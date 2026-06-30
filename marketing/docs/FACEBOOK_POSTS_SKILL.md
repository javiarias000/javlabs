# Facebook Posts Skill

Skill completa para crear, leer, actualizar y eliminar posts en Facebook Pages usando la Graph API oficial.

## Token: Dónde Obtenerlo

### ⚠️ Requisitos Previos (IMPORTANTE)

Tu app en Meta for Developers debe tener estos **permisos APROBADOS**:
- ✅ `pages_manage_posts` — **Crear/editar/eliminar posts**
- ✅ `pages_manage_engagement` — **Gestionar comentarios**
- ✅ `pages_read_engagement` — **Leer comentarios/likes**
- ✅ `pages_read_user_engagement` — **Leer interacciones de usuarios**

Si no están aprobados, ve a: **Meta for Developers → tu app → App Review → Request Permission** para `pages_manage_posts`

### Paso 1: Obtener User Access Token con Permisos

**Opción A: Desde Graph Explorer (Recomendado)**

1. Ve a: https://developers.facebook.com/tools/explorer/
2. En **Application** dropdown → selecciona tu app
3. En **Permissions** sección → agrega:
   ```
   ☑️ pages_manage_posts
   ☑️ pages_manage_engagement
   ☑️ pages_read_engagement
   ☑️ pages_read_user_engagement
   ```
4. Click **"Get User Access Token"**
5. Autoriza en el popup (acepta permisos)
6. **Copia el token** mostrado en Graph Explorer

**Opción B: Desde tu App (Programmaticamente)**

```python
import requests

# Paso 1: Construir URL de login
app_id = "TU_APP_ID"
redirect_uri = "https://localhost:3000/callback"
scope = "pages_manage_posts,pages_manage_engagement,pages_read_engagement,pages_read_user_engagement"

login_url = f"https://www.facebook.com/v19.0/dialog/oauth?client_id={app_id}&redirect_uri={redirect_uri}&scope={scope}"
print(f"Ve a: {login_url}")
# Usuario autoriza, recibe code en URL de callback

# Paso 2: Intercambiar code por token
code = "CODE_RECIBIDO"
token_url = "https://graph.facebook.com/v19.0/oauth/access_token"

resp = requests.get(token_url, params={
    "client_id": app_id,
    "client_secret": "TU_APP_SECRET",
    "redirect_uri": redirect_uri,
    "code": code
})

data = resp.json()
user_token = data['access_token']
print(f"User Token: {user_token}")
```

### Paso 2: Convertir a Long-Lived Token (Opcional pero Recomendado)

User tokens expiran en **2 horas**. Puedes obtener uno de **60 días**:

```bash
curl -i -X GET "https://graph.facebook.com/v19.0/oauth/access_token?grant_type=fb_exchange_token&client_id=YOUR_APP_ID&client_secret=YOUR_APP_SECRET&fb_exchange_token=SHORT_LIVED_TOKEN"
```

O en Python:

```python
import requests

short_token = "TU_USER_TOKEN_CORTA_DURACION"
app_id = "TU_APP_ID"
app_secret = "TU_APP_SECRET"

resp = requests.get(
    "https://graph.facebook.com/v19.0/oauth/access_token",
    params={
        "grant_type": "fb_exchange_token",
        "client_id": app_id,
        "client_secret": app_secret,
        "fb_exchange_token": short_token
    }
)

data = resp.json()
long_lived_token = data['access_token']
print(f"Long-Lived Token (60 days): {long_lived_token}")
```

### Paso 3: Obtener Page Access Token

Con el user token, obtén el **page access token** específico para Mi Idea:

```bash
curl -i -X GET "https://graph.facebook.com/v19.0/me/accounts?access_token=USER_TOKEN_AQUI"
```

Respuesta:
```json
{
  "data": [
    {
      "id": "1130355880150943",
      "name": "Mi Idea",
      "access_token": "EABL...PAGE_TOKEN_AQUI"
    }
  ]
}
```

**Copia el `access_token` del objeto con `id: 1130355880150943`**

### Paso 4: Guardar en .env

```bash
# .env
ACCESS_TOKEN=USER_TOKEN_LARGO_PLAZO
PAGE_ID=1130355880150943
PAGE_ACCESS_TOKEN=PAGE_TOKEN_AQUI
```

## API: Crear Posts

### Crear Post Simple

