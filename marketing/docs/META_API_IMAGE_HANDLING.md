# Meta Ads API v25.0 — Manejo Correcto de Imágenes

## Flujo de Imágenes: Subir → Hash → Creative

```
Image Bytes (JPG/PNG)
    ↓
[1. Upload to /adimages]
    ↓
Get image_hash (String)
    ↓
[2. Use in Creative via object_story_spec.link_data.image_hash]
    ↓
Create Ad with Creative
```

---

## Paso 1: Subir Imagen

**Endpoint:**
```
POST /v25.0/act_{AD_ACCOUNT_ID}/adimages
Content-Type: application/x-www-form-urlencoded
```

**Parámetros:**
```python
payload = {
    "bytes": base64.b64encode(image_bytes).decode('utf-8'),
    "access_token": ACCESS_TOKEN
}

response = requests.post(
    f"https://graph.facebook.com/v25.0/{AD_ACCOUNT_ID}/adimages",
    data=payload  # ⚠️ form-encoded OK aquí, no JSON
)
```

**Respuesta Exitosa:**
```json
{
  "image_hash": "a1b2c3d4e5f6g7h8i9j0k1l2m3",
  "height": 1200,
  "width": 1200
}
```

**Validaciones:**
- Formato: JPG, PNG (GIF también soportado)
- Tamaño máximo: 30 MB
- Dimensiones recomendadas: 1200x628 (16:9), 1200x1200 (1:1)

---

## Paso 2: Usar image_hash en Creative

**INCORRECTO ❌**
```python
# NO HAGAS ESTO
creative_payload = {
    "title": "Headline",
    "body": "Description",
    "image_data": "base64_encoded_image",  # NO EXISTE
    "website_url": "https://...",
}
```

**CORRECTO ✅**
```python
# SIEMPRE HACE ESTO
creative_payload = {
    "object_story_spec": {
        "link_data": {
            "message": "Mensaje del anuncio",
            "headline": "Tu titular",
            "description": "Descripción",
            "link": "https://miidea.site",
            "image_hash": image_hash,  # ← Del Paso 1
            "call_to_action_type": "LEARN_MORE"
        }
    }
}

response = requests.post(
    f"https://graph.facebook.com/v25.0/{AD_ACCOUNT_ID}/adcreatives",
    json=creative_payload  # ← JSON
)
```

---

## Estructura `object_story_spec` — Tipos de Creative

### Link Creative (Recomendado para ads web)
```json
{
  "object_story_spec": {
    "link_data": {
      "message": "Texto principal",
      "headline": "Titular",
      "description": "Descripción",
      "link": "https://ejemplo.com",
      "image_hash": "abc123",
      "call_to_action_type": "LEARN_MORE"
    }
  }
}
```

### Photo Creative
```json
{
  "object_story_spec": {
    "photo_data": {
      "image_hash": "abc123",
      "message": "Texto del anuncio"
    }
  }
}
```

### Video Creative (no aplica aquí)
```json
{
  "object_story_spec": {
    "video_data": {
      "video_id": "123456789"
    }
  }
}
```

---

## Función Corregida: `upload_image()`

```python
def upload_image(image_bytes: bytes) -> str:
    """
    Sube imagen a Meta Ads y retorna image_hash.
    
    Args:
        image_bytes: Bytes de imagen (JPG/PNG)
    
    Returns:
        image_hash (string): Hash para usar en creatives
    
    Raises:
        ValueError: Si upload falla o no hay hash en respuesta
    """
    account = get_ad_account()
    
    image_b64 = base64.b64encode(image_bytes).decode('utf-8')
    
    try:
        # Upload a /adimages
        response = account.create_ad_image(params={'bytes': image_b64})
        
        image_hash = response.get('image_hash')
        if not image_hash:
            raise ValueError(f"No image_hash en respuesta: {response}")
        
        print(f"✓ Imagen subida: {image_hash}")
        return image_hash
        
    except Exception as e:
        raise ValueError(f"Error subiendo imagen: {str(e)}")
```

---

## Función Corregida: `create_ad()`

```python
def create_ad(adset_id: str, plan: CampaignPlan, 
              image_bytes: bytes = None, 
              status: str = Ad.Status.paused) -> str:
    """
    Crea ad con imagen en v25.0 (object_story_spec.link_data).
    
    Flujo:
    1. Si hay image_bytes → subir y obtener image_hash
    2. Crear creative con image_hash en object_story_spec.link_data
    3. Crear ad referenciando el creative
    """
    
    # PASO 1: Subir imagen si existe
    image_hash = None
    if image_bytes:
        image_hash = upload_image(image_bytes)
    
    # PASO 2: Crear creativo con structure object_story_spec
    creative_url = f"https://graph.facebook.com/v25.0/{AD_ACCOUNT_ID}/adcreatives"
    
    creative_payload = {
        "object_story_spec": {
            "link_data": {
                "message": plan.ad_copy,
                "headline": plan.headline,
                "description": plan.description,
                "link": plan.landing_url,
                "call_to_action_type": plan.call_to_action,
                # Solo agregar image_hash si existe
                **({"image_hash": image_hash} if image_hash else {})
            }
        }
    }
    
    try:
        response = requests.post(creative_url, json=creative_payload)
        response.raise_for_status()
        creative_data = response.json()
        
        if "error" in creative_data:
            error_msg = creative_data.get('error', {}).get('message', 'Unknown')
            raise ValueError(f"Error creativo: {error_msg}")
        
        creative_id = creative_data.get('id')
        print(f"✓ Creative creado: {creative_id}")
        
        # PASO 3: Crear ad
        ad_url = f"https://graph.facebook.com/v25.0/{AD_ACCOUNT_ID}/ads"
        
        ad_payload = {
            "adset_id": adset_id,
            "creative": {"creative_id": creative_id},
            "status": status
        }
        
        response = requests.post(ad_url, json=ad_payload)
        response.raise_for_status()
        ad_data = response.json()
        
        if "error" in ad_data:
            error_msg = ad_data.get('error', {}).get('message', 'Unknown')
            raise ValueError(f"Error ad: {error_msg}")
        
        ad_id = ad_data.get('id')
        print(f"✓ Ad creado: {ad_id}")
        return ad_id
        
    except requests.exceptions.RequestException as e:
        try:
            error_data = e.response.json()
            error_msg = error_data.get('error', {}).get('message', str(e))
        except:
            error_msg = str(e)
        raise ValueError(f"Error creando ad: {error_msg}")
```

