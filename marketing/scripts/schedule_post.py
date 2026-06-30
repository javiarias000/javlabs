#!/usr/bin/env python3
"""
Schedule a post for future publish on Facebook page

Usage:
    python schedule_post.py --message "Texto" --delay "2 hours"
    python schedule_post.py --message "Texto" --time "2024-04-22 14:30"
    python schedule_post.py --message "Texto" --unix 1713787800
"""

import os
import sys
from datetime import datetime, timedelta
from dateutil import parser as date_parser
import click
from dotenv import load_dotenv
from meta.pages import init_pages_api

load_dotenv()

PAGE_ID = os.getenv("PAGE_ID")
PAGE_ACCESS_TOKEN = os.getenv("PAGE_ACCESS_TOKEN")

if not PAGE_ID or not PAGE_ACCESS_TOKEN:
    print("❌ Error: PAGE_ID or PAGE_ACCESS_TOKEN not in .env")
    sys.exit(1)

def parse_schedule_time(delay: str = None, time_str: str = None, unix_ts: int = None) -> int:
    """Convert various time formats to UNIX timestamp"""

    if unix_ts:
        return unix_ts

    if delay:
        # Parse relative time: "2 hours", "+1 day", "30 minutes"
        try:
            parts = delay.lower().split()
            if len(parts) == 2:
                amount = int(parts[0])
                unit = parts[1]

                units = {
                    'minute': timedelta(minutes=1),
                    'minutes': timedelta(minutes=1),
                    'hour': timedelta(hours=1),
                    'hours': timedelta(hours=1),
                    'day': timedelta(days=1),
                    'days': timedelta(days=1),
                    'week': timedelta(weeks=1),
                    'weeks': timedelta(weeks=1),
                }

                if unit not in units:
                    raise ValueError(f"Unknown unit: {unit}")

                target_time = datetime.now() + (units[unit] * amount)
                return int(target_time.timestamp())
        except Exception as e:
            raise ValueError(f"Invalid delay format: {e}")

    if time_str:
        # Parse datetime string: "2024-04-22 14:30", "tomorrow 10am", "next Monday"
        try:
            target_time = date_parser.parse(time_str)
            return int(target_time.timestamp())
        except Exception as e:
            raise ValueError(f"Invalid time format: {e}")

    raise ValueError("Must provide --delay, --time, or --unix")

@click.command()
@click.option('--message', required=True, help='Post message text')
@click.option('--image', default=None, help='Path to image file (optional)')
@click.option('--link', default=None, help='URL to include (optional)')
@click.option('--delay', default=None, help='Delay: "2 hours", "1 day", "30 minutes"')
@click.option('--time', 'time_str', default=None, help='Time string: "2024-04-22 14:30", "tomorrow 10am"')
@click.option('--unix', type=int, default=None, help='UNIX timestamp (seconds)')
def schedule(message, image, link, delay, time_str, unix):
    """Schedule a post for future publish"""

    try:
        # Parse schedule time
        scheduled_time = parse_schedule_time(delay=delay, time_str=time_str, unix_ts=unix)

        # Validate range: 10min to 30 days
        now = int(datetime.now().timestamp())
        min_time = now + 600  # 10 minutes
        max_time = now + (86400 * 30)  # 30 days

        if scheduled_time < min_time:
            click.echo("❌ Time must be at least 10 minutes in the future")
            sys.exit(1)

        if scheduled_time > max_time:
            click.echo("❌ Time must be within 30 days")
            sys.exit(1)

        scheduled_dt = datetime.fromtimestamp(scheduled_time)
        click.echo(f"\n📅 Scheduling post for: {scheduled_dt.strftime('%Y-%m-%d %H:%M:%S')}")
        click.echo(f"⏱️  UNIX timestamp: {scheduled_time}")
        click.echo("=" * 70)

        # Initialize API
        pages = init_pages_api(PAGE_ACCESS_TOKEN, PAGE_ID)

        # Create scheduled post
        if image:
            click.echo(f"📸 With image: {image}")
            result = pages.create_post_with_photo(
                message=message,
                photo_path=image,
                link=link,
                scheduled_time=scheduled_time
            )
        else:
            click.echo("📝 Text only post")
            result = pages.create_post_scheduled(
                message=message,
                scheduled_time=scheduled_time,
                link=link
            )

        if "error" in result:
            click.echo(f"❌ Error: {result['error']}")
            sys.exit(1)

        post_id = result.get('post_id') or result.get('id')
        click.echo(f"\n✅ Post scheduled!")
        click.echo(f"Post ID: {post_id}")
        click.echo(f"Publish: {scheduled_dt.strftime('%Y-%m-%d %H:%M:%S')} (in {(scheduled_time - now) // 3600}h)")

    except Exception as e:
        click.echo(f"❌ Error: {e}")
        sys.exit(1)

if __name__ == '__main__':
    schedule()
