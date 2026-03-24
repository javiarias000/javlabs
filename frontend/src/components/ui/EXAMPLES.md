# Ejemplos de Uso - Componentes UI

Ejemplos prácticos de cómo usar los componentes del sistema de diseño.

---

## 📦 Button Component

### Botón Primario
```jsx
import Button from './ui/Button';

<Button
  variant="primary"
  size="lg"
  onClick={() => navigate('/servicios')}
  className="btn-uppercase"
>
  Ver Servicios
</Button>
```

### Botón con Icono
```jsx
<Button
  variant="primary"
  size="md"
  icon={<span className="material-symbols-outlined">add</span>}
  iconPosition="left"
>
  Agregar
</Button>
```

### Botón Outline
```jsx
<Button
  variant="outline"
  size="md"
  className="border-primary/50 text-primary hover:bg-primary/10"
>
  Más Información
</Button>
```

### Botón Ancho Completo
```jsx
<Button
  variant="primary"
  size="lg"
  fullWidth
>
  Comenzar Ahora
</Button>
```

---

## 🃏 Card Component

### Card con Imagen
```jsx
<Card
  title="Automatización de Workflows"
  description="Eliminamos cuellos de botella..."
  image="/path/to/image.jpg"
  hover={true}
  onClick={() => navigate('/servicio')}
>
  <p>Contenido adicional de la card</p>
</Card>
```

### Card Gradient (Pricing)
```jsx
<Card
  title="Plan Profesional"
  className="card-gradient"
>
  <p className="text-2xl font-bold">$150/mes</p>
  <ul>
    <li>Feature 1</li>
    <li>Feature 2</li>
  </ul>
  <Button variant="primary" fullWidth>Comenzar</Button>
</Card>
```

### Card con Imagen de Fondo
```jsx
<Card
  title="Título"
  description="Descripción"
  imagePosition="background"
>
  <p>Texto sobre la imagen</p>
</Card>
```

---

## 📄 Section Component

### Sección Básica
```jsx
import Section from './ui/Section';

<Section
  title="Nuestros Servicios"
  subtitle="Transformamos tu negocio con IA"
  background="dark"
  spaced={true}
  centered={true}
  id="servicios"
>
  <div className="grid gap-8">
    {/* Contenido */}
  </div>
</Section>
```

### Sección con Gradient Background
```jsx
<Section
  title="Planes y Precios"
  background="gradient"
>
  {/* Contenido */}
</Section>
```

---

## 🎯 Patrones Comunes

### Hero Section Pattern
```jsx
<section className="relative overflow-hidden pt-20 pb-32 section-gradient">
  <ParticleBackground />

  <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
    {/* Texto */}
    <div className="flex flex-col gap-8">
      <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-primary/10 border border-primary/30">
        <span className="material-symbols-outlined text-primary">bolt</span>
        <span className="text-primary text-sm font-bold uppercase tracking-widest">Badge</span>
      </div>

      <h1 className="font-michroma text-4xl md:text-6xl text-white leading-tight uppercase">
        TÍTULO PRINCIPAL <br />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">GRADIENTE</span>
      </h1>

      <p className="font-montserrat text-lg md:text-xl text-slate-400 max-w-2xl leading-relaxed">
        Descripción de la sección hero con texto responsivo.
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        <Button variant="primary" size="lg" className="btn-uppercase shadow-glow-primary">
          CTA Principal
        </Button>
        <Button variant="outline" size="lg" className="btn-uppercase">
          CTA Secundario
        </Button>
      </div>
    </div>

    {/* Ilustración */}
    <div className="relative">
      {/* Contenido visual */}
    </div>
  </div>
</section>
```

### Pricing Card Pattern
```jsx
<div className="group relative flex flex-col card-gradient rounded-xl p-6 md:p-8 transition-all duration-300 hover:shadow-glow-primary">
  {/* Badge Popular */}
  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
    <span className="px-4 py-1 text-[10px] font-bold uppercase tracking-widest text-white rounded-full bg-gradient-to-r from-primary to-accent">
      Más Popular
    </span>
  </div>

  {/* Header */}
  <div className="mb-8">
    <div className="inline-flex items-center gap-2 mb-2">
      <span className="text-xs font-bold uppercase tracking-widest text-primary">Plan</span>
      <span className="px-2 py-0.5 text-[9px] font-bold uppercase...bg-gradient...">-40%</span>
    </div>
    <div className="mt-4 flex items-end gap-2">
      <span className="font-michroma text-4xl text-white">$150</span>
      <span className="text-slate-400 text-sm mb-1">/mes</span>
    </div>
    <p className="text-slate-400 text-sm mt-4 leading-relaxed">
      Descripción del plan...
    </p>
  </div>

  <div className="h-px mb-8 bg-primary/20" />

  {/* Features */}
  <ul className="flex flex-col gap-4 flex-1">
    {features.map((feat, i) => (
      <li key={i} className="flex items-start gap-3 text-sm">
        <span className="material-symbols-outlined text-primary text-sm flex-shrink-0">
          check_circle
        </span>
        {feat}
      </li>
    ))}
  </ul>

  <Button variant="primary" fullWidth className="mt-8">
    Comenzar
  </Button>
</div>
```

