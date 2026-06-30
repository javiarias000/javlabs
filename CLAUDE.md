# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## Ramas de trabajo

| Rama | Propósito |
|---|---|
| `main` | Producción — todo push aquí dispara el deploy en EasyPanel |
| `marketing/meta-ads` | Desarrollo del módulo de Marketing Meta Ads (Streamlit wizard + dashboard) |

**Regla:** Si estás desarrollando algo relacionado con marketing, campañas Meta, o el wizard de campañas (`marketing/`), trabaja en la rama `marketing/meta-ads`. Cuando el trabajo esté listo para producción, haz merge a `main`:

```bash
# Estando en marketing/meta-ads:
git add <archivos>
git commit -m "feat(marketing): descripción"

# Para subir a producción:
git checkout main
git merge marketing/meta-ads
git push origin main

# O directamente desde marketing/meta-ads:
git push origin marketing/meta-ads:main
```

---

## Deployment: VPS via EasyPanel + GitHub

**Todo cambio de código debe terminar en un commit y push a `main` para desplegarse.**

EasyPanel usa el `Dockerfile` de la raíz para construir y desplegar automáticamente al detectar un push en `main` de `https://github.com/javiarias000/javlabs.git`.

```bash
git add <archivos>
git commit -m "tipo(scope): descripción"
git push origin main
```

El remote ya tiene el PAT configurado en la URL — el push funciona sin intervención extra.

---

## Arquitectura de despliegue

El `Dockerfile` en la raíz usa **multi-stage build**:

1. **Stage 1** (`frontend-build`): compila el frontend con `vite build` → genera `/app/frontend/dist`
2. **Stage 2**: instala dependencias del backend, genera el cliente Prisma, copia el build del frontend a `/app/dist`

El backend Express sirve el frontend compilado como archivos estáticos en la misma instancia:
- `app.use(express.static(path.join(__dirname, '../../dist')))` — sirve el SPA
- `app.get('*', ...)` — SPA fallback para rutas de React Router
- Todas las rutas API bajo `/api/*`

**No usar `docker-compose.yml` en producción** — ese archivo es para desarrollo local separado (frontend en :80, backend en :3002). En producción todo corre en un solo contenedor en el puerto 3000.

### Servicio de Marketing (Streamlit — servicio separado)

El wizard de campañas Meta Ads (`marketing/`) es una app Python/Streamlit que corre como **servicio independiente** en EasyPanel:

- **Dockerfile:** `Dockerfile.marketing` en la raíz del repo
- **Puerto:** 8501
- **Deploy:** EasyPanel → nuevo servicio → Dockerfile path: `Dockerfile.marketing`
- **Variables de entorno requeridas en EasyPanel (servicio marketing):**

| Variable | Descripción |
|---|---|
| `META_APP_ID` | ID de la app de Facebook |
| `META_APP_SECRET` | Secret de la app de Facebook |
| `META_ACCESS_TOKEN` | Token de usuario de larga duración |
| `META_AD_ACCOUNT_ID` | ID de la cuenta publicitaria (sin prefijo act_) |
| `META_PAGE_ID` | ID de la página de Facebook |
| `META_PAGE_ACCESS_TOKEN` | Token de la página (fallback a ACCESS_TOKEN) |
| `OPENIA_API_KEY` | Clave OpenAI (typo intencional — sin N) |
| `ANTHROPIC_API_KEY` | Clave Anthropic (Claude) — preferida sobre OpenAI |

- **Variable en el servicio principal (Node.js):**
  `VITE_MARKETING_URL` = URL del servicio Streamlit (ej. `https://marketing.javlabsautomatic.com`)
  → El frontend React usa esta variable para incrustar el wizard en `/marketing`.

---

## Comandos de desarrollo local

```bash
# Frontend (puerto 5173)
cd frontend && npm run dev
cd frontend && npm run build       # Verificar que el build no falle antes de hacer push
cd frontend && npm run lint
cd frontend && npm run test        # vitest (watch mode)
cd frontend && npm run test:run    # vitest (una sola vez)

# Backend (puerto 3000)
cd backend && npm run dev          # nodemon
cd backend && npm run db:migrate   # npx prisma migrate dev
cd backend && npm run db:generate  # npx prisma generate (tras cambios en schema)
cd backend && npm run db:seed
cd backend && npm test             # jest
```

**Antes de hacer push siempre ejecutar:**
```bash
cd frontend && npm run build
```
Un error de build aquí rompe el despliegue en EasyPanel.

```bash
# Marketing / Streamlit (puerto 8501) — rama: marketing/meta-ads
cd marketing && pip install -r requirements.txt   # primera vez
cd marketing && streamlit run wizard_app.py       # wizard principal
cd marketing && streamlit run gui_app.py          # legacy GUI
```

---

## Estructura de código

### Frontend (`frontend/src/`)

