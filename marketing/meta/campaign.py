import base64
import requests
from facebook_business.adobjects.campaign import Campaign
from facebook_business.adobjects.adset import AdSet
from facebook_business.adobjects.ad import Ad
from facebook_business.adobjects.adcreative import AdCreative
from meta.client import get_ad_account
from models.campaign_plan import CampaignPlan
from config import ACCESS_TOKEN, AD_ACCOUNT_ID

def get_account_images():
    """Lista imágenes subidas en la librería de medios de la cuenta"""
    account = get_ad_account()
    images = account.get_ad_images()
    return list(images)

def upload_image(image_bytes: bytes) -> str:
    """Sube una imagen a la cuenta de Meta Ads y retorna el image_hash"""
    account = get_ad_account()

    # El SDK de Meta espera base64 como STRING
    image_b64 = base64.b64encode(image_bytes).decode('utf-8')

    try:
        response = account.create_ad_image(params={'bytes': image_b64})
        image_hash = response.get('hash')
        if not image_hash:
            raise ValueError(f"No hash en respuesta: {response}")
        print(f"✓ Imagen subida: {image_hash}")
        return image_hash
    except Exception as e:
        raise ValueError(f"Error subiendo imagen a Meta Ads: {str(e)}")

def create_campaign(plan: CampaignPlan, status: str = Campaign.Status.paused) -> str:
    """Crea campaña usando API REST directa v25.0."""
    url = f"https://graph.facebook.com/v25.0/{AD_ACCOUNT_ID}/campaigns"

    payload = {
        "name": plan.campaign_name,
        "objective": plan.objective,
        "status": status,
        "special_ad_categories": [],
        "is_adset_budget_sharing_enabled": False,
    }

    try:
        response = requests.post(url, json=payload, params={"access_token": ACCESS_TOKEN})
        response.raise_for_status()
        data = response.json()

        if "error" in data:
            error_msg = data.get('error', {}).get('message', 'Unknown error')
            print(f"DEBUG - Respuesta completa Meta: {data}")
            raise ValueError(f"Meta API error: {error_msg}")

        campaign_id = data.get('id')
        print(f"✓ Campaign created: {campaign_id}")
        return campaign_id

    except requests.exceptions.RequestException as e:
        try:
            error_data = e.response.json()
            print(f"DEBUG - Respuesta completa Meta: {error_data}")
            error_msg = error_data.get('error', {}).get('message', str(e))
        except:
            error_msg = str(e)
        raise ValueError(f"Error creando campaña: {error_msg}")

