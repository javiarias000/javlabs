from facebook_business.api import FacebookAdsApi
from facebook_business.adobjects.adaccount import AdAccount
from config import APP_ID, APP_SECRET, ACCESS_TOKEN, AD_ACCOUNT_ID

_api = None

def init_api():
    global _api
    if _api is None:
        FacebookAdsApi.init(access_token=ACCESS_TOKEN)
        _api = FacebookAdsApi
    return _api

def get_ad_account():
    init_api()
    return AdAccount(AD_ACCOUNT_ID)

def test_connection():
    try:
        account = get_ad_account()
        insights = account.get_insights(fields=['spend'])
        return True
    except Exception as e:
        print(f"Error connecting to Meta API: {e}")
        return False
