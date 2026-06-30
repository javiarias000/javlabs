#!/usr/bin/env python3
"""
create_golden_strings_campaign.py
==================================
Crea la estructura completa de campaña Golden Strings en Meta Ads como BORRADOR (PAUSED).

El usuario agrega los creativos (video/imagen) por separado desde Meta Ads Manager.
Este script crea: Campaign → Ad Set → 3 Ad Creatives (copy only) → 3 Ads (PAUSED).

PROCESO DOCUMENTADO PARA WIZARD (ver CAMPAIGN_WIZARD.md):
  Paso 1 — Validar configuración y conexión
  Paso 2 — Crear Campaña (PAUSED)
  Paso 3 — Crear Ad Set con targeting preciso
  Paso 4 — Crear 3 Creativos (variaciones de copy)
  Paso 5 — Crear 3 Ads vinculando creativos al ad set
  Paso 6 — Guardar manifiesto con IDs + copy para revisión
"""

import os
import sys
import json
import requests
from datetime import datetime
from pathlib import Path

# Cargar .env manualmente (sin dependencia de dotenv)
def _load_env(path):
    try:
        for line in Path(path).read_text().splitlines():
            line = line.strip()
            if line and not line.startswith("#") and "=" in line:
                k, _, v = line.partition("=")
                os.environ.setdefault(k.strip(), v.strip())
    except FileNotFoundError:
        pass

_load_env(Path(__file__).parent / ".env")

# ============================================================
# CONFIGURACIÓN — Golden Strings
# ============================================================

ACCESS_TOKEN   = os.getenv("META_ACCESS_TOKEN")
AD_ACCOUNT_ID  = "act_1344807997712643"   # Cuenta Golden_String
PAGE_ID        = "744238478769006"         # Página Golden Strings (84 fans)
API_VERSION    = "v25.0"
BASE_URL       = f"https://graph.facebook.com/{API_VERSION}"
DAILY_BUDGET   = 300                       # $3.00/día (en centavos)
CAMPAIGN_DATE  = datetime.now().strftime("%Y-%m-%d")

# ============================================================
# PASO 4 — COPY: 3 VARIACIONES (A/B/C)
# Basado en estrategia.md — ángulos probados por el framework
# ============================================================

AD_COPIES = [
    {
        "id":          "A1_emotional",
        "angle":       "Emocional — copy ya probado con CTR 2.11% en campaña anterior",
        "hook":        "El momento que todos recuerdan no es el pastel. Es la música.🎻",
        "body": (
            "El momento que todos recuerdan no es el pastel. Es la música.🎻\n\n"
            "Haz que tu graduación, boda o evento sea el que nadie olvida.\n"
            "Violín en vivo en Ambato — disponible para tu fecha.\n\n"
            "Escríbeme y coordinamos 🎶"
        ),
        "headline":    "Agenta ya tu Evento",
        "description": "Violín en vivo para bodas, graduaciones y eventos en Ambato",
        "cta":         "WHATSAPP_MESSAGE",
    },
    {
        "id":          "A2_social_proof",
        "angle":       "Prueba social — credibilidad por volumen de eventos",
        "hook":        "50+ eventos en Ecuador. El violín que todos recuerdan.",
        "body": (
            "50+ bodas, graduaciones y eventos en Ecuador 🎻\n\n"
            "Cada evento tiene un momento que eriza la piel.\n"
            "El mío es ese.\n\n"
            "Disponible en Ambato — escríbeme con tu fecha y te confirmo disponibilidad."
        ),
        "headline":    "Música en Vivo para tu Evento",
        "description": "+50 eventos en Ecuador. Bodas, graduaciones, corporativos.",
        "cta":         "WHATSAPP_MESSAGE",
    },
    {
        "id":          "A3_contrarian",
        "angle":       "Contrarian — rompe expectativa, genera curiosidad",
        "hook":        "La diferencia entre una fiesta y un evento memorable",
        "body": (
            "No es la decoración.\n"
            "No es el catering.\n"
            "No es el DJ.\n\n"
            "Es ese momento musical que hace que todos se volteen a mirarse.\n\n"
            "Violín en vivo en Ambato 🎻 — escríbeme con la fecha de tu evento."
        ),
        "headline":    "Tu Evento, Inolvidable",
        "description": "El toque musical que transforma cualquier celebración.",
        "cta":         "WHATSAPP_MESSAGE",
    },
]

