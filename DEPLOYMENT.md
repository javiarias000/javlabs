# ═══════════════════════════════════════════════════════════════════════════
# JAV LABS - Guía de Despliegue en Producción (EasyPanel)
# ═══════════════════════════════════════════════════════════════════════════

## 📋 Pre-requisitos

- ✅ EasyPanel instalado y accesible
- ✅ Dominio configurado (ej: `javlabs.com`)
- ✅ Base de datos PostgreSQL creada
- ✅ Cuenta en N8N con API Key
- ✅ Credenciales de Google OAuth (si usas auth)

---

## 🚀 Pasos de Despliegue

### 1. Preparar Variables de Entorno (Backend)

En EasyPanel, crea un nuevo servicio **Backend**:

**Configuración básica:**
- **Nombre**: `javlabs-backend`
- **Imagen**: `node:18-alpine` (o usa Dockerfile personalizado)
- **Comando build**: `docker build -t javlabs-backend ./backend`
- **Comando run**: `node src/index.js`
- **Puerto**: `3002`

**Variables de Entorno (Environment):**

```env
NODE_ENV=production
PORT=3002

# Database (proviene de tu PostgreSQL en EasyPanel)
DATABASE_URL="postgresql://USER:PASSWORD@DB_HOST:5432/DB_NAME"

# Generate strong secrets! (usa: openssl rand -base64 32)
JWT_SECRET="TU_SECRETO_JWT_AQUI"
JWT_REFRESH_SECRET="TU_SECRETO_REFRESH_AQUI"

# SMTP (Gmail o cualquier servidor)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu-email@gmail.com
SMTP_PASS=tu-app-password
EMAIL_FROM="JAV LABS <no-reply@javlabs.com>"
EMAIL_ADMIN=admin@javlabs.com

# N8N (ya configurado)
N8N_URL=https://n8n-n8n.ak7rlh.easypanel.host
N8N_API_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhY2UyMTg1OC02YjFhLTQzNDQtYjI4NC0yNTYwNGY4MzJhYjEiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwianRpIjoiYzZjMzhlMmUtMTFhNS00MDRmLWJhNmItZDIwYzFhOWRiMjcyIiwiaWF0IjoxNzczNDUzMTE1LCJleHAiOjE3NzU5NjY0MDB9.yiRPcqbbMVH4x__K_5fIEtY9Lj1mccMVVfySv_djijc
N8N_SUPPORT_WEBHOOK_URL=https://n8n-n8n.ak7rlh.easypanel.host/webhook/support-response

# Google OAuth (opcional)
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_CALLBACK_URL=https://tu-dominio.com/api/auth/google/callback

# Frontend URL
FRONTEND_URL=https://tu-dominio.com
```

**Volúmenes (Volumes):**
```
/var/lib/postgresql/data:/app/data  (opcional)
```

**Health Check:**
- Ruta: `/health`
- Puerto: `3002`

---

### 2. Preparar Variables de Entorno (Frontend)

Crea un nuevo servicio **Frontend**:

**Configuración básica:**
- **Nombre**: `javlabs-frontend`
- **Imagen**: `nginx:alpine`
- **Puerto**: `80` (HTTP) y `443` (HTTPS)
- **Comando**: (dejar vacío, usa default de nginx)

**Variables de Entorno:**
```env
VITE_API_URL=https://tu-dominio.com/api
```

**Volúmenes (Volumes):**
```
./frontend/dist:/usr/share/nginx/html:ro
./frontend/nginx.conf:/etc/nginx/conf.d/default.conf:ro
```

**Health Check:**
- Ruta: `/`
- Puerto: `80`

---

### 3. Configurar Red (Networking)

En EasyPanel, ambos servicios (backend y frontend) deben estar en la **misma red** para que el proxy de Nginx funcione.

**En docker-compose.yml** (si usas archivo):
```yaml
networks:
  javlabs-network:
    driver: bridge
services:
  backend:
    networks:
      - javlabs-network
  frontend:
    networks:
      - javlabs-network
```

**En EasyPanel UI**:
- Ve a Networks → Crear red `javlabs-network`
- En cada servicio, asignar esa red

---

### 4. Build y Deploy

#### Opción A: Usando Docker Compose (Recomendado)

1. Clona el repo en el servidor de EasyPanel:
```bash
cd /ruta/a/easypanel/projects
git clone https://github.com/javiarias000/javlabs.git javlabs
cd javlabs
```

