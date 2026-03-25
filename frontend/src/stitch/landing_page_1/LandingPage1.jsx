import { Link, useNavigate } from 'react-router-dom';
import { motion, useInView, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';
import ROICalculator from '../pricing_page/ROICalculator';
import MouseSpotlight from '../../components/MouseSpotlight';
import AnimatedStatsGroup from '../../components/AnimatedStatsGroup';
import ServiceCard3D from '../../components/ServiceCard3D';
import useTypingEffect from '../../hooks/useTypingEffect';
import ExamplesSection from './ExamplesSection';
import ObjectionBuster from './ObjectionBuster';
import FAQSection from './FAQSection';
import ProcessAnimation from '../../components/ProcessAnimation';
import ExpandableCard from '../../components/ExpandableCard';

// Componente PlanCard para pricing cards con ExpandableCard
function PlanCard({
  title,
  tagline,
  price,
  period,
  setup,
  description,
  features,
  details,
  badge,
  badgeStyle = 'linear-gradient(90deg, #0d7ff2, #8b5cf6)',
  popular = false,
  ctaText,
  onCta
}) {
  const detailItems = details || [];

  return (
    <ExpandableCard
      icon="star"
      iconColor={popular ? "text-primary" : "text-accent"}
      iconBg={popular ? "bg-primary/10" : "bg-accent/10"}
      borderHover={popular ? "hover:border-primary/40" : "hover:border-accent/40"}
      expandedContent={
        <div className="space-y-4">
          {detailItems.map((item, idx) => (
            <div key={idx} className="p-4 bg-slate-900/50 rounded-lg border border-slate-700">
              <p className="text-white text-sm font-bold mb-2">{item.title}</p>
              <p className="text-slate-400 text-xs leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      }
      className={popular ? 'scale-105 z-10' : ''}
      popular={popular}
    >
      {/* Header del plan */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <span className={`text-xs font-bold uppercase tracking-widest ${popular ? 'text-primary' : 'text-slate-400'} font-montserrat`}>
            {tagline}
          </span>
          {badge && !popular && (
            <span className="px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest text-white rounded-full font-montserrat" style={{ background: badgeStyle }}>
              {badge}
            </span>
          )}
        </div>
        <h3 className={`font-michroma text-2xl mb-3 ${popular ? 'text-white' : 'text-white'}`}>
          {title}
        </h3>
        <div className="flex items-end gap-2 mb-2">
          <span className="font-michroma text-4xl text-white">{price}</span>
          <span className={`text-sm mb-1 ${popular ? 'text-primary' : 'text-slate-400'} font-montserrat`}>{period}</span>
        </div>
        <p className={`text-xs font-montserrat mt-1 ${popular ? 'text-primary/80' : 'text-slate-500'}`}>
          {setup}
        </p>
        <p className={`text-sm font-montserrat mt-3 leading-relaxed ${popular ? 'text-white' : 'text-slate-400'}`}>
          {description}
        </p>
      </div>

      {/* Separador */}
      <div className="h-px bg-slate-800 my-4" />

      {/* Features principales */}
      <div className="space-y-2 mb-6">
        {features.map((feature, idx) => (
          <div key={idx} className="flex items-start gap-3">
            <span className={`material-symbols-outlined ${popular ? 'text-primary' : 'text-green-400'} text-sm mt-0.5 flex-shrink-0`}>
              check_circle
            </span>
            <span className={`text-sm ${popular ? 'text-white' : 'text-slate-300'} font-montserrat leading-relaxed`}>
              {feature}
            </span>
          </div>
        ))}
      </div>

      {/* CTA Button */}
      <button
        onClick={onCta}
        className={`w-full py-3 px-6 font-montserrat text-xs font-bold uppercase tracking-widest rounded-lg transition-all duration-300 ${
          popular
            ? 'text-white shadow-lg hover:shadow-2xl hover:scale-105'
            : 'border border-slate-700 text-slate-300 hover:border-primary hover:text-primary hover:bg-primary/5'
        }`}
        style={popular ? { background: badgeStyle } : {}}
      >
        {ctaText}
      </button>

      {/* Badge popular */}
      {popular && badge && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <span className="px-4 py-1 text-[10px] font-bold uppercase tracking-widest text-white rounded-full font-montserrat" style={{ background: badgeStyle }}>
            {badge}
          </span>
        </div>
      )}
    </ExpandableCard>
  );
}
import './LandingPage1.css';

export default function LandingPage1() {
  const navigate = useNavigate();
  const { scrollYProgress } = useScroll();
  const { y: parallaxY } = useTransform(scrollYProgress, [0, 1], [0, -200]);

  // Hero typing effect - mensaje claro y directo para rewrite
  const heroWords = ["AUTOMATIZA TU NEGOCIO.", "RECUPERA 20+ HORAS SEMANALES."];
  const { displayedText, currentWordIndex, isDeleting } = useTypingEffect(heroWords, {
    typingSpeed: 80,
    deletingSpeed: 40,
    pauseTime: 2500
  });

  // Counter animation for stats - números más impresionantes y tangibles
  const stats = [
    { label: 'Horas Ahorradas', value: 2000, suffix: '+', icon: 'schedule', color: 'primary' },
    { label: 'Automatizaciones Activas', value: 150, suffix: '+', icon: 'auto_awesome', color: 'accent' },
    { label: 'Tiempo de Implementación', value: 3, suffix: ' sem', icon: 'rocket_launch', color: 'primary' },
    { label: 'Soporte 24/7', value: 100, suffix: '%', icon: 'support_agent', color: 'success' },
  ];

  // Services data
  const services = [
    {
      icon: 'account_tree',
      title: 'Automatización de Workflows',
      desc: 'Eliminamos cuellos de botella mediante flujos de trabajo inteligentes que conectan todas tus herramientas de negocio.',
      color: 'primary'
    },
    {
      icon: 'psychology',
      title: 'IA Generativa Aplicada',
      desc: 'Implementación de LLMs y agentes autónomos para atención al cliente, creación de contenido y análisis de datos avanzado.',
      color: 'accent'
    },
    {
      icon: 'terminal',
      title: 'Consultoría IT Estratégica',
      desc: 'Diseñamos la hoja de ruta tecnológica para que tu infraestructura crezca al ritmo de tu visión empresarial.',
      color: 'primary'
    }
  ];

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } }
  };

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.6 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.3 }
    }
  };

  const scaleIn = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: 'back.out(1.7)' } }
  };

  return (
    <>
      <MouseSpotlight size={400} opacity={0.08} color="#0d7ff2" />

      {/* ───── HERO ───── */}
      <section className="relative overflow-hidden pt-20 pb-32 section-gradient">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 blur-3xl rounded-full float-shape" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 blur-3xl rounded-full float-shape" />
          <div className="absolute top-1/2 left-1/3 w-48 h-48 bg-primary/5 blur-2xl rounded-full float-shape" />
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.2 }}
          variants={staggerContainer}
          className="relative z-10 max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center py-12"
        >
          {/* TEXT CONTENT */}
          <motion.div variants={fadeInUp} className="flex flex-col gap-6">
            <motion.div variants={fadeIn} className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 w-fit">
              <span className="material-symbols-outlined text-primary text-lg">auto_fix_high</span>
              <span className="text-primary text-sm font-bold uppercase tracking-widest font-montserrat">Automatización Completa</span>
            </motion.div>

            <motion.h1 variants={fadeInUp} className="font-michroma text-4xl md:text-5xl lg:text-6xl text-white leading-tight">
              {heroWords.map((word, i) => (
                <span key={i}>
                  {i === 1 && <br />}
                  {word.split('').map((char, charIndex) => (
                    <motion.span
                      key={`${i}-${charIndex}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{
                        opacity: charIndex < displayedText.length ? 1 : 0,
                        y: charIndex < displayedText.length ? 0 : 20
                      }}
                      transition={{ duration: 0.03 }}
                      className={i === 1 ? "text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent" : ""}
                    >
                      {char}
                    </motion.span>
                  ))}
                  {i === currentWordIndex && displayedText.length < word.length && (
                    <span className="typing-cursor" />
                  )}
                </span>
              ))}
            </motion.h1>

            <motion.p variants={fadeInUp} className="font-montserrat text-lg md:text-xl text-slate-400 max-w-xl leading-relaxed">
              Deja que la tecnología trabaje por ti. Automatiza tareas, vende más, y recupera tiempo valioso.
              <span className="text-white font-semibold"> Nosotros creamos, implementamos y mantenemos todo por ti</span> —
              sin que toques código.
            </motion.p>

            {/* Trust Indicators */}
            <motion.div variants={fadeInUp} className="flex flex-wrap items-center gap-6 pt-4">
              {[
                { icon: 'schedule', text: '2-4 semanas implementación' },
                { icon: 'support_agent', text: 'Soporte 24/7' },
                { icon: 'verified', text: 'Sin permanencia' }
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 text-slate-400 text-sm">
                  <span className="material-symbols-outlined text-primary text-base">{item.icon}</span>
                  <span className="font-montserrat">{item.text}</span>
                </div>
              ))}
            </motion.div>

            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                onClick={() => document.getElementById('ejemplos')?.scrollIntoView({ behavior: 'smooth' })}
                className="magnetic-btn px-8 py-4 text-sm font-bold uppercase tracking-widest text-white rounded-lg transition-all shadow-glow-primary hover:shadow-glow-accent flex items-center justify-center gap-2"
                style={{ background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%)' }}
              >
                <span className="material-symbols-outlined text-base">play_circle</span>
                Ver Cómo Funciona
              </button>
              <button
                onClick={() => document.getElementById('precios')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-8 py-4 text-sm font-bold uppercase tracking-widest border-2 border-primary/50 text-primary hover:bg-primary/10 hover:border-primary transition-all rounded-lg flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-base">payments</span>
                Ver Precios
              </button>
            </motion.div>
          </motion.div>

          {/* HERO VISUAL */}
          <motion.div
            variants={fadeIn}
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative hidden lg:flex items-center justify-center"
          >
            <div className="relative w-full aspect-square max-w-lg">
              <motion.div
                animate={{ y: parallaxY }}
                transition={{ type: "spring", stiffness: 50, damping: 20 }}
                className="relative w-full h-full rounded-2xl border border-slate-800 bg-navy-darker/40 overflow-hidden backdrop-blur-sm"
              >
                <div className="absolute inset-0 opacity-40">
                  <svg className="w-full h-full p-16 text-primary/30" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                    <motion.path
                      d="M20,100 L180,100 M100,20 L100,180 M60,60 L140,140 M140,60 L60,140"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="0.5"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 2, ease: "easeInOut" }}
                    />
                    <motion.circle
                      cx="100"
                      cy="100"
                      fill="none"
                      r="40"
                      stroke="currentColor"
                      strokeDasharray="4,4"
                      strokeWidth="1"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 2, delay: 0.5 }}
                    />
                    <motion.rect
                      fill="none"
                      height="60"
                      width="60"
                      x="70"
                      y="70"
                      stroke="currentColor"
                      strokeWidth="2"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 1.5, delay: 1 }}
                    />
                  </svg>
                </div>

                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 animate-pulse" />
              </motion.div>

              {/* Glow effects */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-accent/20 blur-[80px] rounded-full animate-pulse" />
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-primary/20 blur-[80px] rounded-full animate-pulse" />
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* ───── STATS ───── */}
      <section className="bg-navy-darker border-y border-slate-800 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6">
          <AnimatedStatsGroup stats={stats.map(s => ({...s, suffix: s.suffix || ''}))} />
        </div>
      </section>

      {/* ───── TECNOLOGÍAS ───── */}
      <section className="py-20 bg-background-dark overflow-hidden border-y border-slate-800 relative">
        <div className="max-w-7xl mx-auto px-6 text-center mb-12">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-slate-500 text-xs uppercase tracking-[0.3em] mb-2"
          >
            Tecnologías que utilizamos
          </motion.p>
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-white font-michroma text-xl uppercase"
          >
            Infraestructura moderna y escalable
          </motion.h3>
        </div>

        <div className="relative w-full overflow-hidden">
          <div className="pointer-events-none absolute left-0 top-0 h-full w-32 bg-gradient-to-r from-background-dark to-transparent z-10" />
          <div className="pointer-events-none absolute right-0 top-0 h-full w-32 bg-gradient-to-l from-background-dark to-transparent z-10" />

          <div className="flex gap-16 animate-marquee items-center">
            {[
              '/logos/n8n.png',
              '/logos/supabase.png',
              '/logos/redis.png',
              '/logos/docker.png',
              '/logos/easypanel.png',
              '/logos/hostinger.png',
              '/logos/chatwoot.png',
              '/logos/whatsapp.png',
              '/logos/instagram.png',
              '/logos/meta.png',
              '/logos/messenger.png',
              '/logos/python.png',
              '/logos/json.png'
            ].map((src, i) => (
              <motion.div
                key={i}
                className="tech-logo"
                whileHover={{ scale: 1.1, filter: 'grayscale(0%) opacity(1)' }}
                transition={{ duration: 0.3 }}
              >
                <img src={src} alt={`tech-${i}`} className="h-12 w-auto object-contain" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── ¿QUÉ ES UNA AUTOMATIZACIÓN? ───── */}
      <section id="que-es" className="py-32 bg-navy-darker">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={fadeInUp}
            className="mb-16 text-center"
          >
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 mb-6">
              <span className="material-symbols-outlined text-primary">lightbulb</span>
              <span className="text-primary text-sm font-bold uppercase tracking-widest font-montserrat">Conceptos Clave</span>
            </div>
            <h2 className="font-michroma text-3xl md:text-4xl text-white mb-4 leading-tight">
              ¿Qué significa exactamente <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">"automatización completa"</span>?
            </h2>
            <p className="font-montserrat text-lg text-slate-400 max-w-2xl mx-auto">
              Tres conceptos clave para entender exactamente qué obtienes.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Concepto 1 */}
            <ExpandableCard
              title="No es un 'flujo' — es un SISTEMA INTELIGENTE"
              icon="smart_toy"
              iconColor="text-primary"
              iconBg="bg-primary/10"
              borderHover="hover:border-primary/40"
              expandedContent={
                <div className="p-4 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent rounded-lg border border-primary/20">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center flex-shrink-0">
                      <span className="material-symbols-outlined text-primary text-sm">auto_awesome</span>
                    </div>
                    <div>
                      <p className="text-xs text-slate-300 font-montserrat leading-relaxed">
                        <strong className="text-primary">Ejemplo real:</strong> Un cliente escribe "¿tienes disponible el jueves a las 4pm?" → El sistema revisa tu calendario, confirma disponibilidad, crea la cita automáticamente y agenda recordatorios.
                      </p>
                    </div>
                  </div>
                </div>
              }
            >
              <p className="font-montserrat text-slate-400 text-sm leading-relaxed mb-6">
                Piensa en esto como tu empleado digital que nunca duerme, nunca comete errores, y trabaja 24/7.
              </p>

              {/* Lista de capacidades - 4 items idénticos a las otras tarjetas */}
              <div className="space-y-3">
                {[
                  { icon: 'chat', label: 'Responder consultas automáticamente', color: 'text-green-400', bg: 'bg-green-400/10' },
                  { icon: 'event', label: 'Agendar citas sin intervención humana', color: 'text-blue-400', bg: 'bg-blue-400/10' },
                  { icon: 'notifications', label: 'Enviar recordatorios y seguimientos', color: 'text-purple-400', bg: 'bg-purple-400/10' },
                  { icon: 'mail', label: 'Capturar leads de web o WhatsApp', color: 'text-orange-400', bg: 'bg-orange-400/10' }
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-3 rounded-lg bg-slate-900/50 border border-slate-800 hover:border-primary/30 transition-all"
                  >
                    <div className={`w-8 h-8 rounded-lg ${item.bg} border ${item.color.replace('text', 'border')}/20 flex items-center justify-center`}>
                      <span className={`material-symbols-outlined ${item.color}`}>{item.icon}</span>
                    </div>
                    <span className="text-slate-200 text-sm">{item.label}</span>
                  </div>
                ))}
              </div>
            </ExpandableCard>

            {/* Concepto 2 */}
            <ExpandableCard
              title='¿Qué son las "ejecuciones"?'
              icon="play_circle"
              iconColor="text-accent"
              iconBg="bg-accent/10"
              borderHover="hover:border-accent/40"
              expandedContent={
                <div className="p-4 bg-gradient-to-r from-accent/10 via-accent/5 to-transparent rounded-lg border border-accent/20">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-accent/20 border border-accent/30 flex items-center justify-center flex-shrink-0">
                      <span className="material-symbols-outlined text-accent text-sm">lightbulb</span>
                    </div>
                    <div>
                      <p className="text-xs text-slate-300 font-montserrat leading-relaxed">
                        <strong className="text-accent">Ejemplo práctico:</strong> 1,000 ejecuciones/mes ≈ 500 mensajes + 300 pagos + 200 recordatorios. Cubre el 90% de negocios pequeños.
                      </p>
                    </div>
                  </div>
                </div>
              }
            >
              <p className="font-montserrat text-slate-400 text-sm leading-relaxed mb-6">
                Es <strong className="text-white font-bold">CADA VEZ</strong> que el sistema realiza una acción por ti. Son eventos medibles y concretos.
              </p>

              {/* Lista visual - 4 items idénticos a las otras */}
              <div className="space-y-3">
                {[
                  { icon: 'chat', label: '1 mensaje respondido = 1 ejecución', color: 'text-green-400', bg: 'bg-green-400/10' },
                  { icon: 'payments', label: '1 pago procesado = 1 ejecución', color: 'text-blue-400', bg: 'bg-blue-400/10' },
                  { icon: 'receipt_long', label: '1 factura enviada = 1 ejecución', color: 'text-purple-400', bg: 'bg-purple-400/10' },
                  { icon: 'event', label: '1 cita agendada = 1 ejecución', color: 'text-orange-400', bg: 'bg-orange-400/10' }
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-3 rounded-lg bg-slate-900/50 border border-slate-800 hover:border-accent/30 transition-all"
                  >
                    <div className={`w-8 h-8 rounded-lg ${item.bg} border ${item.color.replace('text', 'border')}/20 flex items-center justify-center`}>
                      <span className={`material-symbols-outlined ${item.color}`}>{item.icon}</span>
                    </div>
                    <span className="text-slate-200 text-sm">{item.label}</span>
                  </div>
                ))}
              </div>
            </ExpandableCard>

            {/* Concepto 3 */}
            <ExpandableCard
              title="Lo que SÍ incluye vs NO incluye"
              icon="balance"
              iconColor="text-primary"
              iconBg="bg-primary/10"
              borderHover="hover:border-primary/40"
              expandedContent={
                <div className="space-y-6 pt-4 mt-4 border-t border-slate-800">
                  {/* NO Incluye */}
                  <div>
                    <h4 className="text-accent text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-2">
                      <div className="w-6 h-6 rounded bg-accent/20 border border-accent/30 flex items-center justify-center">
                        <span className="material-symbols-outlined text-sm">close</span>
                      </div>
                      Lo que NO incluye
                    </h4>
                    <div className="space-y-2">
                      {[
                        { icon: 'dns', label: 'Infraestructura externa', sub: '(WhatsApp API, hosting)', color: 'text-accent' },
                        { icon: 'campaign', label: 'Publicidad o ads', color: 'text-accent' },
                        { icon: 'article', label: 'Contenido de marketing', color: 'text-accent' }
                      ].map((item, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-3 p-2.5 rounded-lg bg-accent/5 border border-accent/10 hover:bg-accent/10 transition-all"
                        >
                          <div className={`w-8 h-8 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center ${item.color}`}>
                            <span className="material-symbols-outlined text-sm">{item.icon}</span>
                          </div>
                          <div className="flex-1">
                            <span className="text-slate-300 text-sm">{item.label}</span>
                            {item.sub && <span className="text-slate-500 text-xs block">{item.sub}</span>}
                          </div>
                          <span className="material-symbols-outlined text-accent/60 text-sm">block</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Resumen */}
                  <div className="p-4 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent rounded-lg border border-primary/20">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center flex-shrink-0">
                        <span className="material-symbols-outlined text-primary text-sm">verified</span>
                      </div>
                      <div>
                        <p className="text-xs text-slate-300 font-montserrat leading-relaxed">
                          <strong className="text-primary">Resumen:</strong> No vendemos acceso a herramientas. Te entregamos un sistema completo funcionando desde el día 1, con todo incluido.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              }
            >
              <p className="font-montserrat text-slate-400 text-sm leading-relaxed mb-6">
                Transparencia total sobre lo que incluye nuestro servicio.
              </p>

              {/* SÍ Incluye - exactamente 4 items como las otras tarjetas */}
              <div className="space-y-3">
                {[
                  { icon: 'build', label: 'Creamos y configuramos todo', color: 'text-green-400' },
                  { icon: 'link', label: 'Conectamos tus herramientas', color: 'text-green-400' },
                  { icon: 'support_agent', label: 'Soporte técnico 24/7', color: 'text-green-400' },
                  { icon: 'upgrade', label: 'Mejoras mensuales sin costo extra', color: 'text-green-400' }
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-3 rounded-lg bg-green-400/5 border border-green-400/10 hover:bg-green-400/10 transition-all"
                  >
                    <div className={`w-8 h-8 rounded-lg bg-green-400/10 border border-green-400/20 flex items-center justify-center ${item.color}`}>
                      <span className="material-symbols-outlined text-sm">{item.icon}</span>
                    </div>
                    <span className="text-slate-200 text-sm">{item.label}</span>
                  </div>
                ))}
              </div>
            </ExpandableCard>
          </div>
        </div>
      </section>

      {/* ───── SERVICIOS ───── */}
      <section id="servicios" className="py-32 bg-background-dark">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={fadeInUp}
            className="mb-20 text-center"
          >
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 mb-6">
              <span className="material-symbols-outlined text-primary">auto_awesome</span>
              <span className="text-primary text-sm font-bold uppercase tracking-widest font-montserrat">Qué Automatizamos</span>
            </div>
            <h2 className="font-michroma text-3xl md:text-4xl text-white mb-4 leading-tight">
              Lo que podemos <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">automatizar por ti</span>
            </h2>
            <p className="font-montserrat text-lg text-slate-400 max-w-2xl mx-auto">
              Cada servicio es un sistema completo — no solo una herramienta.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {services.map((service) => (
              <motion.div key={service.title} variants={scaleIn}>
                <ServiceCard3D
                  icon={service.icon}
                  title={service.title}
                  description={service.desc}
                  color={service.color}
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ───── PROCESO ───── */}
      <section className="py-24 md:py-32 bg-navy-darker overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={fadeInUp}
            className="text-center mb-12 md:mb-16"
          >
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 mb-6">
              <span className="material-symbols-outlined text-primary">timeline</span>
              <span className="text-primary text-sm font-bold uppercase tracking-widest font-montserrat">Proceso</span>
            </div>
            <h2 className="font-michroma text-3xl md:text-4xl text-white mb-4">
              Así creamos tu <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">sistema</span>
            </h2>
            <p className="font-montserrat text-lg text-slate-400 max-w-2xl mx-auto">
              En 3 pasos simples, sin que tú toques código.
            </p>
          </motion.div>

          <ProcessAnimation />
        </div>
      </section>

      {/* ───── PRECIOS ───── */}
      <section id="precios" className="py-32 bg-background-dark relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #0d7ff2 1px, transparent 0)', backgroundSize: '48px 48px' }} />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={fadeInUp}
            className="text-center mb-20"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/30 mb-6">
              <span className="material-symbols-outlined text-primary text-sm">payments</span>
              <span className="text-primary text-xs font-bold uppercase tracking-widest">Planes Transparentes</span>
            </div>
            <h2 className="font-michroma text-3xl md:text-4xl text-white uppercase mb-4 leading-tight">
              Invierte en automatización,<br />no en salarios
            </h2>
            <p className="font-montserrat text-slate-400 max-w-2xl mx-auto">
              Precios claros sin sorpresas. Elige el plan que se ajuste a tu volumen de trabajo.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch"
          >
            {/* Plan Básico */}
            <motion.div variants={scaleIn}>
              <PlanCard
                title="INICIO"
                tagline="INICIO"
                price="$72"
                period="/mes"
                setup="+ $210 setup (único pago)"
                description="Ideal para emprendedores que quieren automatizar su primera tarea y recuperar 15+ horas semanales."
                features={['1 sistema automatizado completo', 'Hasta 1,000 interacciones/mes', 'Integración con 1 canal', 'Google Calendar incluido', 'Soporte técnico básico', 'Panel de monitoreo']}
                details={[
                  { title: '1 Sistema automatizado completo', desc: 'Crearemos y configuraremos 1 automatización de principio a fin: WhatsApp automatizado, agendamiento de citas, facturación automática o captura de leads.' },
                  { title: 'Hasta 1,000 interacciones/mes', desc: '≈ 500 mensajes + 300 pagos + 200 recordatorios. Cubre el 90% de las necesidades de un pequeño negocio.' },
                  { title: 'Integración con 1 canal', desc: 'WhatsApp, Email o Web. Automatizamos un canal completo (ej: WhatsApp Business con respuestas, consultas y agendamiento).' },
                  { title: 'Google Calendar incluido', desc: 'Sincronización en tiempo real para agendamiento automático sin dobles bookings.' },
                  { title: 'Soporte técnico básico', desc: 'Respuesta por email en <24h. Incluye uso del sistema y ajustes menores.' },
                  { title: 'Panel de monitoreo', desc: 'Dashboard donde ves interacciones usadas, estado del sistema y tiempo ahorrado.' }
                ]}
                badge="Ahorra $528-828/mes"
                badgeStyle="linear-gradient(90deg, #0d7ff2, #8b5cf6)"
                popular={false}
                ctaText="Comenzar"
                onCta={() => navigate('/contacto')}
              />
            </motion.div>

            {/* Plan Profesional */}
            <motion.div variants={scaleIn}>
              <PlanCard
                title="CRECIMIENTO"
                tagline="CRECIMIENTO"
                price="$150"
                period="/mes"
                setup="+ $420 setup (único pago)"
                description="Para negocios en crecimiento que automatizan 2-3 procesos y quieren un agente de IA que responda como tú."
                features={['Hasta 3 sistemas automatizados completos', 'Hasta 5,000 interacciones mensuales', 'Multi-canal (WhatsApp + Email + Web)', 'Agente IA personalizado', 'Soporte prioritario 24/7', 'Optimización mensual sin costo extra']}
                details={[
                  { title: 'Hasta 3 sistemas automatizados completos', desc: 'Creamos 3 automatizaciones diferentes (ej: WhatsApp + Calendario + Facturación). Cada sistema funciona de forma independiente pero conectada.' },
                  { title: 'Hasta 5,000 interacciones mensuales', desc: '≈ 2,500 mensajes + 1,500 pagos + 1,000 recordatorios. Cubre negocios con volumen moderado-alto.' },
                  { title: 'Multi-canal (WhatsApp + Email + Web)', desc: 'Automatizamos 3 canales simultáneamente. Todo se conecta en un solo sistema unificado.' },
                  { title: 'Agente IA personalizado', desc: 'Asistente entrenado con tu tono, vocabulario y conocimiento de productos. Responde consultas complejas, vende, agenda y califica leads.' },
                  { title: 'Soporte prioritario 24/7', desc: 'Respuesta en <12h por WhatsApp/email. Ingenieros que conocen tu sistema.' },
                  { title: 'Optimización mensual sin costo extra', desc: 'Cada mes revisamos tus flujos y tienes consultoría de 30min para escalar.' }
                ]}
                badge="MÁS POPULAR"
                badgeStyle="linear-gradient(90deg, #8b5cf6, #0d7ff2)"
                popular={true}
                ctaText="Comenzar"
                onCta={() => navigate('/contacto')}
              />
            </motion.div>

            {/* Plan Empresarial */}
            <motion.div variants={scaleIn}>
              <PlanCard
                title="EMPRESARIAL"
                tagline="ESCALA"
                price="$240"
                period="/mes"
                setup="+ $720 setup (único pago)"
                description="Para organizaciones que necesitan automatización total, IA avanzada y soporte dedicado 24/7."
                features={['Flujos ilimitados', 'Hasta 20,000 interacciones mensuales', 'Todos los canales de comunicación', 'IA con NLP avanzado', 'Dashboard administrativo completo', 'Soporte dedicado 24/7']}
                details={[
                  { title: 'Flujos ilimitados', desc: 'Creamos todas las automatizaciones que necesites: procesos de ventas, onboarding, RRHH, reportes, integraciones ERP/CRM, etc.' },
                  { title: 'Hasta 20,000 interacciones mensuales', desc: '≈ 10,000 mensajes + 6,000 transacciones + 4,000 notificaciones. Cubre alto volumen o múltiples departamentos.' },
                  { title: 'Todos los canales de comunicación', desc: 'WhatsApp, Email, Web, SMS, Telegram, Instagram/Facebook Messenger, Voz (IVR). Todo conectado manteniendo contexto.' },
                  { title: 'IA con NLP avanzado', desc: 'Entiende consultas complejas, detecta emoción/urgencia, puede negociar precios y resolver conflictos.' },
                  { title: 'Dashboard administrativo completo', desc: 'Panel para gerentes con KPIs por departamento, alertas proactivas, reportes exportables (PDF/Excel) y gestión de usuarios.' },
                  { title: 'Soporte dedicado 24/7', desc: 'Chat en vivo 24/7 con ingenieros, <1h respuesta, ingeniero asignado que conoce tu sistema, SLA garantizado.' }
                ]}
                badge="Ahorra $2,160-3,360/mes"
                badgeStyle="linear-gradient(90deg, #8b5cf6, #b06ab3)"
                popular={false}
                ctaText="Comenzar"
                onCta={() => navigate('/contacto')}
              />
            </motion.div>
          </motion.div>

          <ROICalculator />
        </div>
      </section>

      {/* ───── OBJECTION BUSTER ───── */}
      <ObjectionBuster />

      {/* ───── CTA ───── */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative overflow-hidden rounded-2xl p-12 md:p-20 flex flex-col items-center text-center border-2"
            style={{ background: 'linear-gradient(135deg, rgba(13,127,242,0.1) 0%, rgba(139,92,246,0.1) 50%, rgba(176,106,179,0.1) 100%)', borderColor: 'rgba(139,92,246,0.3)' }}
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-[100px] rounded-full animate-pulse" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 blur-[100px] rounded-full animate-pulse" />

            <div className="relative z-10">
              <h2 className="font-michroma text-3xl md:text-5xl text-white mb-4 leading-tight">
                ¿LISTO PARA LLEVAR TU NEGOCIO <br /> AL <span className="gradient-text-animated">FUTURO?</span>
              </h2>
              <p className="font-montserrat text-lg text-slate-300 mb-10 max-w-2xl">
                Únete a las empresas que ya están ahorrando miles de horas de trabajo manual cada año.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/contacto')}
                className="relative px-10 py-5 text-base font-bold uppercase tracking-widest text-white rounded-lg shadow-2xl overflow-hidden"
                style={{ background: 'linear-gradient(135deg, #0d7ff2 0%, #8b5cf6 100%)' }}
              >
                <span className="relative z-10">Hablemos de tu Proyecto</span>
                <motion.div
                  className="absolute inset-0 bg-white/20"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: '100%' }}
                  transition={{ duration: 0.6, ease: 'easeInOut' }}
                />
              </motion.button>

              <p className="mt-6 font-montserrat text-slate-400 text-sm">
                Te contactamos en menos de 24h. Analizamos tu caso y te damos opciones reales.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

    </>
  );
}
