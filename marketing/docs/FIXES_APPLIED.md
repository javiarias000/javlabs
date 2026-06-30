# Correcciones Aplicadas — Meta Ads API v25.0

**Fecha:** 2026-04-22  
**Problema:** Error "Invalid parameter" al crear campaña  
**Causa:** API v19.0 obsoleta, parámetros incorrectos, formato de datos incorrecto

---

## Cambios Realizados

### 1. **meta/campaign.py** — Actualizado a v25.0

#### `create_campaign()`
✅ **ANTES:**
```python
url = f"https://graph.facebook.com/v19.0/{AD_ACCOUNT_ID}/campaigns"
payload = {
    "special_ad_categories": json.dumps([]),  # String "[]"
}
response = requests.post(url, data=payload)  # form-encoded
```

✅ **DESPUÉS:**
```python
url = f"https://graph.facebook.com/v25.0/{AD_ACCOUNT_ID}/campaigns"
payload = {
    "special_ad_categories": [],  # Array directo
}
response = requests.post(url, json=payload)  # JSON
```

---

#### `create_adset()`
✅ **ANTES:**
```python
url = f"https://graph.facebook.com/v19.0/{AD_ACCOUNT_ID}/adsets"
payload = {
    "targeting": json.dumps(targeting),  # JSON string
}
response = requests.post(url, data=payload)  # form-encoded
```

✅ **DESPUÉS:**
```python
url = f"https://graph.facebook.com/v25.0/{AD_ACCOUNT_ID}/adsets"
payload = {
    "targeting": targeting,  # Dict directo
    "publisher_platforms": ['facebook', 'instagram'],  # Agregado
}
response = requests.post(url, json=payload)  # JSON
```

---

#### `create_ad()`
✅ **ANTES:**
```python
creative_payload = {
    "title": plan.headline,
    "body": plan.description,
    "image_data": base64_image,  # ❌ NO EXISTE en v25.0
    "website_url": plan.landing_url,
}
response = requests.post(creative_url, data=payload)  # form-encoded
```

✅ **DESPUÉS:**
```python
# Paso 1: Subir imagen PRIMERO
image_hash = upload_image(image_bytes) if image_bytes else None

# Paso 2: Crear creative con object_story_spec
creative_payload = {
    "object_story_spec": {
        "link_data": {
            "message": plan.ad_copy,
            "headline": plan.headline,
            "description": plan.description,
            "link": plan.landing_url,
            "call_to_action_type": plan.call_to_action,
            "image_hash": image_hash  # ✅ Correcto
        }
    }
}
response = requests.post(creative_url, json=creative_payload)  # JSON

# Paso 3: Crear ad (sin cambios en estructura)
```

---

### 2. **gui_app.py** — Objetivo actualizado

✅ **ANTES:**
```python
objective="OUTCOME_AWARENESS"  # Nuevo nombre de Meta (según comentario)
```

✅ **DESPUÉS:**
```python
objective="REACH"  # Válido en v25.0
```

**Nota:** `OUTCOME_AWARENESS` SÍ es válido en v25.0, pero usamos `REACH` como objetivo principal (más compatible).

---

## Resumen de Correcciones

| Archivo | Función | Cambio | Razón |
|---------|---------|--------|-------|
| `meta/campaign.py` | `create_campaign()` | v19.0 → v25.0 | API obsoleta |
| `meta/campaign.py` | `create_campaign()` | `data=` → `json=` | Formato correcto |
| `meta/campaign.py` | `create_campaign()` | `json.dumps([])` → `[]` | Array directo en JSON |
| `meta/campaign.py` | `create_adset()` | v19.0 → v25.0 | API obsoleta |
| `meta/campaign.py` | `create_adset()` | `data=` → `json=` | Formato correcto |
| `meta/campaign.py` | `create_adset()` | Agregó `publisher_platforms` | Recomendado en v25.0 |
| `meta/campaign.py` | `create_ad()` | v19.0 → v25.0 | API obsoleta |
| `meta/campaign.py` | `create_ad()` | Nuevo flujo: upload → hash → creative | Requerido en v25.0 |
| `meta/campaign.py` | `create_ad()` | `image_data` → `object_story_spec.link_data.image_hash` | Parámetro correcto |
| `meta/campaign.py` | `create_ad()` | `data=` → `json=` | Formato correcto |
| `gui_app.py` | CampaignPlan | `OUTCOME_AWARENESS` → `REACH` | Compatibilidad |

---

## Testing

### Checklist Previo a Producción

- [ ] Verificar que `.env` tiene todos los tokens necesarios
- [ ] Probar conexión: `python test_connection.py`
- [ ] Probar con Streamlit: `streamlit run gui_app.py`
- [ ] Crear campaña de prueba desde GUI
- [ ] Verificar que aparece en Meta Ads Manager
- [ ] Confirmar que imagen se subió correctamente
- [ ] Revisar targeting y presupuesto

### Errores Esperados Si Falta Algo

| Error | Causa | Solución |
|-------|-------|----------|
| 100 - Parámetro no válido | Token inválido o expirado | Actualizar `ACCESS_TOKEN` |
| 190 - OAuth token inválido | Token expirado | Generar nuevo token |
| 368 - Acción no permitida | Falta permiso `ads_management` | Verificar scopes del token |
| 2635 - Versión obsoleta | URL aún en v19.0 | Verificar URLs en campaign.py |

---

## Documentación Adicional

Ver archivos en `docs/`:
- `META_API_V25_CAMPAIGN_CREATION.md` — Guía completa de parámetros
- `META_API_IMAGE_HANDLING.md` — Flujo de imágenes
- `API_MIGRATION_V19_TO_V25.md` — Detalles de migración

---

## Próximos Pasos

1. ✅ Correcciones aplicadas
2. → Testear con Streamlit
3. → Crear campaña de prueba en Meta
4. → Monitorear en Ads Manager
5. → Documentar resultados