# ============================================================
# PASO 3 — TARGETING (resultado de búsqueda API)
# Geo key 644431 = Ambato, Pichincha Province (confirmado)
# Interest IDs verificados via /search endpoint
# ============================================================

TARGETING = {
    "age_min": 28,
    "age_max": 50,
    "geo_locations": {
        "cities": [
            {"key": "638102", "radius": 25, "distance_unit": "kilometer"}
        ]
    },
    "publisher_platforms": ["facebook", "instagram"],
    "flexible_spec": [
        {
            "interests": [
                {"id": "6003409392877", "name": "Bodas (concepto social)"},
                {"id": "6003069898229", "name": "Organización de bodas"},
                {"id": "6003092932417", "name": "Gestión de eventos"},
                {"id": "6003243959401", "name": "Acto de graduación"},
                {"id": "6899296281873", "name": "Eventos y ocasiones especiales"},
            ]
        }
    ],
    # NOTA: exclusiones de intereses deprecadas en Meta API v25.0 — eliminadas
    "targeting_automation": {"advantage_audience": 0},
}


# ============================================================
# HELPERS
# ============================================================

def api_post(endpoint, payload):
    """POST a la Graph API. Lanza ValueError con el mensaje de error si falla."""
    url = f"{BASE_URL}/{endpoint}"
    try:
        r = requests.post(url, json=payload, params={"access_token": ACCESS_TOKEN}, timeout=30)
        r.raise_for_status()
        data = r.json()
        if "error" in data:
            raise ValueError(f"Meta API error: {data['error']['message']}")
        return data
    except requests.exceptions.RequestException as e:
        try:
            msg = e.response.json().get("error", {}).get("message", str(e))
        except Exception:
            msg = str(e)
        raise ValueError(f"Request error: {msg}")


def step(n, title):
    print(f"\n{'='*60}")
    print(f"  PASO {n}: {title}")
    print(f"{'='*60}")


# ============================================================
# PASO 1 — Validar configuración
# ============================================================

def validate():
    step(1, "Validar configuración y conexión")
    if not ACCESS_TOKEN:
        sys.exit("❌ META_ACCESS_TOKEN no encontrado en .env")

    r = requests.get(
        f"{BASE_URL}/{AD_ACCOUNT_ID}",
        params={"access_token": ACCESS_TOKEN, "fields": "id,name,account_status"},
    )
    data = r.json()
    if "error" in data:
        sys.exit(f"❌ No se puede acceder a la cuenta: {data['error']['message']}")

    print(f"  ✓ Cuenta: {data.get('name')} ({data.get('id')})")
    print(f"  ✓ Status: {'Activa' if data.get('account_status') == 1 else data.get('account_status')}")
    print(f"  ✓ Página: Golden Strings ({PAGE_ID})")
    print(f"  ✓ Presupuesto diario: ${DAILY_BUDGET/100:.2f}/día")
    print(f"  ✓ Creativas: {len(AD_COPIES)} variaciones listas")


# ============================================================
# PASO 2 — Crear Campaña
# ============================================================

def create_campaign():
    step(2, "Crear Campaña (PAUSED)")

    campaign_name = f"Golden Strings — Eventos {CAMPAIGN_DATE}"

    payload = {
        "name":                         campaign_name,
        "objective":                    "OUTCOME_ENGAGEMENT",
        "status":                       "PAUSED",
        "special_ad_categories":        [],
        "is_adset_budget_sharing_enabled": False,
    }

    data = api_post(f"{AD_ACCOUNT_ID}/campaigns", payload)
    cid = data["id"]
    print(f"  ✓ Campaña creada: {campaign_name}")
    print(f"  ✓ ID: {cid}")
    return cid


