# Configurar Permisos de App en Meta for Developers

## Problema Actual

Error: `pages_read_engagement` y `pages_manage_posts` no están disponibles.

## Solución: Habilitar Permisos en App Review

### Paso 1: Acceder a Meta for Developers

1. Ve a https://developers.facebook.com/
2. Selecciona tu app ("Meta Ads Automation" u otro nombre)
3. En sidebar izquierdo → **Settings** → **Basic**

### Paso 2: Habilitar Permisos

En la página de Settings:

1. Busca la sección **"Permissions and Features"** o **"Requested Permissions"**
2. Agrega estos permisos:
   - ✅ `pages_read_engagement`
   - ✅ `pages_manage_posts`
   - ✅ `pages_read_user_content`

### Paso 3: Pasar App Review (si es necesario)

Si los permisos requieren App Review:

1. Ve a **App Roles** → **Test Users** 
2. Asegúrate de que tu usuario sea **Admin** o **Developer**
3. Para producción: **App Review** → Submit estos permisos
   - Propósito: "Automatizar publicaciones en mi página de negocios (Mi Idea)"

### Paso 4: Regenerar Tokens

Una vez habilitados los permisos:

1. Ve a **Graph API Explorer** (en Developer Tools)
2. Selecciona tu app
3. Click en "Get User Access Token"
4. En Permissions, asegúrate de incluir:
   - ☑️ `pages_read_engagement`
   - ☑️ `pages_manage_posts`
5. Autoriza
6. Copia el nuevo token
7. Actualiza en `.env`:
   ```
   ACCESS_TOKEN=TU_NUEVO_TOKEN
   ```
8. Ejecuta:
   ```bash
   python get_page_token.py
   ```
9. Copia el PAGE_ACCESS_TOKEN resultado en `.env`

### Paso 5: Verificar Permisos

Prueba que el token tiene los permisos:

```bash
python3 << 'EOF'
import requests
import os
from dotenv import load_dotenv

load_dotenv()
token = os.getenv("ACCESS_TOKEN")

resp = requests.get(
    "https://graph.facebook.com/v19.0/me/permissions",
    params={"access_token": token}
)

data = resp.json()
perms = [p['permission'] for p in data.get('data', []) if p.get('status') == 'granted']
print("✅ Permisos activos:")
for perm in sorted(perms):
    print(f"  - {perm}")
EOF
```

## Alternativa: Usar Facebook Share Dialog

Si los permisos no se aprueban, puedes usar la alternativa legítima:

```html
<div id="fb-root"></div>
<script>
  FB.ui({
    method: 'share',
    href: 'https://tusite.com',
  }, function(){});
</script>
```

Esto usa el Facebook Share Dialog (no requiere App Review).

## Casos Comunes

### "Permission deprecated"
- `publish_actions` está deprecado
- Usa `pages_manage_posts` en su lugar

### "Session has expired"
- Token tiene límite de 2 horas
- Usa: https://developers.facebook.com/tools/accesstoken/ para obtener Long-Lived Token (60 días)

### "Not available for App Review"
- Algunos permisos solo están disponibles después de haber pasado App Review
- Verifica que tu app esté en modo Producción, no Desarrollo

## Documentación Oficial

- [Pages API Permissions](https://developers.facebook.com/docs/pages-api/permissions)
- [App Review Requirements](https://developers.facebook.com/docs/app-review)
- [Access Token Tool](https://developers.facebook.com/tools/accesstoken/)
- [Graph Explorer](https://developers.facebook.com/tools/explorer/)