```bash
curl -X POST "https://graph.facebook.com/v19.0/1130355880150943/feed" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Feliz día Mamá 💕\n\nRetratos personalizados en madera 🎨\n15cm x 15cm - $10",
    "access_token": "PAGE_TOKEN_AQUI"
  }'
```

### Crear Post con Foto

**Método Correcto (Recomendado):**

El endpoint `/photos` auto-crea post + foto, devuelve `post_id`. Luego agregar mensaje:

```bash
# 1. Subir foto (crea post automáticamente)
curl -X POST "https://graph.facebook.com/v19.0/1130355880150943/photos" \
  -F "source=@/path/to/image.jpg" \
  -F "access_token=PAGE_TOKEN_AQUI"

# Respuesta: {"id": "PHOTO_ID", "post_id": "POST_ID"}
# Copiar post_id

# 2. Actualizar post con mensaje
curl -X POST "https://graph.facebook.com/v19.0/POST_ID" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Feliz día Mamá 💕\n\nRetratos personalizados: $10",
    "access_token": "PAGE_TOKEN_AQUI"
  }'
```

**Respuesta exitosa:** `{"success": true}`

**Python:**

```python
import requests

PAGE_ID = "1130355880150943"
PAGE_TOKEN = "PAGE_TOKEN"
image_file = "/path/to/image.jpg"
message = "Tu mensaje aquí"

# 1. Upload photo
with open(image_file, 'rb') as f:
    resp = requests.post(
        f"https://graph.facebook.com/v19.0/{PAGE_ID}/photos",
        files={'source': f},
        params={'access_token': PAGE_TOKEN}
    )
    data = resp.json()
    post_id = data['post_id']
    print(f"Post created: {post_id}")

# 2. Add message
resp = requests.post(
    f"https://graph.facebook.com/v19.0/{post_id}",
    data={'message': message, 'access_token': PAGE_TOKEN}
)
print("Success!" if resp.json().get('success') else "Failed")
```

**Evitar:** `photo_ids` parámetro en `/feed` - NO vincula foto al post

### Crear Post Programado

**Restricciones:**
- Mínimo: 10 minutos en futuro
- Máximo: 30 días en futuro

**Python:**

```python
from datetime import datetime, timedelta

pages = init_pages_api(token, page_id)

# Mañana a las 10 AM
target = datetime.now().replace(hour=10, minute=0, second=0) + timedelta(days=1)
unix_time = int(target.timestamp())

# Publicar imagen
result = pages.create_post_with_photo(
    message="Post programado con imagen",
    photo_path="/path/image.jpg",
    scheduled_time=unix_time
)

# O solo texto
result = pages.create_post_scheduled(
    message="Post solo texto",
    scheduled_time=unix_time
)
```

**CLI Helper Script:**

```bash
# En 2 horas
python schedule_post.py --message "Mi mensaje" --delay "2 hours"

# Fecha/hora específica
python schedule_post.py --message "Mi mensaje" --time "2024-04-22 14:30"

# Con imagen
python schedule_post.py --message "Mi mensaje" --image "/path/img.jpg" --delay "1 day"

# UNIX timestamp directo
python schedule_post.py --message "Mi mensaje" --unix 1745430000
```

**cURL:**

```bash
curl -X POST "https://graph.facebook.com/v19.0/PAGE_ID/feed" \
  -d 'message=Tu mensaje' \
  -d 'published=false' \
  -d 'scheduled_publish_time=1745430000' \
  -d 'access_token=PAGE_TOKEN'
```

**Calcular timestamp:**

```python
from datetime import datetime, timedelta

# Ahora + 2 horas
ts = int((datetime.now() + timedelta(hours=2)).timestamp())
print(ts)

# Fecha específica
dt = datetime(2024, 4, 22, 14, 30, 0)
ts = int(dt.timestamp())
```

## Skill: Función de Ayuda en Python

