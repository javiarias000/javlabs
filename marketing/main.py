import click
import json
from config import validate_config
from meta.client import test_connection
from meta.analyzer import get_account_insights, get_active_campaigns, get_all_campaigns, get_campaign_details
from ai.strategist import generate_campaign_strategy
from meta.campaign import create_full_campaign, get_account_images

@click.group()
def cli():
    pass

@cli.command()
@click.option('--nombre', default='Mi Idea', help='Campaign name to search for')
def status(nombre):
    """Check latest campaign and its ads/adsets status"""
    try:
        validate_config(require_anthropic=False)
        if not test_connection():
            raise click.ClickException("Cannot connect to Meta API. Check credentials.")

        click.echo(f"\n🔍 Searching campaigns: '{nombre}'...")
        campaigns = get_all_campaigns(name_filter=nombre)

        if not campaigns:
            click.echo(f"No campaigns found with name containing '{nombre}'")
            return

        latest = campaigns[0]
        click.echo(f"\n📊 LATEST CAMPAIGN: {latest['name']}")
        click.echo("=" * 70)
        click.echo(f"ID: {latest['id']}")
        click.echo(f"Status: {latest['status']}")
        click.echo(f"Objective: {latest['objective']}")
        click.echo(f"Created: {latest['created_time']}")

        click.echo("\n📋 CAMPAIGN STRUCTURE:")
        click.echo("-" * 70)

        details = get_campaign_details(latest['id'])

        if not details['adsets']:
            click.echo("⚠️  NO AD SETS CREATED!")
        else:
            for i, adset in enumerate(details['adsets'], 1):
                click.echo(f"\nAd Set #{i}: {adset['name']}")
                click.echo(f"  ID: {adset['id']}")
                click.echo(f"  Status: {adset['status']}")
                click.echo(f"  Daily Budget: ${adset['daily_budget'] / 100:.2f}")

                if not adset['ads']:
                    click.echo(f"  ⚠️  NO ADS CREATED IN THIS ADSET!")
                else:
                    for j, ad in enumerate(adset['ads'], 1):
                        click.echo(f"  Ad #{j}: {ad['name']}")
                        click.echo(f"    ID: {ad['id']}")
                        click.echo(f"    Status: {ad['status']}")
                        if ad['creative']:
                            click.echo(f"    Creative ID: {ad['creative'].get('creative_id', 'N/A')}")

    except Exception as e:
        raise click.ClickException(f"Error: {e}")

@cli.command()
def images():
    """List uploaded images in media library"""
    try:
        validate_config()
        if not test_connection():
            raise click.ClickException("Cannot connect to Meta API. Check credentials.")

        click.echo("\n📸 IMAGES IN MEDIA LIBRARY")
        click.echo("=" * 60)
        image_list = get_account_images()

        if not image_list:
            click.echo("No images found.")
            return

        for img in image_list:
            image_hash = img.get('hash')
            created = img.get('created_time', 'N/A')
            click.echo(f"Hash: {image_hash}")
            click.echo(f"  Created: {created}\n")

    except Exception as e:
        raise click.ClickException(f"Error: {e}")

@cli.command()
def analyze():
    """Analyze account performance metrics"""
    try:
        validate_config()
        if not test_connection():
            raise click.ClickException("Cannot connect to Meta API. Check credentials.")

        insights = get_account_insights()
        campaigns = get_active_campaigns()

        click.echo("\n📊 ACCOUNT INSIGHTS (Last 30 Days)")
        click.echo("=" * 40)
        for key, value in insights.items():
            click.echo(f"{key.upper():15} | {value}")

        click.echo("\n📢 ACTIVE CAMPAIGNS")
        click.echo("=" * 40)
        for campaign in campaigns:
            click.echo(f"{campaign['name']:30} | ${campaign['spend']}")

    except Exception as e:
        raise click.ClickException(f"Error: {e}")

