# 📋 JAV LABS - DOCUMENTACIÓN DEL PROYECTO

**Fecha:** 2026-03-25
**Rama:** develop
**Repositorio:** `/home/jav/javlabs`

---

## 🎯 VISIÓN GENERAL

Proyecto completo de aplicación web con frontend React y backend Node.js/Express, incluyendo integración con n8n para automatización de workflows y sistema de soporte con tickets.

---

## 📊 ESTADO ACTUAL

### ✅ CORRECCIONES RECIENTES FINALIZADAS

**Fecha:** 2026-03-25

#### 1. Página de Servicios - Corregida
**Archivo:** `frontend/src/stitch/services_page_variant_1/ServicesPageVariant1.jsx`

**Problemas resueltos:**
- ❌ Importación faltante de `motion` de framer-motion
- ❌ Clases CSS incorrectas con prefijo `color-` (text-color-primary → text-primary)
- ❌ Utilidades CSS faltantes (text-text-secondary, text-text-muted)
- ❌ Clases Tailwind mal formadas

**Soluciones aplicadas:**
```javascript
// Import añadido
import { motion } from 'framer-motion';

// Correcciones de clases
text-color-primary → text-primary
bg-color-primary → bg-primary
border-color-primary → border-primary
from-color-primary → from-primary
```

**CSS añadido en `index.css`:**
```css
.text-text-secondary { color: var(--text-secondary); }
.text-text-muted { color: var(--text-muted); }
.bg-navy-darker { background-color: var(--bg-navy-darker); }
```

**Resultado:** ✅ Build exitoso sin errores

---

#### 2. Landing Page - Footer Duplicado e Iconos

**A) Footer Duplicado**
- **Problema:** Landing page tenía footer local + footer global de PublicLayout
- **Solución:** Eliminado footer local (líneas 838-897 de LandingPage1.jsx)
- **Resultado:** Un solo footer global consistente

**B) Iconos de Material Symbols no aparecían**
- **Problema:** Los iconos se mostraban como texto ("work", "twitter", etc.)
- **Causa:** Especificidad CSS insuficiente, Tailwind sobrescribía font-family
- **Solución:** Reforzada regla CSS en `index.css` con `!important` y `font-variation-settings`

```css
span.material-symbols-outlined,
.material-symbols-outlined {
  font-family: 'Material Symbols Outlined' !important;
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24 !important;
  font-weight: normal !important;
  font-style: normal !important;
  font-size: 1.5rem !important;
  line-height: 1 !important;
  letter-spacing: normal !important;
  text-transform: none !important;
  display: inline-block !important;
  white-space: nowrap !important;
  word-wrap: normal !important;
  direction: ltr !important;
  -webkit-font-feature-settings: 'liga' !important;
  font-feature-settings: 'liga' !important;
  -webkit-font-smoothing: antialiased !important;
  text-rendering: optimizeLegibility !important;
}
```

**Resultado:** ✅ Todos los iconos se renderizan correctamente

---

#### 3. Gestión de Puertos
**Archivo:** `INFORME_PUERTOS.md`

**Puertos activos cerrados:**
- PID 2947550 → Puerto 3001
- PID 3584751 → Puerto 40887
- PID 3586354 → Puerto 5174

**Puertos en uso (NO cerrar):**
- **3000** - Backend
- **5173** - Frontend
- **11434** - Ollama (IA local) - Usuario pidió dejarlo

**Puertos del sistema (NO cerrar sin evaluar):**
- 22 (SSH), 53 (DNS), 2377/7946 (Docker), 5432 (PostgreSQL)
- 80/443 (nginx/Apache), 35307 (VS Code)

---

## 🏗️ ARQUITECTURA

### Frontend (React)
- **Build tool:** Vite 5.4.21
- **UI Framework:** React 18.3.1
- **Animaciones:** Framer Motion 12.38.0
- **Estilos:** Tailwind CSS 3.4.19 + Design Tokens CSS
- **Ruteo:** React Router DOM 7.13.1
- **HTTP Client:** Axios 1.13.6

### Backend (Node.js + Express)
- **Runtime:** Node.js 20+
- **Framework:** Express
- **ORM:** Prisma
- **Base de datos:** PostgreSQL
- **Autenticación:** JWT + roles (admin, agente, usuario)
- **CORS:** Configurado para webhooks n8n

### Integraciones
- **n8n:** Workflows de automatización de soporte
- **Docker:** Contenedores separados frontend/backend

---

## 📁 ESTRUCTURA DEL PROYECTO