- `App.jsx` — router raíz. Todas las páginas son lazy-loaded con `React.lazy`. Las rutas privadas se envuelven en el componente `<P>` que usa `PrivateRoute`.
- `stitch/` — páginas completas, una carpeta por vista. Agregar nuevas páginas aquí y registrarlas en `App.jsx`.
- `components/` — componentes reutilizables. `PublicLayout.jsx` incluye `PublicNavbar` y `Footer`; no agregar footer propio en páginas dentro de `PublicLayout`.
- `context/AuthContext.jsx` — estado global de autenticación. Expone `user`, `login`, `register`, `logout`, `loading`, `accessToken`, `loginWithTokens`.
- `services/api.js` — instancia axios configurada. Interceptor de request adjunta `Authorization: Bearer <token>`. Interceptor de response renueva automáticamente con `/api/auth/refresh` ante 401 y redirige a `/login` si falla.
- `styles/design-tokens.css` — variables CSS globales (colores, tipografía). Se importa en `App.jsx`.

**Tokens de sesión:** `localStorage` con claves `accessToken` y `refreshToken`. Usar siempre estas claves exactas — cualquier otra provoca bugs silenciosos.

### Backend (`backend/src/`)

CommonJS (`require`/`module.exports`). Entry point: `src/index.js` → `src/app.js`.

- `routes/` — define endpoints, delega a controladores
- `controllers/` — lógica de negocio (auth, contact, dashboard, project)
- `middlewares/auth.middleware.js` — verifica JWT; `middlewares/validate.middleware.js` — express-validator
- `config/passport.js` — OAuth Google (passport-google-oauth20)
- `utils/logger.js` — winston

**CORS:** lista de orígenes permitidos está hardcodeada en `app.js`. Para agregar un nuevo origen (ej. dominio de producción), editarlo ahí y actualizar también la variable de entorno `FRONTEND_URL`.

### Base de datos (Prisma + PostgreSQL)

Modelos principales: `User` (roles: `ADMIN | AGENT | CLIENT`), `Project`, `Automation`, `ContactForm`, `SupportTicket`, `TicketMessage`, `N8nProject`, `RefreshToken`.

Tras cualquier cambio en `backend/prisma/schema.prisma` ejecutar `npm run db:generate` (y `db:migrate` si hay cambio de esquema).

---

## Sistema de diseño

Tailwind con variables CSS en `design-tokens.css`. Las clases de color usan el nombre **sin** el prefijo `color-`:

| Correcto | Incorrecto |
|---|---|
| `text-primary` | `text-color-primary` |
| `bg-accent` | `bg-color-accent` |

**Iconos Material Symbols:** requieren el override `!important` en `index.css` para que `font-family` no sea sobrescrita por Tailwind. Si los iconos aparecen como texto, verificar ese bloque.

**Tipografías:** Michroma (títulos/display), Montserrat (body), Fira Code (mono).

---

## Problemas conocidos / invariantes

- **Footer duplicado:** páginas bajo `<PublicLayout>` no deben incluir su propio footer — ya lo renderiza el layout.
- **`catch (err) =>` es sintaxis inválida** en JS — el bloque catch no acepta arrow function. Usar `catch (err) {`.
- **Atributos JSX duplicados** (`badge="A" badge="B"`) causan error de build en esbuild — solo puede haber uno por prop.
- `app.set('trust proxy', 1)` es necesario para que `express-rate-limit` funcione correctamente detrás del proxy de EasyPanel.
- El `docker-compose.yml` incluye un healthcheck apuntando a puerto 3000 pero el backend en ese archivo corre en 3002 — inconsistencia conocida, no afecta producción.

---

## Variables de entorno (producción — configuradas en EasyPanel)

| Variable | Uso |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_SECRET` / `JWT_REFRESH_SECRET` | Firma de tokens |
| `FRONTEND_URL` | Origen permitido en CORS |
| `N8N_URL` / `N8N_API_KEY` / `N8N_SUPPORT_WEBHOOK_URL` | Integración n8n |
| `SMTP_*` / `EMAIL_FROM` / `EMAIL_ADMIN` | Nodemailer |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` / `GOOGLE_CALLBACK_URL` | OAuth Google |
| `VITE_API_URL` | URL base de la API desde el frontend (build-time) |

---

## Diagnóstico de errores en producción (EasyPanel)

Cuando algo falla en producción y **no se puede reproducir localmente**, los logs del contenedor en EasyPanel son la fuente principal de información:

1. Ir a EasyPanel → seleccionar el servicio `javlabs` → pestaña **Logs**
2. Los logs de Express (morgan) y Winston aparecen ahí en tiempo real
3. Los errores de Prisma, email y runtime lanzan mensajes con nivel `error`

**Variables críticas a verificar en EasyPanel → Environment:**
- `VITE_API_URL` debe terminar en `/api` (ej: `https://javlabsautomatic.com/api`). Si falta el `/api`, el frontend posta a la ruta incorrecta y el SPA devuelve HTML en vez de JSON → el formulario siempre falla silenciosamente.
- `DATABASE_URL` — si no está, Prisma no conecta y todas las rutas que tocan BD retornan 500.
- `GMAIL_REFRESH_TOKEN` / `GMAIL_USER` — si faltan, el email de notificación falla, pero **no bloquea** la respuesta del formulario (el error se captura con `.catch()`).

**Flujo de deploy:**
Todo cambio de código debe commitearse y pushearse a `main`. EasyPanel detecta el push, reconstruye la imagen Docker y reinicia el contenedor automáticamente. No hay que hacer nada manual.