@cli.command()
@click.option('--empresa', required=True, help='Company description')
@click.option('--objetivo', default='REACH', help='Campaign objective: REACH, TRAFFIC, CONVERSIONS')
@click.option('--presupuesto', type=float, default=100, help='Total budget')
@click.option('--diario', type=float, default=10, help='Daily budget')
@click.option('--crear', is_flag=True, help='Actually create campaign (requires confirmation)')
@click.option('--image-hash', default=None, help='Image hash from media library (get with: python main.py images)')
def plan(empresa, objetivo, presupuesto, diario, crear, image_hash):
    """Generate campaign plan with Claude AI"""
    try:
        validate_config()
        if not test_connection():
            raise click.ClickException("Cannot connect to Meta API. Check credentials.")

        click.echo("\n🔍 Analyzing account performance...")
        insights = get_account_insights()

        click.echo("🤖 Claude generating strategy...")
        strategy = generate_campaign_strategy(
            company_description=empresa,
            objective=objetivo,
            budget=presupuesto,
            daily_budget=diario,
            account_insights=insights
        )

        click.echo("\n📋 CAMPAIGN PLAN")
        click.echo("=" * 50)
        click.echo(f"Campaign Name: {strategy.campaign_name}")
        click.echo(f"Objective: {strategy.objective}")
        click.echo(f"Budget: ${strategy.budget}")
        click.echo(f"Daily: ${strategy.daily_budget}")
        click.echo(f"\nHeadline: {strategy.headline}")
        click.echo(f"Description: {strategy.description}")
        click.echo(f"CTA: {strategy.call_to_action}")
        click.echo(f"URL: {strategy.landing_url}")
        click.echo(f"\nAudience:")
        click.echo(f"  Age: {strategy.audience.age_min}-{strategy.audience.age_max}")
        click.echo(f"  Interests: {', '.join(strategy.audience.interests)}")
        click.echo(f"  Countries: {', '.join(strategy.audience.countries)}")
        click.echo(f"\nReasoning: {strategy.reasoning}")

        if crear:
            if not click.confirm("\n⚠️  Create this campaign now?"):
                click.echo("Cancelled.")
                return

            if not image_hash:
                click.echo("⚠️  No image hash provided. Use: python main.py images")
                click.echo("Then run again with: --image-hash <hash>")
                return

            click.echo("\n🚀 Creating campaign...")
            result = create_full_campaign(strategy, image_hash=image_hash)
            click.echo(f"\n✅ Campaign created successfully!")
            click.echo(f"Campaign ID: {result['campaign_id']}")
            click.echo(f"Ad Set ID: {result['adset_id']}")
            click.echo(f"Ad ID: {result['ad_id']}")

    except Exception as e:
        raise click.ClickException(f"Error: {e}")

@cli.command()
@click.option('--empresa', required=True, help='Company description')
@click.option('--objetivo', default='REACH', help='Campaign objective')
@click.option('--presupuesto', type=float, default=100, help='Total budget')
@click.option('--diario', type=float, default=10, help='Daily budget')
@click.option('--image-hash', required=True, help='Image hash from media library (get with: python main.py images)')
def create(empresa, objetivo, presupuesto, diario, image_hash):
    """Create campaign directly (generates + creates)"""
    try:
        validate_config()
        if not test_connection():
            raise click.ClickException("Cannot connect to Meta API. Check credentials.")

        click.echo("\n🔍 Analyzing account performance...")
        insights = get_account_insights()

        click.echo("🤖 Claude generating strategy...")
        strategy = generate_campaign_strategy(
            company_description=empresa,
            objective=objetivo,
            budget=presupuesto,
            daily_budget=diario,
            account_insights=insights
        )

        click.echo("\n📋 PROPOSED CAMPAIGN")
        click.echo("=" * 50)
        click.echo(f"Name: {strategy.campaign_name}")
        click.echo(f"Budget: ${strategy.budget} (${strategy.daily_budget}/day)")
        click.echo(f"Audience: {strategy.audience.age_min}-{strategy.audience.age_max}")
        click.echo(f"Interests: {', '.join(strategy.audience.interests)}")
        click.echo(f"\nHeadline: {strategy.headline}")
        click.echo(f"Reasoning: {strategy.reasoning}")

        if not click.confirm("\n⚠️  Create this campaign now?"):
            click.echo("Cancelled.")
            return

        click.echo("\n🚀 Creating campaign...")
        result = create_full_campaign(strategy, image_hash=image_hash)
        click.echo(f"\n✅ Campaign created!")
        click.echo(f"Campaign: {result['campaign_id']}")

    except Exception as e:
        raise click.ClickException(f"Error: {e}")

# ============ FACEBOOK PAGES API ============

@cli.group()
def page():
    """Manage Facebook page content (posts, comments, insights)"""
    pass

@page.command()
def info():
    """Get page information"""
    try:
        from config import PAGE_ID, PAGE_ACCESS_TOKEN
        from meta.pages import init_pages_api

        if not PAGE_ID or not PAGE_ACCESS_TOKEN:
            raise click.ClickException("PAGE_ID and PAGE_ACCESS_TOKEN env vars required")

        pages_api = init_pages_api(PAGE_ACCESS_TOKEN, PAGE_ID)
        if not pages_api.test_connection():
            raise click.ClickException("Cannot connect to Pages API. Check credentials.")

        info = pages_api.get_page_info()
        if "error" in info:
            raise click.ClickException(f"API Error: {info['error']}")

        click.echo("\n📄 PAGE INFORMATION")
        click.echo("=" * 60)
        click.echo(f"Name: {info.get('name')}")
        click.echo(f"ID: {info.get('id')}")
        click.echo(f"Username: {info.get('username', 'N/A')}")
        click.echo(f"Likes: {info.get('likes', 0)}")
        click.echo(f"Followers: {info.get('followers', 0)}")
        click.echo(f"About: {info.get('about', 'N/A')[:100]}...")
        click.echo(f"Description: {info.get('description', 'N/A')[:100]}...")

    except Exception as e:
        raise click.ClickException(f"Error: {e}")

