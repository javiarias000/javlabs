# Meta Ads API — Migración de v19.0 a v25.0

## Cambios Principales

| Aspecto | v19.0 | v25.0 |
|--------|-------|-------|
| **Base URL** | `/v19.0/` | `/v25.0/` |
| **Formato datos** | form-encoded (`data=`) | JSON (`json=`) |
| **AdCreative** | `image_data` ❌ | `object_story_spec.link_data.image_hash` ✅ |
| **Imagen** | Pasar base64 directo | Subir primero → usar hash |
| **special_ad_categories** | Flexible | Debe ser array `[]` |

---

## Cambios en Código

### URLs Base

**v19.0:**
```python
url = f"https://graph.facebook.com/v19.0/{AD_ACCOUNT_ID}/campaigns"
```

**v25.0:**
```python
url = f"https://graph.facebook.com/v25.0/{AD_ACCOUNT_ID}/campaigns"
```

---

### Formato de Requests

**v19.0 (form-encoded):**
```python
response = requests.post(url, data=payload)
```

**v25.0 (JSON):**
```python
response = requests.post(url, json=payload)
```

---

### AdCreative — Estructura Completa

**v19.0 (incorrecto):**
```python
creative_payload = {
    "title": plan.headline,
    "body": plan.description,
    "call_to_action_type": plan.call_to_action,
    "website_url": plan.landing_url,
    "image_data": base64_image,  # ❌ NO FUNCIONA
}
```

**v25.0 (correcto):**
```python
creative_payload = {
    "object_story_spec": {
        "link_data": {
            "message": plan.ad_copy,
            "headline": plan.headline,
            "description": plan.description,
            "link": plan.landing_url,
            "call_to_action_type": plan.call_to_action,
            "image_hash": image_hash  # ✅ DEBE SER HASH
        }
    }
}
```

---

### Manejo de Imágenes

**v19.0 (incorrecto):**
```python
# Pasar imagen directamente al creative
creative_payload["image_data"] = base64.b64encode(image_bytes).decode()
```

**v25.0 (correcto):**
```python
# 1. Subir imagen PRIMERO
image_hash = upload_image(image_bytes)

# 2. Usar image_hash en creative
creative_payload["object_story_spec"]["link_data"]["image_hash"] = image_hash
```

---

### special_ad_categories

**v19.0:**
```python
"special_ad_categories": json.dumps([])  # String "[]"
```

**v25.0:**
```python
"special_ad_categories": []  # Array directo (JSON maneja)
```

Cuando usas `json=payload`, no necesitas hacer `json.dumps()` — requests lo hace automáticamente.

---

## Checklist de Migración

- [ ] Cambiar `/v19.0/` a `/v25.0/` en todas las URLs
- [ ] Cambiar `requests.post(url, data=...)` a `requests.post(url, json=...)`
- [ ] Verificar que payloads no usan `json.dumps()` innecesarios (requests maneja JSON)
- [ ] En `create_campaign()`: `special_ad_categories` como array `[]`, no string
- [ ] En `create_adset()`: `targeting` como dict normal, requests lo convierte a JSON
- [ ] En `create_ad()`: 
  - [ ] Llamar `upload_image()` primero si hay imagen
  - [ ] Usar `object_story_spec.link_data` con `image_hash`
  - [ ] Remover `image_data` (no existe en v25.0)
- [ ] Probar flujo completo: Campaign → AdSet → Ad con imagen

---

## Validación Post-Migración

**Errores esperados si migración es incompleta:**
```
100 - Parámetro no válido
  → Falta cambiar de json.dumps() o formato incorrecto

2635 - Versión obsoleta de API
  → Falta cambiar de /v19.0/ a /v25.0/

368 - Acción no permitida
  → Parámetro inválido (ej: image_data)

190 - OAuth token inválido
  → Token expirado o sin permisos requeridos
```