```
/home/jav/javlabs/
├── backend/
│   ├── src/
│   ├── prisma/
│   │   └── migrations/
│   │       ├── 20260321191927_add_support_ticket_models
│   │       └── 20260321210017_add_agent_role
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── main.jsx
│   │   ├── App.jsx
│   │   ├── index.css
│   │   ├── styles/
│   │   │   └── design-tokens.css
│   │   ├── components/
│   │   │   ├── PublicLayout.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── ExpandableCard.jsx
│   │   │   └── ...
│   │   ├── stitch/
│   │   │   ├── landing_page_1/
│   │   │   │   ├── LandingPage1.jsx
│   │   │   │   ├── ExamplesSection.jsx
│   │   │   │   ├── ObjectionBuster.jsx
│   │   │   │   └── FAQSection.jsx
│   │   │   ├── services_page_variant_1/
│   │   │   │   └── ServicesPageVariant1.jsx
│   │   │   ├── pricing_page/
│   │   │   │   └── ROICalculator.jsx
│   │   │   ├── about_page/
│   │   │   ├── contact_page_variant_1/
│   │   │   └── ...
│   │   └── ...
│   └── package.json
├── support_n8n_workflow.json
├── docker-compose.yml
└── [Documentación .md]
```

---

## 🎨 SISTEMA DE DISEÑO

### Design Tokens (`design-tokens.css`)

**Colores:**
- `--color-primary: #0d7ff2` (Azul)
- `--color-accent: #8b5cf6` (Violeta)
- `--bg-primary: #0D1B2A` (Navy oscuro)
- `--text-primary: #ffffff`
- `--text-secondary: #94a3b8`
- `--text-muted: #64748b`

**Tipografía:**
- Display: Michroma
- Body: Montserrat
- Mono: Fira Code

**Espaciado:** Escala 0.25rem - 8rem (4px - 128px)

**Sombras:** sm, md, lg, xl, 2xl + glow effects

**Animaciones:** fadeIn, fadeInUp, slideIn, bounce, pulse, float, zoomIn

---

## 🧩 COMPONENTES PRINCIPALES

### Layouts
- **PublicLayout.jsx** - Layout para páginas públicas con navbar y footer
- **PrivateRoute** - Protección de rutas autenticadas

### Páginas Públicas
- **LandingPage1** - Página principal con hero, servicios, precios, FAQ
- **ServicesPageVariant1** - Página de servicios (corregida)
- **AboutPage** - Nosotros
- **ContactPageVariant1** - Formulario de contacto
- **PricingPage** - Planes de precios con ROI calculator

### Componentes Específicos
- **Footer.jsx** - Footer global con redes sociales, newsletter
- **ExpandableCard.jsx** - Tarjeta expandible para pricing
- **ServiceCard3D.jsx** - Tarjeta de servicios con efecto 3D
- **ProcessAnimation.jsx** - Animación de pasos del proceso
- **ExamplesSection.jsx** - Casos de uso por industria
- **ObjectionBuster.jsx** - Tabla comparativa de precios
- **FAQSection.jsx** - Preguntas frecuentes accordion

---

## 🚀 COMANDOS ÚTILES

### Desarrollo Frontend
```bash
cd frontend
npm install
npm run dev     # Puerto 5173
npm run build   #Build de producción
npm run lint    # ESLint
```

### Desarrollo Backend
```bash
cd backend
npm install
npm run dev     # Puerto 3000
npx prisma migrate dev
```

### Docker
```bash
# Build y run
docker-compose up --build

# Logs
docker-compose logs -f [service]

# Stop
docker-compose down
```

---

## 📦 DEPENDENCIAS CLAVE

### Frontend (`frontend/package.json`)
```json
{
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^7.13.1",
    "framer-motion": "^12.38.0",
    "tailwindcss": "^3.4.19",
    "axios": "^1.13.6"
  }
}
```

### Backend (presumible)
- express, prisma, pg, jsonwebtoken, bcrypt, dotenv, cors, helmet

---

## 🔧 CONFIGURACIÓN

### Variables de Entorno
**Backend (.env):**
```
DATABASE_URL="postgresql://..."
JWT_SECRET="..."
N8N_URL="..."
PORT=3000
```

**Frontend (.env):**
```
VITE_API_URL=http://localhost:3000
```

### Rutas Importantes

**Públicas:**
- `/` - Landing page
- `/servicios` - Página de servicios
- `/nosotros` - About page
- `/contacto` - Contacto
- `/precios` - Pricing

