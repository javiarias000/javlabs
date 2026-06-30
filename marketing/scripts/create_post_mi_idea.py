#!/usr/bin/env python3
"""
Create a post on Mi Idea page with an image

Usage:
    python create_post_mi_idea.py --image <path> --message "Post text"
    python create_post_mi_idea.py --image /path/to/image.jpg --message "Feliz día Mamá! Retratos personalizados 15x15cm - $10"

Requirements:
    - PAGE_ID and PAGE_ACCESS_TOKEN in .env
    - Image file must exist locally
"""

import os
import sys
import click
import requests
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

PAGE_ID = os.getenv("PAGE_ID")
PAGE_ACCESS_TOKEN = os.getenv("PAGE_ACCESS_TOKEN")

if not PAGE_ID or not PAGE_ACCESS_TOKEN:
    print("❌ Error: PAGE_ID or PAGE_ACCESS_TOKEN not found in .env")
    sys.exit(1)

@click.command()
@click.option('--image', required=True, help='Path to image file')
@click.option('--message', required=True, help='Post message/caption')
@click.option('--link', default=None, help='URL to include in post')
def create_post(image, message, link):
    """Create a post on Mi Idea page with image"""

    image_path = Path(image).resolve()

    if not image_path.exists():
        click.echo(f"❌ Image not found: {image_path}")
        sys.exit(1)

    click.echo(f"\n📸 Uploading image: {image_path.name}")
    click.echo(f"📝 Message: {message}")
    click.echo(f"🔗 Link: {link if link else 'None'}")
    click.echo("-" * 60)

    # Upload image to page photos first
    upload_url = f"https://graph.facebook.com/v19.0/{PAGE_ID}/photos"

    with open(image_path, 'rb') as img_file:
        files = {'source': img_file}
        params = {'access_token': PAGE_ACCESS_TOKEN}

        try:
            click.echo("\n⏳ Uploading image to Facebook...")
            upload_response = requests.post(upload_url, files=files, params=params)
            upload_data = upload_response.json()

            if 'error' in upload_data:
                error_msg = upload_data['error'].get('message', 'Unknown error')
                click.echo(f"❌ Upload failed: {error_msg}")
                if 'Session has expired' in error_msg:
                    click.echo("\n⚠️  Token expired! Regenerate at:")
                    click.echo("   https://developers.facebook.com/tools/explorer/")
                sys.exit(1)

            photo_id = upload_data.get('id')
            click.echo(f"✅ Image uploaded! Photo ID: {photo_id}")

            # Create post with the image
            post_url = f"https://graph.facebook.com/v19.0/{PAGE_ID}/feed"

            post_data = {
                'message': message,
                'photo_ids': [photo_id],
                'access_token': PAGE_ACCESS_TOKEN
            }

            if link:
                post_data['link'] = link

            click.echo("⏳ Creating post...")
            post_response = requests.post(post_url, data=post_data)
            post_data_response = post_response.json()

            if 'error' in post_data_response:
                error_msg = post_data_response['error'].get('message', 'Unknown error')
                click.echo(f"❌ Post creation failed: {error_msg}")
                sys.exit(1)

            post_id = post_data_response.get('id')
            click.echo(f"\n✅ Post created successfully!")
            click.echo(f"Post ID: {post_id}")
            click.echo(f"View: https://facebook.com/{post_id}")

        except requests.exceptions.RequestException as e:
            click.echo(f"❌ Request error: {e}")
            sys.exit(1)

if __name__ == '__main__':
    create_post()