### Stats Section Pattern
```jsx
<section className="py-16 md:py-24 bg-navy-darker relative">
  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />

  <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
    <AnimatedStat
      label="Procesos Optimizados"
      value={5}
      suffix="+"
      icon="check_circle"
      color="primary"
    />
    <AnimatedStat
      label="Eficiencia"
      value={95}
      suffix="%"
      icon="trending_up"
      color="accent"
    />
    {/* más stats... */}
  </div>
</section>
```

---

## 🎨 Utilidades CSS Comunes

### Gradients
```css
/* Text gradient */
className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent"

/* Button gradient */
className="bg-gradient-to-r from-primary to-accent"

/* Border gradient (cards) */
className="border-primary/40" /* con hover */
```

### Glow Effects
```css
/* Shadow glow primary */
className="shadow-glow-primary hover:shadow-glow-accent"

/* Glow custom */
className="[box-shadow:0_0_15px_rgba(13,127,242,0.4)]"
```

### Backgrounds
```css
className="bg-navy-darker"           /* #0a0f14 */
className="bg-background-dark"      /* #0D1B2A */
className="bg-navy-light"           /* #172033 */
```

---

## 📐 Responsive Tips

### Mobile First
```jsx
// Mobile (default)
className="py-8"

// Tablet (md: 768px)
className="md:py-12"

// Desktop (lg: 1024px)
className="lg:py-16"

// Wide (xl: 1280px)
className="xl:py-20"
```

### Grid Layout
```jsx
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
```

### Typography
```jsx
className="text-xl md:text-2xl lg:text-3xl font-michroma"
```

---

## ⚡ Animations con Framer Motion

### Fade In Up (Reusable)
```jsx
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } }
};

<motion.div
  initial="hidden"
  whileInView="visible"
  viewport={{ once: false, amount: 0.2 }}
  variants={fadeInUp}
>
  Contenido
</motion.div>
```

### Stagger Container
```jsx
const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.3 }
  }
};

<motion.div variants={staggerContainer}>
  {items.map(item => (
    <motion.div key={item.id} variants={fadeInUp}>
      {item.content}
    </motion.div>
  ))}
</motion.div>
```

---

## 🎯 Accesibilidad Checklist

- [ ] **Buttons:** `aria-label` si no tienen texto visible
- [ ] **Links:** texto descriptivo (evitar "click aquí")
- [ ] **Images:** `alt` descriptivo o `alt=""` si decorativo
- [ ] **Forms:** `label` asociado o `aria-label`
- [ ] **Focus visible:** No remover outline sin alternative
- [ ] **Color contrast:** Verificar ratio 4.5:1 (texto normal), 3:1 (grande)
- [ ] **Reduced motion:** No usar `!important` en animations
- [ ] **Skip links:** Para páginas largas con header complejo

---

## 🐛 Troubleshooting

### Problema: Tailwind classes no aplican
**Solución:** Verificar que `design-tokens.css` esté importado en `App.jsx` antes que otros estilos.

### Problema: Gradients no se ven
**Solución:** Revisar que Tailwind esté configurado con `background-clip: text` y `-webkit-background-clip`.

### Problema: AnimatedStat tooltip no aparece
**Solución:** Verificar que el parent tenga `position: relative` y `z-index` suficiente.

### Problema: ServiceCard3D rotate muy sensible
**Solución:** Ajustar el multiplicador en `x.set(xRot * 5)` → `x.set(xRot * 3)` (menos grados).

### Problema: Líneas proceso no animan
**Solución:** Asegurarse que `isLast={false}` en todos excepto el último step.

---

## 📚 Recursos

- **Design Tokens:** `/frontend/src/styles/design-tokens.css`
- **Componentes UI:** `/frontend/src/components/ui/`
- **Variables:** Usar `var(--token-name)` en CSS o clases utilitarias
- **Nuevos colores:** Añadir en `:root` de `design-tokens.css`

---

**Nota:** Este archivo es una guía rápida. Para detalles completos, ver el README.md de cada componente.
