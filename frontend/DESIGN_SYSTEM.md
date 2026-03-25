# 🎨 Design System - JAVLABS

**Sistema de Diseño para el proyecto JAVLABS**

---

## 📐 Tabla de Contenidos

1. [Introducción](#introducción)
2. [Instalación](#instalación)
3. [Colores](#colores)
4. [Tipografía](#tipografía)
5. [Espaciado](#espaciado)
6. [Sombras](#sombras)
7. [Border Radius](#border-radius)
8. [Transiciones](#transiciones)
9. [Componentes](#componentes)
10. [Accesibilidad](#accesibilidad)
11. [Responsive](#responsive)
12. [Ejemplos de Uso](#ejemplos-de-uso)

---

## 📖 Introducción

Este documento define el sistema de diseño para el proyecto JAVLABS. Proporciona:

- **Consistencia** visual en todas las páginas y componentes
- **Eficiencia** al desarrollar (reutilización de componentes)
- **Accesibilidad** WCAG 2.1 Level AA
- **Mantenibilidad** con variables CSS centralizadas

### Archivos principales:

- `frontend/src/styles/design-tokens.css` - Variables CSS y utilidades
- `frontend/src/components/ui/` - Componentes atómicos reutilizables
- `frontend/src/stitch/landing_page_1/LandingPage1.jsx` - Ejemplo de implementación

---

## 🚀 Instalación

Para usar el sistema de diseño en cualquier archivo:

```jsx
// Importar las variables CSS (una vez en tu app)
import './styles/design-tokens.css';

// Importar componentes atómicos según necesites
import Button from './components/ui/Button';
import Card from './components/ui/Card';
import Section from './components/ui/Section';
```

---

## 🎨 Colores

### Paleta de Marca

| Nombre | Variable | Hex | RGB | Uso |
|--------|----------|-----|-----|-----|
| Primary | `var(--color-primary)` | `#0d7ff2` | 13, 127, 242 | Botones, links, acentos principales |
| Primary Light | `var(--color-primary-light)` | `#3d8ef7` | 61, 142, 247 | Hover states |
| Primary Dark | `var(--color-primary-dark)` | `#0a68d9` | 10, 104, 217 | Active states |
| Accent | `var(--color-accent)` | `#8b5cf6` | 139, 92, 246 | Acentos secundarios, gradientes |
| Accent Light | `var(--color-accent-light)` | `#a78bfa` | 167, 139, 250 | Hover states |
| Accent Dark | `var(--color-accent-dark)` | `#7c3aed` | 124, 58, 237 | Active states |

### Fondos

| Nombre | Variable | Hex |
|--------|----------|-----|
| Primary | `var(--bg-primary)` | `#0D1B2A` |
| Secondary | `var(--bg-secondary)` | `#1E293B` |
| Tertiary | `var(--bg-tertiary` | `#0f141a` |
| Navy Dark | `var(--bg-navy-darker)` | `#0a0f14` |
| Navy Light | `var(--bg-navy-light)` | `#172033` |
| Surface | `var(--bg-surface)` | `#1E293B` |
| Surface Hover | `var(--bg-surface-hover)` | `#273549` |
| Glass | `var(--bg-glass)` | `rgba(15, 20, 26, 0.8)` |

### Texto

| Nombre | Variable | Hex | Contraste |
|--------|----------|-----|-----------|
| Primary | `var(--text-primary)` | `#ffffff` | -
| Secondary | `var(--text-secondary)` | `#94a3b8` | 5.8:1 |
| Muted | `var(--text-muted)` | `#64748b` | 4.7:1 |
| Dark | `var(--text-dark)` | `#1a1a1a` | -

### Estados

| Nombre | Variable | Hex |
|--------|----------|-----|
| Success | `var(--color-success)` | `#22C55E` |
| Warning | `var(--color-warning)` | `#f59e0b` |
| Error | `var(--color-error)` | `#ef4444` |
| Info | `var(--color-info)` | `#0d7ff2` |

### Gradientes

```css
/* Gradiente principal (horizontal) */
--gradient-primary: linear-gradient(90deg, #0d7ff2, #8b5cf6);

/* Gradiente hover */
--gradient-primary-hover: linear-gradient(90deg, #0a68d9, #7c3aed);
```

---

## 🔤 Tipografía

### Fuentes

```css
--font-primary: 'Montserrat', sans-serif;  /* Cuerpo de texto */
--font-display: 'Michroma', sans-serif;    /* Headlines, títulos */
--font-mono: 'Fira Code', monospace;      /* Código, datos técnicos */
```

### Tamaños (en `rem`)

| Tamaño | Variable | Píxeles | Uso |
|--------|----------|---------|-----|
| XS | `var(--font-size-xs)` | 12px | Textos auxiliares, notas |
| SM | `var(--font-size-sm)` | 14px | Texto secundario |
| **Base** | `var(--font-size-base)` | **16px** | Texto principal |
| LG | `var(--font-size-lg)` | 18px | Subtítulos, párrafos destacados |
| XL | `var(--font-size-xl)` | 20px | Títulos de tarjetas |
| 2XL | `var(--font-size-2xl)` | 24px | Títulos de sección |
| 3XL | `var(--font-size-3xl)` | 30px | Headers de página |
| 4XL | `var(--font-size-4xl)` | 36px | Títulos H1 grandes |
| 5XL | `var(--font-size-5xl)` | 48px | H1 hero section |
| 6XL | `var(--font-size-6xl)` | 60px | Headlines monumentales |

### Pesos (Weights)

```css
--font-weight-normal: 400;
--font-weight-medium: 500;
--font-weight-semibold: 600;
--font-weight-bold: 700;
--font-weight-extrabold: 800;
```

### Altura de Línea

```css
--line-height-tight: 1.25;    /* Títulos grandes */
--line-height-normal: 1.5;    /* Texto general */
--line-height-relaxed: 1.75;  /* Texto lectura larga */
```

### Espaciado Entre Letras

```css
--letter-spacing-tight: -0.025em;
--letter-spacing-normal: 0;
--letter-spacing-wide: 0.05em;
--letter-spacing-wider: 0.1em;
--letter-spacing-widest: 0.2em;  /* uppercase tracking */
```

---

## 📏 Espaciado (Spacing)

Sistema de espaciado basado en múltiplos de 4px.

| Espacio | Variable | Píxeles |
|---------|----------|---------|
| 0 | `var(--space-0)` | 0px |
| 1 | `var(--space-1)` | 4px |
| 2 | `var(--space-2)` | 8px |
| 3 | `var(--space-3)` | 12px |
| **4** | `var(--space-4)` | **16px** |
| 5 | `var(--space-5)` | 20px |
| **6** | `var(--space-6)` | **24px** |
| 8 | `var(--space-8)` | 32px |
| 10 | `var(--space-10)` | 40px |
| 12 | `var(--space-12)` | 48px |
| 16 | `var(--space-16)` | 64px |
| 20 | `var(--space-20)` | 80px |
| 24 | `var(--space-24)` | 96px |
| 32 | `var(--space-32)` | 128px |

**Uso recomendado:**
- Padding interno de cards: `var(--space-6)` (24px)
- Gap entre elementos: `var(--space-4)` a `var(--space-6)` (16-24px)
- Separación de secciones: `var(--space-24)` (96px)

---

## 🌙 Sombras (Shadows)

### Sombras estándar (Material Design inspired)

```css
/* Sutil - para cards con elevation baja */
--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);

/* Normal - sombra media */
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);

/* Grande - para popups, dropdowns */
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);

/* Muy grande - para modales */
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);

/* Enorme - para destacados especiales */
--shadow-2xl: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
```

### Sombras con color (Glow effects)

```css
/* Glow primario (azul) */
--shadow-glow-primary: 0 0 15px rgba(13, 127, 242, 0.4);

/* Glow accent (violeta) */
--shadow-glow-accent: 0 0 15px rgba(139, 92, 246, 0.4);

/* Glow pequeño */
--shadow-glow-sm-primary: 0 0 8px rgba(13, 127, 242, 0.3);
--shadow-glow-sm-accent: 0 0 8px rgba(139, 92, 246, 0.3);
```

**Uso:**
```css
.my-element {
  box-shadow: var(--shadow-glow-primary);
}
```

---

## 🔲 Border Radius

| Variable | Valor | Uso |
|----------|-------|-----|
| `--radius-none` | 0 | Botones planos, bordes cuadrados |
| `--radius-sm` | 0.25rem (4px) | Inputs pequeños |
| `--radius-md` | 0.5rem (8px) | Botones, inputs estándar |
| `--radius-lg` | 0.75rem (12px) | Cards, contenedores |
| `--radius-xl` | 1rem (16px) | Cards grandes, modales |
| `--radius-2xl` | 1.5rem (24px) | Hero sections, banners |
| `--radius-full` | 9999px | Circulos, pills (badges) |

---

## ⚡ Transiciones

```css
--transition-fast: 150ms cubic-bezier(0.4, 0, 0.2, 1);  /* Hover rápido */
--transition-base: 300ms cubic-bezier(0.4, 0, 0.2, 1); /* Por defecto */
--transition-slow: 500ms cubic-bezier(0.4, 0, 0.2, 1); /* Animaciones complejas */
--transition-bounce: 500ms cubic-bezier(0.68, -0.55, 0.265, 1.55); /* Efecto botón */
```

**Uso en Tailwind/Framer Motion:**
```jsx
<motion.div transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }} />
```

---

## 🧩 Componentes Atómicos

### Button

**Props:**
- `variant`: `'primary' | 'secondary' | 'outline' | 'ghost'`
- `size`: `'sm' | 'md' | 'lg'`
- `fullWidth`: `boolean`
- `disabled`: `boolean`
- `icon`: `ReactNode`
- `iconPosition`: `'left' | 'right'`
- `onClick`: `() => void`

**Ejemplo:**
```jsx
<Button variant="primary" size="lg" onClick={handleSubmit}>
  Enviar Formulario
</Button>

<Button variant="outline" icon={<SearchIcon />}>
  Buscar
</Button>
```

### Card

**Props:**
- `title`: `string`
- `description`: `string`
- `image`: `string` (URL)
- `imagePosition`: `'top' | 'left' | 'right'`
- `hover`: `boolean` (default true)
- `onClick`: `() => void`
- `children`: `ReactNode`

**Ejemplo:**
```jsx
<Card
  title="Servicio de Automatización"
  description="Descripción del servicio..."
  image="/img/servicio.jpg"
  onClick={() => navigate('/servicio')}
>
  <Button variant="primary">Ver más</Button>
</Card>
```

### Section

**Props:**
- `title`: `string`
- `subtitle`: `string`
- `centered`: `boolean` (default true)
- `spaced`: `boolean` (default true)
- `background`: `'light' | 'dark' | 'gradient'`
- `className`: `string`

**Ejemplo:**
```jsx
<Section
  title="Nuestros Servicios"
  subtitle="Soluciones de alto impacto"
  background="dark"
>
  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
    {/* Contenido */}
  </div>
</Section>
```

---

## ♿ Accesibilidad

### Focus Visible

Todos los componentes deben respetar `:focus-visible`:

```css
:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}
```

### Skip Links

Agregar al inicio de cada página:

```jsx
<a href="#main-content" className="skip-link">
  Saltar al contenido principal
</a>

<main id="main-content" tabIndex="-1">
  {/* Contenido de la página */}
</main>
```

### Reduced Motion

El sistema incluye `prefers-reduced-motion` en `design-tokens.css`:

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

Framer Motion:
```jsx
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.3 }}
  // Se respeta reduced motion automáticamente
/>
```

### ARIA

- Botones con solo ícono: `aria-label="Descripción"`
- Menús desplegables: `aria-expanded`, `aria-controls`
- Modales: `role="dialog"`, `aria-modal="true"`
- Alertas: `aria-live="polite"`, `aria-atomic="true"`

---

## 📱 Responsive

### Breakpoints

```css
/* Mobile first: */
/* Base: < 768px (móvil) */

/* Tablet */
@media (min-width: 768px) { /* ... */ }

/* Desktop */
@media (min-width: 1024px) { /* ... */ }

/* Wide */
@media (min-width: 1280px) { /* ... */ }
```

### Grid Responsive Pattern

```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* Elementos */}
</div>
```

### Container

```css
.container {
  max-width: var(--container-max-width); /* 1280px */
  margin: 0 auto;
  padding-left: var(--container-padding); /* 24px */
  padding-right: var(--container-padding);
}
```

---

## 🎬 Animaciones

### Clases CSS Disponibles

```css
/* Fade */
.animate-fadeIn
.animate-fadeInUp
.animate-fadeInDown

/* Slide */
.animate-slideInUp
.animate-slideInDown
.animate-slideInLeft
.animate-slideInRight

/* Zoom */
.animate-zoomIn
.animate-zoomInUp

/* Bounce */
.animate-bounce

/* Pulse */
.animate-pulse
.animate-pulse-ring

/* Float */
.animate-float

/* Spin */
.animate-spin

/* Scale */
.animate-scaleIn
```

### Delays para Stagger

```css
.animate-delay-100  /* 100ms */
.animate-delay-200  /* 200ms */
.animate-delay-300  /* 300ms */
...
.animate-delay-1000 /* 1000ms */
```

---

## 🛠️ Utilidades CSS

### Tipografía

```css
.text-gradient  /* Texto con gradiente primary->accent */
.font-display   /* Fuente Michroma (display) */
.font-body      /* Fuente Montserrat (cuerpo) */
.font-mono      /* Fuente monoespaciada */
```

### Sombras Glow

```css
.shadow-glow-primary  /* Glow azul */
.shadow-glow-accent   /* Glow violeta */
```

### Glass Effect

```css
.glass {
  background: rgba(15, 20, 26, 0.8);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}
```

### Gradientes de Sección

```css
.section-gradient {
  background: radial-gradient(ellipse at top, rgba(13, 127, 242, 0.15) 0%, transparent 50%),
              radial-gradient(ellipse at bottom right, rgba(139, 92, 246, 0.1) 0%, transparent 50%),
              var(--bg-primary);
}
```

---

## 📋 Checklist de Implementación

Para cada nueva página/componente:

- [ ] Usar componentes atómicos (Button, Card, Section)
- [ ] Respetar spacing system (no usar Tailwind arbitrary values)
- [ ] Usar colores de design tokens (no hardcodear hexes)
- [ ] Tipografía con variables (no hardcodear px sizes)
- [ ] Responsive: mobile-first, todos los breakpoints
- [ ] Accesibilidad: focus-visible, ARIA labels, skip link
- [ ] Animaciones con :prefers-reduced-motion respetado
- [ ] Imágenes optimizadas (width/height, aspect-ratio)
- [ ] Contraste WCAG AA (4.5:1 mínimo)
- [ ] Meta tags (title, description, og:) en páginas públicas

---

## 🔍 Testing

### Herramientas recomendadas:

1. **Chrome DevTools Lighthouse** - Performance, Accesibilidad, SEO
2. **axe DevTools** - Scan de accesibilidad
3. **WebPageTest.org** - Core Web Vitals detallados
4. **BrowserStack** - Testing multi-browser/device

### Criterios:

- **Accesibilidad:** Lighthouse score > 90
- **Performance:** Lighthouse score > 90
- **Best Practices:** > 90
- **SEO:** > 90

---

## 📚 Ejemplos de Uso

### Card de Servicio

```jsx
<Card
  title="Automatización de Workflows"
  description="Eliminamos cuellos de botella mediante flujos de trabajo inteligentes."
  image="/img/workflow.jpg"
  className="group"
>
  <Button variant="primary" fullWidth>
    Ver Detalles
  </Button>
</Card>
```

### Section con fondo oscuro

```jsx
<Section background="dark" title="Nuestros Servicios">
  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
    {/* Cards */}
  </div>
</Section>
```

### Botón con glow

```jsx
<Button
  variant="primary"
  size="lg"
  className="shadow-glow-primary hover:shadow-glow-accent"
>
  Comenzar Ahora
</Button>
```

---

## 📞 Contacto y Soporte

Para preguntas sobre el sistema de diseño:

- **Documentación:** Ver comentarios en cada componente
- **Ejemplos:** `frontend/src/stitch/landing_page_1/LandingPage1.jsx`
- **Issues:** Reportar en el repositorio del proyecto

---

**Última actualización:** 2026-03-24
**Versión:** 1.0.0
**Mantenido por:** Equipo de Desarrollo JAVLABS
