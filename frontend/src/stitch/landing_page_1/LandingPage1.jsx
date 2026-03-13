import { Link, useNavigate } from 'react-router-dom';
import ROICalculator from '../pricing_page/ROICalculator';
import PublicNavbar from '../../components/PublicNavbar';
import './LandingPage1.css';

export default function LandingPage1() {
  const navigate = useNavigate();

  return (
    <>
      {/* ───── HEADER ───── */}
      <PublicNavbar />

      {/* ───── HERO ───── */}
      <section className="relative overflow-hidden pt-20 pb-32">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          <div className="flex flex-col gap-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 w-fit">
              <span className="material-symbols-outlined text-primary text-sm">bolt</span>
              <span className="text-primary text-xs font-bold uppercase tracking-widest">Next-Gen Automation</span>
            </div>

            <h1 className="font-michroma text-4xl md:text-6xl text-white leading-tight uppercase">
              AUTOMATIZA TU NEGOCIO. <br />
              <span className="gradient-text">ESCALA SIN LÍMITES.</span>
            </h1>

            <p className="font-montserrat text-lg text-slate-400 max-w-xl leading-relaxed">
              Optimiza procesos críticos y aumenta la eficiencia operativa con soluciones de
              inteligencia artificial y flujos de trabajo de vanguardia.
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <button
                onClick={() => navigate('/servicios')}
                className="text-white px-8 py-4 text-sm font-bold uppercase tracking-widest rounded hover:opacity-90 transition-all"
                style={{ background: 'linear-gradient(to right, #0d7ff2, #8b5cf6)', boxShadow: '0 10px 15px -3px rgba(13,127,242,0.2)' }}
              >
                Ver Servicios
              </button>
              <button className="border border-slate-700 text-white px-8 py-4 text-sm font-bold uppercase tracking-widest rounded hover:bg-slate-800 transition-all">
                Más Información
              </button>
            </div>
          </div>

          <div className="relative hidden lg:block">
            <div className="relative z-10 w-full aspect-square rounded-2xl border border-slate-800 bg-navy-darker/50 overflow-hidden group">
              <div className="absolute inset-0 opacity-30 group-hover:opacity-50 transition-opacity duration-700 bg-[radial-gradient(circle_at_50%_50%,#0d7ff2_0%,transparent_70%)]" />
              <div className="absolute inset-0 flex items-center justify-center">
                <svg className="w-full h-full p-12 text-primary/40" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20,100 L180,100 M100,20 L100,180 M60,60 L140,140 M140,60 L60,140" fill="none" stroke="currentColor" strokeWidth="0.5" />
                  <circle cx="100" cy="100" fill="none" r="40" stroke="currentColor" strokeDasharray="4,4" strokeWidth="1" />
                  <rect fill="none" height="60" stroke="currentColor" strokeWidth="2" width="60" x="70" y="70" />
                  <circle cx="20"  cy="100" fill="#8b5cf6" r="3" />
                  <circle cx="180" cy="100" fill="#8b5cf6" r="3" />
                  <circle cx="100" cy="20"  fill="#0d7ff2" r="3" />
                  <circle cx="100" cy="180" fill="#0d7ff2" r="3" />
                </svg>
              </div>
              <img
                className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-screen"
                alt="Circuit board"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAVT_tmrJ7SRehELAkUzm1UqaCFG4duEqA3gZQQIsVLYwRSllmGjy5EdAsk7OnuagrM0pi3SDl0iBz6aGJtkxjCt5fwVhbE7FRxhYz1_sjjY2-aZbP5KwS8egY9fy_rsFaO9X03KgWv9mGvrSzbo2Jaoxqkr4xYMiHISpYuGGHW3Nm7p35NQfzzOq508BJq5cGHWmxDOZB0OmmNyir9p1g_bniU2HCtoxQTLobJyJgVMwikAQm8rvJanbhiuqE3Ew0ThRjnqAixc2M"
              />
            </div>
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-accent/20 blur-[80px] rounded-full" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-primary/20 blur-[80px] rounded-full" />
          </div>
        </div>
      </section>

      {/* ───── STATS ───── */}
      <div className="bg-navy-darker border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row justify-between items-center gap-8">
          {[
            { label: 'Procesos Optimizados', value: '500+' },
            { label: 'Eficiencia Aumentada',  value: '95%'  },
            { label: 'Clientes Satisfechos',  value: '120+' },
            { label: 'Soporte 24/7',          value: '100%' },
          ].map((stat, i) => (
            <div key={stat.label} className="flex items-center gap-8 w-full md:w-auto">
              {i > 0 && <div className="hidden md:block w-px h-12 bg-gradient-to-b from-primary to-accent" />}
              <div className="flex-1 text-center md:text-left">
                <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.2em] mb-1">{stat.label}</p>
                <p className="text-3xl font-michroma text-white">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ───── SERVICIOS ───── */}
      <section className="py-32 bg-background-dark">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-20">
            <h2 className="font-michroma text-3xl text-white uppercase mb-4">Servicios Especializados</h2>
            <div className="h-1 w-20 bg-gradient-to-r from-primary to-accent" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: 'account_tree', boxClass: 'bg-primary/10 border-primary/30 group-hover:bg-primary/20', iconClass: 'gradient-text', linkClass: 'text-primary', title: 'Automatización de Workflows',  desc: 'Eliminamos cuellos de botella mediante flujos de trabajo inteligentes que conectan todas tus herramientas de negocio.' },
              { icon: 'psychology',   boxClass: 'bg-accent/10  border-accent/30  group-hover:bg-accent/20',  iconClass: 'text-accent',   linkClass: 'text-accent',  title: 'IA Generativa Aplicada',       desc: 'Implementación de LLMs y agentes autónomos para atención al cliente, creación de contenido y análisis de datos avanzado.' },
              { icon: 'terminal',     boxClass: 'bg-primary/10 border-primary/30 group-hover:bg-primary/20', iconClass: 'gradient-text', linkClass: 'text-primary', title: 'Consultoría IT Estratégica',    desc: 'Diseñamos la hoja de ruta tecnológica para que tu infraestructura crezca al ritmo de tu visión empresarial.' },
            ].map((s) => (
              <div key={s.title} className="group p-8 bg-navy-darker border border-slate-800 rounded-lg glow-hover transition-all duration-300">
                <div className={`w-14 h-14 mb-6 rounded flex items-center justify-center border transition-colors ${s.boxClass}`}>
                  <span className={`material-symbols-outlined text-3xl ${s.iconClass}`}>{s.icon}</span>
                </div>
                <h3 className="font-michroma text-lg text-white mb-4 uppercase leading-tight">{s.title}</h3>
                <p className="font-montserrat text-slate-400 text-sm leading-relaxed mb-6">{s.desc}</p>
                <Link to="/servicios" className={`${s.linkClass} text-xs font-bold uppercase tracking-widest flex items-center gap-2 hover:gap-4 transition-all`}>
                  Saber más <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── PROCESO ───── */}
      {/*
        Fiel al HTML original:
        - Círculos: rounded-full (no cuadrados)
        - Línea: top-8 (32px), opacity-20, gradiente from-primary via-accent to-primary
        - Dots: top-[30px], left-[33%] y left-[66%], z-20 para quedar sobre la línea
        - Steps: z-10
        - Línea y dots al FINAL del DOM → quedan visualmente detrás/sobre correctamente
      */}
      <section className="py-32 bg-navy-darker">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="font-michroma text-3xl text-white uppercase mb-16 tracking-wide">Nuestro Proceso</h2>

          <div className="relative flex flex-col md:flex-row justify-between items-start gap-12">

            {/* Step 1 */}
            <div className="relative z-10 flex flex-col items-center md:items-start text-center md:text-left w-full md:w-1/3">
              <div className="size-16 rounded-full bg-navy-darker border-2 border-primary flex items-center justify-center mb-6 shadow-[0_0_15px_rgba(13,127,242,0.4)]">
                <span className="font-michroma text-white text-xl">01</span>
              </div>
              <h4 className="font-michroma text-lg text-white mb-4">DIAGNÓSTICO</h4>
              <p className="font-montserrat text-slate-400 text-sm max-w-xs">Análisis profundo de tus procesos actuales para identificar oportunidades de mejora.</p>
            </div>

            {/* Step 2 */}
            <div className="relative z-10 flex flex-col items-center md:items-start text-center md:text-left w-full md:w-1/3">
              <div className="size-16 rounded-full bg-navy-darker border-2 border-accent flex items-center justify-center mb-6 shadow-[0_0_15px_rgba(139,92,246,0.4)]">
                <span className="font-michroma text-white text-xl">02</span>
              </div>
              <h4 className="font-michroma text-lg text-white mb-4">DESARROLLO</h4>
              <p className="font-montserrat text-slate-400 text-sm max-w-xs">Construcción y despliegue de las automatizaciones personalizadas.</p>
            </div>

            {/* Step 3 */}
            <div className="relative z-10 flex flex-col items-center md:items-start text-center md:text-left w-full md:w-1/3">
              <div className="size-16 rounded-full bg-navy-darker border-2 border-primary flex items-center justify-center mb-6 shadow-[0_0_15px_rgba(13,127,242,0.4)]">
                <span className="font-michroma text-white text-xl">03</span>
              </div>
              <h4 className="font-michroma text-lg text-white mb-4">ESCALADO</h4>
              <p className="font-montserrat text-slate-400 text-sm max-w-xs">Mantenimiento continuo y expansión de capacidades para un crecimiento sostenido.</p>
            </div>

            {/* Línea — z-0, detrás de los círculos */}
            <div className="hidden md:block absolute top-8 left-0 w-full h-0.5 bg-gradient-to-r from-primary via-accent to-primary opacity-20 z-0" />
            {/* Dots brillantes — z-20, encima de la línea */}
            <div className="hidden md:block absolute top-[30px] left-[33%] size-2 rounded-full bg-primary z-20 shadow-[0_0_8px_#0d7ff2]" />
            <div className="hidden md:block absolute top-[30px] left-[66%] size-2 rounded-full bg-accent  z-20 shadow-[0_0_8px_#8b5cf6]" />
          </div>
        </div>
      </section>


      {/* ───── PLANES ───── */}
      <section id="precios" className="py-32 bg-background-dark relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #0d7ff2 1px, transparent 0)', backgroundSize: '48px 48px' }} />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <span className="material-symbols-outlined text-primary text-sm">payments</span>
              <span className="text-primary text-xs font-bold uppercase tracking-widest">Planes y Precios</span>
            </div>
            <h2 className="font-michroma text-3xl md:text-4xl text-white uppercase mb-4">Soluciones para cada negocio</h2>
            <p className="font-montserrat text-slate-400 max-w-2xl mx-auto">Desde startups hasta empresas consolidadas — tenemos el plan exacto para automatizar tus procesos y escalar sin límites.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">

            {/* Plan Básico */}
            <div className="group relative flex flex-col bg-navy-darker border border-slate-800 rounded-xl p-8 hover:border-primary/40 transition-all duration-300">
              <div className="mb-8">
                <span className="text-xs font-bold uppercase tracking-widest text-slate-500 font-montserrat">Básico</span>
                <div className="mt-4 flex items-end gap-2">
                  <span className="font-michroma text-4xl text-white">$120</span>
                  <span className="text-slate-500 text-sm mb-1 font-montserrat">/mes</span>
                </div>
                <p className="text-slate-500 text-xs font-montserrat mt-1">+ $350 setup inicial</p>
                <p className="text-slate-400 text-sm font-montserrat mt-4 leading-relaxed">Ideal para negocios pequeños o emprendedores que quieren automatizar sus primeros procesos.</p>
              </div>
              <div className="h-px bg-slate-800 mb-8" />
              <ul className="flex flex-col gap-4 flex-1 font-montserrat">
                {['1 flujo de automatización', 'Hasta 1,000 ejecuciones/mes', 'Integración con 1 canal (WhatsApp, Email o Web)', 'Google Calendar incluido', 'Soporte técnico básico', 'Panel de monitoreo'].map(f => (
                  <li key={f} className="flex items-start gap-3 text-sm text-slate-400">
                    <span className="material-symbols-outlined text-primary text-sm mt-0.5 flex-shrink-0">check_circle</span>
                    {f}
                  </li>
                ))}
              </ul>
              <button onClick={() => navigate('/contacto')}
                className="mt-8 w-full border border-slate-700 text-slate-300 py-3 text-xs font-bold uppercase tracking-widest hover:border-primary hover:text-primary transition-all font-montserrat rounded">
                Comenzar
              </button>
            </div>

            {/* Plan Profesional */}
            <div className="group relative flex flex-col rounded-xl p-8 transition-all duration-300"
              style={{ background: 'linear-gradient(135deg, #0d1b2a 0%, #0d2a4a 100%)', border: '1px solid rgba(13,127,242,0.4)', boxShadow: '0 0 40px rgba(13,127,242,0.15)' }}>
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <span className="px-4 py-1 text-[10px] font-bold uppercase tracking-widest text-white rounded-full font-montserrat"
                  style={{ background: 'linear-gradient(90deg, #0d7ff2, #8b5cf6)' }}>
                  Más Popular
                </span>
              </div>
              <div className="mb-8">
                <span className="text-xs font-bold uppercase tracking-widest text-primary font-montserrat">Profesional</span>
                <div className="mt-4 flex items-end gap-2">
                  <span className="font-michroma text-4xl text-white">$250</span>
                  <span className="text-slate-400 text-sm mb-1 font-montserrat">/mes</span>
                </div>
                <p className="text-slate-500 text-xs font-montserrat mt-1">+ $700 setup inicial</p>
                <p className="text-slate-400 text-sm font-montserrat mt-4 leading-relaxed">Para empresas en crecimiento que necesitan múltiples flujos y automatización avanzada con IA.</p>
              </div>
              <div className="h-px mb-8" style={{ background: 'rgba(13,127,242,0.2)' }} />
              <ul className="flex flex-col gap-4 flex-1 font-montserrat">
                {['Hasta 3 flujos de automatización', 'Hasta 5,000 ejecuciones/mes', 'Multi-canal (WhatsApp + Email + Web)', 'Agente IA personalizado', 'Recordatorios y seguimientos automáticos', 'Reportes y métricas', 'Soporte prioritario', 'Optimización mensual'].map(f => (
                  <li key={f} className="flex items-start gap-3 text-sm text-slate-300">
                    <span className="material-symbols-outlined text-primary text-sm mt-0.5 flex-shrink-0">check_circle</span>
                    {f}
                  </li>
                ))}
              </ul>
              <button onClick={() => navigate('/contacto')}
                className="mt-8 w-full py-3 text-xs font-bold uppercase tracking-widest text-white transition-all font-montserrat rounded hover:opacity-90"
                style={{ background: 'linear-gradient(90deg, #0d7ff2, #8b5cf6)' }}>
                Comenzar
              </button>
            </div>

            {/* Plan Empresarial */}
            <div className="group relative flex flex-col bg-navy-darker border border-slate-800 rounded-xl p-8 hover:border-accent/40 transition-all duration-300">
              <div className="mb-8">
                <span className="text-xs font-bold uppercase tracking-widest text-slate-500 font-montserrat">Empresarial</span>
                <div className="mt-4 flex items-end gap-2">
                  <span className="font-michroma text-4xl text-white">$400</span>
                  <span className="text-slate-500 text-sm mb-1 font-montserrat">/mes</span>
                </div>
                <p className="text-slate-500 text-xs font-montserrat mt-1">+ $1,200 setup inicial</p>
                <p className="text-slate-400 text-sm font-montserrat mt-4 leading-relaxed">Para organizaciones que requieren automatización completa, IA avanzada y soporte dedicado.</p>
              </div>
              <div className="h-px bg-slate-800 mb-8" />
              <ul className="flex flex-col gap-4 flex-1 font-montserrat">
                {['Flujos ilimitados', 'Hasta 20,000 ejecuciones/mes', 'Todos los canales de comunicación', 'IA con procesamiento de lenguaje natural', 'Dashboard administrativo completo', 'Integraciones con CRM y APIs externas', 'Soporte dedicado 24/7', 'Mejoras y mantenimiento continuo'].map(f => (
                  <li key={f} className="flex items-start gap-3 text-sm text-slate-400">
                    <span className="material-symbols-outlined text-accent text-sm mt-0.5 flex-shrink-0">check_circle</span>
                    {f}
                  </li>
                ))}
              </ul>
              <button onClick={() => navigate('/contacto')}
                className="mt-8 w-full border border-slate-700 text-slate-300 py-3 text-xs font-bold uppercase tracking-widest hover:border-accent hover:text-accent transition-all font-montserrat rounded">
                Contactar
              </button>
            </div>
          </div>

          <ROICalculator />
        </div>
      </section>

      {/* ───── CTA ───── */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div
            className="relative overflow-hidden rounded-xl p-12 md:p-20 flex flex-col items-center text-center"
            style={{ background: 'linear-gradient(to right, #0d7ff2, #8b5cf6, #b06ab3)' }}
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-[100px] rounded-full" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 blur-[100px] rounded-full" />
            <h2 className="relative z-10 font-michroma text-3xl md:text-5xl text-white mb-8 leading-tight">
              ¿LISTO PARA LLEVAR TU NEGOCIO <br /> AL FUTURO?
            </h2>
            <p className="relative z-10 font-montserrat text-white/90 text-lg mb-10 max-w-2xl">
              Únete a las empresas que ya están ahorrando miles de horas de trabajo manual cada año.
            </p>
            <button
              onClick={() => navigate('/contacto')}
              className="relative z-10 bg-white px-10 py-5 text-sm font-bold uppercase tracking-[0.2em] rounded-lg shadow-2xl hover:bg-slate-50 transition-all transform hover:scale-105"
              style={{ color: '#0d7ff2' }}
            >
              Hablemos de tu Proyecto
            </button>
          </div>
        </div>
      </section>

      {/* ───── FOOTER ───── */}
      <footer className="bg-navy-darker border-t border-slate-800 pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">

          <div className="col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <div className="size-8 bg-gradient-to-br from-primary to-accent flex items-center justify-center rounded">
                <span className="text-white font-michroma text-sm font-bold">J/V</span>
              </div>
              <h2 className="text-white text-lg font-michroma tracking-tighter">JAV LABS</h2>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              Sistemas de automatización de alta gama para empresas con visión de futuro.
            </p>
            <div className="flex gap-4">
              <a href="/" className="size-10 rounded border border-slate-700 flex items-center justify-center hover:border-primary transition-colors">
                <svg className="w-5 h-5 text-slate-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                </svg>
              </a>
              <a href="/" className="size-10 rounded border border-slate-700 flex items-center justify-center hover:border-primary transition-colors">
                <svg className="w-5 h-5 text-slate-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-2 16h-2v-6h2v6zm-1-6.891c-.607 0-1.1-.493-1.1-1.109 0-.616.493-1.109 1.1-1.109s1.1.493 1.1 1.109c0 .616-.493 1.109-1.1 1.109zm8 6.891h-2v-3.412c0-.813-.015-1.861-1.134-1.861-1.134 0-1.308.886-1.308 1.802v3.471h-2v-6h1.92v.823h.027c.267-.506.92-1.027 1.94-1.127 1.18 0 1.18 1.905 1.18 3.514v3.541h2v6z" />
                </svg>
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-michroma text-sm uppercase mb-6">Empresa</h4>
            <ul className="flex flex-col gap-4 text-slate-400 text-sm">
              {['Nosotros', 'Casos de Éxito', 'Carreras', 'Prensa'].map((item) => (
                <li key={item}><a href="/" className="hover:text-primary transition-colors">{item}</a></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-michroma text-sm uppercase mb-6">Soporte</h4>
            <ul className="flex flex-col gap-4 text-slate-400 text-sm">
              <li><Link to="/contacto" className="hover:text-primary transition-colors">Contacto</Link></li>
              <li><Link to="/login"    className="hover:text-primary transition-colors">Portal de Clientes</Link></li>
              <li><a href="/"          className="hover:text-primary transition-colors">Documentación</a></li>
              <li><a href="/"          className="hover:text-primary transition-colors">FAQ</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-michroma text-sm uppercase mb-6">Newsletter</h4>
            <p className="text-slate-400 text-xs mb-4">Recibe insights sobre automatización cada semana.</p>
            <div className="flex">
              <input
                type="email"
                placeholder="Email"
                className="bg-background-dark border border-slate-700 rounded-l px-4 py-2 text-sm w-full focus:ring-1 focus:ring-primary focus:border-primary outline-none text-white"
              />
              <button
                className="text-white px-4 py-2 rounded-r hover:opacity-80 transition-all"
                style={{ background: '#0d7ff2' }}
              >
                <span className="material-symbols-outlined text-sm">send</span>
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-xs">© 2024 JAV LABS. Todos los derechos reservados.</p>
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
