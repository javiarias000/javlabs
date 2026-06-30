#!/usr/bin/env python3
"""
Get PAGE access token from USER access token

This script exchanges a user access token (with pages_manage_posts permission)
for a PAGE access token specific to the Mi Idea page.

Steps:
1. Get User Access Token from: https://developers.facebook.com/tools/explorer/
2. Include permissions: pages_manage_posts
3. Paste user token below or set in .env as ACCESS_TOKEN
4. Run this script to get PAGE token
"""

import os
import requests
from dotenv import load_dotenv

load_dotenv()

USER_TOKEN = os.getenv("ACCESS_TOKEN")
PAGE_ID = os.getenv("PAGE_ID", "61570796200315")

if not USER_TOKEN:
    print("❌ Error: ACCESS_TOKEN not found in .env")
    exit(1)

print(f"🔑 Using USER access token")
print(f"📄 Page ID: {PAGE_ID}")
print("-" * 60)

# Get page token from user token
url = f"https://graph.facebook.com/v19.0/me/accounts"
params = {
    "access_token": USER_TOKEN,
    "fields": "id,name,access_token,category"
}

try:
    response = requests.get(url, params=params)
    data = response.json()

    if "error" in data:
        error = data["error"]
        print(f"❌ Error: {error.get('message')}")
        print(f"\nPosible solución:")
        print(f"- Token expirado: Regenera en https://developers.facebook.com/tools/explorer/")
        print(f"- Sin permisos: Agrega 'pages_manage_posts' al scope")
        exit(1)

    # Find page token
    pages = data.get("data", [])
    page_token = None

    for page in pages:
        if page.get("id") == PAGE_ID:
            page_token = page.get("access_token")
            print(f"✅ Found page: {page.get('name')}")
            print(f"   Category: {page.get('category')}")
            break

    if not page_token:
        print(f"❌ Page {PAGE_ID} not found in user's pages")
        print(f"\nAvailable pages:")
        for page in pages:
            print(f"  - {page.get('name')} (ID: {page.get('id')})")
        exit(1)

    print(f"\n📋 PAGE ACCESS TOKEN:")
    print(f"{page_token}")
    print(f"\n💾 Add to .env as:")
    print(f"PAGE_ACCESS_TOKEN={page_token}")

except requests.exceptions.RequestException as e:
    print(f"❌ Request error: {e}")
    exit(1)
