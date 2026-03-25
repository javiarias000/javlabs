import { Link, useNavigate } from 'react-router-dom';
import { motion, useInView, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';
import ROICalculator from '../pricing_page/ROICalculator';
import PublicNavbar from '../../components/PublicNavbar';
import MouseSpotlight from '../../components/MouseSpotlight';
import AnimatedStatsGroup from '../../components/AnimatedStatsGroup';
import ServiceCard3D from '../../components/ServiceCard3D';
import useTypingEffect from '../../hooks/useTypingEffect';
import './LandingPage1.css';

export default function LandingPage1() {
  const navigate = useNavigate();
  const { scrollYProgress } = useScroll();
  const { y: parallaxY } = useTransform(scrollYProgress, [0, 1], [0, -200]);

  // Hero typing effect
  const heroWords = ["AUTOMATIZA TU NEGOCIO.", "ESCALA SIN LÍMITES."];
  const { displayedText, currentWordIndex, isDeleting } = useTypingEffect(heroWords, {
    typingSpeed: 80,
    deletingSpeed: 40,
    pauseTime: 2500
  });

  // Counter animation for stats
  const stats = [
    { label: 'Procesos Optimizados', value: 5, suffix: '+' },
    { label: 'Eficiencia Aumentada', value: 95, suffix: '%' },
    { label: 'Clientes Satisfechos', value: 5, suffix: '+' },
    { label: 'Soporte 24/7', value: 100, suffix: '%' },
  ];

  // Process steps
  const processSteps = [
    {
      num: '01',
      title: 'DIAGNÓSTICO',
      desc: 'Análisis profundo de tus procesos actuales para identificar oportunidades de mejora.',
      color: '#0d7ff2'
    },
    {
      num: '02',
      title: 'DESARROLLO',
      desc: 'Construcción y despliegue de las automatizaciones personalizadas.',
      color: '#8b5cf6'
    },
    {
      num: '03',
      title: 'ESCALADO',
      desc: 'Mantenimiento continuo y expansión de capacidades para un crecimiento sostenido.',
      color: '#0d7ff2'
    }
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

      {/* ───── HEADER ───── */}
      <PublicNavbar />

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
              Optimiza procesos críticos y aumenta la eficiencia operativa con soluciones de
              <span className="text-white font-semibold"> inteligencia artificial</span> y flujos de trabajo de vanguardia.
            </motion.p>

            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                onClick={() => navigate('/servicios')}
                className="magnetic-btn px-8 py-4 text-sm font-bold uppercase tracking-widest text-white rounded-lg transition-all shadow-glow-primary hover:shadow-glow-accent"
                style={{ background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%)' }}
              >
                Ver Servicios
              </button>
              <button
                onClick={() => document.getElementById('servicios')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-8 py-4 text-sm font-bold uppercase tracking-widest border-2 border-primary/50 text-primary hover:bg-primary/10 hover:border-primary transition-all rounded-lg"
              >
                Explorar
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

                {/* Floating icons */}
                {['smart_toy', 'psychology', 'auto_awesome', 'bolt'].map((icon, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.5 + i * 0.2, type: "spring" }}
                    className="absolute"
                    style={{
                      top: `${20 + i * 20}%`,
                      left: `${15 + i * 15}%`,
                    }}
                  >
                    <div className="w-16 h-16 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center backdrop-blur-sm">
                      <span className="material-symbols-outlined text-2xl text-primary">{icon}</span>
                    </div>
                  </motion.div>
                ))}

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
              <span className="material-symbols-outlined text-primary">services</span>
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
      <section className="py-32 bg-navy-darker">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={fadeInUp}
            className="text-center mb-16"
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

          <div className="relative flex flex-col md:flex-row justify-between items-start gap-12 md:gap-8">
            {processSteps.map((step, index) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="relative z-10 flex flex-col items-center md:items-start text-center md:text-left w-full md:w-1/3"
              >
                <motion.div
                  className="size-20 rounded-full flex items-center justify-center font-michroma text-2xl mb-6"
                  style={{
                    background: `conic-gradient(from 0deg, ${step.color}30, ${step.color}60, ${step.color}30)`,
                    border: `3px solid ${step.color}`,
                    boxShadow: `0 0 20px ${step.color}40`
                  }}
                  animate={{ boxShadow: [`0 0 20px ${step.color}40`, `0 0 30px ${step.color}60`, `0 0 20px ${step.color}40`] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {step.num}
                </motion.div>
                <h4 className="font-michroma text-lg md:text-xl text-white mb-4 uppercase">{step.title}</h4>
                <p className="font-montserrat text-slate-400 text-sm md:text-base leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}

            {/* Línea conectora animada */}
            <motion.div
              className="hidden md:block absolute top-10 left-0 w-full h-0.5 bg-gradient-to-r from-primary via-accent to-primary opacity-30 z-0"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, delay: 0.5 }}
            />

            {/* Puntos animados */}
            <motion.div
              className="hidden md:block absolute top-10 left-[33%] size-3 rounded-full bg-primary z-20"
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 1 }}
              animate={{ boxShadow: ['0 0 8px #0d7ff2', '0 0 16px #0d7ff2', '0 0 8px #0d7ff2'] }}
            />
            <motion.div
              className="hidden md:block absolute top-10 left-[66%] size-3 rounded-full bg-accent z-20"
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 1.5 }}
              animate={{ boxShadow: ['0 0 8px #8b5cf6', '0 0 16px #8b5cf6', '0 0 8px #8b5cf6'] }}
            />
          </div>
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
              <span className="text-primary text-xs font-bold uppercase tracking-widest">Planes y Precios</span>
            </div>
            <h2 className="font-michroma text-3xl md:text-4xl text-white uppercase mb-4">Soluciones para cada negocio</h2>
            <p className="font-montserrat text-slate-400 max-w-2xl mx-auto">
              Desde startups hasta empresas consolidadas — tenemos el plan exacto para automatizar tus procesos y escalar sin límites.
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
            <motion.div variants={scaleIn} className="group relative flex flex-col bg-navy-darker border border-slate-800 rounded-xl p-8 hover:border-primary/40 transition-all duration-300">
              <div className="mb-8">
                <span className="text-xs font-bold uppercase tracking-widest text-slate-500 font-montserrat">Básico </span>
                <span className="px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest text-white rounded-full font-montserrat"
                  style={{ background: 'linear-gradient(90deg, #0d7ff2, #8b5cf6)' }}>
                  -40%
                </span>
                <div className="mt-4 flex items-end gap-2">
                  <span className="font-michroma text-4xl text-white">$72</span>
                  <span className="text-slate-500 text-sm mb-1 font-montserrat">/mes</span>
                </div>
                <p className="text-slate-500 text-xs font-montserrat mt-1">+ $210 setup</p>
                <p className="text-slate-400 text-sm font-montserrat mt-4 leading-relaxed">Ideal para negocios pequeños o emprendedores.</p>
              </div>
              <div className="h-px bg-slate-800 mb-8" />
              <ul className="flex flex-col gap-4 flex-1 font-montserrat">
                {['1 flujo de automatización', 'Hasta 1,000 ejecuciones/mes', 'Integración con 1 canal', 'Google Calendar incluido', 'Soporte técnico básico', 'Panel de monitoreo'].map(f => (
                  <li key={f} className="flex items-start gap-3 text-sm text-slate-400">
                    <span className="material-symbols-outlined text-primary text-sm mt-0.5 flex-shrink-0">check_circle</span>
                    {f}
                  </li>
                ))}
              </ul>
              <button onClick={() => navigate('/contacto')}
                className="mt-8 w-full border border-slate-700 text-slate-300 py-3 text-xs font-bold uppercase tracking-widest hover:border-primary hover:text-primary transition-all font-montserrat rounded hover:scale-105"
              >
                Comenzar
              </button>
            </motion.div>

            {/* Plan Profesional */}
            <motion.div variants={scaleIn} className="group relative flex flex-col rounded-xl p-8 transition-all duration-300"
              style={{ background: 'linear-gradient(135deg, #0d1b2a 0%, #0d2a4a 100%)', border: '1px solid rgba(13,127,242,0.4)', boxShadow: '0 0 40px rgba(13,127,242,0.15)' }}>
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <span className="px-4 py-1 text-[10px] font-bold uppercase tracking-widest text-white rounded-full font-montserrat"
                  style={{ background: 'linear-gradient(90deg, #0d7ff2, #8b5cf6)' }}>
                  MÁS POPULAR
                </span>
              </div>
              <div className="mb-8">
                <div className="inline-flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold uppercase tracking-widest text-primary font-montserrat">Profesional</span>
                  <span className="px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest text-white rounded-full font-montserrat"
                    style={{ background: 'linear-gradient(90deg, #0d7ff2, #8b5cf6)' }}>
                    -40%
                  </span>
                </div>
                <div className="mt-4 flex items-end gap-2">
                  <span className="font-michroma text-4xl text-white">$150</span>
                  <span className="text-slate-400 text-sm mb-1 font-montserrat">/mes</span>
                </div>
                <p className="text-slate-500 text-xs font-montserrat mt-1">+ $420 setup</p>
                <p className="text-slate-400 text-sm font-montserrat mt-4 leading-relaxed">Para empresas en crecimiento con IA avanzada.</p>
              </div>
              <div className="h-px mb-8" style={{ background: 'rgba(13,127,242,0.2)' }} />
              <ul className="flex flex-col gap-4 flex-1 font-montserrat">
                {['Hasta 3 flujos de automatización', 'Hasta 5,000 ejecuciones/mes', 'Multi-canal completo', 'Agente IA personalizado', 'Soporte prioritario', 'Optimización mensual'].map(f => (
                  <li key={f} className="flex items-start gap-3 text-sm text-slate-300">
                    <span className="material-symbols-outlined text-primary text-sm mt-0.5 flex-shrink-0">check_circle</span>
                    {f}
                  </li>
                ))}
              </ul>
              <button onClick={() => navigate('/contacto')}
                className="mt-8 w-full py-3 text-xs font-bold uppercase tracking-widest text-white rounded-lg hover:scale-105 transition-all font-montserrat"
                style={{ background: 'linear-gradient(90deg, #0d7ff2, #8b5cf6)' }}
              >
                Comenzar
              </button>
            </motion.div>

            {/* Plan Empresarial */}
            <motion.div variants={scaleIn} className="group relative flex flex-col bg-navy-darker border border-slate-800 rounded-xl p-8 hover:border-accent/40 transition-all duration-300">
              <div className="mb-8">
                <div className="inline-flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold uppercase tracking-widest text-slate-500 font-montserrat">Empresarial</span>
                  <span className="px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest text-white rounded-full font-montserrat"
                    style={{ background: 'linear-gradient(90deg, #8b5cf6, #b06ab3)' }}>
                    -40%
                  </span>
                </div>
                <div className="mt-4 flex items-end gap-2">
                  <span className="font-michroma text-4xl text-white">$240</span>
                  <span className="text-slate-500 text-sm mb-1 font-montserrat">/mes</span>
                </div>
                <p className="text-slate-500 text-xs font-montserrat mt-1">+ $720 setup</p>
                <p className="text-slate-400 text-sm font-montserrat mt-4 leading-relaxed">Automatización total con IA avanzada.</p>
              </div>
              <div className="h-px bg-slate-800 mb-8" />
              <ul className="flex flex-col gap-4 flex-1 font-montserrat">
                {['Flujos ilimitados', 'Hasta 20,000 ejecuciones/mes', 'Todos los canales', 'IA con NLP', 'Dashboard completo', 'Soporte dedicado 24/7'].map(f => (
                  <li key={f} className="flex items-start gap-3 text-sm text-slate-400">
                    <span className="material-symbols-outlined text-accent text-sm mt-0.5 flex-shrink-0">check_circle</span>
                    {f}
                  </li>
                ))}
              </ul>
              <button onClick={() => navigate('/contacto')}
                className="mt-8 w-full border border-slate-700 text-slate-300 py-3 text-xs font-bold uppercase tracking-widest hover:border-accent hover:text-accent transition-all font-montserrat rounded hover:scale-105"
              >
                Comenzar
              </button>
            </motion.div>
          </motion.div>

          <ROICalculator />
        </div>
      </section>

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

      {/* ───── FOOTER ───── */}
      <footer className="bg-navy-darker border-t border-slate-800 pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
          <div className="col-span-1">
            <div className="flex items-center gap-4 mb-6">
              <img src="/Logo3.png" alt="Javlabs Logo" className="h-12 w-auto object-contain" />
              <span className="text-white text-lg font-michroma tracking-widest">JAVLABS</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              Sistemas de automatización de alta gama para empresas con visión de futuro.
            </p>
            <div className="flex gap-4">
              {['facebook', 'twitter', 'linkedin', 'instagram'].map((social) => (
                <motion.a
                  key={social}
                  href="/"
                  className="size-10 rounded border border-slate-700 flex items-center justify-center hover:border-primary transition-colors group"
                  aria-label={`Síguenos en ${social}`}
                  whileHover={{ y: -3, scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="material-symbols-outlined text-slate-400 group-hover:text-primary text-xs">
                    {social === 'facebook' ? 'facebook' : social === 'twitter' ? 'alternate_email' : social === 'linkedin' ? 'alternate_description' : 'photo_camera'}
                  </span>
                </motion.a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-white font-michroma text-sm uppercase mb-6">Empresa</h4>
            <ul className="flex flex-col gap-4 text-slate-400 text-sm">
              {['Nosotros', 'Casos de Éxito', 'Carreras', 'Prensa'].map((item) => (
                <li key={item}><Link to="/" className="hover:text-primary transition-colors">{item}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-michroma text-sm uppercase mb-6">Soporte</h4>
            <ul className="flex flex-col gap-4 text-slate-400 text-sm">
              <li><Link to="/contacto" className="hover:text-primary transition-colors">Contacto</Link></li>
              <li><Link to="/login" className="hover:text-primary transition-colors">Portal de Clientes</Link></li>
              <li><a href="/" className="hover:text-primary transition-colors">Documentación</a></li>
              <li><a href="/" className="hover:text-primary transition-colors">FAQ</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-michroma text-sm uppercase mb-6">Newsletter</h4>
            <p className="text-slate-400 text-xs mb-4">Recibe insights sobre automatización cada semana.</p>
            <div className="flex">
              <input
                type="email"
                placeholder="Email"
                className="bg-background-dark border border-slate-700 rounded-l px-4 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-white newsletter-input"
              />
              <button
                className="px-4 py-2 rounded-r hover:opacity-80 transition-all"
                style={{ background: 'var(--color-primary)' }}
              >
                <span className="material-symbols-outlined text-sm">send</span>
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-xs">© {new Date().getFullYear()} JAV LABS. Todos los derechos reservados.</p>
          <div className="flex gap-8 text-slate-500 text-xs">
            {['Privacidad', 'Términos', 'Cookies'].map((item) => (
              <a key={item} href="/" className="hover:text-slate-300 transition-colors">{item}</a>
            ))}
          </div>
        </div>
      </footer>
    </>
  );
}
