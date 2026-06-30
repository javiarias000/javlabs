#!/usr/bin/env python
import os
import sys
from dotenv import load_dotenv
load_dotenv('/home/jav/Facebook/.env')

from facebook_business.adobjects.adcreative import AdCreative
from facebook_business.adobjects.ad import Ad
from meta.client import get_ad_account, init_api

init_api()

ADSET_ID = '52608870257417'
IMAGE_HASH = sys.argv[1] if len(sys.argv) > 1 else None

if not IMAGE_HASH:
    print("❌ Uso: python create_ad_manual.py <image_hash>")
    print("\nEjemplo: python create_ad_manual.py 959b8699890838826ba9514748ece8f1")
    sys.exit(1)

account = get_ad_account()

# Crear creativo
creative_params = {
    AdCreative.Field.title: "MI IDEA - Diseño y Construcción",
    AdCreative.Field.body: "Transformamos tus ideas en realidad. Servicios de diseño, láser y construcción.",
    AdCreative.Field.image_hash: IMAGE_HASH,
    AdCreative.Field.call_to_action_type: "LEARN_MORE",
    AdCreative.Field.website_url: "https://tudominio.com",
}

print("Creating creative...")
creative = account.create_adcreative(creative_params)
creative_id = creative.get('id')
print(f"✓ Creative created: {creative_id}")

# Crear ad
ad_params = {
    Ad.Field.adset_id: ADSET_ID,
    Ad.Field.creative: {'creative_id': creative_id},
    Ad.Field.status: Ad.Status.paused,
    Ad.Field.name: "WhatsApp_Ad_1",
}

print("Creating ad...")
ad = account.create_ad(ad_params)
ad_id = ad.get('id')
print(f"✓ Ad created: {ad_id}")
print(f"\n✅ Ad set '{ADSET_ID}' ahora tiene 1 anuncio")