**Privadas:**
- `/dashboard` - Dashboard principal
- `/automatizaciones` - Gestión de automatizaciones
- `/soporte` - Sistema de tickets
- `/admin/usuarios` - Panel de administración

---

## ✅ CHECKLIST DE VERIFICACIÓN

### Antes de deploy
- [ ] Build de producción sin errores
- [ ] Variables de entorno configuradas
- [ ] Base de datos migrada
- [ ] CORS configurado correctamente
- [ ] HTTPS configurado (producción)
- [ ] Google Analytics / tracking instalado
- [ ] Favicon configurado
- [ ] Meta tags SEO configurados

### Pruebas
- [ ] Footer no duplicado
- [ ] Iconos de Material Symbols renderizados
- [ ] Responsive en móvil/tablet/desktop
- [ ] Navegación funciona correctamente
- [ ] Formularios envían datos
- [ ] Autenticación funciona
- [ ] API calls exitosas

---

## 🐛 PROBLEMAS COMUNES Y SOLUCIONES

### 1. Iconos no aparecen (solo texto)
**Causa:** CSS de Material Symbols sobrescrito
**Solución:** Verificar que `index.css` tenga la regla con `!important`

### 2. Footer duplicado
**Causa:** Página con footer local + footer global
**Solución:** Eliminar footer local, usar solo el global de PublicLayout

### 3. Clases Tailwind no reconocidas
**Causa:** Uso de `color-` prefijo (incorrecto)
**Solución:** Usar `primary`, `accent` directamente (ej: `text-primary`)

### 4. Build falla
**Solución:**
```bash
rm -rf node_modules
npm install
npm run build
```

### 5. Puertos en uso
**Verificar:**
```bash
ss -tulpn | grep -E ':(3000|5173)'
```

**Matar proceso:** `kill -9 <PID>`

---

## 📝 RECIENTES CAMBIOS (2026-03-25)

### Frontend
1. ✅ ServicesPageVariant1.jsx - Corregida completamente
2. ✅ LandingPage1.jsx - Footer removido
3. ✅ index.css - Material Symbols mejorado
4. ✅ Build de producción verificado

### Sistema
1. ✅ Procesos node innecesarios cerrados (puertos 3001, 40887, 5174)
2. ✅ Informe de puertos generado
3. ✅ Documentación unificada

---

## 📂 ARCHIVOS MODIFICADOS RECIENTEMENTE

| Archivo | Cambio | Líneas |
|---------|--------|--------|
| `frontend/src/stitch/services_page_variant_1/ServicesPageVariant1.jsx` | Import motion, corrección clases CSS | Varias |
| `frontend/src/stitch/landing_page_1/LandingPage1.jsx` | Eliminado footer duplicado | 838-897 |
| `frontend/src/index.css` | Mejorado Material Symbols, utilidades | 6-22 |
| `frontend/tailwind.config.js` - Diseño tokens (existente)
| `frontend/src/styles/design-tokens.css` - Diseño tokens (existente)

---

## 🧪 TESTING

### Build de producción (actual)
```
✓ 553 modules transformed
✓ built in 2.66s
✓ CSS: 89.87 kB (gzip: 15.71 kB)
✓ JS: 662.14 kB (gzip: 184.56 kB)
```

### Servidores activos
- Frontend: `http://localhost:5173` ✅
- Backend: `http://localhost:3000` ✅

---

## 🔗 RECURSOS EXTERNOS

- **Google Fonts:** Michroma, Montserrat, Material Symbols Outlined
- **Material Icons:** https://fonts.google.com/icons
- **Tailwind CSS:** https://tailwindcss.com/docs
- **Framer Motion:** https://www.framer.com/motion

---

## 📞 SOPORTE

Si hay problemas:

1. **Verifica servidores** corriendo en puertos correctos
2. **Limpia caché** navegador (Ctrl+Shift+R)
3. **Revisa consola** DevTools (F12) para errores
4. **Verifica variables** de entorno
5. **Revisa logs** de Docker si usas contenedores

---

## 📄 DOCUMENTACIÓN ADICIONAL

### Archivos de configuración
- `frontend/tailwind.config.js` - Configuración Tailwind
- `frontend/vite.config.js` - Configuración Vite
- `backend/prisma/schema.prisma` - Schema de base de datos
- `docker-compose.yml` - Orquestación de contenedores

