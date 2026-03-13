import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PublicNavbar from '../../components/PublicNavbar';
import './ServicesPageVariant1.css';

export default function ServicesPageVariant1() {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState(1); // índice abierto por defecto

  const faqs = [
    {
      id: 0,
      question: '¿Cuánto tiempo toma una implementación estándar?',
      answer: 'Típicamente, los proyectos básicos se despliegan en 2-3 semanas, mientras que las soluciones Enterprise pueden tomar de 2 a 4 meses dependiendo de la complejidad.',
    },
    {
      id: 1,
      question: '¿Es necesario reemplazar mis herramientas actuales?',
      answer: 'No. Nuestra especialidad es la integración. Trabajamos sobre su stack tecnológico actual (Salesforce, Hubspot, SAP, etc.) para potenciarlo sin fricciones.',
    },
    {
      id: 2,
      question: '¿Ofrecen garantía de ROI?',
      answer: 'Sí. En proyectos de automatización estándar garantizamos un retorno medible en los primeros 90 días o extendemos el soporte sin costo adicional.',
    },
  ];

  return (
    <>
      <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden">

        {/* ───── HEADER ───── */}
        <PublicNavbar />

        <main className="flex-1">

          {/* ───── HERO ───── */}
          <section className="relative py-24 px-10 flex flex-col items-center justify-center text-center overflow-hidden">
            <div className="absolute inset-0 z-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, #0d0df2 0%, transparent 70%)' }} />
            <div className="relative z-10 max-w-4xl">
              <h1 className="text-white text-5xl md:text-6xl font-michroma mb-6 tracking-tighter">
                NUESTROS SERVICIOS
              </h1>
              <div className="gradient-underline w-32 mx-auto mb-8" />
              <p className="text-slate-400 font-montserrat text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
                Soluciones avanzadas de automatización e inteligencia artificial diseñadas para escalar tu infraestructura digital.
              </p>
            </div>
          </section>

          {/* ───── SERVICIOS ───── */}
          <section className="px-10 py-20 max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: 'memory',
                  title: 'Automatización de Procesos',
                  desc: 'Eliminamos cuellos de botella mediante flujos de trabajo inteligentes que conectan sus herramientas actuales.',
                  items: ['Ahorro de +40h mensuales', 'Reducción de error humano', 'Reportes en tiempo real'],
                },
                {
                  icon: 'psychology',
                  title: 'IA Generativa',
                  desc: 'Implementación de modelos de lenguaje personalizados para atención al cliente y análisis de datos profundo.',
                  items: ['Chatbots con contexto real', 'Análisis predictivo', 'Entrenamiento de LLMs'],
                },
                {
                  icon: 'hub',
                  title: 'Integración de Sistemas',
                  desc: 'Conectamos su ecosistema de software a través de APIs robustas para una sincronización de datos impecable.',
                  items: ['Estrategia API First', 'Escalabilidad horizontal', 'Seguridad de grado bancario'],
                },
              ].map((service) => (
                <div key={service.title} className="bg-card-dark border border-slate-800 p-8 flex flex-col hover-glow transition-all group">
                  <span className="material-symbols-outlined text-5xl circuit-icon mb-6">{service.icon}</span>
                  <h3 className="text-white text-xl font-michroma mb-4 tracking-tight">{service.title}</h3>
                  <p className="text-slate-400 font-montserrat text-sm mb-8 leading-relaxed">{service.desc}</p>
                  <ul className="space-y-3 mb-10 flex-1">
                    {service.items.map((item) => (
                      <li key={item} className="flex items-center gap-3 text-sm text-slate-300 font-montserrat">
                        <span className="material-symbols-outlined text-primary text-lg">check_circle</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                  <button className="gradient-border-btn w-full py-3 text-xs font-bold uppercase tracking-widest text-white hover:bg-primary/10 transition-colors">
                    Solicitar este servicio
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* ───── CÓMO TRABAJAMOS ───── */}
          <section className="bg-slate-900/50 py-24 px-10">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-white text-3xl font-michroma mb-16 text-center">¿CÓMO TRABAJAMOS?</h2>

              {/* La línea va a top: 32px (la mitad de size-16 = 64px) */}
              <div className="relative hidden md:flex flex-row justify-between" style={{ paddingTop: '0' }}>

                {/* Línea fija a 32px desde arriba = centro exacto del cuadrado de 64px */}
                <div className="absolute left-0 right-0 h-0.5 z-0"
                  style={{ top: '32px', background: 'linear-gradient(to right, #0d7ff2, #8b5cf6)' }}
                />

                {[
                  { num: '01', border: '#0d7ff2', text: '#0d7ff2', title: 'DIAGNÓSTICO',    desc: 'Auditamos sus procesos actuales y detectamos ineficiencias.' },
                  { num: '02', border: '#0d7ff2', text: '#0d7ff2', title: 'PROPUESTA',      desc: 'Diseñamos una arquitectura técnica a medida de sus metas.' },
                  { num: '03', border: '#0d7ff2', text: '#0d7ff2', title: 'IMPLEMENTACIÓN', desc: 'Desarrollo ágil y despliegue de las soluciones elegidas.' },
                  { num: '04', border: '#8b5cf6', text: '#8b5cf6', title: 'SOPORTE',         desc: 'Optimización continua y mantenimiento proactivo 24/7.' },
                ].map((step) => (
                  <div key={step.num} className="relative z-10 flex flex-col items-center text-center w-1/4">
                    {/* size-16 = 64px, la línea está en top:32px = centro exacto */}
                    <div
                      className="size-16 flex items-center justify-center font-michroma text-xl mb-6"
                      style={{
                        background: '#0D1B2A',
                        border: `2px solid ${step.border}`,
                        color: step.text,
                      }}
                    >
                      {step.num}
                    </div>
                    <h4 className="text-white font-bold mb-2 font-michroma text-sm">{step.title}</h4>
                    <p className="text-slate-400 text-xs font-montserrat px-4">{step.desc}</p>
                  </div>
                ))}
              </div>

              {/* Mobile: versión vertical sin línea */}
              <div className="flex flex-col gap-10 md:hidden">
                {[
                  { num: '01', border: '#0d7ff2', text: '#0d7ff2', title: 'DIAGNÓSTICO',    desc: 'Auditamos sus procesos actuales y detectamos ineficiencias.' },
                  { num: '02', border: '#0d7ff2', text: '#0d7ff2', title: 'PROPUESTA',      desc: 'Diseñamos una arquitectura técnica a medida de sus metas.' },
                  { num: '03', border: '#0d7ff2', text: '#0d7ff2', title: 'IMPLEMENTACIÓN', desc: 'Desarrollo ágil y despliegue de las soluciones elegidas.' },
                  { num: '04', border: '#8b5cf6', text: '#8b5cf6', title: 'SOPORTE',         desc: 'Optimización continua y mantenimiento proactivo 24/7.' },
                ].map((step) => (
                  <div key={step.num} className="flex flex-col items-center text-center">
                    <div
                      className="size-16 flex items-center justify-center font-michroma text-xl mb-4"
                      style={{ background: '#0D1B2A', border: `2px solid ${step.border}`, color: step.text }}
                    >
                      {step.num}
                    </div>
                    <h4 className="text-white font-bold mb-2 font-michroma text-sm">{step.title}</h4>
                    <p className="text-slate-400 text-xs font-montserrat px-4">{step.desc}</p>
                  </div>
                ))}
              </div>

            </div>
          </section>

          {/* ───── COMPARATIVA ───── */}
          <section className="px-10 py-24 max-w-7xl mx-auto">
            <h2 className="text-white text-3xl font-michroma mb-12">COMPARATIVA DE PLANES</h2>
            <div className="overflow-x-auto border border-slate-800">
              <table className="w-full text-left font-montserrat">
                <thead>
                  <tr className="border-b border-slate-800" style={{ background: 'linear-gradient(to right, rgba(13,127,242,0.2), rgba(139,92,246,0.2))' }}>
                    <th className="p-6 text-white font-michroma text-sm tracking-widest uppercase">Característica</th>
                    <th className="p-6 text-white font-michroma text-sm tracking-widest uppercase text-center">Básico</th>
                    <th className="p-6 text-white font-michroma text-sm tracking-widest uppercase text-center border-x border-slate-700/50 bg-primary/10">Profesional</th>
                    <th className="p-6 text-white font-michroma text-sm tracking-widest uppercase text-center">Enterprise</th>
                  </tr>
                </thead>
                <tbody className="bg-card-dark divide-y divide-slate-800">
                  {[
                    { label: 'Automatizaciones',     basic: 'Hasta 5',    pro: 'Hasta 20',        ent: 'Ilimitadas',        check: false },
                    { label: 'Soporte Técnico',      basic: 'Email (48h)', pro: 'Prioritario 24/7', ent: 'Manager Dedicado', check: false },
                    { label: 'Integraciones Custom', basic: null,          pro: true,               ent: true,               check: true  },
                    { label: 'Infraestructura IA',   basic: null,          pro: true,               ent: true,               check: true  },
                  ].map((row) => (
                    <tr key={row.label}>
                      <td className="p-6 text-slate-300 font-medium">{row.label}</td>
                      <td className="p-6 text-center text-slate-400">
                        {row.check
                          ? <span className="material-symbols-outlined text-slate-600">close</span>
                          : row.basic}
                      </td>
                      <td className="p-6 text-center text-white border-x border-slate-700/50">
                        {row.check
                          ? <span className="material-symbols-outlined text-primary">check</span>
                          : <span className="font-semibold">{row.pro}</span>}
                      </td>
                      <td className="p-6 text-center text-slate-400">
                        {row.check
                          ? <span className="material-symbols-outlined text-primary">check</span>
                          : row.ent}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* ───── FAQ ───── */}
          <section className="px-10 py-24 max-w-4xl mx-auto">
            <h2 className="text-white text-3xl font-michroma mb-12 text-center uppercase">Preguntas Frecuentes</h2>
            <div className="space-y-4">
              {faqs.map((faq) => {
                const isOpen = openFaq === faq.id;
                return (
                  <div
                    key={faq.id}
                    className="bg-card-dark p-6 transition-all cursor-pointer"
                    style={{ borderLeft: `4px solid ${isOpen ? '#0d7ff2' : '#1e293b'}` }}
                    onClick={() => setOpenFaq(isOpen ? null : faq.id)}
                  >
                    <div className="flex justify-between items-center gap-4">
                      <h4 className="text-white font-michroma text-sm uppercase">{faq.question}</h4>
                      <span
                        className="material-symbols-outlined flex-shrink-0 transition-transform duration-300"
                        style={{ color: isOpen ? '#0d7ff2' : '#64748b', transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
                      >
                        expand_more
                      </span>
                    </div>
                    {isOpen && (
                      <div className="mt-4 text-slate-400 text-sm font-montserrat leading-relaxed">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {/* ───── CTA FINAL ───── */}
          <section className="bg-background-dark py-20 px-10 border-t border-slate-800">
            <div className="max-w-5xl mx-auto text-center">
              <h3 className="text-white text-2xl md:text-3xl font-michroma mb-8">
                ¿NO SABES QUÉ SERVICIO NECESITAS? HABLEMOS.
              </h3>
              {/* ✅ Fix: style inline porque Tailwind no genera clases con colores custom en runtime */}
              <button
                onClick={() => navigate('/contacto')}
                className="text-white font-bold uppercase tracking-widest px-10 py-5 transition-all shadow-lg hover:opacity-90"
                style={{ background: 'linear-gradient(to right, #0d7ff2, #8b5cf6)' }}
              >
                Agendar Diagnóstico Gratuito
              </button>
            </div>
          </section>

        </main>

        {/* ───── FOOTER ───── */}
        <footer className="bg-card-dark px-10 py-12 border-t border-slate-800">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="col-span-2">
              <div className="flex items-center gap-3 text-white mb-6">
                <span className="material-symbols-outlined text-2xl text-primary">settings_input_component</span>
                <h2 className="text-lg font-michroma tracking-widest">JAV LABS</h2>
              </div>
              <p className="text-slate-500 font-montserrat text-sm max-w-md leading-relaxed">
                Laboratorio de automatización avanzada especializado en IA y optimización de flujos operativos para empresas de alto rendimiento.
              </p>
            </div>
            <div>
              <h4 className="text-white font-michroma text-xs uppercase mb-6 tracking-widest">Legal</h4>
              <div className="flex flex-col gap-3">
                {['Privacidad', 'Términos', 'Cookies'].map((item) => (
                  <a key={item} className="text-slate-500 hover:text-primary text-xs font-montserrat transition-colors" href="/">{item}</a>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-white font-michroma text-xs uppercase mb-6 tracking-widest">Social</h4>
              <div className="flex flex-col gap-3">
                {['LinkedIn', 'X / Twitter', 'Github'].map((item) => (
                  <a key={item} className="text-slate-500 hover:text-primary text-xs font-montserrat transition-colors" href="/">{item}</a>
                ))}
              </div>
            </div>
          </div>
          <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-600 text-xs font-montserrat">© 2024 JAV LABS. Todos los derechos reservados.</p>
            <p className="text-slate-600 text-xs font-montserrat uppercase tracking-widest">Pioneering Efficiency.</p>
          </div>
        </footer>

      </div>
    </>
  );
}