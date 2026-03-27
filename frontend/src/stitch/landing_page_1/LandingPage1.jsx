import { Link, useNavigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { motion, useScroll, useTransform, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import { useEffect, useState, useRef, useCallback } from 'react';
import ROICalculator from '../pricing_page/ROICalculator';

// Lazy loaded components (below the fold)
const MouseSpotlight = lazy(() => import('../../components/MouseSpotlight'));
const AnimatedStatsGroup = lazy(() => import('../../components/AnimatedStatsGroup'));
const ServiceCard3D = lazy(() => import('../../components/ServiceCard3D'));
const ExamplesSection = lazy(() => import('./ExamplesSection'));
const ObjectionBuster = lazy(() => import('./ObjectionBuster'));
const FAQSection = lazy(() => import('./FAQSection'));
const ProcessAnimation = lazy(() => import('../../components/ProcessAnimation'));
const ExpandableCard = lazy(() => import('../../components/ExpandableCard'));
import SEO from '../../components/SEO';

// ─────────────────────────────────────────────────────────────
// TYPING HOOK (optimizado — sin animación por caracter)
// ─────────────────────────────────────────────────────────────
function useTypingEffect(words, { typingSpeed = 80, deletingSpeed = 40, pauseTime = 2500 } = {}) {
  const [state, setState] = useState({ text: '', wordIndex: 0, deleting: false });

  useEffect(() => {
    const { text, wordIndex, deleting } = state;
    const current = words[wordIndex];
    const isComplete = !deleting && text === current;
    const isEmpty = deleting && text === '';

    const delay = isComplete ? pauseTime : isEmpty ? 400 : deleting ? deletingSpeed : typingSpeed;

    const t = setTimeout(() => {
      if (isComplete) return setState(s => ({ ...s, deleting: true }));
      if (isEmpty) return setState(s => ({ ...s, deleting: false, wordIndex: (s.wordIndex + 1) % words.length }));
      setState(s => ({
        ...s,
        text: deleting ? current.slice(0, s.text.length - 1) : current.slice(0, s.text.length + 1),
      }));
    }, delay);

    return () => clearTimeout(t);
  }, [state, words, typingSpeed, deletingSpeed, pauseTime]);

  return state;
}

// ─────────────────────────────────────────────────────────────
// MAGNETIC BUTTON
// ─────────────────────────────────────────────────────────────
function MagneticButton({ children, className, onClick, style }) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 20 });
  const sy = useSpring(y, { stiffness: 200, damping: 20 });

  const handleMove = (e) => {
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - rect.left - rect.width / 2) * 0.3);
    y.set((e.clientY - rect.top - rect.height / 2) * 0.3);
  };

  return (
    <motion.button
      ref={ref}
      style={{ x: sx, y: sy, ...style }}
      onMouseMove={handleMove}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      onClick={onClick}
      whileTap={{ scale: 0.96 }}
      className={className}
    >
      {children}
    </motion.button>
  );
}

