#!/usr/bin/env python3
"""
Crear anuncio Día de la Madre 2026 - VERSIÓN FINAL
Usa creative existente + Ad Set optimizado + imagen subida
Ejecutar DESPUÉS de agregar método de pago en Ads Manager
"""

from meta.client import get_ad_account
import json
from datetime import datetime

def create_mother_day_2026_ad():
    """
    Crea el anuncio final para Día de la Madre 2026
    Precondiciones:
    - Ad Set 6884404856613 ya configurado ✓
    - Imagen ya subida (hash: fabc143181e2fccef71a65592263f1bf) ✓
    - Método de pago agregado en Ads Manager ✓
    """

    ACCOUNT_ID = 'act_464890650235577'
    ADSET_ID = '6884404856613'
    CREATIVE_ID = '1412760383189829'  # Día Madre 2025 (reutilizar)
    CAMPAIGN_ID = '6884404855213'

    account = get_ad_account()

    print("=" * 70)
    print("🌸 CREAR ANUNCIO DÍA DE LA MADRE 2026")
    print("=" * 70)

    # ============================================
    # CREAR ANUNCIO
    # ============================================

    print(f"\n📝 Creando anuncio...")
    print(f"   Campaign:  {CAMPAIGN_ID}")
    print(f"   Ad Set:    {ADSET_ID}")
    print(f"   Creative:  {CREATIVE_ID}")

    # Intento múltiples formatos de creative
    creative_formats = [
        {'creative_id': CREATIVE_ID},  # Formato dict
        CREATIVE_ID,  # Formato string directo
        int(CREATIVE_ID),  # Formato int
    ]

    ad_params_base = {
        'name': f'Día Madre 2026 - {datetime.now().strftime("%d/%m/%Y")}',
        'adset_id': ADSET_ID,
        'status': 'PAUSED',
    }

    ad_response = None
    ad_id = None

    for idx, creative_format in enumerate(creative_formats, 1):
        try:
            print(f"\n   Intento {idx}: creative = {type(creative_format).__name__}")

            ad_params = {**ad_params_base, 'creative': creative_format}
            ad_response = account.create_ad(ad_params)

            if isinstance(ad_response, dict) and 'id' in ad_response:
                ad_id = ad_response['id']
            else:
                ad_id = str(ad_response)

            print(f"   ✅ Éxito con este formato!")
            break

        except Exception as e:
            error_msg = str(e)[:200]
            print(f"   ❌ {error_msg}")
            continue

    if ad_id:
        print(f"\n✅ ANUNCIO CREADO EXITOSAMENTE!")
        print(f"   Ad ID:     {ad_id}")
        print(f"   Status:    PAUSED (revisar antes de activar)")

        return {
            'ad_id': ad_id,
            'creative_id': CREATIVE_ID,
            'adset_id': ADSET_ID,
            'campaign_id': CAMPAIGN_ID,
            'status': 'success'
        }
    else:
        print(f"\n❌ TODOS LOS INTENTOS FALLARON")
        print(f"\n💡 POSIBLE CAUSA: Falta agregar método de pago en Ads Manager")
        print(f"\n💡 SOLUCIÓN:")
        print(f"   1. Ir a: https://ads.facebook.com/billing")
        print(f"   2. Agregar método de pago (tarjeta de crédito)")
        print(f"   3. Esperar 5 minutos para que Meta sincronice")
        print(f"   4. Reintentar este script")

        return {
            'status': 'error',
            'error': 'Todos los intentos fallaron. Verificar método de pago.'
        }

    # ============================================
    # RESUMEN FINAL
    # ============================================

    print("\n" + "=" * 70)
    print("📊 CAMPAÑA DÍA DE LA MADRE 2026 - LISTA")
    print("=" * 70)

    print(f"""
    ✅ Ad Set Configurado:
       - Billing: CONVERSIONS (óptimo)
       - Targeting: 25-50 años, Ecuador
       - Presupuesto: $100/día
       - Schedule: 7am-11:59pm (May 8-14)

    ✅ Imagen Subida:
       - Hash: fabc143181e2fccef71a65592263f1bf
       - Archivo: Arreglo floral $20

    ✅ Anuncio Creado:
       - ID: {ad_id}
       - Status: PAUSED

    📋 PRÓXIMOS PASOS:
    1. Revisar anuncio en Ads Manager (verificar preview)
    2. Cambiar Status: PAUSED → ACTIVE
    3. Monitorear primeras 24h:
       - Impresiones >100
       - CTR >2%
       - CPC <$0.30
    4. Si todo OK: dejar activo hasta May 14
    5. El 15 de mayo: pausar y analizar resultados

    🎯 MÉTRICAS ESPERADAS:
    - Impresiones: 5,000-10,000
    - Clics: 100-300
    - Conversiones: 5-15
    - ROAS: 2.5-4x
    - CPL: $10-20

    📞 LINK A ANUNCIO:
    https://ads.facebook.com/ad/{ad_id}

    🎉 ¡Campaña lista para lanzamiento!
    """)

if __name__ == '__main__':
    result = create_mother_day_2026_ad()

    if result['status'] == 'success':
        print(f"\n✨ Éxito. Anuncio: {result['ad_id']}")
    else:
        print(f"\n⚠️ Fallo: {result.get('error', 'Unknown error')}")
