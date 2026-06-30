import requests
import json
from datetime import datetime, timedelta
from typing import Optional, Dict, List, Any

# Graph API base URL
GRAPH_API_BASE = "https://graph.facebook.com/v19.0"

class FacebookPagesAPI:
    """Facebook Pages API client for managing page content, insights, and engagement"""

    def __init__(self, page_access_token: str, page_id: str):
        """
        Initialize Pages API client

        Args:
            page_access_token: Page access token from Facebook
            page_id: Facebook page ID
        """
        self.page_access_token = page_access_token
        self.page_id = page_id
        self.base_url = f"{GRAPH_API_BASE}/{page_id}"
        self.headers = {"Authorization": f"Bearer {page_access_token}"}

    def _make_request(self, method: str, endpoint: str, **kwargs) -> Dict:
        """Make API request with error handling"""
        url = f"{self.base_url}{endpoint}"
        kwargs.setdefault("headers", {}).update(self.headers)

        try:
            response = requests.request(method, url, **kwargs)
            response.raise_for_status()
            return response.json() if response.text else {}
        except requests.exceptions.RequestException as e:
            return {"error": str(e), "status_code": getattr(e.response, "status_code", None)}

    def _make_request_direct(self, method: str, object_id: str, **kwargs) -> Dict:
        """Make API request directly to object (post, comment, etc)"""
        url = f"{GRAPH_API_BASE}/{object_id}"

        try:
            response = requests.request(method, url, **kwargs)
            response.raise_for_status()
            return response.json() if response.text else {}
        except requests.exceptions.RequestException as e:
            return {"error": str(e), "status_code": getattr(e.response, "status_code", None)}

    # ============ PAGE INFO ============
    def get_page_info(self) -> Dict:
        """Get basic page information"""
        fields = "id,name,description,about,cover,picture,username,likes,followers"
        return self._make_request("GET", f"?fields={fields}")

    def update_page_settings(self, **settings) -> Dict:
        """Update page settings (name, description, etc)"""
        return self._make_request("POST", "", json=settings)

    # ============ POSTS / FEED ============
    def create_post(
        self,
        message: str,
        link: Optional[str] = None,
        picture: Optional[str] = None,
        name: Optional[str] = None,
        description: Optional[str] = None,
        caption: Optional[str] = None
    ) -> Dict:
        """
        Create a new post on page feed

        Args:
            message: Post text content
            link: URL to link in post
            picture: URL of image/video thumbnail
            name: Link title
            description: Link description
            caption: Caption text
        """
        payload = {"message": message}
        if link:
            payload["link"] = link
        if picture:
            payload["picture"] = picture
        if name:
            payload["name"] = name
        if description:
            payload["description"] = description
        if caption:
            payload["caption"] = caption

        return self._make_request("POST", "/feed", json=payload)

    def create_post_with_photo(
        self,
        message: str,
        photo_path: str,
        link: Optional[str] = None,
        scheduled_time: Optional[int] = None
    ) -> Dict:
        """
        Create post with local photo file (can be scheduled)

        Args:
            message: Post text content
            photo_path: Local file path to image
            link: Optional URL to include
            scheduled_time: UNIX timestamp for scheduled publish (10min-30days future)

        Returns:
            Dict with post_id on success, error key on failure
        """
        # Step 1: Upload photo (auto-creates post)
        with open(photo_path, 'rb') as f:
            files = {'source': f}
            photo_response = self._make_request("POST", "/photos", files=files)

            if "error" in photo_response:
                return photo_response

            post_id = photo_response.get("post_id")
            if not post_id:
                return {"error": "No post_id in upload response"}

        # Step 2: Update post with message
        # Note: scheduled_publish_time cannot be applied to existing posts
        # Posts are published immediately. For scheduling, use URLs in /feed endpoint
        update_payload = {
            "message": message,
            "access_token": self.page_access_token
        }
        if link:
            update_payload["link"] = link

        update_response = self._make_request_direct("POST", post_id, data=update_payload)

        return {"success": True, "post_id": post_id} if "error" not in update_response else update_response

    def create_post_scheduled(
        self,
        message: str,
        scheduled_time: int,
        link: Optional[str] = None
    ) -> Dict:
        """
        Create scheduled text post (no image)

        Args:
            message: Post text content
            scheduled_time: UNIX timestamp for publish time
            link: Optional URL

        Returns:
            Dict with post_id
        """
        payload = {
            "message": message,
            "published": False,
            "scheduled_publish_time": scheduled_time
        }
        if link:
            payload["link"] = link

        return self._make_request("POST", "/feed", json=payload)

    def get_feed(self, limit: int = 25, since: Optional[str] = None) -> Dict:
        """Get page feed posts"""
        fields = "id,message,created_time,type,link,picture,permalink_url,story"
        params = {"fields": fields, "limit": limit}
        if since:
            params["since"] = since

        return self._make_request("GET", "/feed", params=params)

    def delete_post(self, post_id: str) -> Dict:
        """Delete a specific post"""
        return self._make_request("DELETE", f"/{post_id}")

    # ============ INSIGHTS / ANALYTICS ============
    def get_insights(
        self,
        metric: Optional[str] = None,
        date_preset: str = "last_30d"
    ) -> Dict:
        """
        Get page insights (analytics)

        Args:
            metric: Specific metric (e.g., 'page_engaged_users', 'page_fan_adds')
                   If None, returns default metrics
            date_preset: Time period ('today', 'yesterday', 'last_7d', 'last_30d', 'last_90d')
        """
        default_metrics = [
            "page_engaged_users",
            "page_views",
            "page_fans",
            "page_fan_adds",
            "page_fan_removes",
            "page_post_engagements",
            "page_impressions",
            "page_impressions_unique"
        ]

        metrics = [metric] if metric else default_metrics
        fields = f"id,name,period,values"

        params = {
            "metric": ",".join(metrics),
            "period": "day",
            "date_preset": date_preset
        }

        return self._make_request("GET", "/insights", params=params)

    def get_post_insights(self, post_id: str) -> Dict:
        """Get insights for a specific post (engagement, reach, impressions)"""
        fields = "id,message,created_time,engagement,impressions,impressions_organic,reach"
        return self._make_request("GET", f"/{post_id}", params={"fields": fields})

    # ============ COMMENTS ============
    def get_comments(self, post_id: str, limit: int = 25) -> Dict:
        """Get comments on a post"""
        fields = "id,message,created_time,from,user_likes,comment_count"
        return self._make_request(
            "GET",
            f"/{post_id}/comments",
            params={"fields": fields, "limit": limit}
        )

    def create_comment(self, post_id: str, message: str) -> Dict:
        """Create a comment on a post"""
        return self._make_request(
            "POST",
            f"/{post_id}/comments",
            json={"message": message}
        )

    def delete_comment(self, comment_id: str) -> Dict:
        """Delete a comment"""
        return self._make_request("DELETE", f"/{comment_id}")

    def reply_to_comment(self, comment_id: str, message: str) -> Dict:
        """Reply to a comment"""
        return self._make_request(
            "POST",
            f"/{comment_id}/comments",
            json={"message": message}
        )

    # ============ MENTIONS & TAGS ============
    def get_mentions(self, limit: int = 25) -> Dict:
        """Get posts mentioning the page"""
        return self._make_request(
            "GET",
            "/mentions",
            params={"limit": limit}
        )

    def get_tagged_posts(self, limit: int = 25) -> Dict:
        """Get posts where the page is tagged"""
        fields = "id,message,created_time,from,permalink_url"
        return self._make_request(
            "GET",
            "/tagged",
            params={"fields": fields, "limit": limit}
        )

    # ============ UTILITY ============
    def test_connection(self) -> bool:
        """Test API connection with a simple page info request"""
        result = self.get_page_info()
        return "error" not in result


def init_pages_api(page_access_token: str, page_id: str) -> FacebookPagesAPI:
    """Initialize Pages API client with credentials"""
    return FacebookPagesAPI(page_access_token, page_id)