### Documentación eliminada
Los siguientes archivos .md han sido consolidados en este documento y pueden eliminarse:
- INFORME_PUERTOS.md
- REPORTE_CORRECCION_SERVICIOS.md
- CORRECCIONES_LANDING_PAGE.md
- RESUMEN_FINAL_CORRECCIONES.md
- DEBUG_ICONOS_FOOTER.md
- PLAN_DE_DESARROLLO.md
- CAMBIOS_APLICADOS.md
- Y otros archivos de reportes históricos

**Mantener solo:**
- `PROYECTO_INFO.md` (este archivo)
- `PLAN_DE_DESARROLLO.md` (resumen general del proyecto)
- `frontend/README.md` (documentación frontend)
- `CLAUDE.md` (configuración de Claude Code)

---

---

## 🤖 INTEGRACIÓN AUTOMATIZADA CON N8N (2026-03-26)

### **Sistema de Soporte con IA**

✅ **Integración completada y funcional** entre backend JAV LABS y n8n para soporte automatizado.

---

### **🔧 Problemas Resueltos**

1. **Módulo faltante en producción**
   - `jsonwebtoken` movido de `devDependencies` a `dependencies`
   - Commit: `cee99e6`

2. **Rate limiting bloqueando endpoints**
   - Excluidos endpoints públicos (`/public`, `/webhook-n8n`)
   - Excluidos endpoints de auth (`/api/auth/*`)
   - Commit: `e7fbe2b`

3. **URL incorrecta del webhook**
   - Corregida variable `N8N_SUPPORT_WEBHOOK_URL`
   - De `.../webhook-test/...` → `.../webhook/...`

4. **Configuración n8n V4**
   - HTTP Request: Usar `JSON Body` (no `body`)
   - Referencias: `={{ $json.field }}`
   - Prompt OpenAI: Corregido a `$node['Get Ticket Details'].json`

5. **Logging mejorado**
   - Detalle en notificación a n8n
   - Commit: `e99f23d`

---

### **📊 Arquitectura del Flujo**

```
Usuario crea ticket (AUTOMATED)
    ↓
Backend → notifyN8n() → POST webhook
    ↓
n8n Workflow "N8n_Javlabs":
  ├─ Webhook Trigger (recibe ticketId)
  ├─ Get Ticket Details (consulta /public)
  ├─ OpenAI Chat (genera respuesta)
  ├─ Build Response (formatea)
  └─ Send to Backend (envía respuesta)
    ↓
Backend → Crea mensaje BOT en ticket
    ↓
Frontend → Muestra respuesta automática
```

---

### **📁 Archivos Modificados**

| Archivo | commit | Descripción |
|---------|--------|-------------|
| `backend/package.json` | cee99e6 | jsonwebtoken → dependencies |
| `backend/src/app.js` | e7fbe2b | Rate limiting mejorado |
| `backend/src/routes/support.routes.js` | e99f23d | Logging detallado |

---

### **📚 Documentación**

- **Diagnóstico completo:** `INTEGRACION_N8N_DIAGNOSTICO_Y_SOLUCION.md`
- **Workflow corregido:** `support_n8n_workflow_fixed.json` (referencia)
- **Scripts de prueba:** `test_n8n_integration.sh`, `test_webhook_direct.sh`

---

### **Variables de Entorno Requeridas**

```env
# Backend .env
N8N_URL=n8n-n8n.ak7rlh.easypanel.host
N8N_SUPPORT_WEBHOOK_URL=https://n8n-n8n.ak7rlh.easypanel.host/webhook/support-response
N8N_API_KEY=<api-key>
```

---

### **Configuración n8n - Nodo "Send to Backend"**

**IMPORTANTE:** En n8n V4, usar:

- **Type:** HTTP Request
- **Method:** POST
- **URL:** `https://.../api/support/tickets/{{ $json.ticketId }}/webhook-n8n`
- **Send Body:** ON
- **Body Content Type:** JSON
- **JSON Body:**
```json
{
  "response": "={{ $json.response }}",
  "confidence": "={{ $json.confidence }}",
  "metadata": "={{ $json.metadata }}"
}
```

---

**Estado:** ✅ Funcionando en producción

---

## 🎉 ESTADO ACTUAL

✅ **Proyecto funcional y corregido**

**Servicios activos:**
- Frontend: Puerto 5173
- Backend: Puerto 3000
- Ollama: Puerto 11434
- n8n: Integración activa

**Últimas correcciones:**
- Página de servicios funcionando
- Landing page sin footer duplicado
- Iconos de Material Symbols visibles
- Build de producción exitoso
- **Integración n8n completada** 🤖

**Listo para:** Desarrollo continuo y deployment

---

**Última actualización:** 2026-03-26
**Responsable:** Claude Code Assistant
