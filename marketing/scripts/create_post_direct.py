#!/usr/bin/env python3
"""
Create post with image on Facebook page
Uses /photos endpoint which returns post_id, then updates with message
"""

import os
import requests
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

PAGE_ID = os.getenv("PAGE_ID")
PAGE_TOKEN = os.getenv("PAGE_ACCESS_TOKEN")

image_path = "/home/jav/Facebook/facebook-100063596467837-20_04_2026-OWzQjEYQ/this_profile's_activity_across_facebook/posts/media/Fotos_505523001577578/240013784580191.jpg"

message = """Feliz día Mamá 💕

Retratos personalizados en madera 🎨
15cm x 15cm - $10

Nueva temporada de creatividad 🎁
¡Sorprende a tu mamá con un regalo único!"""

print(f"📄 PAGE_ID: {PAGE_ID}")
print(f"📸 Image: {Path(image_path).name}")
print(f"📝 Message: {message[:50]}...")
print("-" * 60)

# Step 1: Upload photo - this creates a post with the photo
photo_url = f"https://graph.facebook.com/v19.0/{PAGE_ID}/photos"

print("\n⏳ Step 1: Uploading image...")
with open(image_path, 'rb') as img:
    files = {'source': img}
    params = {'access_token': PAGE_TOKEN}

    try:
        resp = requests.post(photo_url, files=files, params=params, timeout=30)
        data = resp.json()

        if 'error' in data:
            error = data['error']['message']
            print(f"❌ Upload failed: {error}")
            exit(1)

        photo_id = data.get('id')
        post_id = data.get('post_id')

        if not post_id:
            print(f"❌ No post_id in response: {data}")
            exit(1)

        print(f"✅ Image uploaded! Photo ID: {photo_id}")
        print(f"✅ Post auto-created! Post ID: {post_id}")

        # Step 2: Update post with message
        print("\n⏳ Step 2: Adding message to post...")
        update_url = f"https://graph.facebook.com/v19.0/{post_id}"

        update_data = {
            'message': message,
            'access_token': PAGE_TOKEN
        }

        resp2 = requests.post(update_url, data=update_data, timeout=30)
        data2 = resp2.json()

        if data2.get('success'):
            print(f"✅ Message added successfully!")
            print(f"\n✅ POST COMPLETE!")
            print(f"Post ID: {post_id}")
            print(f"View: https://facebook.com/{post_id}")
        else:
            error = data2.get('error', {}).get('message', 'Unknown')
            print(f"❌ Message update failed: {error}")
            print(f"But post with image was created: {post_id}")
            exit(1)

    except requests.exceptions.RequestException as e:
        print(f"❌ Error: {e}")
        exit(1)
