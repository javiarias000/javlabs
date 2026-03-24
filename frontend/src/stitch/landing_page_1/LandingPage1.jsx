import { Link, useNavigate } from 'react-router-dom';
import ROICalculator from '../pricing_page/ROICalculator';
import { motion, useInView } from 'framer-motion';
import PublicNavbar from '../../components/PublicNavbar';
import FloatingContactButton from '../../components/FloatingContactButton';
import ParticleBackground from '../../components/ParticleBackground';
import AnimatedStat from '../../components/AnimatedStat';
import TechMarquee from '../../components/TechMarquee';
import ServiceCard3D from '../../components/ServiceCard3D';
import ProcessAnimation from '../../components/ProcessAnimation';
import ExamplesSection from './ExamplesSection';
import ObjectionBuster from './ObjectionBuster';
import FAQSection from './FAQSection';
import './LandingPage1.css';

export default function LandingPage1() {
  const navigate = useNavigate();

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.3 }
    }
  };

  const float = {
    hidden: { y: 0 },
    visible: { y: [-10, 10], transition: { duration: 4, repeat: Infinity, ease: 'easeInOut' } }
  };

  const pulse = {
    hidden: { scale: 1 },
    visible: { scale: [1, 1.05, 1], transition: { duration: 3, repeat: Infinity } }
  };

  return (
    <>
      <PublicNavbar />

      {/* HERO SECTION - NUEVO TEXTO CLARO */}
      <section className="relative overflow-hidden pt-20 pb-32 section-gradient">
        <ParticleBackground />

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.2 }}
          variants={staggerContainer}
          className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
        >
          {/* TEXT CONTENT */}
          <motion.div variants={fadeInUp} className="flex flex-col gap-6">
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 w-fit">
              <span className="material-symbols-outlined text-primary text-lg">auto_fix_high</span>
              <span className="text-primary text-sm font-bold uppercase tracking-widest font-montserrat">Automatización Completa</span>
            </motion.div>

            <motion.h1 variants={fadeInUp} className="font-michroma text-4xl md:text-5xl lg:text-6xl text-white leading-tight animate-fadeInUp">
              Deja que la tecnología <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">trabaje por ti.</span>
            </motion.h1>

            <motion.h2 variants={fadeInUp} className="font-montserrat text-xl md:text-2xl text-slate-300 leading-relaxed">
              Automatiza tareas, vende más, <br/>
              <span className="text-primary font-bold">y recupera 20+ horas cada semana.</span>
            </motion.h2>

            <motion.p variants={fadeInUp} className="font-montserrat text-lg text-slate-400 max-w-xl leading-relaxed">
              Con un sistema automatizado completo, no necesitas contratar 3 personas ni pasar horas haciendo tareas repetitivas.
              <span className="text-white font-semibold"> Nosotros creamos, implementamos y mantenemos todo por ti.</span>
            </motion.p>

            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 pt-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.location.hash = '#ejemplos'}
                className="px-8 py-4 text-sm font-bold uppercase tracking-widest rounded-lg bg-gradient-to-r from-primary to-accent text-white shadow-glow-primary hover:shadow-glow-accent transition-all duration-300"
              >
                👉 Ver Cómo Funciona
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.location.hash = '#precios'}
                className="px-8 py-4 text-sm font-bold uppercase tracking-widest rounded-lg border-2 border-primary/50 text-primary hover:bg-primary/10 hover:border-primary transition-all duration-300"
              >
                Ver Precios
              </motion.button>
            </motion.div>

            {/* Trust indicators bajo CTA */}
            <motion.div variants={fadeInUp} className="flex flex-wrap items-center gap-6 pt-4 text-sm text-slate-400 font-montserrat">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-green-400">check_circle</span>
                <span>2-4 semanas implementación</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-green-400">check_circle</span>
                <span>Soporte 24/7 incluido</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-green-400">check_circle</span>
                <span>Sin permanencia</span>
              </div>
            </motion.div>
          </motion.div>

          {/* ILLUSTRATION - Mantengo igual */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="relative hidden lg:block"
          >
            <motion.div
              animate={float}
              className="relative z-10 w-full aspect-square rounded-2xl border border-slate-800 bg-navy-darker/50 overflow-hidden group"
            >
              <div className="absolute inset-0 opacity-30 group-hover:opacity-50 transition-opacity duration-700 bg-[radial-gradient(circle_at_50%_50%,#0d7ff2_0%,transparent_70%)]" />
              <div className="absolute inset-0 flex items-center justify-center">
                <svg className="w-full h-full p-12 text-primary/40" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20,100 L180,100 M100,20 L100,180 M60,60 L140,140 M140,60 L60,140" fill="none" stroke="currentColor" strokeWidth="0.5" />
                  <circle cx="100" cy="100" fill="none" r="40" stroke="currentColor" strokeDasharray="4,4" strokeWidth="1" />
                  <rect fill="none" height="60" stroke="currentColor" strokeWidth="2" width="60" x="70" y="70" />
                  <circle cx="20" cy="100" fill="#8b5cf6" r="3" />
                  <circle cx="180" cy="100" fill="#8b5cf6" r="3" />
                  <circle cx="100" cy="20" fill="#0d7ff2" r="3" />
                  <circle cx="100" cy="180" fill="#0d7ff2" r="3" />
                </svg>
              </div>
              <img
                className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-screen"
                alt="Circuit board"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAVT_tmrJ7SRehELAkUzm1UqaCFG4duEqA3gZQQIsVLYwRSllmGjy5EdAsk7OnuagrM0pi3SDl0iBz6aGJtkxjCt5fwVhbE7FRxhYz1_sjjY2-aZbP5KwS8egY9fy_rsFaO9X03KgWv9mGvrSzbo2Jaoxqkr4xYMiHISpYuGGHW3Nm7p35NQfzzOq508BJq5cGHWmxDOZB0OmmNyir9p1g_bniU2HCtoxQTLobJyJgVMwikAQm8rvJanbhiuqE3Ew0ThRjnqAixc2M"
              />
            </motion.div>

            <motion.div
              animate={pulse}
              className="absolute -top-10 -right-10 w-40 h-40 bg-accent/20 blur-[80px] rounded-full"
            />
            <motion.div
              animate={pulse}
              className="absolute -bottom-10 -left-10 w-40 h-40 bg-primary/20 blur-[80px] rounded-full"
            />
          </motion.div>
        </motion.div>
      </section>

      {/* STATS SECTION - Números más realistas y orientados a beneficios */}
      <section className="py-16 md:py-24 bg-navy-darker relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          variants={staggerContainer}
          className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8 md:gap-12"
        >
          <AnimatedStat
            label="Horas Ahorradas"
            value={2000}
            suffix="+"
            icon="schedule"
            color="primary"
          />
          <AnimatedStat
            label="Automatizaciones Activas"
            value={150}
            suffix="+"
            icon="auto_fix_high"
            color="accent"
          />
          <AnimatedStat
            label="Tiempo de Implementación"
            value={3}
            suffix=" sem"
            icon="timelapse"
            color="primary"
          />
          <AnimatedStat
            label="Soporte 24/7"
            value={100}
            suffix="%"
            icon="support_agent"
            color="accent"
          />
        </motion.div>
      </section>

      {/* TECHNOLOGIES MARQUEE */}
      <TechMarquee />

      {/* ¿QUÉ ES UNA AUTOMATIZACIÓN COMPLETA? */}
      <section id="que-es" className="py-24 md:py-32 bg-background-dark section-spaced">
        <div className="container mx-auto px-6">
          <div className="mb-16 text-center">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 mb-6">
              <span className="material-symbols-outlined text-primary">help</span>
              <span className="text-primary text-sm font-bold uppercase tracking-widest font-montserrat">¿Qué es esto?</span>
            </div>
            <h2 className="font-michroma text-3xl md:text-4xl text-white uppercase mb-4 leading-tight">
              ¿Qué significa <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">"automatización completa"?</span>
            </h2>
            <p className="font-montserrat text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
              Te lo explicamos en lenguaje simple, sin tecnicismos.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* CONCEPTO 1 */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeInUp}
              className="flex flex-col bg-navy-darker border border-slate-800 rounded-xl p-6 md:p-8"
            >
              <div className="w-14 h-14 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-primary text-3xl">smart_toy</span>
              </div>
              <h3 className="font-michroma text-lg text-white uppercase mb-4">No es un "flujo"</h3>
              <h4 className="font-montserrat text-primary text-sm font-bold mb-3">Es un SISTEMA INTELIGENTE</h4>
              <p className="font-montserrat text-sm text-slate-300 leading-relaxed mb-4">
                Piensa en esto como tu empleado digital que nunca duerme, nunca comete errores, y trabaja 24/7.
              </p>
              <p className="font-montserrat text-xs text-slate-400 mb-4">Automatizamos:</p>
              <ul className="flex flex-col gap-2 flex-1 font-montserrat text-sm text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-primary text-sm mt-0.5 flex-shrink-0">check_circle</span>
                  Responder consultas de clientes automáticamente
                </li>
                <li className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-primary text-sm mt-0.5 flex-shrink-0">check_circle</span>
                  Agendar citas sin intervención humana
                </li>
                <li className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-primary text-sm mt-0.5 flex-shrink-0">check_circle</span>
                  Enviar recordatorios y seguimientos
                </li>
                <li className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-primary text-sm mt-0.5 flex-shrink-0">check_circle</span>
                  Capturar leads de tu web o WhatsApp
                </li>
                <li className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-primary text-sm mt-0.5 flex-shrink-0">check_circle</span>
                  Procesar pagos y generar facturas
                </li>
              </ul>
            </motion.div>

            {/* CONCEPTO 2 */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeInUp}
              className="flex flex-col bg-navy-darker border border-slate-800 rounded-xl p-6 md:p-8"
            >
              <div className="w-14 h-14 rounded-lg bg-accent/10 border border-accent/30 flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-accent text-3xl">bolt</span>
              </div>
              <h3 className="font-michroma text-lg text-white uppercase mb-4">¿Qué son las "ejecuciones"?</h3>
              <h4 className="font-montserrat text-accent text-sm font-bold mb-3">CADA VEZ que el sistema hace algo</h4>
              <p className="font-montserrat text-sm text-slate-300 leading-relaxed mb-4">
                Es cada acción automática que realiza por ti. Sin confusión: respuesta = ejecución.
              </p>
              <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-800">
                <p className="font-montserrat text-xs text-slate-400 mb-2">Ejemplos concretos:</p>
                <ul className="flex flex-col gap-2 font-montserrat text-sm text-slate-300">
                  <li className="flex items-center gap-2">
                    <span className="text-primary font-bold">●</span> Responder 1 mensaje WhatsApp = 1 ejecución
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-primary font-bold">●</span> Procesar 1 pago = 1 ejecución
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-primary font-bold">●</span> Enviar 1 factura = 1 ejecución
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-primary font-bold">●</span> Agendar 1 cita = 1 ejecución
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-primary font-bold">●</span> Analizar 1 consulta con IA = 1 ejecución
                  </li>
                </ul>
              </div>
            </motion.div>

            {/* CONCEPTO 3 */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeInUp}
              className="flex flex-col bg-navy-darker border border-slate-800 rounded-xl p-6 md:p-8"
            >
              <div className="w-14 h-14 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-primary text-3xl">handshake</span>
              </div>
              <h3 className="font-michroma text-lg text-white uppercase mb-4">Lo que SÍ incluye</h3>
              <h4 className="font-montserrat text-primary text-sm font-bold mb-3">"Todo por ti" significa:</h4>
              <ul className="flex flex-col gap-2 flex-1 font-montserrat text-sm text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-green-400 text-sm mt-0.5 flex-shrink-0">check_circle</span>
                  <span><strong>Creamos</strong> los flujos de automatización</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-green-400 text-sm mt-0.5 flex-shrink-0">check_circle</span>
                  <span><strong>Conectamos</strong> tus herramientas (CRM, calendario, WhatsApp)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-green-400 text-sm mt-0.5 flex-shrink-0">check_circle</span>
                  <span><strong>Configuramos</strong> la IA para que responda como tú</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-green-400 text-sm mt-0.5 flex-shrink-0">check_circle</span>
                  <span><strong>Probamos</strong> todo antes de activarlo</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-green-400 text-sm mt-0.5 flex-shrink-0">check_circle</span>
                  <span><strong>Entregamos</strong> sistema funcionando — tú solo usas</span>
                </li>
              </ul>
            </motion.div>
          </div>

          <div className="mt-12 p-6 bg-accent/10 border border-accent/30 rounded-xl">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="flex-shrink-0">
                <span className="material-symbols-outlined text-accent text-4xl">info</span>
              </div>
              <div className="flex-1">
                <h4 className="font-montserrat text-accent font-bold text-lg mb-2">¿Qué NO incluye?</h4>
                <p className="font-montserrat text-sm text-slate-300 leading-relaxed">
                  No vendemos acceso a herramientas. No te damos un Zapier o Make para que tú lo configures.
                  <br/><strong className="text-white">Nosotros entregamos un sistema automatizado COMPLETO funcionando.</strong>
                  <br/><br/>
                  Tú no tocas código. Nosotros hacemos todo: diseño, desarrollo, conexión, pruebas, despliegue, y soporte.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* EJEMPLOS REALES */}
      <ExamplesSection />

      {/* CÓMO FUNCIONA */}
      <section className="py-24 md:py-32 bg-navy-darker section-spaced">
        <div className="container mx-auto px-6">
          <div className="mb-16 text-center">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 mb-6">
              <span className="material-symbols-outlined text-primary">timeline</span>
              <span className="text-primary text-sm font-bold uppercase tracking-widest font-montserrat">Cómo Trabajamos</span>
            </div>
            <h2 className="font-michroma text-3xl md:text-4xl text-white uppercase mb-4 leading-tight">
              Proceso <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Simple</span>
            </h2>
            <p className="font-montserrat text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
              Así es como creamos tu sistema automatizado — sin complicaciones.
            </p>
          </div>

          <ProcessAnimation />
        </div>
      </section>

      {/* PRECIOS - NUEVOS PLANES CLAROS */}
      <section id="precios" className="py-24 md:py-32 bg-background-dark relative overflow-hidden section-spaced">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 mb-6">
              <span className="material-symbols-outlined text-primary">payments</span>
              <span className="text-primary text-sm font-bold uppercase tracking-widest font-montserrat">Planes Simples</span>
            </div>
            <h2 className="font-michroma text-3xl md:text-4xl text-white uppercase mb-4 leading-tight">
              Elige tu nivel de <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">automatización</span>
            </h2>
            <p className="font-montserrat text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
              Todos los planes incluyen sistema completo + soporte. Solo cambia el número de procesos y volumen.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {/* BÁSICO PLAN */}
            <div className="group relative flex flex-col bg-navy-darker border border-slate-800 rounded-xl p-6 md:p-8 transition-all duration-300 hover:border-primary/40">
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold uppercase tracking-widest text-slate-500 font-montserrat">INICIO</span>
                </div>
                <h3 className="font-michroma text-white text-lg mb-2">1 Sistema Automatizado</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Para emprendedores que quieren automatizar su primera tarea repetitiva.
                </p>
              </div>

              <div className="mb-6 pb-6 border-b border-slate-800">
                <div className="flex items-end gap-2 mb-2">
                  <span className="font-michroma text-4xl text-white">$72</span>
                  <span className="text-slate-500 text-sm mb-1 font-montserrat">/mes</span>
                </div>
                <p className="text-slate-500 text-xs font-montserrat">Setup único: $210 (una sola vez)</p>
              </div>

              <ul className="flex flex-col gap-4 flex-1 font-montserrat mb-2">
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-primary text-sm mt-0.5 flex-shrink-0">check_circle</span>
                  <div>
                    <p className="text-sm text-slate-300"><strong>1 Sistema completo</strong></p>
                    <p className="text-xs text-slate-500">Ej: WhatsApp automatizado, o agendamiento, o facturación</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-primary text-sm mt-0.5 flex-shrink-0">check_circle</span>
                  <div>
                    <p className="text-sm text-slate-300"><strong>Hasta 1,000 interacciones/mes</strong></p>
                    <p className="text-xs text-slate-500">≈ 500 mensajes WhatsApp + 300 pagos + 200 recordatorios</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-primary text-sm mt-0.5 flex-shrink-0">check_circle</span>
                  <div>
                    <p className="text-sm text-slate-300"><strong>1 canal automatizado</strong></p>
                    <p className="text-xs text-slate-500">WhatsApp, Email, o Web (elige uno)</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-primary text-sm mt-0.5 flex-shrink-0">check_circle</span>
                  <div>
                    <p className="text-sm text-slate-300"><strong>Sincronización Google Calendar</strong></p>
                    <p className="text-xs text-slate-500">Agenda citas automáticamente viendo tu disponibilidad</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-primary text-sm mt-0.5 flex-shrink-0">check_circle</span>
                  <div>
                    <p className="text-sm text-slate-300"><strong>Soporte por email</strong></p>
                    <p className="text-xs text-slate-500">Respuesta en &lt;24h</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-primary text-sm mt-0.5 flex-shrink-0">check_circle</span>
                  <div>
                    <p className="text-sm text-slate-300"><strong>Panel de monitoreo</strong></p>
                    <p className="text-xs text-slate-500">Ve qué está haciendo el sistema en tiempo real</p>
                  </div>
                </li>
              </ul>

              <div className="mt-auto pt-6 border-t border-slate-800">
                <p className="font-montserrat text-sm text-slate-400 mb-4">
                  <strong className="text-white">¿Qué obtienes?</strong><br/>
                  1 automatización funcionando en 2-3 semanas. 15+ horas semanales liberadas.
                </p>
                <button onClick={() => navigate('/contacto')} className="w-full border border-slate-700 text-slate-300 py-3 text-sm font-bold uppercase tracking-widest hover:border-primary hover:text-primary transition-all font-montserrat rounded">
                  Comenzar
                </button>
              </div>
            </div>

            {/* PROFESIONAL PLAN */}
            <div className="group relative flex flex-col card-gradient rounded-xl p-6 md:p-8 transition-all duration-300 hover:shadow-glow-primary">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <span className="px-4 py-1 text-[10px] font-bold uppercase tracking-widest text-white rounded-full bg-gradient-to-r from-primary to-accent">MÁS POPULAR</span>
              </div>
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold uppercase tracking-widest text-primary font-montserrat">CRECIMIENTO</span>
                </div>
                <h3 className="font-michroma text-white text-lg mb-2">Hasta 3 Sistemas Automatizados</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Para negocios en crecimiento que necesitan múltiples automatizaciones + IA.
                </p>
              </div>

              <div className="mb-6 pb-6 border-b border-primary/20">
                <div className="flex items-end gap-2 mb-2">
                  <span className="font-michroma text-4xl text-white">$150</span>
                  <span className="text-slate-400 text-sm mb-1 font-montserrat">/mes</span>
                </div>
                <p className="text-slate-500 text-xs font-montserrat">Setup único: $420 (una sola vez)</p>
              </div>

              <ul className="flex flex-col gap-4 flex-1 font-montserrat mb-2">
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-primary text-sm mt-0.5 flex-shrink-0">check_circle</span>
                  <div>
                    <p className="text-sm text-slate-300"><strong>Hasta 3 sistemas completos</strong></p>
                    <p className="text-xs text-slate-500">Ej: WhatsApp + Email + Agendamiento. Pueden conectarse entre sí</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-primary text-sm mt-0.5 flex-shrink-0">check_circle</span>
                  <div>
                    <p className="text-sm text-slate-300"><strong>Hasta 5,000 interacciones/mes</strong></p>
                    <p className="text-xs text-slate-500">≈ 2,500 mensajes + 1,500 pagos + 1,000 recordatorios</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-primary text-sm mt-0.5 flex-shrink-0">check_circle</span>
                  <div>
                    <p className="text-sm text-slate-300"><strong>Multi-canal completo</strong></p>
                    <p className="text-xs text-slate-500">WhatsApp + Email + Web automatizados simultáneamente</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-primary text-sm mt-0.5 flex-shrink-0">check_circle</span>
                  <div>
                    <p className="text-sm text-slate-300"><strong>Agente IA personalizado</strong></p>
                    <p className="text-xs text-slate-500">Aprende cómo respondes tú. Atiende consultas complejas, no solo FAQs</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-primary text-sm mt-0.5 flex-shrink-0">check_circle</span>
                  <div>
                    <p className="text-sm text-slate-300"><strong>Automatizaciones de seguimiento</strong></p>
                    <p className="text-xs text-slate-500">Recordatorios, reactivación de clientes, encuestas post-servicio</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-primary text-sm mt-0.5 flex-shrink-0">check_circle</span>
                  <div>
                    <p className="text-sm text-slate-300"><strong>Dashboard con métricas</strong></p>
                    <p className="text-xs text-slate-500">ROI calculado automáticamente, alertas, qué funciona mejor</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-primary text-sm mt-0.5 flex-shrink-0">check_circle</span>
                  <div>
                    <p className="text-sm text-slate-300"><strong>Soporte prioritario</strong></p>
                    <p className="text-xs text-slate-500">Respuesta &lt;12h por WhatsApp/email</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-primary text-sm mt-0.5 flex-shrink-0">check_circle</span>
                  <div>
                    <p className="text-sm text-slate-300"><strong>Optimización mensual</strong></p>
                    <p className="text-xs text-slate-500">Revisión mensual + 30min consultoría para escalar</p>
                  </div>
                </li>
              </ul>

              <div className="mt-auto pt-6 border-t border-primary/20">
                <p className="font-montserrat text-sm text-slate-400 mb-4">
                  <strong className="text-white">¿Qué obtienes?</strong><br/>
                  3 sistemas funcionando + IA personalizada. 40+ horas semanales liberadas.
                </p>
                <button onClick={() => navigate('/contacto')} className="w-full py-3 text-sm font-bold uppercase tracking-widest text-white transition-all font-montserrat rounded hover:opacity-90 bg-gradient-to-r from-primary to-accent shadow-glow-primary">
                  Comenzar
                </button>
              </div>
            </div>

            {/* EMPRESARIAL PLAN */}
            <div className="group relative flex flex-col bg-navy-darker border border-slate-800 rounded-xl p-6 md:p-8 transition-all duration-300 hover:border-accent/40">
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold uppercase tracking-widest text-slate-500 font-montserrat">EMPRESARIAL</span>
                </div>
                <h3 className="font-michroma text-white text-lg mb-2">Automatización Total</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Para organizaciones que necesitan automatización completa + IA avanzada + soporte 24/7.
                </p>
              </div>

              <div className="mb-6 pb-6 border-b border-slate-800">
                <div className="flex items-end gap-2 mb-2">
                  <span className="font-michroma text-4xl text-white">$240</span>
                  <span className="text-slate-500 text-sm mb-1 font-montserrat">/mes</span>
                </div>
                <p className="text-slate-500 text-xs font-montserrat">Setup único: $720 (una sola vez)</p>
              </div>

              <ul className="flex flex-col gap-4 flex-1 font-montserrat mb-2">
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-accent text-sm mt-0.5 flex-shrink-0">check_circle</span>
                  <div>
                    <p className="text-sm text-slate-300"><strong>Flujos ilimitados</strong></p>
                    <p className="text-xs text-slate-500">Creamos todas las automatizaciones que necesites. Sin límite.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-accent text-sm mt-0.5 flex-shrink-0">check_circle</span>
                  <div>
                    <p className="text-sm text-slate-300"><strong>Hasta 20,000 interacciones/mes</strong></p>
                    <p className="text-xs text-slate-500">≈ 10,000 mensajes + 6,000 pagos + 4,000 notificaciones</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-accent text-sm mt-0.5 flex-shrink-0">check_circle</span>
                  <div>
                    <p className="text-sm text-slate-300"><strong>Todos los canales</strong></p>
                    <p className="text-xs text-slate-500">WhatsApp, Email, Web, SMS, Telegram, Instagram, voz (IVR)</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-accent text-sm mt-0.5 flex-shrink-0">check_circle</span>
                  <div>
                    <p className="text-sm text-slate-300"><strong>IA avanzada (NLP)</strong></p>
                    <p className="text-xs text-slate-500">Detecta emociones, negocia, resuelve conflictos. No solo respuestas predefinidas</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-accent text-sm mt-0.5 flex-shrink-0">check_circle</span>
                  <div>
                    <p className="text-sm text-slate-300"><strong>Dashboard administrativo</strong></p>
                    <p className="text-xs text-slate-500">KPIs de todos los departamentos, alertas proactivas, API access</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-accent text-sm mt-0.5 flex-shrink-0">check_circle</span>
                  <div>
                    <p className="text-sm text-slate-300"><strong>Integraciones con cualquier API</strong></p>
                    <p className="text-xs text-slate-500">Tu CRM, ERP, contabilidad, bases de datos — lo que sea</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-accent text-sm mt-0.5 flex-shrink-0">check_circle</span>
                  <div>
                    <p className="text-sm text-slate-300"><strong>Soporte dedicado 24/7</strong></p>
                    <p className="text-xs text-slate-500">Ingeniero asignado, chat en vivo, respuesta &lt;1h críticos</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-accent text-sm mt-0.5 flex-shrink-0">check_circle</span>
                  <div>
                    <p className="text-sm text-slate-300"><strong>Mejoras continuas + consultoría CTO</strong></p>
                    <p className="text-xs text-slate-500">Actualizaciones automáticas, auditorías de seguridad, roadmap compartido</p>
                  </div>
                </li>
              </ul>

              <div className="mt-auto pt-6 border-t border-slate-800">
                <p className="font-montserrat text-sm text-slate-400 mb-4">
                  <strong className="text-white">¿Qué obtienes?</strong><br/>
                  Automatización total de tu operación. 80+ horas semanales liberadas.
                </p>
                <button onClick={() => navigate('/contacto')} className="w-full border border-slate-700 text-slate-300 py-3 text-sm font-bold uppercase tracking-widest hover:border-accent hover:text-accent transition-all font-montserrat rounded">
                  Comenzar
                </button>
              </div>
            </div>
          </div>

          <ROICalculator />
        </div>
      </section>

      {/* SECCIÓN DE OBJECIONES AL PRECIO */}
      <ObjectionBuster />

      {/* CTA SECTION - MEJORADO */}
      <section className="py-20 section-spaced">
        <div className="container mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
            className="relative overflow-hidden rounded-2xl p-12 md:p-20 flex flex-col items-center text-center bg-gradient-to-r from-primary/20 via-accent/10 to-primary/20 border border-primary/20"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-[100px] rounded-full" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 blur-[100px] rounded-full" />

            <h2 className="relative z-10 font-michroma text-3xl md:text-4xl lg:text-5xl text-white mb-4 leading-tight animate-fadeInUp">
              ¿QUÉ AUTOMATIZARÍAS <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">HOY MISMO?</span>
            </h2>
            <p className="relative z-10 font-montserrat text-lg md:text-xl text-slate-300 mb-8 max-w-2xl leading-relaxed animate-fadeInUp">
              En 15 minutos te mostramos exactamente qué podrías automatizar y cuánto tiempo ahorrarías.
              <br/><span className="text-primary font-semibold">Sin costo. Sin compromiso.</span>
            </p>

            <motion.button
              onClick={() => navigate('/contacto')}
              className="relative z-10 px-10 py-5 text-base font-bold uppercase tracking-widest text-white transition-all rounded-lg shadow-glow-primary animate-fadeInUp"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                background: 'linear-gradient(135deg, #007BFF 0%, #8A2BE2 100%)',
                boxShadow: '0 0 20px rgba(13, 127, 242, 0.5), 0 0 40px rgba(138, 92, 246, 0.3)'
              }}
            >
              📞 Agenda una Consulta Gratis
            </motion.button>

            <p className="relative z-10 font-montserrat text-slate-400 text-sm mt-6 max-w-lg">
              Te contactamos en menos de 24h. Analizamos tu negocio y te damos opciones concretas.
              <br/><span className="text-slate-500">No vendemos humo — vendemos resultados.</span>
            </p>

            {/* Decorative elements */}
            <div className="absolute top-8 left-8 w-2 h-2 rounded-full bg-primary animate-pulse" />
            <div className="absolute top-8 right-8 w-2 h-2 rounded-full bg-accent animate-pulse" />
            <div className="absolute bottom-8 left-8 w-2 h-2 rounded-full bg-accent animate-pulse" />
            <div className="absolute bottom-8 right-8 w-2 h-2 rounded-full bg-primary animate-pulse" />
          </motion.div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <FAQSection />

      {/* FLOATING CONTACT BUTTON */}
      <FloatingContactButton />

      {/* FOOTER - Más conversional */}
      <footer className="bg-navy-darker border-t border-slate-800 pt-16 pb-8 section-spaced">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
            {/* COLUMN 1 - Brand + CTA */}
            <div className="lg:col-span-1">
              <div className="flex items-center gap-3 mb-6">
                <img src="/Logo3.png" alt="Javlabs Logo" className="h-12 w-auto object-contain" />
                <span className="text-white font-michroma text-lg font-bold tracking-widest">JAVLABS</span>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">
                Sistemas de automatización de alta gama para empresas con visión de futuro.
              </p>
              <a
                href="/contacto"
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-bold uppercase tracking-widest text-white rounded-lg transition-all"
                style={{ background: 'linear-gradient(135deg, #007BFF 0%, #8A2BE2 100%)' }}
              >
                <span className="material-symbols-outlined text-sm">phone</span>
                Consulta Gratis
              </a>
            </div>

            {/* COLUMN 2 - Producto */}
            <div>
              <h4 className="text-white font-michroma text-sm uppercase mb-6">Producto</h4>
              <ul className="flex flex-col gap-3 text-slate-400 text-sm">
                <li>
                  <a href="/servicios" className="hover:text-primary transition-colors flex items-center gap-2 group">
                    <span className="material-symbols-outlined text-xs opacity-0 group-hover:opacity-100 transition-opacity">arrow_forward</span>
                    Servicios
                  </a>
                </li>
                <li>
                  <a href="#precios" className="hover:text-primary transition-colors flex items-center gap-2 group">
                    <span className="material-symbols-outlined text-xs opacity-0 group-hover:opacity-100 transition-opacity">arrow_forward</span>
                    Precios
                  </a>
                </li>
                <li>
                  <a href="/contacto" className="hover:text-primary transition-colors flex items-center gap-2 group">
                    <span className="material-symbols-outlined text-xs opacity-0 group-hover:opacity-100 transition-opacity">arrow_forward</span>
                    Casos de Éxito
                  </a>
                </li>
                <li>
                  <a href="/login" className="hover:text-primary transition-colors flex items-center gap-2 group">
                    <span className="material-symbols-outlined text-xs opacity-0 group-hover:opacity-100 transition-opacity">arrow_forward</span>
                    Portal de Clientes
                  </a>
                </li>
              </ul>
            </div>

            {/* COLUMN 3 - Empresa */}
            <div>
              <h4 className="text-white font-michroma text-sm uppercase mb-6">Empresa</h4>
              <ul className="flex flex-col gap-3 text-slate-400 text-sm">
                <li>
                  <a href="/nosotros" className="hover:text-primary transition-colors flex items-center gap-2 group">
                    <span className="material-symbols-outlined text-xs opacity-0 group-hover:opacity-100 transition-opacity">arrow_forward</span>
                    Nosotros
                  </a>
                </li>
                <li>
                  <a href="/contacto" className="hover:text-primary transition-colors flex items-center gap-2 group">
                    <span className="material-symbols-outlined text-xs opacity-0 group-hover:opacity-100 transition-opacity">arrow_forward</span>
                    Contacto
                  </a>
                </li>
                <li>
                  <a href="/contacto" className="hover:text-primary transition-colors flex items-center gap-2 group">
                    <span className="material-symbols-outlined text-xs opacity-0 group-hover:opacity-100 transition-opacity">arrow_forward</span>
                    Soporte
                  </a>
                </li>
                <li>
                  <a href="/contacto" className="hover:text-primary transition-colors flex items-center gap-2 group">
                    <span className="material-symbols-outlined text-xs opacity-0 group-hover:opacity-100 transition-opacity">arrow_forward</span>
                    Carreras
                  </a>
                </li>
              </ul>
            </div>

            {/* COLUMN 4 - Contacto */}
            <div>
              <h4 className="text-white font-michroma text-sm uppercase mb-6">Contacto</h4>
              <ul className="flex flex-col gap-4 text-slate-400 text-sm">
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-primary mt-0.5 flex-shrink-0">email</span>
                  <span>hola@javlabsautomatic.com</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-primary mt-0.5 flex-shrink-0">phone</span>
                  <span>+593 99 123 4567</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-primary mt-0.5 flex-shrink-0">location_on</span>
                  <span>Quito, Ecuador</span>
                </li>
              </ul>

              {/* Social */}
              <div className="mt-8">
                <h5 className="text-white text-xs font-bold uppercase mb-3 font-montserrat">Síguenos</h5>
                <div className="flex gap-3">
                  {['facebook', 'twitter', 'linkedin', 'instagram'].map((social) => (
                    <a
                      key={social}
                      href="/"
                      className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-primary border border-slate-700 hover:border-primary flex items-center justify-center transition-all group"
                      aria-label={`Síguenos en ${social}`}
                    >
                      <span className="material-symbols-outlined text-slate-400 group-hover:text-primary text-xs">
                        {social === 'facebook' ? 'facebook' : social === 'twitter' ? 'alternate_email' : social === 'linkedin' ? 'alternate_description' : 'photo_camera'}
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Footer bottom - Legal */}
          <div className="border-t border-slate-800 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-500 text-xs text-center md:text-left">
              © {new Date().getFullYear()} JAV LABS. Todos los derechos reservados.
            </p>
            <div className="flex gap-6 text-slate-500 text-xs">
              <a href="/" className="hover:text-primary transition-colors">Política de Privacidad</a>
              <a href="/" className="hover:text-primary transition-colors">Términos de Servicio</a>
              <a href="/" className="hover:text-primary transition-colors">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}