# 🎯 JAV LABS - Guía para Claude Code

**Proyecto:** Aplicación web de automatización - JAV LABS
**Rama actual:** develop
**Fecha:** 2026-03-25

---

## 📋 Descripción

Proyecto completo de aplicación web con:
- **Frontend:** React + Vite + Tailwind CSS + Framer Motion
- **Backend:** Node.js + Express + Prisma + PostgreSQL
- **Integración:** n8n workflows
- **Sistema:** Autenticación con roles, tickets de soporte

---

## 🚀 Comandos Esenciales

### Frontend
```bash
cd frontend
npm install          # Instalar dependencias
npm run dev          # Servidor desarrollo (puerto 5173)
npm run build        # Build producción
npm run lint         # ESLint
```

### Backend
```bash
cd backend
npm install
npm run dev          # Servidor desarrollo (puerto 3000)
npx prisma migrate dev
```

### Docker
```bash
docker-compose up --build      # Iniciar todos los servicios
docker-compose logs -f [servicio]  # Ver logs
docker-compose down           # Detener
```

---

## 🏗️ Estructura del Proyecto

```
/home/jav/javlabs/
├── backend/              # API Node.js + Express
│   ├── src/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── migrations/
│   └── package.json
├── frontend/             # React + Vite
│   ├── src/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   ├── index.css
│   │   ├── styles/
│   │   │   └── design-tokens.css  # Variables CSS
│   │   ├── components/
│   │   │   ├── PublicLayout.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── ExpandableCard.jsx
│   │   │   └── ...
│   │   └── stitch/      # Páginas
│   │       ├── landing_page_1/
│   │       │   ├── LandingPage1.jsx
│   │       │   ├── ExamplesSection.jsx
│   │       │   ├── ObjectionBuster.jsx
│   │       │   └── FAQSection.jsx
│   │       ├── services_page_variant_1/
│   │       │   └── ServicesPageVariant1.jsx  # CORREGIDA
│   │       ├── pricing_page/
│   │       ├── about_page/
│   │       ├── contact_page_variant_1/
│   │       └── ...
│   └── tailwind.config.js
├── .claude/              # Configuración Claude Code
│   ├── settings.json
│   ├── settings.local.json
│   ├── agents/
│   ├── skills/
│   └── plans/
├── support_n8n_workflow.json
├── docker-compose.yml
├── PROYECTO_INFO.md     # Documentación completa
└── CLAUDE.md            # Este archivo
```

---

## 🎨 Sistema de Diseño

### Design Tokens (`design-tokens.css`)

**Colores principales:**
- `--color-primary: #0d7ff2` (Azul)
- `--color-accent: #8b5cf6` (Violeta)
- `--bg-primary: #0D1B2A` (Fondo oscuro)
- `--text-secondary: #94a3b8`
- `--text-muted: #64748b`

**Tipografía:**
- Display: **Michroma** (títulos)
- Body: **Montserrat** (texto)
- Mono: **Fira Code** (código)

**Clases utilitarias propias:**
```css
.text-text-secondary  /* = var(--text-secondary) */
.text-text-muted      /* = var(--text-muted) */
.bg-navy-darker       /* = var(--bg-navy-darker) */
```

---

## ⚠️ Problemas Comunes y Soluciones

### 1. Iconos no aparecen (solo texto)
**Causa:** Material Symbols CSS sobrescrito
**Solución:** Verificar que `index.css` tenga:
```css
span.material-symbols-outlined,
.material-symbols-outlined {
  font-family: 'Material Symbols Outlined' !important;
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24 !important;
  ... !important;
}
```

### 2. Footer duplicado
**Causa:** Página con footer local + footer global
**Solución:** Eliminar footer local, usar solo el de `PublicLayout`

### 3. Clases Tailwind no reconocidas
**Error:** `text-color-primary` no existe
**Correcto:** `text-primary` (sin prefijo `color-`)
**Aplicar a:** `bg-color-`, `border-color-`, `from-color-`, etc.

### 4. Build falla
```bash
rm -rf node_modules
npm install
npm run build
```

### 5. Puertos en uso
```bash
# Ver qué usa puertos 3000 y 5173
ss -tulpn | grep -E ':(3000|5173)'
# Matar proceso
kill -9 <PID>
```

---

## ✅ Estados de Servidores

| Servicio | Puerto | Estado | Comando |
|----------|--------|--------|---------|
| Frontend | 5173 | ✅ | `npm run dev` |
| Backend | 3000 | ✅ | `npm run dev` |
| Ollama | 11434 | ✅ | `ollama serve` |

---

## 🧪 Testing Checklist

### Antes de commit
- [ ] Build de producción exitoso
- [ ] ESLint sin errores críticos
- [ ] Servidores frontend y backend funcionando
- [ ] Iconos de Material Symbols visibles
- [ ] Footer no duplicado
- [ ] Responsive en móvil/tablet/desktop
- [ ] Sin errores en consola del navegador

### rutas importantes
- `/` - Landing page
- `/servicios` - Página de servicios (CORREGIDA)
- `/nosotros` - About
- `/contacto` - Contacto
- `/precios` - Pricing con ROI calculator
- `/dashboard` - Privado (requiere auth)
- `/automatizaciones` - Gestión de automatizaciones
- `/soporte` - Sistema de tickets

---

## 🔧 Configuración

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

### Tailwind Colors
Las clases usan colores directamente: `text-primary`, `bg-accent`, `border-primary/50`

NO usar: `text-color-primary`, `bg-color-accent` ❌

---

## 📦 Dependencias Clave

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

---

## 🗂️ Archivos Modificados Recientemente

| Archivo | Cambio | Fecha |
|---------|--------|-------|
| `ServicesPageVariant1.jsx` | Corregido: motion import, clases CSS | 2026-03-25 |
| `LandingPage1.jsx` | Eliminado footer duplicado | 2026-03-25 |
| `index.css` | Mejorado Material Symbols | 2026-03-25 |

---

## 📄 Documentación

- `PROYECTO_INFO.md` - Documentación completa del proyecto
- `PLAN_DE_DESARROLLO.md` - Plan general de desarrollo
- `frontend/README.md` - Documentación específica frontend

---

## 🎯 Estado Actual

✅ **Proyecto funcional y corregido**

**Últimas correcciones:**
- ✅ Página de servicios funcionando
- ✅ Landing page sin footer duplicado
- ✅ Iconos de Material Symbols visibles
- ✅ Build de producción exitoso

---

## 🆘 Soporte

Si encuentras problemas:

1. **Revisa este archivo** (CLAUDE.md)
2. **Consulta PROYECTO_INFO.md** para detalles
3. **Verifica consola del navegador** (F12) para errores
4. **Revisa logs** de Docker si usas contenedores
5. **Limpia caché** navegador: Ctrl+Shift+R
6. **Reinicia servidores** frontend y backend

---

**Última actualización:** 2026-03-25
**Mantenido por:** Claude Code Assistant