# ============================================================
# PASO 3 — Crear Ad Set
# ============================================================

def create_adset(campaign_id):
    step(3, "Crear Ad Set con targeting preciso")

    adset_name = "Eventos Ambato | 28-50 | Bodas & Graduaciones"

    payload = {
        "name":               adset_name,
        "campaign_id":        campaign_id,
        "daily_budget":       DAILY_BUDGET,
        "billing_event":      "IMPRESSIONS",
        "optimization_goal":  "CONVERSATIONS",
        "bid_amount":         200,    # $2.00 límite de puja — requerido para CONVERSATIONS
        "status":             "PAUSED",
        "targeting":          TARGETING,
    }

    data = api_post(f"{AD_ACCOUNT_ID}/adsets", payload)
    adset_id = data["id"]
    print(f"  ✓ Ad Set creado: {adset_name}")
    print(f"  ✓ ID: {adset_id}")
    print(f"  ✓ Geo: Ambato (20km radio)")
    print(f"  ✓ Edad: 28-50")
    print(f"  ✓ Intereses: Bodas, Organización de bodas, Gestión de eventos, Graduación")
    return adset_id


# ============================================================
# PASO 4 — Crear Creativos (copy sin imagen/video)
# El usuario agrega el video desde Meta Ads Manager
# ============================================================

def create_creatives():
    step(4, "Crear 3 Creativos (copy — el usuario agrega video)")
    creative_ids = []

    for copy in AD_COPIES:
        creative_name = f"GS | {copy['id']} | {CAMPAIGN_DATE}"

        # Link a la página de FB como placeholder — el usuario reemplaza con video
        payload = {
            "name": creative_name,
            "object_story_spec": {
                "page_id": PAGE_ID,
                "link_data": {
                    "message":     copy["body"],
                    "name":        copy["headline"],
                    "description": copy["description"],
                    "link":        f"https://www.facebook.com/Golden-Strings-744238478769006",
                    "call_to_action": {
                        "type": "WHATSAPP_MESSAGE",
                        "value": {"app_destination": "WHATSAPP"},
                    },
                },
            },
        }

        try:
            data = api_post(f"{AD_ACCOUNT_ID}/adcreatives", payload)
            cid = data["id"]
            print(f"  ✓ Creativo [{copy['id']}]: {cid}")
            print(f"    Ángulo: {copy['angle']}")
            print(f"    Hook:   {copy['hook'][:60]}...")
            creative_ids.append({"copy_id": copy["id"], "creative_id": cid})
        except ValueError as e:
            print(f"  ⚠️  Creativo [{copy['id']}] falló: {e}")
            print(f"     → Guardado en manifiesto para creación manual")
            creative_ids.append({"copy_id": copy["id"], "creative_id": None, "error": str(e)})

    return creative_ids


# ============================================================
# PASO 5 — Crear Ads (vincula creative → adset)
# ============================================================

def create_ads(adset_id, creative_ids):
    step(5, "Crear 3 Ads vinculando creativos al Ad Set")
    ad_ids = []

    for i, item in enumerate(creative_ids):
        if not item.get("creative_id"):
            print(f"  ⚠️  Ad [{item['copy_id']}] omitido — creativo no disponible")
            ad_ids.append({"copy_id": item["copy_id"], "ad_id": None})
            continue

        copy = next(c for c in AD_COPIES if c["id"] == item["copy_id"])
        ad_name = f"GS | {copy['id']} | {CAMPAIGN_DATE}"

        payload = {
            "name":       ad_name,
            "adset_id":   adset_id,
            "creative":   {"creative_id": item["creative_id"]},
            "status":     "PAUSED",
        }

        try:
            data = api_post(f"{AD_ACCOUNT_ID}/ads", payload)
            aid = data["id"]
            print(f"  ✓ Ad [{copy['id']}]: {aid} (PAUSED)")
            ad_ids.append({"copy_id": copy["id"], "ad_id": aid})
        except ValueError as e:
            print(f"  ⚠️  Ad [{copy['id']}] falló: {e}")
            ad_ids.append({"copy_id": copy["id"], "ad_id": None, "error": str(e)})

    return ad_ids