def create_adset(campaign_id: str, plan: CampaignPlan, status: str = AdSet.Status.paused) -> str:
    """Crea ad set usando API REST directa v25.0."""
    url = f"https://graph.facebook.com/v25.0/{AD_ACCOUNT_ID}/adsets"

    targeting = {
        'age_min': plan.audience.age_min,
        'age_max': plan.audience.age_max,
        'geo_locations': {'countries': plan.audience.countries},
        'publisher_platforms': ['facebook', 'instagram'],
        'targeting_automation': {
            'advantage_audience': 0
        }
    }

    if plan.audience.interests:
        targeting['flexible_spec'] = [{
            'interests': [{'name': interest} for interest in plan.audience.interests]
        }]

    daily_budget_cents = int(plan.daily_budget * 100)
    bid_amount_cents = max(500, daily_budget_cents // 2)

    payload = {
        "name": f"{plan.campaign_name} - Adset 1",
        "campaign_id": campaign_id,
        "daily_budget": daily_budget_cents,
        "billing_event": "IMPRESSIONS",
        "optimization_goal": "IMPRESSIONS",
        "bid_amount": bid_amount_cents,
        "status": status,
        "targeting": targeting,
    }

    try:
        response = requests.post(url, json=payload, params={"access_token": ACCESS_TOKEN})
        response.raise_for_status()
        data = response.json()

        if "error" in data:
            error_msg = data.get('error', {}).get('message', 'Unknown error')
            print(f"DEBUG - Respuesta completa Meta: {data}")
            raise ValueError(f"Meta API error: {error_msg}")

        adset_id = data.get('id')
        print(f"✓ Ad Set created: {adset_id}")
        return adset_id

    except requests.exceptions.RequestException as e:
        try:
            error_data = e.response.json()
            print(f"DEBUG - Respuesta completa Meta: {error_data}")
            error_msg = error_data.get('error', {}).get('message', str(e))
        except:
            error_msg = str(e)
        raise ValueError(f"Error creando ad set: {error_msg}")

def create_ad(adset_id: str, plan: CampaignPlan, image_bytes: bytes = None, status: str = Ad.Status.paused) -> str:
    """Crea ad usando API REST directa v25.0 con object_story_spec."""
    if not plan.landing_url.startswith(('http://', 'https://')):
        raise ValueError(f"URL inválida: {plan.landing_url}. Debe empezar con http:// o https://")

    # Paso 1: Subir imagen PRIMERO si existe
    image_hash = None
    if image_bytes:
        image_hash = upload_image(image_bytes)

    # Paso 2: Crear creativo con object_story_spec
    creative_url = f"https://graph.facebook.com/v25.0/{AD_ACCOUNT_ID}/adcreatives"
    PAGE_ID = "1130355880150943"

    link_data = {
        "message": plan.ad_copy,
        "link": plan.landing_url,
    }

    if image_hash:
        link_data["image_hash"] = image_hash

    creative_payload = {
        "name": plan.campaign_name,
        "object_story_spec": {
            "page_id": PAGE_ID,
            "link_data": link_data
        }
    }

    print(f"DEBUG - Creative payload: {creative_payload}")

    try:
        response = requests.post(creative_url, json=creative_payload, params={"access_token": ACCESS_TOKEN})
        response.raise_for_status()
        creative_data = response.json()

        if "error" in creative_data:
            error_msg = creative_data.get('error', {}).get('message', 'Unknown error')
            print(f"DEBUG - Respuesta completa Meta (Creative): {creative_data}")
            raise ValueError(f"Error creativo: {error_msg}")

        creative_id = creative_data.get('id')
        print(f"✓ Creative created: {creative_id}")

        # Paso 3: Crear ad
        ad_url = f"https://graph.facebook.com/v25.0/{AD_ACCOUNT_ID}/ads"

        ad_payload = {
            "adset_id": adset_id,
            "creative": {"creative_id": creative_id},
            "status": status,
        }

        response = requests.post(ad_url, json=ad_payload, params={"access_token": ACCESS_TOKEN})
        response.raise_for_status()
        ad_data = response.json()

        if "error" in ad_data:
            error_msg = ad_data.get('error', {}).get('message', 'Unknown error')
            print(f"DEBUG - Respuesta completa Meta (Ad): {ad_data}")
            raise ValueError(f"Error ad: {error_msg}")

        ad_id = ad_data.get('id')
        print(f"✓ Ad created: {ad_id}")
        return ad_id

    except requests.exceptions.RequestException as e:
        try:
            error_data = e.response.json()
            print(f"DEBUG - Respuesta completa Meta (Exception): {error_data}")
            error_msg = error_data.get('error', {}).get('message', str(e))
        except:
            error_msg = str(e)
        raise ValueError(f"Error creando ad: {error_msg}")

def create_full_campaign(plan: CampaignPlan, image_bytes: bytes = None, status: str = Campaign.Status.paused) -> dict:
    campaign_id = create_campaign(plan, status=status)
    adset_id = create_adset(campaign_id, plan, status=status)
    ad_id = create_ad(adset_id, plan, image_bytes=image_bytes, status=status)

    return {
        'campaign_id': campaign_id,
        'adset_id': adset_id,
        'ad_id': ad_id,
    }
