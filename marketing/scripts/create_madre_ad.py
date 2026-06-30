#!/usr/bin/env python3
"""
Crear anuncio Día de la Madre 2026 vía API
Usa copy emocional + CTA optimizado
"""

from facebook_business.adobjects.ad import Ad
from facebook_business.adobjects.adcreative import AdCreative
from meta.client import get_ad_account
import json

def create_madre_ad():
    """
    Crea anuncio con copy emocional para Día de la Madre 2026

    Parámetros optimizados:
    - Copy: Emocional + beneficio
    - CTA: LEARN_MORE (visitar landing/WhatsApp)
    - Status: PAUSED (review antes de activar)
    """

    ADSET_ID = '6884404856613'  # Obtenido de setup_madre_2026.py
    PAGE_ID = '1130355880150943'  # MI IDEA page

    account = get_ad_account()

    # ============================================
    # CREATIVE DATA: Copy emocional + CTA
    # ============================================

    print("🎨 Creando AdCreative para Día de la Madre 2026...")

    creative_spec = {
        'page_id': PAGE_ID,
        'title': '🌸 Sorprende a tu madre en su día',
        'body': 'Diseño, remodelación o regalo personalizado con láser. Ella merece lo mejor. Hablemos de tu proyecto.',
        'call_to_action_type': 'LEARN_MORE',
        'object_url': 'https://wa.me/593999999999',  # TODO: reemplazar con WhatsApp real
    }

    # ============================================
    # 1. CREAR ADCREATIVE
    # ============================================

    try:
        ad_creative = account.create_ad_creative({
            'title': creative_spec['title'],
            'body': creative_spec['body'],
            'call_to_action_type': creative_spec['call_to_action_type'],
            'object_url': creative_spec['object_url'],
            'page_id': creative_spec['page_id'],
        })

        creative_id = ad_creative.get('id') if isinstance(ad_creative, dict) else str(ad_creative)
        print(f"✅ AdCreative creado: {creative_id}")

        # ============================================
        # 2. CREAR ANUNCIO CON CREATIVE
        # ============================================

        print(f"📝 Creando Ad en Ad Set {ADSET_ID}...")

        ad_params = {
            'name': f'Madre 2026 - Emocional',
            'adset_id': ADSET_ID,
            'creative': {'creative_id': creative_id},
            'status': 'PAUSED',
        }

        ad = account.create_ad(ad_params)
        ad_id = ad.get('id') if isinstance(ad, dict) else str(ad)

        print(f"✅ Anuncio creado: {ad_id}")
        return ad_id

    except Exception as e:
        print(f"⚠️ Error: {str(e)[:500]}")
        print(f"\n📋 PARÁMETROS PARA CREAR MANUALMENTE:")
        print(f"   Ad Set ID: {ADSET_ID}")
        print(f"   Título: {creative_spec['title']}")
        print(f"   Body: {creative_spec['body']}")
        print(f"   CTA: {creative_spec['call_to_action_type']}")
        return None

if __name__ == '__main__':
    ad_id = create_madre_ad()

    if ad_id:
        print(f"""
✅ ANUNCIO LISTO

Próximos pasos:
1. Agregar imagen real (Antes/Después proyecto)
2. Reemplazar link de WhatsApp con el real
3. Revisar en Ads Manager
4. Cambiar status a ACTIVE
        """)
    else:
        print("""
⚠️ Crear anuncio manualmente en Ads Manager:
1. Ad Set ID: 6884404856613
2. Usar copy emocional proporcionado
3. Agregar imagen
4. Activar cuando esté listo
        """)
