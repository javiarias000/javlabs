# Facebook Pages API Integration

Complete integration for managing Facebook Page content, analytics, and engagement using the Graph API.

## Setup

### Required Environment Variables

Add to `.env`:

```bash
PAGE_ID=YOUR_PAGE_ID                    # Facebook page numeric ID
PAGE_ACCESS_TOKEN=YOUR_PAGE_TOKEN       # Page access token (get from Facebook App)
```

**Note:** `PAGE_ACCESS_TOKEN` defaults to `ACCESS_TOKEN` if not specified. Both use the same Graph API credentials.

### Getting Page Access Token

1. Go to [Facebook App Dashboard](https://developers.facebook.com/apps)
2. Select your app
3. Navigate to **Roles** → **Test Users** or **Tools** → **Access Token Tool**
4. Get a user access token with permissions: `pages_manage_posts`, `pages_read_engagement`, `pages_manage_engagement`
5. Use the token to get a **page access token**:

```bash
curl "https://graph.facebook.com/v19.0/{user-id}/accounts?access_token={user-token}"
```

This returns page tokens with `access_token` field.

### Get Page ID

```bash
# If you have user token with page access
curl "https://graph.facebook.com/me/accounts?access_token={user-token}"

# Or use your page's username
curl "https://graph.facebook.com/{page-username}?access_token={page-token}"
```

## Python API Usage

### Initialize Client

```python
from meta.pages import init_pages_api

pages = init_pages_api(
    page_access_token="YOUR_PAGE_TOKEN",
    page_id="YOUR_PAGE_ID"
)

# Test connection
if pages.test_connection():
    print("Connected!")
```

### Page Information

```python
# Get page details
info = pages.get_page_info()
print(info['name'], info['followers'])
```

### Create Posts

**Text Only:**

```python
result = pages.create_post(message="Hello followers!")
post_id = result['id']
```

**With Photo (Recommended):**

```python
result = pages.create_post_with_photo(
    message="Feliz día Mamá 💕\n\nRetratos personalizados: $10",
    photo_path="/path/to/image.jpg"
)

if result.get('success'):
    post_id = result['post_id']
    print(f"Posted: {post_id}")
```

**With Link:**

```python
pages.create_post(
    message="Check this out",
    link="https://example.com",
    name="Example Site",
    description="Cool example"
)
```

### Manage Feed

```python
# Get recent posts
feed = pages.get_feed(limit=10)
for post in feed['data']:
    print(post['message'], post['created_time'])

# Delete a post
pages.delete_post("123456789")
```

### Scheduled Posts

**Text only (scheduled):**

```python
from datetime import datetime, timedelta

# Calculate publish time (tomorrow at 10 AM)
target_time = datetime.now().replace(hour=10, minute=0, second=0) + timedelta(days=1)
unix_timestamp = int(target_time.timestamp())

result = pages.create_post_scheduled(
    message="This post publishes tomorrow at 10 AM",
    scheduled_time=unix_timestamp
)

post_id = result['post_id']
print(f"Scheduled for: {datetime.fromtimestamp(unix_timestamp)}")
```

**With photo (scheduled):**

```python
result = pages.create_post_with_photo(
    message="Photo post tomorrow",
    photo_path="/path/to/image.jpg",
    scheduled_time=unix_timestamp
)
```

**Constraints:**
- Minimum: 10 minutes from now
- Maximum: 30 days from now

### Analytics (Insights)

```python
# Get page insights (last 30 days)
insights = pages.get_insights(date_preset='last_30d')

# Get specific metric
insights = pages.get_insights(metric='page_engaged_users')

# Get post-level insights
post_insights = pages.get_post_insights("123456789")
print(post_insights['engagement'], post_insights['reach'])
```

### Comments

```python
# Get comments on a post
comments = pages.get_comments("123456789", limit=10)
for comment in comments['data']:
    print(f"{comment['from']['name']}: {comment['message']}")

# Reply to comment
pages.reply_to_comment("987654321", "Thanks for the feedback!")

# Delete comment
pages.delete_comment("987654321")
```

### Mentions & Tags

```python
# Get posts mentioning the page
mentions = pages.get_mentions(limit=10)

# Get posts where page is tagged
tagged = pages.get_tagged_posts(limit=10)
```

## CLI Commands

All commands require `PAGE_ID` and `PAGE_ACCESS_TOKEN` env vars.

### Page Information

```bash
python main.py page info
```

Shows: name, ID, username, likes, followers, description

### Create Post

```bash
python main.py page post --message "Hello world!"
python main.py page post --message "Check it out" --link "https://example.com"
```

### Get Feed

```bash
python main.py page feed                  # Last 25 posts
python main.py page feed --limit 50       # Last 50 posts
```

### Get Analytics

```bash
python main.py page insights               # Last 30 days (default)
python main.py page insights --preset today
python main.py page insights --preset last_7d
```

Time preset options: `today`, `yesterday`, `last_7d`, `last_30d`, `last_90d`

### Get Comments

```bash
python main.py page comments 123456789           # Comments on post
python main.py page comments 123456789 --limit 50
```

## API Reference

### FacebookPagesAPI Class

**Methods:**

#### Page Info
- `get_page_info()` → Dict
- `update_page_settings(**settings)` → Dict

#### Posts/Feed
- `create_post(message, link=None, picture=None, name=None, description=None, caption=None)` → Dict
- `get_feed(limit=25, since=None)` → Dict
- `delete_post(post_id)` → Dict

#### Analytics
- `get_insights(metric=None, date_preset='last_30d')` → Dict
- `get_post_insights(post_id)` → Dict

#### Comments
- `get_comments(post_id, limit=25)` → Dict
- `create_comment(post_id, message)` → Dict
- `delete_comment(comment_id)` → Dict
- `reply_to_comment(comment_id, message)` → Dict

#### Other
- `get_mentions(limit=25)` → Dict
- `get_tagged_posts(limit=25)` → Dict
- `test_connection()` → bool

## Error Handling

All API methods return a dict. Check for `error` key:

```python
result = pages.create_post(message="Test")
if "error" in result:
    print(f"API Error: {result['error']}")
else:
    print(f"Success: {result['id']}")
```

## Common Errors

| Error | Solution |
|-------|----------|
| `Invalid OAuth access token` | Page token expired or incorrect |
| `Requires page_manage_posts permission` | Token missing required permissions |
| `(#803) Some of the aliases you requested do not exist` | Page ID incorrect |
| `Invalid post ID` | Post doesn't exist or token doesn't have access |

## Rate Limiting

Facebook API has rate limits. For heavy usage, implement:

```python
import time

for post_id in post_ids:
    result = pages.get_post_insights(post_id)
    time.sleep(0.1)  # Small delay between requests
```

## Webhook Subscriptions (Advanced)

For real-time updates when page receives comments/mentions:

```bash
# Subscribe to page updates (requires app_id, verify_token, callback_url)
curl -X POST "https://graph.facebook.com/v19.0/{page-id}/subscribed_apps" \
  -d "access_token={page-token}"
```

Webhooks configuration requires callback endpoint handling (outside scope of this module).

## Resources

- [Pages API Docs](https://developers.facebook.com/docs/pages-api)
- [Graph API Reference](https://developers.facebook.com/docs/graph-api)
- [Permissions Reference](https://developers.facebook.com/docs/permissions/reference)
- [Access Token Guide](https://developers.facebook.com/docs/facebook-login/access-tokens)