```python
# facebook_skill.py
import requests
import os
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

PAGE_ID = os.getenv("PAGE_ID")
PAGE_ACCESS_TOKEN = os.getenv("PAGE_ACCESS_TOKEN")
API_VERSION = "v19.0"

def create_post_with_image(message: str, image_path: str = None, 
                          link: str = None) -> dict:
    """
    Crear post en página con imagen
    
    Args:
        message: Texto del post
        image_path: Ruta local a imagen (jpg, png)
        link: URL a incluir en post
    
    Returns:
        {"success": True/False, "post_id": "...", "error": "..."}
    """
    
    try:
        # Si hay imagen, subirla primero
        if image_path:
            if not Path(image_path).exists():
                return {"success": False, "error": "Image file not found"}
            
            # 1. Upload photo (auto-creates post)
            photo_url = f"https://graph.facebook.com/{API_VERSION}/{PAGE_ID}/photos"
            with open(image_path, 'rb') as f:
                resp = requests.post(
                    photo_url,
                    files={'source': f},
                    params={'access_token': PAGE_ACCESS_TOKEN}
                )
                data = resp.json()
                
                if 'error' in data:
                    return {"success": False, "error": data['error']['message']}
                
                post_id = data.get('post_id')
                if not post_id:
                    return {"success": False, "error": "No post_id returned"}
        else:
            # Sin imagen, crear post simple
            post_url = f"https://graph.facebook.com/{API_VERSION}/{PAGE_ID}/feed"
            resp = requests.post(
                post_url,
                data={"message": message, "access_token": PAGE_ACCESS_TOKEN}
            )
            data = resp.json()
            
            if 'error' in data:
                return {"success": False, "error": data['error']['message']}
            
            post_id = data.get('id')
            if not post_id:
                return {"success": False, "error": "No post_id returned"}
        
        # 2. Add message to post (works for both image + text posts)
        update_url = f"https://graph.facebook.com/{API_VERSION}/{post_id}"
        update_data = {
            "message": message,
            "access_token": PAGE_ACCESS_TOKEN
        }
        if link:
            update_data["link"] = link
        
        resp = requests.post(update_url, data=update_data)
        result = resp.json()
        
        if result.get('success') or 'error' not in result:
            return {"success": True, "post_id": post_id}
        else:
            return {"success": False, "error": result.get("error", {}).get("message")}
    
    except Exception as e:
        return {"success": False, "error": str(e)}

def get_posts(limit: int = 10) -> dict:
    """Obtener últimos posts de la página"""
    url = f"https://graph.facebook.com/{API_VERSION}/{PAGE_ID}/feed"
    params = {
        "fields": "id,message,created_time,permalink_url",
        "limit": limit,
        "access_token": PAGE_ACCESS_TOKEN
    }
    
    try:
        resp = requests.get(url, params=params)
        return resp.json()
    except Exception as e:
        return {"error": str(e)}

def delete_post(post_id: str) -> dict:
    """Eliminar un post"""
    url = f"https://graph.facebook.com/{API_VERSION}/{post_id}"
    params = {"access_token": PAGE_ACCESS_TOKEN}
    
    try:
        resp = requests.delete(url, params=params)
        result = resp.json()
        
        if result.get("success"):
            return {"success": True}
        else:
            error = result.get("error", {}).get("message", "Unknown")
            return {"success": False, "error": error}
    except Exception as e:
        return {"success": False, "error": str(e)}

# Ejemplo uso:
if __name__ == "__main__":
    result = create_post(
        message="Feliz día Mamá 💕\nRetratos personalizados: $10",
        picture="https://example.com/image.jpg"
    )
    print(result)
```

## Comandos CLI Disponibles

```bash
# Crear post simple
python main.py page post --message "Hola mundo"

# Crear post con link
python main.py page post --message "Nueva colección" --link "https://ejemplo.com"

# Ver posts recientes
python main.py page feed --limit 10

# Ver estadísticas
python main.py page insights --preset today

# Leer comentarios en un post
python main.py page comments POST_ID
```

## Troubleshooting

| Error | Causa | Solución |
|-------|-------|----------|
| `(#200) The permission(s) pages_manage_posts are not available` | Permiso no aprobado | Ir a App Review en Meta for Developers |
| `An error occurred. Please try again later` | Token expirado | Regenerar token en Graph Explorer |
| `Invalid OAuth access token` | Token incorrecto/falso | Copiar token de Graph Explorer nuevamente |
| `(#100) Invalid page id` | PAGE_ID incorrecto | Verificar en `me/accounts` |

## Referencias

- [Pages API Oficial](https://developers.facebook.com/docs/pages-api/)
- [Graph API Feed Reference](https://developers.facebook.com/docs/graph-api/reference/page/feed)
- [Permissions Reference](https://developers.facebook.com/docs/permissions/reference)
- [Graph Explorer](https://developers.facebook.com/tools/explorer/)
