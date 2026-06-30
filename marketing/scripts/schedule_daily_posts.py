#!/usr/bin/env python3
"""
Schedule daily posts from folder images

Creates one post per day at optimal time (10 AM)
Each image gets a unique post with custom message
"""

import os
import sys
import time
from pathlib import Path
from datetime import datetime, timedelta
import click
from dotenv import load_dotenv
from meta.pages import init_pages_api

load_dotenv()

PAGE_ID = os.getenv("PAGE_ID")
PAGE_ACCESS_TOKEN = os.getenv("PAGE_ACCESS_TOKEN")

if not PAGE_ID or not PAGE_ACCESS_TOKEN:
    print("❌ Error: PAGE_ID or PAGE_ACCESS_TOKEN not in .env")
    sys.exit(1)

# Default message templates
DEFAULT_MESSAGES = {
    "retratos": "✨ Retratos Personalizados ✨\n\n15cm x 15cm\n$10\n\n¡Haz que tus momentos especiales sean eternos! 💕",
    "laser": "🔥 Servicio de Grabado Láser 🔥\n\nGrabamos en madera, vidrio y más\n¡Perfecto para regalos especiales! 🎁",
    "web": "💻 Diseño Web Profesional 💻\n\nSitios modernos, rápidos y funcionales\n¡Tu presencia digital importa! 🌐",
    "construction": "🏗️ Servicios de Construcción 🏗️\n\nObras de calidad, presupuestos honestos\n¡Contactanos para tu próyecto! 👷",
    "generic": "🎨 Mi Idea - Diseño y Creatividad 🎨\n\nExplora nuestros servicios y productos\n¡Transformamos tus ideas en realidad! ✨"
}

@click.command()
@click.option('--folder', required=True, help='Path to images folder')
@click.option('--start-date', default=None, help='Start date (YYYY-MM-DD), default=today')
@click.option('--hour', type=int, default=10, help='Hour to post (0-23, default=10 AM)')
@click.option('--message', default=None, help='Custom message for all posts')
@click.option('--message-file', default=None, help='File with messages (one per line)')
@click.option('--skip-count', type=int, default=0, help='Skip first N images')
@click.option('--limit', type=int, default=None, help='Limit to N images')
@click.option('--dry-run', is_flag=True, help='Preview without creating posts')
def schedule_daily(folder, start_date, hour, message, message_file, skip_count, limit, dry_run):
    """Schedule daily posts from folder images"""

    folder_path = Path(folder).resolve()

    if not folder_path.exists():
        click.echo(f"❌ Folder not found: {folder_path}")
        sys.exit(1)

    # Get all images
    images = sorted([
        p for p in folder_path.glob('*')
        if p.suffix.lower() in ['.jpg', '.jpeg', '.png', '.gif']
    ])

    if not images:
        click.echo(f"❌ No images found in {folder_path}")
        sys.exit(1)

    click.echo(f"📁 Found {len(images)} images")

    # Apply skip and limit
    if skip_count > 0:
        images = images[skip_count:]
        click.echo(f"⏭️  Skipped {skip_count} images")

    if limit:
        images = images[:limit]
        click.echo(f"📌 Limited to {limit} images")

    # Load messages
    messages = []
    if message_file:
        try:
            with open(message_file, 'r') as f:
                messages = [line.strip() for line in f if line.strip()]
            click.echo(f"📝 Loaded {len(messages)} custom messages")
        except Exception as e:
            click.echo(f"⚠️  Could not load message file: {e}")
            messages = []

    # Parse start date
    if start_date:
        start_dt = datetime.strptime(start_date, '%Y-%m-%d')
    else:
        start_dt = datetime.now()

    # Set to specified hour
    start_dt = start_dt.replace(hour=hour, minute=0, second=0, microsecond=0)

    # If start time in past, move to tomorrow
    if start_dt < datetime.now():
        start_dt += timedelta(days=1)

    click.echo(f"\n📅 Schedule:")
    click.echo(f"  Start: {start_dt.strftime('%Y-%m-%d %H:%M')}")
    click.echo(f"  Interval: 1 day")
    click.echo(f"  Posts: {len(images)}")
    click.echo("=" * 70)

    # Initialize API
    pages = init_pages_api(PAGE_ACCESS_TOKEN, PAGE_ID)

    # Schedule posts
    scheduled_count = 0
    failed_count = 0

    for idx, image_path in enumerate(images):
        post_time = start_dt + timedelta(days=idx)
        unix_time = int(post_time.timestamp())

        # Get message
        if messages and idx < len(messages):
            post_message = messages[idx]
        elif message:
            post_message = message
        else:
            # Use default based on image name
            post_message = DEFAULT_MESSAGES['generic']

        click.echo(f"\n[{idx+1}/{len(images)}] {image_path.name}")
        click.echo(f"  📅 {post_time.strftime('%Y-%m-%d %H:%M')}")
        click.echo(f"  📝 {post_message[:50]}...")

        if dry_run:
            click.echo(f"  ✓ [DRY RUN]")
            scheduled_count += 1
            continue

        try:
            result = pages.create_post_with_photo(
                message=post_message,
                photo_path=str(image_path),
                scheduled_time=unix_time
            )

            if "error" in result:
                click.echo(f"  ❌ {result['error']}")
                failed_count += 1
            else:
                post_id = result.get('post_id') or result.get('id')
                click.echo(f"  ✅ Post ID: {post_id}")
                scheduled_count += 1

            # Wait between posts to avoid rate limiting
            time.sleep(2)

        except Exception as e:
            click.echo(f"  ❌ Exception: {e}")
            failed_count += 1
            time.sleep(2)

    # Summary
    click.echo("\n" + "=" * 70)
    click.echo(f"✅ Scheduled: {scheduled_count}/{len(images)}")
    if failed_count > 0:
        click.echo(f"❌ Failed: {failed_count}")

    if dry_run:
        click.echo("\n💡 DRY RUN - No posts created. Remove --dry-run to publish.")

if __name__ == '__main__':
    schedule_daily()