// ─────────────────────────────────────────────────────────────
// PLAN CARD — rediseñada con proporciones correctas
// ─────────────────────────────────────────────────────────────
function PlanCard({ title, tagline, price, period, setup, description, features, details, badge, badgeGradient, popular = false, ctaText, onCta }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      className="relative flex flex-col h-full"
      whileHover={{ y: popular ? -4 : -6 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
    >
      {/* Popular badge flotante */}
      {popular && badge && (
        <div className="absolute -top-3.5 left-0 right-0 flex justify-center z-20">
          <span
            className="px-5 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-white rounded-full shadow-lg"
            style={{ background: badgeGradient }}
          >
            {badge}
          </span>
        </div>
      )}

      <div
        className={`relative flex flex-col h-full rounded-2xl border transition-all duration-300 overflow-hidden ${
          popular
            ? 'border-violet-500/60 bg-gradient-to-b from-slate-900 to-slate-950 shadow-2xl shadow-violet-500/10'
            : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
        }`}
      >
        {/* Glow interno para el popular */}
        {popular && (
          <div className="absolute inset-0 bg-gradient-to-b from-violet-500/5 via-transparent to-blue-500/5 pointer-events-none" />
        )}

        {/* Línea superior coloreada */}
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{ background: popular ? badgeGradient : 'linear-gradient(90deg, transparent, rgba(100,116,139,0.3), transparent)' }}
        />

        <div className="relative z-10 flex flex-col h-full p-7">
          {/* Header */}
          <div className="mb-6">
            <p className={`text-[10px] font-bold uppercase tracking-[0.2em] mb-3 font-montserrat ${popular ? 'text-violet-400' : 'text-slate-500'}`}>
              {tagline}
            </p>
            <h3 className="font-michroma text-2xl text-white mb-4">{title}</h3>
            <div className="flex items-baseline gap-1.5 mb-1">
              <span className="font-michroma text-5xl text-white tracking-tight">{price}</span>
              <span className={`text-sm font-montserrat ${popular ? 'text-violet-400' : 'text-slate-500'}`}>{period}</span>
            </div>
            <p className="text-xs text-slate-600 font-montserrat mt-1">{setup}</p>
          </div>

          <p className={`text-sm font-montserrat leading-relaxed mb-6 ${popular ? 'text-slate-300' : 'text-slate-400'}`}>
            {description}
          </p>

          {/* Divider */}
          <div className={`h-px mb-6 ${popular ? 'bg-violet-500/20' : 'bg-slate-800'}`} />

          {/* Features */}
          <div className="space-y-3 mb-6 flex-1">
            {features.map((feature, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <div className={`mt-0.5 size-4 rounded-full flex items-center justify-center flex-shrink-0 ${popular ? 'bg-violet-500/20' : 'bg-emerald-500/10'}`}>
                  <span className={`material-symbols-outlined text-[11px] ${popular ? 'text-violet-400' : 'text-emerald-400'}`}>
                    check
                  </span>
                </div>
                <span className={`text-sm font-montserrat leading-snug ${popular ? 'text-white' : 'text-slate-300'}`}>
                  {feature}
                </span>
              </div>
            ))}
          </div>

          {/* Ver detalles expandible */}
          {details?.length > 0 && (
            <button
              onClick={() => setExpanded(e => !e)}
              className="text-xs text-slate-500 hover:text-slate-300 transition-colors mb-4 font-montserrat flex items-center gap-1 w-fit"
            >
              <span className="material-symbols-outlined text-sm">
                {expanded ? 'expand_less' : 'expand_more'}
              </span>
              {expanded ? 'Ocultar detalles' : 'Ver qué incluye exactamente'}
            </button>
          )}

          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden mb-4"
              >
                <div className="space-y-2 pb-2">
                  {details.map((item, idx) => (
                    <div key={idx} className="p-3 bg-slate-800/50 rounded-lg border border-slate-700/50">
                      <p className="text-white text-xs font-bold mb-1 font-montserrat">{item.title}</p>
                      <p className="text-slate-400 text-xs leading-relaxed font-montserrat">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* CTA */}
          <button
            onClick={onCta}
            className={`w-full py-3.5 px-6 font-montserrat text-xs font-bold uppercase tracking-[0.15em] rounded-xl transition-all duration-300 ${
              popular
                ? 'text-white shadow-lg hover:shadow-violet-500/25 hover:opacity-90 active:scale-98'
                : 'border border-slate-700 text-slate-300 hover:border-blue-500/50 hover:text-blue-400 hover:bg-blue-500/5'
            }`}
            style={popular ? { background: badgeGradient } : {}}
          >
            {ctaText}
          </button>

          {/* Non-popular badge */}
          {!popular && badge && (
            <p
              className="text-[10px] text-center mt-3 font-montserrat font-semibold"
              style={{ background: badgeGradient, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
            >
              {badge}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────
// HERO VISUAL — dashboard animado
// ─────────────────────────────────────────────────────────────
function HeroVisual() {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const i = setInterval(() => setTick(t => t + 1), 2000);
    return () => clearInterval(i);
  }, []);

  const messages = [
    { from: 'user', text: '¿Tienen cita el jueves?' },
    { from: 'bot', text: '¡Claro! Te confirmo el jueves a las 4pm 📅' },
    { from: 'system', text: 'Cita creada · Recordatorio enviado' },
  ];

  const visibleMessages = Math.min(Math.floor(tick / 1) + 1, messages.length);

  return (
    <div className="relative w-full max-w-md mx-auto">
      {/* Glows ambientales */}
      <div className="absolute -inset-8 bg-blue-500/8 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-8 -right-8 w-48 h-48 bg-violet-500/10 blur-3xl rounded-full pointer-events-none" />

      {/* Card principal */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="relative bg-slate-900/80 border border-slate-700/60 rounded-2xl overflow-hidden backdrop-blur-xl shadow-2xl"
      >
        {/* Barra superior */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-800 bg-slate-900/50">
          <div className="size-2.5 rounded-full bg-red-500/70" />
          <div className="size-2.5 rounded-full bg-yellow-500/70" />
          <div className="size-2.5 rounded-full bg-green-500/70" />
          <span className="ml-2 text-[10px] text-slate-500 font-mono">JAV LABS · Automation Hub</span>
          <div className="ml-auto flex items-center gap-1.5">
            <div className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] text-emerald-400 font-mono">LIVE</span>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 divide-x divide-slate-800 border-b border-slate-800">
          {[
            { label: 'Mensajes hoy', value: '1,284', color: 'text-blue-400' },
            { label: 'Conversiones', value: '94.2%', color: 'text-emerald-400' },
            { label: 'Horas ahorradas', value: '18.5h', color: 'text-violet-400' },
          ].map((stat) => (
            <div key={stat.label} className="px-4 py-3 text-center">
              <p className={`font-mono text-base font-bold ${stat.color}`}>{stat.value}</p>
              <p className="text-[10px] text-slate-600 mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Chat simulado */}
        <div className="p-4 space-y-3 min-h-[160px]">
          <AnimatePresence>
            {messages.slice(0, visibleMessages).map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.35, delay: 0.05 }}
                className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.from === 'system' ? (
                  <div className="mx-auto flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                    <span className="material-symbols-outlined text-emerald-400 text-xs">check_circle</span>
                    <span className="text-[11px] text-emerald-400 font-mono">{msg.text}</span>
                  </div>
                ) : (
                  <div
                    className={`max-w-[80%] px-3 py-2 rounded-xl text-xs font-montserrat leading-relaxed ${
                      msg.from === 'user'
                        ? 'bg-blue-600/30 border border-blue-500/30 text-blue-100'
                        : 'bg-slate-800 border border-slate-700 text-slate-200'
                    }`}
                  >
                    {msg.from === 'bot' && (
                      <div className="flex items-center gap-1.5 mb-1">
                        <div className="size-4 rounded-full bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center">
                          <span className="material-symbols-outlined text-[8px] text-white">smart_toy</span>
                        </div>
                        <span className="text-[9px] text-slate-500">IA Asistente</span>
                      </div>
                    )}
                    {msg.text}
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Typing indicator cuando espera */}
          {visibleMessages < messages.length && (
            <div className="flex justify-start">
              <div className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl flex items-center gap-1">
                {[0, 1, 2].map(i => (
                  <motion.div
                    key={i}
                    className="size-1.5 rounded-full bg-slate-400"
                    animate={{ scale: [1, 1.4, 1], opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.2 }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer del dashboard */}
        <div className="px-4 py-3 border-t border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-slate-600 text-sm">schedule</span>
            <span className="text-[10px] text-slate-600 font-mono">Próximo: Recordatorio en 2h</span>
          </div>
          <div
            className="px-2 py-0.5 text-[10px] font-bold rounded text-white font-montserrat"
            style={{ background: 'linear-gradient(90deg, #0d7ff2, #8b5cf6)' }}
          >
            AUTO
          </div>
        </div>
      </motion.div>

      {/* Floating badges */}
      <motion.div
        initial={{ opacity: 0, x: 20, y: 10 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="absolute -right-6 top-16 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 shadow-xl"
      >
        <div className="flex items-center gap-2">
          <div className="size-6 rounded-lg bg-emerald-500/20 flex items-center justify-center">
            <span className="material-symbols-outlined text-emerald-400 text-sm">trending_up</span>
          </div>
          <div>
            <p className="text-white text-xs font-bold font-mono">+32%</p>
            <p className="text-slate-500 text-[10px]">conversiones</p>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: -20, y: -10 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ delay: 1.5, duration: 0.6 }}
        className="absolute -left-6 bottom-20 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 shadow-xl"
      >
        <div className="flex items-center gap-2">
          <div className="size-6 rounded-lg bg-blue-500/20 flex items-center justify-center">
            <span className="material-symbols-outlined text-blue-400 text-sm">bolt</span>
          </div>
          <div>
            <p className="text-white text-xs font-bold font-mono">24/7</p>
            <p className="text-slate-500 text-[10px]">sin descanso</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// MAIN LANDING
// ─────────────────────────────────────────────────────────────
export default function LandingPage1() {
  const navigate = useNavigate();
  const { scrollYProgress } = useScroll();
  const heroParallax = useTransform(scrollYProgress, [0, 0.3], [0, -60]);

  const heroWords = ['AUTOMATIZA TU NEGOCIO.', 'RECUPERA 20+ HORAS.', 'ESCALA SIN LÍMITES.'];
  const { text: typedText, wordIndex } = useTypingEffect(heroWords, { typingSpeed: 75, deletingSpeed: 35, pauseTime: 2800 });

  const stats = [
    { label: 'Horas Ahorradas', value: 2000, suffix: '+', icon: 'schedule', color: 'primary' },
    { label: 'Automatizaciones Activas', value: 150, suffix: '+', icon: 'auto_awesome', color: 'accent' },
    { label: 'Semanas de Implementación', value: 3, suffix: '', icon: 'rocket_launch', color: 'primary' },
    { label: 'Soporte Garantizado', value: 100, suffix: '%', icon: 'support_agent', color: 'success' },
  ];

  const services = [
    { icon: 'account_tree', title: 'Automatización de Workflows', desc: 'Eliminamos cuellos de botella mediante flujos de trabajo inteligentes que conectan todas tus herramientas de negocio.', color: 'primary' },
    { icon: 'psychology', title: 'IA Generativa Aplicada', desc: 'Implementación de LLMs y agentes autónomos para atención al cliente, creación de contenido y análisis de datos.', color: 'accent' },
    { icon: 'terminal', title: 'Consultoría IT Estratégica', desc: 'Diseñamos la hoja de ruta tecnológica para que tu infraestructura crezca al ritmo de tu visión empresarial.', color: 'primary' },
  ];

  const fadeInUp = { hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } } };
  const fadeIn = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.6 } } };
  const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.12, delayChildren: 0.2 } } };
  const scaleIn = { hidden: { opacity: 0, scale: 0.92 }, visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } } };

  // FAQ para Structured Data
  const landingFaqs = [
    {
      question: '¿Cuánto tiempo toma implementar una automatización?',
      answer: 'Los proyectos básicos se despliegan en 2-3 semanas. Soluciones Enterprise pueden tomar 2-4 meses dependiendo de la complejidad.'
    },
    {
      question: '¿Es necesario reemplazar mis herramientas actuales?',
      answer: 'No. Nuestra especialidad es la integración. Trabajamos sobre tu stack tecnológico actual (Salesforce, Hubspot, SAP, etc.) sin fricciones.'
    },
    {
      question: '¿Ofrecen garantía de ROI?',
      answer: 'Sí. En automatizaciones estándar garantizamos retorno medible en los primeros 90 días o extendemos el soporte sin costo adicional.'
    },
    {
      question: '¿Mis datos están seguros?',
      answer: 'Totalmente. Todos los datos se almacenan con encriptación. No vendemos ni compartimos tu información. Tienes acceso completo para exportar.'
    },
    {
      question: '¿Necesito saber programar?',
      answer: 'NO. Tú solo participas en diagnóstico, aprobación y uso. Nosotros desarrollamos, implementamos y mantenemos todo.'
    }
  ];

  return (
    <>
      <SEO
        title="Automatización con IA para Empresas Ecuador | JAV LABS"
        description="JAV LABS - Agencia de automatización con IA en Ecuador. Recupera 20+ horas semanales con workflows automatizados, integraciones n8n y agentes de IA. Implementación en 2-3 semanas."
        ogTitle="Automatización con IA para Empresas | JAV LABS Ecuador"
        ogDescription="Automatiza procesos empresariales con IA. +2000 horas ahorradas, 150+ automatizaciones activas. Consultoría especializada en n8n, WhatsApp Business y agentes autónomos."
        ogImage="/Logo2.png"
        canonicalUrl="/"
        breadcrumbItems={[{ name: 'Inicio', url: '/' }]}
        faqSchema={landingFaqs}
      />
      <MouseSpotlight size={400} opacity={0.06} color="#0d7ff2" />

      {/* ═══════════════════════════════════════ HERO ═══ */}
      <section className="relative overflow-hidden pt-20 pb-24 min-h-screen flex items-center" style={{ background: 'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(13,127,242,0.12) 0%, transparent 60%), #020817' }}>
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)', backgroundSize: '60px 60px' }}
        />

        {/* Orbs */}
        <motion.div style={{ y: heroParallax }} className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/8 blur-[120px] rounded-full" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-violet-600/8 blur-[100px] rounded-full" />
        </motion.div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            {/* TEXT */}
            <motion.div initial="hidden" animate="visible" variants={stagger} className="flex flex-col gap-7">
              <motion.div variants={fadeIn}>
                <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border text-sm font-bold uppercase tracking-widest font-montserrat" style={{ background: 'rgba(13,127,242,0.08)', borderColor: 'rgba(13,127,242,0.3)', color: '#0d7ff2' }}>
                  <span className="material-symbols-outlined text-base">auto_fix_high</span>
                  Automatización Completa
                </div>
              </motion.div>

              <motion.div variants={fadeInUp} className="space-y-2">
                <h1 className="font-michroma text-4xl md:text-5xl lg:text-[3.4rem] text-white leading-[1.1] tracking-tight">
                  {typedText}
                  <span className="inline-block w-0.5 h-[1em] bg-blue-400 ml-1 align-middle animate-pulse" />
                </h1>
                <h2 className="font-michroma text-3xl md:text-4xl lg:text-[2.6rem] leading-[1.15] tracking-tight">
                  <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(90deg, #0d7ff2, #8b5cf6, #b06ab3)' }}>
                    CON INTELIGENCIA ARTIFICIAL.
                  </span>
                </h2>
              </motion.div>

              <motion.p variants={fadeInUp} className="font-montserrat text-lg text-slate-400 max-w-lg leading-relaxed">
                Deja que la tecnología trabaje por ti. Automatiza tareas, vende más, y recupera tiempo valioso.
                <span className="text-white font-semibold"> Creamos, implementamos y mantenemos todo</span> — sin que toques código.
              </motion.p>

              <motion.div variants={fadeInUp} className="flex flex-wrap items-center gap-5">
                {[
                  { icon: 'schedule', text: '2-4 semanas implementación' },
                  { icon: 'support_agent', text: 'Soporte 24/7' },
                  { icon: 'verified', text: 'Sin permanencia' },
                ].map((item) => (
                  <div key={item.text} className="flex items-center gap-2 text-slate-400 text-sm font-montserrat">
                    <span className="material-symbols-outlined text-blue-400 text-base">{item.icon}</span>
                    {item.text}
                  </div>
                ))}
              </motion.div>

              <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-3 pt-1">
                <MagneticButton
                  onClick={() => document.getElementById('ejemplos')?.scrollIntoView({ behavior: 'smooth' })}
                  className="px-8 py-4 text-sm font-bold uppercase tracking-widest text-white rounded-xl flex items-center justify-center gap-2 shadow-xl transition-all duration-300"
                  style={{ background: 'linear-gradient(135deg, #0d7ff2, #8b5cf6)', boxShadow: '0 0 30px rgba(13,127,242,0.3)' }}
                >
                  <span className="material-symbols-outlined text-base">play_circle</span>
                  Ver Cómo Funciona
                </MagneticButton>
                <button
                  onClick={() => document.getElementById('precios')?.scrollIntoView({ behavior: 'smooth' })}
                  className="px-8 py-4 text-sm font-bold uppercase tracking-widest border border-slate-700 text-slate-300 hover:border-blue-500/50 hover:text-blue-400 hover:bg-blue-500/5 transition-all rounded-xl flex items-center justify-center gap-2 font-montserrat"
                >
                  <span className="material-symbols-outlined text-base">payments</span>
                  Ver Precios
                </button>
              </motion.div>
            </motion.div>

            {/* VISUAL */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.9, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="hidden lg:block"
            >
              <HeroVisual />
            </motion.div>

          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-[10px] text-slate-600 uppercase tracking-widest font-montserrat">Scroll</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="size-5 rounded-full border border-slate-700 flex items-center justify-center"
          >
            <div className="size-1 rounded-full bg-slate-500" />
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════ STATS ═══ */}
      <section className="relative py-16 border-y border-slate-800/50" style={{ background: 'linear-gradient(180deg, #020817 0%, #0a0f1e 100%)' }}>
        <div className="max-w-7xl mx-auto px-6">
          <AnimatedStatsGroup stats={stats.map(s => ({ ...s, suffix: s.suffix || '' }))} />
        </div>
      </section>

      {/* ═══════════════════════════════════════ TECH STRIP ═══ */}
      <section className="py-16 overflow-hidden border-b border-slate-800/50" style={{ background: '#0a0f1e' }}>
        <div className="max-w-7xl mx-auto px-6 text-center mb-10">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-slate-600 text-[10px] uppercase tracking-[0.35em] font-montserrat mb-2"
          >
            Infraestructura moderna y escalable
          </motion.p>
          <motion.h3
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-white font-michroma text-lg uppercase tracking-wider"
          >
            Tecnologías que dominamos
          </motion.h3>
        </div>

        <div className="relative w-full overflow-hidden">
          <div className="pointer-events-none absolute left-0 top-0 h-full w-24 z-10" style={{ background: 'linear-gradient(90deg, #0a0f1e, transparent)' }} />
          <div className="pointer-events-none absolute right-0 top-0 h-full w-24 z-10" style={{ background: 'linear-gradient(-90deg, #0a0f1e, transparent)' }} />
          <div className="flex gap-14 animate-marquee items-center">
            {['/logos/n8n.png', '/logos/supabase.png', '/logos/redis.png', '/logos/docker.png', '/logos/easypanel.png', '/logos/hostinger.png', '/logos/chatwoot.png', '/logos/whatsapp.png', '/logos/instagram.png', '/logos/meta.png', '/logos/messenger.png', '/logos/python.png', '/logos/json.png'].map((src, i) => (
              <motion.div key={i} className="tech-logo opacity-40 hover:opacity-80 transition-opacity duration-300" whileHover={{ scale: 1.1 }}>
                <img
                  src={src}
                  alt={`${['n8n','supabase','redis','docker','easypanel','hostinger','chatwoot','whatsapp','instagram','meta','messenger','python','json'][i]} logo`}
                  width={40}
                  height={40}
                  loading="lazy"
                  className="h-10 w-auto object-contain filter grayscale hover:grayscale-0 transition-all duration-300"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════ ¿QUÉ ES? ═══ */}
      <section id="que-es" className="py-28" style={{ background: '#020817' }}>
        <div className="max-w-7xl mx-auto px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={fadeInUp} className="mb-16 text-center">
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border mb-6 text-sm font-bold uppercase tracking-widest font-montserrat" style={{ background: 'rgba(13,127,242,0.08)', borderColor: 'rgba(13,127,242,0.3)', color: '#0d7ff2' }}>
              <span className="material-symbols-outlined text-base">lightbulb</span>
              Conceptos Clave
            </div>
            <h2 className="font-michroma text-3xl md:text-4xl text-white mb-4 leading-tight">
              ¿Qué significa exactamente{' '}
              <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(90deg, #0d7ff2, #8b5cf6)' }}>
                "automatización completa"
              </span>?
            </h2>
            <p className="font-montserrat text-lg text-slate-400 max-w-2xl mx-auto">
              Tres conceptos clave para entender exactamente qué obtienes.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {[
              {
                title: 'No es un "flujo" — es un SISTEMA INTELIGENTE',
                icon: 'smart_toy',
                accentColor: '#0d7ff2',
                desc: 'Piensa en esto como tu empleado digital que nunca duerme, nunca comete errores, y trabaja 24/7.',
                items: [
                  { icon: 'chat', label: 'Responder consultas automáticamente', color: 'text-emerald-400', bg: 'bg-emerald-400/8 border-emerald-400/15' },
                  { icon: 'event', label: 'Agendar citas sin intervención humana', color: 'text-blue-400', bg: 'bg-blue-400/8 border-blue-400/15' },
                  { icon: 'notifications', label: 'Enviar recordatorios y seguimientos', color: 'text-violet-400', bg: 'bg-violet-400/8 border-violet-400/15' },
                  { icon: 'mail', label: 'Capturar leads de web o WhatsApp', color: 'text-orange-400', bg: 'bg-orange-400/8 border-orange-400/15' },
                ],
                tip: { icon: 'auto_awesome', color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20', text: 'Un cliente escribe "¿tienes el jueves a las 4pm?" → el sistema revisa tu calendario, confirma y agenda automáticamente.' },
              },
              {
                title: '¿Qué son las "ejecuciones"?',
                icon: 'play_circle',
                accentColor: '#8b5cf6',
                desc: 'Es CADA VEZ que el sistema realiza una acción por ti. Son eventos medibles y concretos.',
                items: [
                  { icon: 'chat', label: '1 mensaje respondido = 1 ejecución', color: 'text-emerald-400', bg: 'bg-emerald-400/8 border-emerald-400/15' },
                  { icon: 'payments', label: '1 pago procesado = 1 ejecución', color: 'text-blue-400', bg: 'bg-blue-400/8 border-blue-400/15' },
                  { icon: 'receipt_long', label: '1 factura enviada = 1 ejecución', color: 'text-violet-400', bg: 'bg-violet-400/8 border-violet-400/15' },
                  { icon: 'event', label: '1 cita agendada = 1 ejecución', color: 'text-orange-400', bg: 'bg-orange-400/8 border-orange-400/15' },
                ],
                tip: { icon: 'lightbulb', color: 'text-violet-400', bg: 'bg-violet-500/10 border-violet-500/20', text: '1,000 ejecuciones/mes ≈ 500 mensajes + 300 pagos + 200 recordatorios. Cubre el 90% de negocios pequeños.' },
              },
              {
                title: 'Lo que SÍ incluye vs NO incluye',
                icon: 'balance',
                accentColor: '#0d7ff2',
                desc: 'Transparencia total sobre lo que incluye nuestro servicio desde el día 1.',
                items: [
                  { icon: 'build', label: 'Creamos y configuramos todo', color: 'text-emerald-400', bg: 'bg-emerald-400/8 border-emerald-400/15' },
                  { icon: 'link', label: 'Conectamos tus herramientas', color: 'text-emerald-400', bg: 'bg-emerald-400/8 border-emerald-400/15' },
                  { icon: 'support_agent', label: 'Soporte técnico 24/7', color: 'text-emerald-400', bg: 'bg-emerald-400/8 border-emerald-400/15' },
                  { icon: 'upgrade', label: 'Mejoras mensuales sin costo extra', color: 'text-emerald-400', bg: 'bg-emerald-400/8 border-emerald-400/15' },
                ],
                tip: { icon: 'verified', color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20', text: 'No vendemos acceso a herramientas. Te entregamos un sistema completo funcionando desde el día 1.' },
              },
            ].map((card, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -4 }}
                className="relative bg-slate-900/50 border border-slate-800 hover:border-slate-700 rounded-2xl p-6 flex flex-col gap-5 transition-colors duration-300"
              >
                {/* Accent line */}
                <div className="absolute top-0 left-6 right-6 h-px" style={{ background: `linear-gradient(90deg, transparent, ${card.accentColor}40, transparent)` }} />

                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-xl flex items-center justify-center" style={{ background: `${card.accentColor}15`, border: `1px solid ${card.accentColor}30` }}>
                    <span className="material-symbols-outlined text-base" style={{ color: card.accentColor }}>{card.icon}</span>
                  </div>
                  <h3 className="text-white font-michroma text-sm leading-snug flex-1">{card.title}</h3>
                </div>

                <p className="text-slate-400 text-sm font-montserrat leading-relaxed">{card.desc}</p>

                <div className="space-y-2">
                  {card.items.map((item, i) => (
                    <div key={i} className={`flex items-center gap-3 p-2.5 rounded-lg border ${item.bg} transition-all duration-200`}>
                      <span className={`material-symbols-outlined ${item.color} text-base`}>{item.icon}</span>
                      <span className="text-slate-200 text-xs font-montserrat">{item.label}</span>
                    </div>
                  ))}
                </div>

                <div className={`p-3 rounded-xl border ${card.tip.bg} flex items-start gap-3`}>
                  <span className={`material-symbols-outlined ${card.tip.color} text-sm mt-0.5 flex-shrink-0`}>{card.tip.icon}</span>
                  <p className="text-slate-300 text-xs font-montserrat leading-relaxed">{card.tip.text}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════ SERVICIOS ═══ */}
      <section id="servicios" className="py-28" style={{ background: '#0a0f1e' }}>
        <div className="max-w-7xl mx-auto px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={fadeInUp} className="mb-16 text-center">
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border mb-6 text-sm font-bold uppercase tracking-widest font-montserrat" style={{ background: 'rgba(13,127,242,0.08)', borderColor: 'rgba(13,127,242,0.3)', color: '#0d7ff2' }}>
              <span className="material-symbols-outlined text-base">auto_awesome</span>
              Qué Automatizamos
            </div>
            <h2 className="font-michroma text-3xl md:text-4xl text-white mb-4">
              Lo que podemos{' '}
              <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(90deg, #0d7ff2, #8b5cf6)' }}>
                automatizar por ti
              </span>
            </h2>
            <p className="font-montserrat text-lg text-slate-400 max-w-2xl mx-auto">
              Cada servicio es un sistema completo — no solo una herramienta.
            </p>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={stagger} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {services.map((service) => (
              <motion.div key={service.title} variants={scaleIn}>
                <ServiceCard3D icon={service.icon} title={service.title} description={service.desc} color={service.color} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════ PROCESO ═══ */}
      <section className="py-24" style={{ background: '#020817' }}>
        <div className="max-w-7xl mx-auto px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={fadeInUp} className="text-center mb-14">
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border mb-6 text-sm font-bold uppercase tracking-widest font-montserrat" style={{ background: 'rgba(13,127,242,0.08)', borderColor: 'rgba(13,127,242,0.3)', color: '#0d7ff2' }}>
              <span className="material-symbols-outlined text-base">timeline</span>
              Proceso
            </div>
            <h2 className="font-michroma text-3xl md:text-4xl text-white mb-4">
              Así creamos tu{' '}
              <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(90deg, #0d7ff2, #8b5cf6)' }}>
                sistema
              </span>
            </h2>
            <p className="font-montserrat text-lg text-slate-400 max-w-xl mx-auto">
              En 3 pasos simples, sin que tú toques código.
            </p>
          </motion.div>
          <ProcessAnimation />
        </div>
      </section>

      {/* ═══════════════════════════════════════ PRECIOS ═══ */}
      <section id="precios" className="py-28 relative overflow-hidden" style={{ background: '#0a0f1e' }}>
        <div className="absolute inset-0 opacity-[0.025] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #0d7ff2 1px, transparent 0)', backgroundSize: '48px 48px' }} />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-violet-600/5 blur-3xl rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={fadeInUp} className="text-center mb-16">
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border mb-6 text-sm font-bold uppercase tracking-widest font-montserrat" style={{ background: 'rgba(13,127,242,0.08)', borderColor: 'rgba(13,127,242,0.3)', color: '#0d7ff2' }}>
              <span className="material-symbols-outlined text-base">payments</span>
              Planes Transparentes
            </div>
            <h2 className="font-michroma text-3xl md:text-4xl text-white mb-4 leading-tight">
              Invierte en automatización,<br />no en salarios
            </h2>
            <p className="font-montserrat text-slate-400 max-w-xl mx-auto">
              Precios claros sin sorpresas. Elige el plan que se ajuste a tu volumen de trabajo.
            </p>
          </motion.div>

          {/* Grid de precios — sin scale que rompe proporciones */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start"
          >
            <motion.div variants={scaleIn}>
              <PlanCard
                title="INICIO"
                tagline="Para emprendedores"
                price="$72"
                period="/mes"
                setup="+ $210 setup único"
                description="Ideal para emprendedores que quieren automatizar su primera tarea y recuperar 15+ horas semanales."
                features={['1 sistema automatizado completo', 'Hasta 1,000 interacciones/mes', 'Integración con 1 canal', 'Google Calendar incluido', 'Soporte técnico básico', 'Panel de monitoreo']}
                details={[
                  { title: '1 Sistema automatizado completo', desc: 'Creamos y configuramos 1 automatización de principio a fin.' },
                  { title: 'Hasta 1,000 interacciones/mes', desc: '≈ 500 mensajes + 300 pagos + 200 recordatorios.' },
                  { title: 'Soporte básico', desc: 'Respuesta por email en menos de 24h.' },
                ]}
                badge="Ahorra hasta $828/mes"
                badgeGradient="linear-gradient(90deg, #0d7ff2, #8b5cf6)"
                popular={false}
                ctaText="Comenzar"
                onCta={() => navigate('/contacto')}
              />
            </motion.div>

            <motion.div variants={scaleIn}>
              <PlanCard
                title="CRECIMIENTO"
                tagline="Más popular"
                price="$150"
                period="/mes"
                setup="+ $420 setup único"
                description="Para negocios en crecimiento que automatizan 2-3 procesos y quieren un agente de IA personalizado."
                features={['Hasta 3 sistemas automatizados', 'Hasta 5,000 interacciones/mes', 'Multi-canal (WhatsApp + Email + Web)', 'Agente IA personalizado', 'Soporte prioritario 24/7', 'Optimización mensual gratis']}
                details={[
                  { title: '3 sistemas automatizados', desc: 'Tres automatizaciones independientes pero conectadas.' },
                  { title: '5,000 interacciones/mes', desc: '≈ 2,500 mensajes + 1,500 pagos + 1,000 notificaciones.' },
                  { title: 'Agente IA personalizado', desc: 'Entrenado con tu tono, vocabulario y catálogo de productos.' },
                ]}
                badge="MÁS POPULAR"
                badgeGradient="linear-gradient(90deg, #8b5cf6, #0d7ff2)"
                popular={true}
                ctaText="Comenzar"
                onCta={() => navigate('/contacto')}
              />
            </motion.div>

            <motion.div variants={scaleIn}>
              <PlanCard
                title="EMPRESARIAL"
                tagline="Para organizaciones"
                price="$240"
                period="/mes"
                setup="+ $720 setup único"
                description="Para organizaciones que necesitan automatización total, IA avanzada y soporte dedicado 24/7."
                features={['Flujos ilimitados', 'Hasta 20,000 interacciones/mes', 'Todos los canales', 'IA con NLP avanzado', 'Dashboard administrativo', 'SLA garantizado 24/7']}
                details={[
                  { title: 'Flujos ilimitados', desc: 'Ventas, onboarding, RRHH, reportes, integraciones ERP/CRM.' },
                  { title: '20,000 interacciones/mes', desc: 'Alto volumen o múltiples departamentos.' },
                  { title: 'Soporte dedicado', desc: 'Respuesta <1h, ingeniero asignado, SLA garantizado.' },
                ]}
                badge="Ahorra hasta $3,360/mes"
                badgeGradient="linear-gradient(90deg, #8b5cf6, #b06ab3)"
                popular={false}
                ctaText="Comenzar"
                onCta={() => navigate('/contacto')}
              />
            </motion.div>
          </motion.div>

          <ROICalculator />
        </div>
      </section>

      {/* ═══════════════════════════════════════ OBJECTIONS ═══ */}
      <ObjectionBuster />

      {/* ═══════════════════════════════════════ CTA FINAL ═══ */}
      <section className="py-24 px-6" style={{ background: '#020817' }}>
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="relative overflow-hidden rounded-3xl p-12 md:p-20 text-center border"
            style={{
              background: 'linear-gradient(135deg, rgba(13,127,242,0.08) 0%, rgba(139,92,246,0.08) 50%, rgba(176,106,179,0.06) 100%)',
              borderColor: 'rgba(139,92,246,0.25)',
            }}
          >
            {/* Glow corners */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-violet-500/10 blur-3xl rounded-full pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/10 blur-3xl rounded-full pointer-events-none" />

            {/* Top line */}
            <div className="absolute top-0 left-1/4 right-1/4 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(139,92,246,0.6), transparent)' }} />

            <div className="relative z-10 space-y-6">
              <p className="text-[10px] text-slate-500 uppercase tracking-[0.3em] font-montserrat">¿Listo para el siguiente nivel?</p>
              <h2 className="font-michroma text-3xl md:text-5xl text-white leading-tight">
                LLEVA TU NEGOCIO AL{' '}
                <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(90deg, #0d7ff2, #8b5cf6, #b06ab3)' }}>
                  FUTURO
                </span>
              </h2>
              <p className="font-montserrat text-lg text-slate-400 max-w-lg mx-auto leading-relaxed">
                Únete a las empresas que ya ahorran miles de horas de trabajo manual cada año.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                <MagneticButton
                  onClick={() => navigate('/contacto')}
                  className="px-10 py-4 text-sm font-bold uppercase tracking-widest text-white rounded-xl font-montserrat transition-all"
                  style={{ background: 'linear-gradient(135deg, #0d7ff2, #8b5cf6)', boxShadow: '0 0 40px rgba(139,92,246,0.3)' }}
                >
                  Hablemos de tu Proyecto
                </MagneticButton>
              </div>
              <p className="text-slate-600 text-xs font-montserrat">
                Te contactamos en menos de 24h · Sin compromiso
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}