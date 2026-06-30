# Meta Ads API v25.0 — Creación Correcta de Campañas

## Flujo Completo (Campaign → AdSet → Ad)

### 1. Crear Campaign
```
POST /v25.0/act_{AD_ACCOUNT_ID}/campaigns
```

**Payload (JSON):**
```json
{
  "name": "MI IDEA - Headline",
  "objective": "OUTCOME_AWARENESS",
  "status": "PAUSED",
  "special_ad_categories": [],
  "access_token": "TOKEN"
}
```

**Objetivos válidos en v25.0:**
- `REACH` (alcance)
- `OUTCOME_AWARENESS` (conciencia de marca)
- `OUTCOME_TRAFFIC` (tráfico web)
- `CONVERSIONS` (conversiones)
- `LEAD_GENERATION` (generación de leads)
- Otros: APP_INSTALLS, VIDEO_VIEWS, MESSAGES, etc.

**Respuesta:**
```json
{
  "id": "123456789",
  "success": true
}
```

---

### 2. Crear Ad Set
```
POST /v25.0/act_{AD_ACCOUNT_ID}/adsets
```

**Payload (JSON):**
```json
{
  "name": "MI IDEA - Adset 1",
  "campaign_id": "123456789",
  "daily_budget": 1000,
  "billing_event": "IMPRESSIONS",
  "optimization_goal": "REACH",
  "status": "PAUSED",
  "targeting": {
    "age_min": 18,
    "age_max": 55,
    "geo_locations": {
      "countries": ["EC", "CO", "PE"]
    },
    "languages": ["es_LA", "es"],
    "publisher_platforms": ["facebook", "instagram"]
  },
  "access_token": "TOKEN"
}
```

**Targeting - Campos Válidos:**
- `age_min`, `age_max` — Rango de edad (13-65)
- `geo_locations.countries` — Array de códigos ISO (["US", "EC", "CO"])
- `languages` — Array de idiomas (["es", "es_LA", "en"])
- `publisher_platforms` — ["facebook", "instagram", "audience_network", "messenger"]
- `flexible_spec` — (Opcional) Intereses/comportamientos avanzados

**Billing Events válidos:**
- `IMPRESSIONS` (por cada 1000 impresiones)
- `CLICKS` (por cada clic)
- `ACTIONS` (por cada acción/conversión)

---

### 3. Crear Ad (con imagen)

**PASO 3A: Subir Imagen PRIMERO**
```
POST /v25.0/act_{AD_ACCOUNT_ID}/adimages
```

**Payload (form-data):**
```
bytes: base64_encoded_image_data
```

**Respuesta:**
```json
{
  "image_hash": "a1b2c3d4e5f6g7h8i9j0k1l2m3",
  "height": 1080,
  "width": 1200
}
```

**Guardar el `image_hash` — se usa en el creative**

---

**PASO 3B: Crear Ad Creative**
```
POST /v25.0/act_{AD_ACCOUNT_ID}/adcreatives
```

**Payload (JSON):**
```json
{
  "object_story_spec": {
    "link_data": {
      "message": "Descripción del anuncio aquí",
      "headline": "Tu titular (máx 40 chars)",
      "description": "Descripción adicional",
      "link": "https://miidea.site",
      "call_to_action_type": "LEARN_MORE",
      "image_hash": "a1b2c3d4e5f6g7h8i9j0k1l2m3"
    }
  },
  "access_token": "TOKEN"
}
```

**Call-to-Action válidos:**
- `LEARN_MORE` — Aprender Más
- `SHOP_NOW` — Comprar Ahora
- `SIGN_UP` — Registrarse
- `CONTACT_US` — Contactar
- `WATCH_MORE` — Ver Más
- `SUBSCRIBE` — Suscribirse
- `DOWNLOAD` — Descargar

**Respuesta:**
```json
{
  "id": "987654321",
  "success": true
}
```

---

**PASO 3C: Crear Ad**
```
POST /v25.0/act_{AD_ACCOUNT_ID}/ads
```

**Payload (JSON):**
```json
{
  "adset_id": "987654321",
  "creative": {
    "creative_id": "987654321"
  },
  "status": "PAUSED",
  "access_token": "TOKEN"
}
```

**Respuesta:**
```json
{
  "id": "111222333",
  "success": true
}
```

---

## Cambios Críticos en el Código

### ❌ ANTES (v19.0, incorrecto)
```python
# POST a v19.0
url = f"https://graph.facebook.com/v19.0/{AD_ACCOUNT_ID}/campaigns"

# Usa form-data
response = requests.post(url, data=payload)

# AdCreative con image_data (INVÁLIDO)
creative_payload = {
    "title": plan.headline,
    "body": plan.description,
    "image_data": base64_image,  # ❌ NO EXISTE
}
```

### ✅ DESPUÉS (v25.0, correcto)
```python
# POST a v25.0
url = f"https://graph.facebook.com/v25.0/{AD_ACCOUNT_ID}/campaigns"

# Usa JSON
response = requests.post(url, json=payload)

# Subir imagen PRIMERO → obtener image_hash
image_hash = upload_image(image_bytes)

# AdCreative con image_hash (CORRECTO)
creative_payload = {
    "object_story_spec": {
        "link_data": {
            "message": plan.ad_copy,
            "headline": plan.headline,
            "description": plan.description,
            "link": plan.landing_url,
            "call_to_action_type": plan.call_to_action,
            "image_hash": image_hash
        }
    }
}
```

---

## Error "Invalid parameter" — Causa Probable

1. **Objetivo no válido** — `OUTCOME_AWARENESS` debe estar en la lista (✅ está en v25.0)
2. **API versión antigua** — v19.0 no reconoce ciertos parámetros → cambiar a v25.0
3. **Form-encoded en lugar de JSON** — `data=` en lugar de `json=` causa errores
4. **image_data en AdCreative** — No existe en v25.0, usar `image_hash` siempre
5. **special_ad_categories incorrecta** — Debe ser array `[]`, no string `"[]"`

