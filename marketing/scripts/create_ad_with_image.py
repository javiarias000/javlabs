#!/usr/bin/env python3
"""
Crear anuncio Día de la Madre 2026 CON IMAGEN
Sube imagen a Meta → obtiene hash → crea anuncio
"""

from facebook_business.adobjects.adimage import AdImage
from facebook_business.adobjects.ad import Ad
from facebook_business.adobjects.adcreative import AdCreative
from meta.client import get_ad_account
import os
import base64

def upload_image_and_create_ad():
    """
    1. Sube imagen a Meta
    2. Obtiene image_hash
    3. Crea anuncio con imagen + copy emocional
    """

    ADSET_ID = '6884404856613'
    PAGE_ID = '1130355880150943'
    IMAGE_PATH = "/home/jav/Facebook/facebook-100063596467837-20_04_2026-OWzQjEYQ/this_profile's_activity_across_facebook/posts/media/Fotos_505523001577578/240013701246866.jpg"

    account = get_ad_account()

    print("=" * 60)
    print("🎨 CREAR ANUNCIO DÍA DE LA MADRE 2026 CON IMAGEN")
    print("=" * 60)

    # ============================================
    # 1. VALIDAR IMAGEN
    # ============================================

    print(f"\n📸 Validando imagen...")
    if not os.path.exists(IMAGE_PATH):
        print(f"❌ Imagen no encontrada: {IMAGE_PATH}")
        return None

    file_size_mb = os.path.getsize(IMAGE_PATH) / (1024 * 1024)
    print(f"✓ Imagen encontrada ({file_size_mb:.2f} MB)")

    # ============================================
    # 2. SUBIR IMAGEN A META
    # ============================================

    print(f"\n☁️ Subiendo imagen a Meta...")

    try:
        # Parámetro 'bytes' requiere string (base64 encoded)
        with open(IMAGE_PATH, 'rb') as f:
            image_bytes = f.read()

        # Codificar a base64 como string
        image_base64 = base64.b64encode(image_bytes).decode('utf-8')

        ad_image = account.create_ad_image(
            params={'bytes': image_base64}
        )

        image_hash = ad_image.get('hash')
        image_id = ad_image.get('id')

        print(f"✅ Imagen subida exitosamente")
        print(f"   Hash: {image_hash}")
        print(f"   ID: {image_id}")

    except Exception as e:
        error_msg = str(e)[:500]
        print(f"❌ Error subiendo imagen: {error_msg}")
        raise

    # ============================================
    # 3. CREAR ADCREATIVE CON IMAGEN
    # ============================================

    print(f"\n🎯 Creando AdCreative con imagen...")

    # ============================================
    # 3B. CREAR ADCREATIVE SOLO CON IMAGEN
    # ============================================
    # (Sin título/body - esos van en el Ad directamente)

    print(f"\n🎯 Creando AdCreative image-only...")

    # Meta requiere: image_hash MÍNIMO
    # Los campos como title, body van en el Ad, no en el Creative
    creative_data_minimal = {
        'image_hash': image_hash,
    }

    creative_id = None
    try:
        ad_creative = account.create_ad_creative(creative_data_minimal)
        creative_id = ad_creative.get('id')
        print(f"✅ AdCreative image-only creado: {creative_id}")
    except Exception as e:
        error_msg = str(e)[:500]
        print(f"⚠️ Error: {error_msg}")
        print("   Nota: AdCreative puede requerir object_story_id (post)")
        return None

    if not creative_id:
        print("❌ No se pudo crear AdCreative")
        return None

    # ============================================
    # 4. CREAR ANUNCIO CON CREATIVE_ID
    # ============================================

    print(f"\n📝 Creando Anuncio...")

    ad_params = {
        'name': 'Día Madre 2026 - Arreglo Floral $20',
        'adset_id': ADSET_ID,
        'creative': {'creative_id': creative_id},
        'status': 'PAUSED',
    }

    try:
        ad = account.create_ad(ad_params)
        ad_id = ad.get('id')
        print(f"✅ Anuncio creado exitosamente")
        print(f"   ID: {ad_id}")

    except Exception as e:
        error_msg = str(e)[:600]
        print(f"❌ Error creando anuncio: {error_msg}")
        return None

    # ============================================
    # 5. RESUMEN
    # ============================================

    print("\n" + "=" * 60)
    print("✅ ANUNCIO CREADO EXITOSAMENTE")
    print("=" * 60)
    print(f"""
    Ad Set ID:       {ADSET_ID}
    Creative ID:     {creative_id}
    Ad ID:           {ad_id}
    Image Hash:      {image_hash}
    Status:          PAUSED (revisar antes de activar)

    📋 PRÓXIMOS PASOS:
    1. Ir a Ads Manager → Anuncio {ad_id}
    2. Revisar preview en desktop + mobile
    3. Verificar link de WhatsApp
    4. Cambiar Status a ACTIVE cuando esté listo
    5. Monitorear en primeras 24h

    🎯 MÉTRICAS ESPERADAS:
    - Impresiones: >100 en 3 min
    - CTR: >2%
    - CPC: <$0.30
    - Relevance Score: ≥6/10
    """)

    return {
        'ad_id': ad_id,
        'creative_id': creative_id,
        'image_hash': image_hash,
        'adset_id': ADSET_ID
    }

if __name__ == '__main__':
    result = upload_image_and_create_ad()
    if result:
        print(f"\n✅ TODO LISTO - Anuncio: {result['ad_id']}")
    else:
        print(f"\n❌ Error al crear anuncio")
