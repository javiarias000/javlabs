# Campaign Wizard — Meta Ads desde Cero

Documentación del proceso completo para crear campañas Meta Ads vía API.
Basado en la ejecución real de la campaña Golden Strings (junio 2026).

---

## Prerequisitos (hacer UNA vez por cuenta)

### 1. App Meta en modo LIVE

Las ad creatives solo se pueden crear si la app Meta está en modo público.

**Pasos:**
1. Ir a [developers.facebook.com](https://developers.facebook.com)
2. Seleccionar la app que usas para el acceso token
3. En el panel superior: cambiar **Modo desarrollo → Modo activo (Live)**
4. Confirmar los permisos requeridos: `ads_management`, `ads_read`, `pages_manage_ads`

> **Por qué falla sin esto:** La API bloquea la creación de creatives con error code 100, subcode 1885183 cuando la app está en Development mode.

### 2. Access Token con permisos correctos

El token necesita estos scopes:
- `ads_management` — crear/editar campañas
- `ads_read` — leer insights
- `pages_manage_ads` — crear creatives vinculados a la página
- `pages_read_engagement` — leer info de la página

**Cómo verificar:**
```bash
curl "https://graph.facebook.com/v19.0/debug_token?input_token=TU_TOKEN&access_token=TU_TOKEN"
```

### 3. Variables de entorno en `.env` (directorio padre del proyecto)

```env
META_ACCESS_TOKEN=tu_token_largo_aqui
META_AD_ACCOUNT_ID=act_XXXXXXXXXXXXXXX
```

---

## Proceso de Creación — 6 Pasos

### Paso 1: Descubrir IDs de audiencia

Antes de crear la campaña, busca los IDs correctos via API.

**Geo keys (ciudades):**
```python
import requests
r = requests.get('https://graph.facebook.com/v19.0/search', params={
    'access_token': TOKEN,
    'type': 'adgeolocation',
    'q': 'Quito',
    'location_types': ['city'],
    'country_code': 'EC',
})
# Resultado: key 644431 = Quito, Pichincha Province
```

**Interest IDs:**
```python
r = requests.get('https://graph.facebook.com/v19.0/search', params={
    'access_token': TOKEN,
    'type': 'adinterest',
    'q': 'bodas',
    'locale': 'es_LA',
    'limit': 5,
})
```

**IDs confirmados para eventos en Ecuador:**

| Interés | ID | Audiencia aprox |
|---|---|---|
| Bodas (concepto social) | 6003409392877 | 305M |
| Organización de bodas | 6003069898229 | 5M |
| Gestión de eventos | 6003092932417 | 31M |
| Acto de graduación | 6003243959401 | 45M |
| Eventos y ocasiones especiales | 6899296281873 | 850K |
| Quito (city key) | 644431 | — |

> **Nota API:** Las exclusiones de intereses (`exclusions.interests`) fueron deprecadas en Meta API v25.0. No incluirlas.

---

### Paso 2: Crear Campaña

```python
payload = {
    "name":                         "Nombre de la Campaña",
    "objective":                    "OUTCOME_ENGAGEMENT",  # o OUTCOME_SALES, OUTCOME_LEADS
    "status":                       "PAUSED",              # siempre PAUSED para borradores
    "special_ad_categories":        [],
    "is_adset_budget_sharing_enabled": False,
}
r = requests.post(f'{BASE_URL}/{AD_ACCOUNT_ID}/campaigns',
    json=payload, params={'access_token': TOKEN})
campaign_id = r.json()['id']
```

**Objetivos disponibles (API v25.0):**

| Objetivo negocio | Parámetro API |
|---|---|
| Alcance / Awareness | `OUTCOME_AWARENESS` |
| Mensajes WhatsApp | `OUTCOME_ENGAGEMENT` |
| Tráfico web | `OUTCOME_TRAFFIC` |
| Leads / Formularios | `OUTCOME_LEADS` |
| Ventas / Conversiones | `OUTCOME_SALES` |

---

### Paso 3: Crear Ad Set

```python
payload = {
    "name":              "Nombre del Ad Set",
    "campaign_id":       campaign_id,
    "daily_budget":      300,           # en centavos — 300 = $3.00
    "billing_event":     "IMPRESSIONS",
    "optimization_goal": "CONVERSATIONS",  # para campañas de mensajes
    "bid_amount":        200,           # REQUERIDO para CONVERSATIONS — $2.00 límite
    "status":            "PAUSED",
    "targeting": {
        "age_min": 28,
        "age_max": 50,
        "geo_locations": {
            "cities": [{"key": "644431", "radius": 20, "distance_unit": "kilometer"}]
        },
        "publisher_platforms": ["facebook", "instagram"],
        "flexible_spec": [{
            "interests": [
                {"id": "6003409392877", "name": "Bodas (concepto social)"},
                # ... más intereses
            ]
        }],
        "targeting_automation": {"advantage_audience": 0},
    },
}
r = requests.post(f'{BASE_URL}/{AD_ACCOUNT_ID}/adsets',
    json=payload, params={'access_token': TOKEN})
adset_id = r.json()['id']
```

**Combinaciones de optimization_goal / billing_event:**

| Objetivo | optimization_goal | billing_event | bid_amount requerido |
|---|---|---|---|
| Mensajes | CONVERSATIONS | IMPRESSIONS | Sí |
| Alcance | REACH | IMPRESSIONS | No |
| Tráfico | LINK_CLICKS | IMPRESSIONS | No |
| Video views | VIDEO_VIEWS | IMPRESSIONS | No |

---

### Paso 4: Crear Ad Creative (copy)

> ⚠️ **Requiere app en modo LIVE** — falla con error 1885183 en modo desarrollo.

```python
payload = {
    "name": "Nombre del Creativo",
    "object_story_spec": {
        "page_id": PAGE_ID,
        "link_data": {
            "message":     "Texto principal del anuncio",
            "name":        "Titular (headline)",
            "description": "Descripción corta",
            "link":        "https://www.facebook.com/TU_PAGINA",
            "call_to_action": {
                "type": "WHATSAPP_MESSAGE",
                "value": {"app_destination": "WHATSAPP"},
            },
        },
    },
}
r = requests.post(f'{BASE_URL}/{AD_ACCOUNT_ID}/adcreatives',
    json=payload, params={'access_token': TOKEN})
creative_id = r.json()['id']
```

**CTAs disponibles:**

| Acción | Parámetro |
|---|---|
| WhatsApp | `WHATSAPP_MESSAGE` |
| Aprender más | `LEARN_MORE` |
| Comprar | `SHOP_NOW` |
| Registrarse | `SIGN_UP` |
| Contactar | `CONTACT_US` |

**Para agregar video al creativo** (el usuario lo sube):
```python
# Primero subir el video
video_payload = {"file_url": "https://url-del-video.mp4"}
r = requests.post(f'{BASE_URL}/{AD_ACCOUNT_ID}/advideos',
    json=video_payload, params={'access_token': TOKEN})
video_id = r.json()['id']

# Luego usar video_data en vez de link_data
"object_story_spec": {
    "page_id": PAGE_ID,
    "video_data": {
        "video_id":   video_id,
        "message":    "Texto del anuncio",
        "title":      "Titular",
        "call_to_action": {"type": "WHATSAPP_MESSAGE", ...}
    }
}
```

---

### Paso 5: Crear Ad (vincula creative → adset)

```python
payload = {
    "name":       "Nombre del Ad",
    "adset_id":   adset_id,
    "creative":   {"creative_id": creative_id},
    "status":     "PAUSED",
}
r = requests.post(f'{BASE_URL}/{AD_ACCOUNT_ID}/ads',
    json=payload, params={'access_token': TOKEN})
ad_id = r.json()['id']
```

---

### Paso 6: Guardar manifiesto y revisar

El script guarda `golden_strings_campaign_manifest.json` con:
- Todos los IDs creados (campaign, adset, creatives, ads)
- El copy completo de cada variación
- La nota de qué video subir a cada ad
- Los próximos pasos

**Para revisar en Meta Ads Manager:**
```
https://adsmanager.facebook.com/adsmanager/manage/campaigns?act=ACT_ID
```

---

## Errores Conocidos y Soluciones

| Error code | Subcode | Mensaje | Solución |
|---|---|---|---|
| 100 | 1885183 | App en modo desarrollo | Cambiar app a Live en developers.facebook.com |
| 100 | 2490487 | bid_amount requerido | Agregar `"bid_amount": 200` al payload del adset |
| 100 | 3858492 | Exclusiones deprecadas | Eliminar `exclusions.interests` del targeting |
| 100 | — | Invalid parameter (genérico) | Revisar respuesta completa con `r.json()` antes del raise_for_status |

---

## Estado de la Campaña Golden Strings (2026-06-26)

| Elemento | ID | Estado |
|---|---|---|
| Campaña | 120250474635510725 | ✅ PAUSED (creada) |
| Ad Set | 120250474643550725 | ✅ PAUSED (creada) |
| Creative A1 | — | ⏳ Pendiente (app en dev mode) |
| Creative A2 | — | ⏳ Pendiente (app en dev mode) |
| Creative A3 | — | ⏳ Pendiente (app en dev mode) |

**Para completar:**
1. Cambiar app Meta a modo Live
2. Ejecutar `python3 create_golden_strings_campaign.py`
3. Subir videos desde Meta Ads Manager
4. Aprobar y activar

---

## Roadmap del Wizard (implementación futura)

El wizard se puede implementar como una nueva página en `gui_app.py` (Streamlit) con estos pasos guiados:

```
Wizard Step 1 — Validar cuenta y permisos
Wizard Step 2 — Elegir objetivo de campaña
Wizard Step 3 — Configurar targeting (ciudad, edad, intereses con búsqueda live)
Wizard Step 4 — Escribir o generar copy con IA (3 variaciones)
Wizard Step 5 — Subir video/imagen del creativo
Wizard Step 6 — Revisar preview del anuncio
Wizard Step 7 — Confirmar presupuesto y fechas
Wizard Step 8 — Crear como borrador → aprobar → activar
```

Cada paso mapea a una función en `create_golden_strings_campaign.py`:
- `validate()` → Step 1
- `create_campaign()` → Step 2
- `create_adset()` → Steps 3 + 7
- `create_creatives()` → Steps 4 + 5 + 6
- `create_ads()` → Step 8
- `save_manifest()` → siempre, después de cada paso
