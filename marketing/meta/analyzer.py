from meta.client import get_ad_account
from datetime import datetime, timedelta

def get_account_insights():
    account = get_ad_account()
    end_date = datetime.now()
    start_date = end_date - timedelta(days=30)

    fields = ['spend', 'impressions', 'clicks', 'actions', 'action_values']
    insights = account.get_insights(
        fields=fields,
        params={
            'date_preset': 'last_30d',
            'level': 'account'
        }
    )

    if not insights:
        return {}

    data = insights[0]

    spend = float(data.get('spend', 0))
    impressions = int(data.get('impressions', 0))
    clicks = int(data.get('clicks', 0))

    ctr = (clicks / impressions * 100) if impressions > 0 else 0
    cpc = (spend / clicks) if clicks > 0 else 0

    actions = data.get('actions', [])
    conversions = sum(int(a.get('value', 0)) for a in actions if a.get('action_type') == 'purchase')
    roas = (data.get('action_values', [{}])[0].get('value', 0) / spend) if spend > 0 else 0
    cpa = (spend / conversions) if conversions > 0 else 0

    return {
        'spend': round(spend, 2),
        'impressions': impressions,
        'clicks': clicks,
        'ctr': round(ctr, 2),
        'cpc': round(cpc, 2),
        'conversions': conversions,
        'roas': round(roas, 2),
        'cpa': round(cpa, 2),
    }

def get_active_campaigns():
    account = get_ad_account()
    campaigns = account.get_campaigns(fields=['id', 'name', 'status', 'objective', 'spend'])

    return [
        {
            'id': c.get('id'),
            'name': c.get('name'),
            'status': c.get('status'),
            'objective': c.get('objective'),
            'spend': float(c.get('spend', 0)),
        }
        for c in campaigns if c.get('status') != 'PAUSED'
    ]

def get_all_campaigns(name_filter=None):
    """Get all campaigns including paused ones"""
    account = get_ad_account()
    campaigns = account.get_campaigns(fields=['id', 'name', 'status', 'objective', 'created_time'])

    result = []
    for c in campaigns:
        if name_filter and name_filter.lower() not in c.get('name', '').lower():
            continue
        result.append({
            'id': c.get('id'),
            'name': c.get('name'),
            'status': c.get('status'),
            'objective': c.get('objective'),
            'created_time': c.get('created_time'),
        })

    # Sort by created_time descending (newest first)
    result.sort(key=lambda x: x.get('created_time', ''), reverse=True)
    return result

def get_campaign_details(campaign_id: str):
    """Get full campaign details including adsets and ads"""
    from facebook_business.adobjects.campaign import Campaign
    from meta.client import init_api

    init_api()
    campaign = Campaign(campaign_id)
    campaign.remote_read(fields=['id', 'name', 'status', 'objective', 'created_time'])

    # Get adsets
    adsets = campaign.get_ad_sets(fields=['id', 'name', 'status', 'daily_budget'])
    adsets_list = []

    for adset in adsets:
        adset_id = adset.get('id')
        ads = adset.get_ads(fields=['id', 'name', 'status', 'creative'])
        ads_list = []

        for ad in ads:
            ads_list.append({
                'id': ad.get('id'),
                'name': ad.get('name'),
                'status': ad.get('status'),
                'creative': ad.get('creative'),
            })

        adsets_list.append({
            'id': adset_id,
            'name': adset.get('name'),
            'status': adset.get('status'),
            'daily_budget': adset.get('daily_budget'),
            'ads': ads_list,
        })

    return {
        'campaign_id': campaign.get('id'),
        'campaign_name': campaign.get('name'),
        'status': campaign.get('status'),
        'objective': campaign.get('objective'),
        'created_time': campaign.get('created_time'),
        'adsets': adsets_list,
    }