# ============================================================
# PASO 6 — Guardar manifiesto JSON
# ============================================================

def save_manifest(campaign_id, adset_id, creative_ids, ad_ids):
    step(6, "Guardar manifiesto (IDs + copy para revisión)")

    manifest = {
        "created_at":    datetime.now().isoformat(),
        "account":       {"id": AD_ACCOUNT_ID, "name": "Golden_String"},
        "page":          {"id": PAGE_ID, "name": "Golden Strings"},
        "campaign":      {"id": campaign_id, "status": "PAUSED"},
        "adset":         {"id": adset_id, "daily_budget_usd": DAILY_BUDGET / 100},
        "targeting": {
            "city":      "Ambato (key 644431, 20km radio)",
            "age":       "28-50",
            "interests": [i["name"] for i in TARGETING["flexible_spec"][0]["interests"]],
        },
        "ads": [
            {
                **next(c for c in AD_COPIES if c["id"] == a["copy_id"]),
                "ad_id":        a.get("ad_id"),
                "creative_id":  next((x["creative_id"] for x in creative_ids if x["copy_id"] == a["copy_id"]), None),
                "status":       "PAUSED",
                "note":         "Agregar video desde Meta Ads Manager antes de activar",
            }
            for a in ad_ids
        ],
        "next_steps": [
            "1. Abrir Meta Ads Manager → Golden_String account",
            "2. Buscar campaña: 'Golden Strings — Eventos'",
            "3. Para cada ad: editar → subir video/imagen del creativo",
            "4. Revisar preview del anuncio",
            "5. Si apruebas → cambiar status a ACTIVE",
        ],
    }

    out_path = Path(__file__).parent / "golden_strings_campaign_manifest.json"
    out_path.write_text(json.dumps(manifest, ensure_ascii=False, indent=2))
    print(f"  ✓ Manifiesto guardado: {out_path.name}")
    return manifest


# ============================================================
# MAIN
# ============================================================

def main():
    print("\n🎻 Golden Strings — Creación de Campaña Meta Ads")
    print(f"   Fecha: {CAMPAIGN_DATE} | Cuenta: {AD_ACCOUNT_ID}")

    validate()
    campaign_id  = create_campaign()
    adset_id     = create_adset(campaign_id)
    creative_ids = create_creatives()
    ad_ids       = create_ads(adset_id, creative_ids)
    manifest     = save_manifest(campaign_id, adset_id, creative_ids, ad_ids)

    # Resumen final
    ads_ok    = sum(1 for a in ad_ids if a.get("ad_id"))
    ads_fail  = len(ad_ids) - ads_ok

    print(f"\n{'='*60}")
    print(f"  ✅ CAMPAÑA CREADA EN BORRADOR")
    print(f"{'='*60}")
    print(f"  Campaign ID : {campaign_id}")
    print(f"  Ad Set ID   : {adset_id}")
    print(f"  Ads creados : {ads_ok}/{len(ad_ids)}")
    if ads_fail:
        print(f"  Ads fallidos: {ads_fail} — ver manifiesto para crear manualmente")
    print(f"\n  PRÓXIMO PASO:")
    print(f"  → Abre Meta Ads Manager → cuenta Golden_String")
    print(f"  → Sube el video a cada anuncio")
    print(f"  → Aprueba y activa cuando estés listo")
    print(f"\n  Manifiesto: golden_strings_campaign_manifest.json")


if __name__ == "__main__":
    main()
