# UI Components Library

 Biblioteca de componentes atómicos basada en el sistema de diseño de JAV LABS.

## 📦 Componentes

### Button
Botón reutilizable con múltiples variantes y tamaños.

**Uso:**
```jsx
import Button from './ui/Button';

<Button
  variant="primary"
  size="md"
  onClick={() => console.log('clicked')}
  fullWidth={false}
  disabled={false}
>
  Click Me
</Button>
```

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'primary' \| 'secondary' \| 'outline' \| 'ghost'` | `'primary'` | Variante visual |
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | Tamaño del botón |
| `fullWidth` | `boolean` | `false` | Ancho completo |
| `disabled` | `boolean` | `false` | Estado deshabilitado |
| `icon` | `ReactNode` | - | Icono opcional |
| `iconPosition` | `'left' \| 'right'` | `'left'` | Posición del icono |

**Variantes:**
- `primary`: Gradiente azul-violeta (marca)
- `secondary`: Color accent (violeta)
- `outline`: Borde con fondo transparente
- `ghost`: Sin borde ni fondo (hover sutil)

### Card
Contenedor flexible para contenido con soporte de imágenes y hover effects.

**Uso:**
```jsx
import Card from './ui/Card';

<Card
  title="Card Title"
  description="Card description"
  image="/path/to/image.jpg"
  hover={true}
  onClick={() => navigate('/detail')}
>
  <p>Card body content</p>
</Card>
```

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | - | Título de la card |
| `description` | `string` | - | Descripción |
| `image` | `string` | - | URL de la imagen |
| `imagePosition` | `'top' \| 'left' \| 'background'` | `'top'` | Posición de la imagen |
| `hover` | `boolean` | `true` | Efectos hover |
| `onClick` | `function` | - | Handler de click |

**Variantes CSS:**
- `.card-gradient`: Para cards con fondo gradiente y glow (usada en pricing)
- `.card-feature`: Para cards de características centradas

### Section
Contenedor semántico para secciones de página.

**Uso:**
```jsx
import Section from './ui/Section';

<Section
  title="Our Services"
  subtitle="What we do best"
  background="dark"
  spaced={true}
  centered={true}
  id="services"
>
  <div>Sección contenido</div>
</Section>
```

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | - | Título de la sección |
| `subtitle` | `string` | - | Subtítulo/descripción |
| `background` | `'light' \| 'dark' \| 'gradient'` | `'light'` | Fondo de la sección |
| `spaced` | `boolean` | `true` | Añadir padding vertical |
| `centered` | `boolean` | `true` | Centrar contenido horizontalmente |
| `id` | `string` | - | ID para navegación |

---

## 🎨 Design Tokens

Todos los componentes usan las variables CSS definidas en `design-tokens.css`:

### Colores
- `--color-primary`: `#0d7ff2` (azul marca)
- `--color-accent`: `#8b5cf6` (violeta)
- `--bg-primary`: `#0D1B2A` (fondo oscuro)
- `--text-primary`: `#ffffff` (texto claro)

### Spacing
- `--space-4`: 1rem (16px) - padding base
- `--space-6`: 1.5rem (24px) - gap entre elementos
- `--space-8`: 2rem (32px) - padding secciones
- `--space-12`: 3rem (48px) - padding grandes

### Shadows
- `--shadow-md`: Sombra media
- `--shadow-lg`: Sombra grande
- `--shadow-xl`: Sombra extra grande
- `--shadow-glow-primary`: Glow azul (efecto neon)

### Transitions
- `--transition-base`: 300ms (animaciones estándar)
- `--transition-slow`: 500ms (animaciones largas)

---

## 🎬 Animaciones

Incluidas en `design-tokens.css`:

| Animación | Uso | Duración |
|-----------|-----|----------|
| `fadeIn` | Aparecer suave | 300ms |
| `fadeInUp` | Aparecer desde abajo | 500ms |
| `slideInUp` | Deslizar desde abajo | 500ms |
| `zoomIn` | Zoom desde pequeño | 500ms |
| `bounce` | Rebote (una vez) | 1s |
| `pulse` | Pulsar continuo | 2s infinite |
| `float` | Flotar suave | 3s infinite |
| `spin` | Rotación continua | 1s infinite |

**Clases utilitarias:**
```jsx
<div className="animate-fadeIn animate-delay-200">
  Contenido animado
</div>
```

---

## 📱 Responsive

Todos los componentes son responsive por defecto (mobile-first).

Breakpoints definidos en Tailwind (usar clases responsive):
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px

---

## ♿ Accesibilidad

- Todos los elementos interactivos tienen `:focus-visible` styles
- Cards clickeables son accesibles por teclado (Enter key)
- Colores cumplen ratio de contraste 4.5:1 mínimo
- Se respeta `prefers-reduced-motion` para animaciones

---

## 🚀 Instalación

Los estilos ya están configurados. Solo importar:

```jsx
import './styles/design-tokens.css'; // Una vez en tu App.jsx o index
import Button from './components/ui/Button';
import Card from './components/ui/Card';
import Section from './components/ui/Section';
```

---

## 📖 Ejemplos

Ver ejemplos completos en:
- `LandingPage1.jsx` - Uso real de componentes
- Componentes existentes para patrones

---

## 🔧 Extensión

Para agregar nuevos componentes:

1. Crear `ComponentName.jsx` y `ComponentName.css`
2. Usar variables CSS de `design-tokens.css`
3. Seguir convenciones de naming BEM-ish
4. Documentar en este README
5. Mantener accesibilidad

---

**Nota:** Esta biblioteca está en desarrollo activo. Se agregarán más componentes (Input, Modal, Dropdown, etc.) en fases futuras.