2. Crea el archivo `.env` en el backend (copia de `.env.production.example`):
```bash
cp backend/.env.production.example backend/.env
# Edita backend/.env con tus valores reales
```

3. Construye las imágenes:
```bash
docker-compose build
```

4. Levanta los servicios:
```bash
docker-compose up -d
```

5. Verifica logs:
```bash
docker-compose logs -f backend
docker-compose logs -f frontend
```

#### Opción B: Usando EasyPanel UI

1. En EasyPanel, crea el servicio Backend:
   - Sube los archivos o usa Git
   - Configura variables de entorno
   - Build automático

2. Crea el servicio Frontend:
   - Igual, usa Git o sube archivos
   - Configura volúmenes

3. Inicia ambos servicios

---

### 5. Configurar Dominio

En EasyPanel → Domains:

1. Agrega tu dominio (ej: `javlabs.com`)
2. Apunta al servicio `frontend` (puerto 80)
3. Habilita HTTPS (Let's Encrypt automático en EasyPanel)

---

### 6. Verificación Post-Deploy

#### Checklist:
- [ ] Backend responde en `https://tu-dominio.com/api/health` → `{"status":"ok"}`
- [ ] Frontend carga en `https://tu-dominio.com`
- [ ] Login funciona
- [ ] Página de Rendimiento (`/dashboard/performance`) carga correctamente
- [ ] N8N workflows se muestran
- [ ] Tickets de soporte funcionan
- [ ] Webhook de N8N responde ( prueba creando un ticket )

#### Logs importantes:
```bash
# Backend logs
docker logs javlabs-backend -f

# Frontend logs
docker logs javlabs-frontend -f

# Nginx access/error logs
docker exec javlabs-frontend tail -f /var/log/nginx/access.log
```

---

## 🔧 Troubleshooting

### Problema: "The service refused the connection" (N8N)
**Causa**: N8N no puede reach al backend
**Solución**:
- Verifica que el backend esté corriendo: `curl https://tu-dominio.com/api/health`
- Verifica N8N_URL en el backend `.env`
- Verifica que el dominio esté correctamente configurado en DNS

### Problema: Pantalla azul en Rendimiento
**Causa**: Respuesta de N8N muy grande (>600KB)
**Solución**: Ya está corregido en el código (slim payload). Build y redeploy.

### Problema: 404 en /soporte/ticket
**Solución**: Ya corregido. La ruta `/soporte/ticket` redirige a lista.

### Problema: Certificado SSL no válido
**Solución**: En EasyPanel, regenera certificado Let's Encrypt:
```
easyctl cert renew javlabs.com
```

---

## 📊 Monitoreo

### Métricas a revisar:
- **Backend Health**: `GET /health`
- **N8N conexión**: Dashboard → API Stable (verde)
- **Tickets creados**: `/api/support/tickets`
- **Workflows activos**: Dashboard

### Logs en producción:
```bash
# Todos los logs
docker-compose logs -f

# Solo errores backend
docker-compose logs -f backend | grep ERROR

# Accesos nginx
docker exec javlabs-frontend cat /var/log/nginx/access.log | tail -100
```

---

## 🔄 Actualizaciones Futuras

Para actualizar a una nueva versión:

```bash
git pull origin main
docker-compose build --no-cache
docker-compose up -d
docker-compose logs -f  # verificar que todo empezó bien
```

---

## ⚠️ Consideraciones de Seguridad

1. **Cambia TODOS los secrets** en producción:
   - `JWT_SECRET`
   - `JWT_REFRESH_SECRET`
   - `N8N_API_KEY` (si es necesario)
   - Credenciales de DB

2. **Usa HTTPS** everywhere (EasyPanel lo configura automático)

3. **Firewall**: Solo abre puertos 80 y 443 al exterior. Puerto 3002 solo interno.

4. **Backups**:
   - PostgreSQL: Configura backups diarios en EasyPanel
   - Archivos subidos (si hay): volúmenes persistentes

---

## 📞 Soporte

Si encuentras problemas:
1. Revisa logs de ambos servicios
2. Verifica connectivity entre servicios: `docker exec javlabs-backend ping javlabs-frontend`
3. Verifica variables de entorno
4. Abre issue en GitHub: https://github.com/javiarias000/javlabs/issues

---

**¡Listo!** Tu aplicación debería estar corriendo en `https://tu-dominio.com`