@page.command()
@click.option('--message', required=True, help='Post message content')
@click.option('--link', default=None, help='URL to include in post')
def post(message, link):
    """Create a new post on page feed"""
    try:
        from config import PAGE_ID, PAGE_ACCESS_TOKEN
        from meta.pages import init_pages_api

        if not PAGE_ID or not PAGE_ACCESS_TOKEN:
            raise click.ClickException("PAGE_ID and PAGE_ACCESS_TOKEN env vars required")

        pages_api = init_pages_api(PAGE_ACCESS_TOKEN, PAGE_ID)
        result = pages_api.create_post(message=message, link=link)

        if "error" in result:
            raise click.ClickException(f"API Error: {result['error']}")

        click.echo(f"\n✅ Post created!")
        click.echo(f"Post ID: {result.get('id')}")

    except Exception as e:
        raise click.ClickException(f"Error: {e}")

@page.command()
@click.option('--limit', default=25, help='Number of posts to retrieve')
def feed(limit):
    """Get recent posts from page feed"""
    try:
        from config import PAGE_ID, PAGE_ACCESS_TOKEN
        from meta.pages import init_pages_api

        if not PAGE_ID or not PAGE_ACCESS_TOKEN:
            raise click.ClickException("PAGE_ID and PAGE_ACCESS_TOKEN env vars required")

        pages_api = init_pages_api(PAGE_ACCESS_TOKEN, PAGE_ID)
        result = pages_api.get_feed(limit=limit)

        if "error" in result:
            raise click.ClickException(f"API Error: {result['error']}")

        posts = result.get("data", [])
        click.echo(f"\n📰 PAGE FEED ({len(posts)} posts)")
        click.echo("=" * 70)

        for post in posts:
            click.echo(f"\nID: {post.get('id')}")
            click.echo(f"Created: {post.get('created_time')}")
            click.echo(f"Type: {post.get('type')}")
            msg = post.get('message', post.get('story', 'N/A'))
            click.echo(f"Content: {msg[:100]}...")
            click.echo(f"Link: {post.get('permalink_url', 'N/A')}")
            click.echo("-" * 70)

    except Exception as e:
        raise click.ClickException(f"Error: {e}")

@page.command()
@click.option('--preset', default='last_30d', help='Time period (today, yesterday, last_7d, last_30d, last_90d)')
def insights(preset):
    """Get page insights (analytics)"""
    try:
        from config import PAGE_ID, PAGE_ACCESS_TOKEN
        from meta.pages import init_pages_api

        if not PAGE_ID or not PAGE_ACCESS_TOKEN:
            raise click.ClickException("PAGE_ID and PAGE_ACCESS_TOKEN env vars required")

        pages_api = init_pages_api(PAGE_ACCESS_TOKEN, PAGE_ID)
        result = pages_api.get_insights(date_preset=preset)

        if "error" in result:
            raise click.ClickException(f"API Error: {result['error']}")

        data = result.get("data", [])
        click.echo(f"\n📊 PAGE INSIGHTS ({preset})")
        click.echo("=" * 70)

        for metric in data:
            name = metric.get('name', 'Unknown')
            values = metric.get('values', [])
            if values:
                total = sum(float(v.get('value', 0)) for v in values)
                click.echo(f"{name}: {total:,.0f}")

    except Exception as e:
        raise click.ClickException(f"Error: {e}")

@page.command()
@click.argument('post_id')
@click.option('--limit', default=25, help='Number of comments to retrieve')
def comments(post_id, limit):
    """Get comments on a post"""
    try:
        from config import PAGE_ID, PAGE_ACCESS_TOKEN
        from meta.pages import init_pages_api

        if not PAGE_ID or not PAGE_ACCESS_TOKEN:
            raise click.ClickException("PAGE_ID and PAGE_ACCESS_TOKEN env vars required")

        pages_api = init_pages_api(PAGE_ACCESS_TOKEN, PAGE_ID)
        result = pages_api.get_comments(post_id, limit=limit)

        if "error" in result:
            raise click.ClickException(f"API Error: {result['error']}")

        comments_data = result.get("data", [])
        click.echo(f"\n💬 COMMENTS ({len(comments_data)} total)")
        click.echo("=" * 70)

        for comment in comments_data:
            click.echo(f"\nID: {comment.get('id')}")
            click.echo(f"Author: {comment.get('from', {}).get('name', 'Unknown')}")
            click.echo(f"Created: {comment.get('created_time')}")
            click.echo(f"Message: {comment.get('message')}")
            click.echo(f"Replies: {comment.get('comment_count', 0)}")
            click.echo("-" * 70)

    except Exception as e:
        raise click.ClickException(f"Error: {e}")

if __name__ == '__main__':
    cli()
