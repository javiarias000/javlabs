#!/usr/bin/env python3
"""
Example: Using Facebook Pages API

Run: python example_pages_usage.py

Requires: PAGE_ID and PAGE_ACCESS_TOKEN in .env
"""

import os
from dotenv import load_dotenv
from meta.pages import init_pages_api

load_dotenv()

PAGE_ID = os.getenv("PAGE_ID")
PAGE_ACCESS_TOKEN = os.getenv("PAGE_ACCESS_TOKEN")

if not PAGE_ID or not PAGE_ACCESS_TOKEN:
    print("❌ Missing PAGE_ID or PAGE_ACCESS_TOKEN in .env")
    exit(1)

# Initialize API client
pages = init_pages_api(PAGE_ACCESS_TOKEN, PAGE_ID)

# Test connection
print("Testing connection...")
if not pages.test_connection():
    print("❌ Connection failed. Check credentials.")
    exit(1)
print("✅ Connected to Pages API\n")

# ============ EXAMPLE 1: GET PAGE INFO ============
print("=" * 70)
print("EXAMPLE 1: Page Information")
print("=" * 70)
info = pages.get_page_info()
if "error" not in info:
    print(f"Page Name: {info.get('name')}")
    print(f"Page ID: {info.get('id')}")
    print(f"Username: {info.get('username')}")
    print(f"Followers: {info.get('followers')}")
    print(f"Likes: {info.get('likes')}")
else:
    print(f"Error: {info['error']}")

# ============ EXAMPLE 2: GET FEED ============
print("\n" + "=" * 70)
print("EXAMPLE 2: Recent Posts (Feed)")
print("=" * 70)
feed = pages.get_feed(limit=5)
if "error" not in feed:
    posts = feed.get("data", [])
    print(f"Found {len(posts)} recent posts:\n")
    for i, post in enumerate(posts, 1):
        print(f"{i}. {post.get('message', post.get('story', 'N/A'))[:80]}...")
        print(f"   ID: {post.get('id')}")
        print(f"   Created: {post.get('created_time')}")
        print()
else:
    print(f"Error: {feed['error']}")

# ============ EXAMPLE 3: GET INSIGHTS ============
print("=" * 70)
print("EXAMPLE 3: Page Insights (Last 30 Days)")
print("=" * 70)
insights = pages.get_insights(date_preset='last_30d')
if "error" not in insights:
    data = insights.get("data", [])
    for metric in data[:5]:  # Show first 5 metrics
        name = metric.get('name', 'Unknown')
        values = metric.get('values', [])
        if values:
            total = sum(float(v.get('value', 0)) for v in values)
            print(f"{name}: {total:,.0f}")
else:
    print(f"Error: {insights['error']}")

# ============ EXAMPLE 4: CREATE A POST (COMMENTED OUT) ============
print("\n" + "=" * 70)
print("EXAMPLE 4: Create Post (Uncomment to use)")
print("=" * 70)
print("""
# Uncomment below to create a post:

result = pages.create_post(
    message="Hello from Pages API! 🚀",
    link="https://example.com"
)

if "error" in result:
    print(f"Error: {result['error']}")
else:
    print(f"✅ Post created! ID: {result['id']}")
""")

# ============ EXAMPLE 5: GET COMMENTS (if posts exist) ============
print("\n" + "=" * 70)
print("EXAMPLE 5: Get Comments on Recent Post")
print("=" * 70)
feed = pages.get_feed(limit=1)
if "error" not in feed and feed.get("data"):
    post_id = feed["data"][0]["id"]
    print(f"Getting comments on post: {post_id}\n")

    comments = pages.get_comments(post_id, limit=5)
    if "error" not in comments:
        comments_data = comments.get("data", [])
        if comments_data:
            print(f"Found {len(comments_data)} comments:\n")
            for comment in comments_data:
                author = comment.get('from', {}).get('name', 'Unknown')
                message = comment.get('message', 'N/A')
                print(f"- {author}: {message[:60]}...")
        else:
            print("No comments on this post yet.")
    else:
        print(f"Error: {comments['error']}")
else:
    print("No posts in feed to get comments from.")

# ============ EXAMPLE 6: MENTIONS AND TAGS ============
print("\n" + "=" * 70)
print("EXAMPLE 6: Mentions & Tagged Posts")
print("=" * 70)
mentions = pages.get_mentions(limit=5)
if "error" not in mentions:
    mentions_data = mentions.get("data", [])
    print(f"Posts mentioning page: {len(mentions_data)}")
else:
    print(f"Error getting mentions: {mentions['error']}")

tagged = pages.get_tagged_posts(limit=5)
if "error" not in tagged:
    tagged_data = tagged.get("data", [])
    print(f"Posts with page tagged: {len(tagged_data)}")
else:
    print(f"Error getting tagged posts: {tagged['error']}")

print("\n✅ Examples complete!")
