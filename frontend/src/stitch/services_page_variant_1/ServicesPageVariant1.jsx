import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PublicNavbar from '../../components/PublicNavbar';
import './ServicesPageVariant1.css';

export default function ServicesPageVariant1() {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState(1);

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
          <section className="relative services-hero flex flex-col items-center justify-center text-center overflow-hidden">
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-color-primary/10 via-color-accent/5 to-transparent opacity-60" />

            <div className="relative z-10 max-w-4xl">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <h1 className="text-white text-4xl md:text-5xl lg:text-6xl font-michroma mb-6 tracking-tight leading-tight">
                  DEJA QUE LA TECNOLOGÍA<br className="hidden md:block" /> TRABAJE POR TI
                </h1>
                <div className="w-24 h-1 bg-gradient-to-r from-color-primary to-color-accent mx-auto mb-8 rounded-full" />
                <p className="text-text-secondary font-montserrat text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
                  Automatizamos tus procesos completos para que recuperes 20+ horas cada semana. No necesitas contratar 3 personas — nosotros creamos, implementamos y mantenemos todo por ti.
                </p>
              </motion.div>

              {/* CTA Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="mt-10"
              >
                <button
                  onClick={() => navigate('/contacto')}
                  className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-color-primary to-color-accent text-white font-montserrat font-bold text-sm uppercase tracking-widest rounded-lg shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300"
                >
                  <span>Comenzar ahora</span>
                  <span className="material-symbols-outlined">arrow_forward</span>
                </button>
              </motion.div>
            </div>
          </section>

          {/* ───── SERVICIOS ───── */}
          <section className="services-section max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-color-primary/10 border border-color-primary/30 mb-6">
                <span className="material-symbols-outlined text-color-primary">auto_awesome</span>
                <span className="text-color-primary text-sm font-bold uppercase tracking-widest font-montserrat">Nuestros Servicios</span>
              </div>
              <h2 className="text-white text-3xl md:text-4xl font-michroma mb-4">
                Soluciones completas para <span className="text-transparent bg-clip-text bg-gradient-to-r from-color-primary to-color-accent">tu negocio</span>
              </h2>
              <p className="text-text-secondary font-montserrat max-w-2xl mx-auto">
                Cada servicio es un sistema completo — no solo una herramienta.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: 'memory',
                  title: 'Automatización de Procesos',
                  desc: 'Recupera 40+ horas mensuales eliminando tareas repetitivas. Tus herramientas actuales trabajando juntas sin intervención manual.',
                  items: ['Ahorro de +40h mensuales', 'Reducción de error humano', 'Todo funciona automáticamente 24/7'],
                  colorClass: 'text-color-primary',
                  borderClass: 'border-color-primary/50',
                  hoverBg: 'bg-color-primary/10'
                },
                {
                  icon: 'psychology',
                  title: 'IA Generativa',
                  desc: 'Un asistente de IA que responde como tú, atiende clientes 24/7 y califica leads automáticamente.',
                  items: ['Chatbot que usa tu tono', 'Atención 24/7 sin esperas', 'Vende y agenda automáticamente'],
                  colorClass: 'text-color-accent',
                  borderClass: 'border-color-accent/50',
                  hoverBg: 'bg-color-accent/10'
                },
                {
                  icon: 'hub',
                  title: 'Integración de Sistemas',
                  desc: 'Conectamos tu CRM, calendario, email y herramientas en un solo sistema que comparte datos automáticamente.',
                  items: ['Todo conectado en un solo flujo', 'Sin duplicar información', 'Implementación en días, no meses'],
                  colorClass: 'text-color-primary',
                  borderClass: 'border-color-primary/50',
                  hoverBg: 'bg-color-primary/10'
                },
              ].map((service, idx) => (
                <motion.div
                  key={service.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                  className="service-card group"
                >
                  <div className="relative z-10">
                    <div className={`service-icon bg-${service.colorClass.replace('text-', '')}/10 border-${service.colorClass.replace('text-', '')}/30`}>
                      <span className={`material-symbols-outlined text-2xl ${service.colorClass}`}>{service.icon}</span>
                    </div>
                    <h3 className="service-title">{service.title}</h3>
                    <p className="service-desc">{service.desc}</p>
                    <ul className="service-features">
                      {service.items.map((item) => (
                        <li key={item} className="service-feature-item">
                          <span className={`material-symbols-outlined ${service.colorClass}`}>check_circle</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                    <button
                      onClick={() => navigate('/contacto')}
                      className={`service-button ${service.colorClass.replace('text-', '')}`}
                    >
                      Ver cómo funciona
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* ───── CÓMO TRABAJAMOS ───── */}
          <section className="services-section-alt">
            <div className="max-w-7xl mx-auto px-6">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="text-center mb-16"
              >
                <h2 className="text-white text-3xl md:text-4xl font-michroma mb-4">
                  ASÍ CREAMOS TU <span className="text-transparent bg-clip-text bg-gradient-to-r from-color-primary to-color-accent">SISTEMA</span>
                </h2>
                <p className="text-text-secondary font-montserrat max-w-2xl mx-auto">
                  En 3 pasos simples, sin que tú toques código.
                </p>
              </motion.div>

              {/* Timeline horizontal */}
              <div className="relative hidden md:block">
                <div className="absolute top-12 left-0 right-0 h-0.5 bg-gradient-to-r from-color-primary/30 via-color-accent/30 to-color-primary/30" />

                <div className="relative flex justify-between">
                  {[
                    { num: '01', title: 'DIAGNÓSTICO', desc: 'Nos cuentas tu negocio, qué procesos consumen tu tiempo, y qué quieres lograr.' },
                    { num: '02', title: 'CONSTRUCCIÓN', desc: 'Nuestro equipo desarrolla y despliega TODO. Tú NO tocas código.' },
                    { num: '03', title: 'CRECIMIENTO', desc: 'No te dejamos solo. Incluye monitoreo 24/7, mejoras mensuales y soporte permanente.' }
                  ].map((step, idx) => (
                    <div key={idx} className="relative flex-1 flex flex-col items-center text-center px-4">
                      <div
                        className="size-16 flex items-center justify-center font-michroma text-2xl mb-6 rounded-full bg-navy-darker border-2 shadow-lg"
                        style={{ borderColor: idx === 2 ? 'var(--color-accent)' : 'var(--color-primary)', boxShadow: `0 0 30px ${idx === 2 ? 'rgba(139,92,246,0.3)' : 'rgba(13,127,242,0.3)'}` }}
                      >
                        {step.num}
                      </div>
                      <h4 className="text-white font-michroma text-lg mb-2">{step.title}</h4>
                      <p className="text-text-secondary text-sm max-w-xs">{step.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mobile: vertical */}
              <div className="flex flex-col gap-12 md:hidden">
                {[
                  { num: '01', title: 'DIAGNÓSTICO', desc: 'Nos cuentas tu negocio, qué procesos consumen tu tiempo, y qué quieres lograr.' },
                  { num: '02', title: 'CONSTRUCCIÓN', desc: 'Nuestro equipo desarrolla y despliega TODO. Tú NO tocas código.' },
                  { num: '03', title: 'CRECIMIENTO', desc: 'No te dejamos solo. Incluye monitoreo 24/7, mejoras mensuales y soporte permanente.' }
                ].map((step, idx) => (
                  <div key={idx} className="flex flex-col items-center text-center">
                    <div
                      className="size-16 flex items-center justify-center font-michroma text-2xl mb-4 rounded-full bg-navy-darker border-2"
                      style={{ borderColor: idx === 2 ? 'var(--color-accent)' : 'var(--color-primary)' }}
                    >
                      {step.num}
                    </div>
                    <h4 className="text-white font-michroma text-lg mb-2">{step.title}</h4>
                    <p className="text-text-secondary text-sm max-w-xs">{step.desc}</p>
                  </div>
                ))}
              </div>

            </div>
          </section>

          {/* ───── COMPARATIVA ───── */}
          <section className="services-section-alt">
            <div className="max-w-7xl mx-auto px-6">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="text-center mb-16"
              >
                <h2 className="text-white text-3xl md:text-4xl font-michroma mb-4">
                  Comparativa de <span className="text-transparent bg-clip-text bg-gradient-to-r from-color-primary to-color-accent">Planes</span>
                </h2>
                <p className="text-text-secondary font-montserrat max-w-2xl mx-auto">
                  Elige el plan que mejor se adapte a tus necesidades
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="overflow-x-auto rounded-xl border border-border-color shadow-2xl"
              >
                <table className="comparison-table">
                  <thead>
                    <tr style={{ background: 'linear-gradient(to right, rgba(13, 127, 242, 0.15), rgba(139, 92, 246, 0.15))' }}>
                      <th className="p-6 text-white font-michroma text-sm tracking-widest uppercase">Característica</th>
                      <th className="p-6 text-white font-michroma text-sm tracking-widest uppercase text-center">Básico</th>
                      <th className="p-6 text-white font-michroma text-sm tracking-widest uppercase text-center border-x border-border-color bg-color-primary/5">Profesional</th>
                      <th className="p-6 text-white font-michroma text-sm tracking-widest uppercase text-center">Enterprise</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-color">
                    {[
                      { label: 'Automatizaciones',     basic: 'Hasta 5',    pro: 'Hasta 20',        ent: 'Ilimitadas',        check: false },
                      { label: 'Soporte Técnico',      basic: 'Email (48h)', pro: 'Prioritario 24/7', ent: 'Manager Dedicado', check: false },
                      { label: 'Integraciones Custom', basic: null,          pro: true,               ent: true,               check: true  },
                      { label: 'Infraestructura IA',   basic: null,          pro: true,               ent: true,               check: true  },
                    ].map((row, idx) => (
                      <motion.tr
                        key={row.label}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: idx * 0.1 }}
                        className="hover:bg-slate-800/50 transition-colors"
                      >
                        <td className="p-6 text-text-secondary font-medium">{row.label}</td>
                        <td className="p-6 text-center text-text-muted">
                          {row.check
                            ? <span className="material-symbols-outlined text-slate-600 text-xl">close</span>
                            : row.basic}
                        </td>
                        <td className="p-6 text-center text-white border-x border-border-color bg-color-primary/5">
                          {row.check
                            ? <span className="material-symbols-outlined text-color-primary text-xl">check_circle</span>
                            : <span className="font-semibold">{row.pro}</span>}
                        </td>
                        <td className="p-6 text-center text-text-muted">
                          {row.check
                            ? <span className="material-symbols-outlined text-color-primary text-xl">check_circle</span>
                            : row.ent}
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </motion.div>
            </div>
          </section>

          {/* ───── FAQ ───── */}
          <section className="services-section max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-white text-3xl md:text-4xl font-michroma mb-4">
                Preguntas <span className="text-transparent bg-clip-text bg-gradient-to-r from-color-primary to-color-accent">Frecuentes</span>
              </h2>
              <p className="text-text-secondary font-montserrat max-w-2xl mx-auto">
                Resolvemos tus dudas sobre nuestros servicios
              </p>
            </motion.div>

            <div className="space-y-4">
              {faqs.map((faq, idx) => (
                <motion.div
                  key={faq.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className="accordion-item w-full text-left p-6"
                    aria-expanded={openFaq === idx}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <h3 className="text-white font-michroma text-lg pr-8">{faq.question}</h3>
                      <span className={`material-symbols-outlined text-color-primary transition-transform duration-300 ${openFaq === idx ? 'rotated' : ''}`}>
                        expand_more
                      </span>
                    </div>
                    {openFaq === idx && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <p className="text-text-secondary font-montserrat mt-4 leading-relaxed">{faq.answer}</p>
                      </motion.div>
                    )}
                  </button>
                </motion.div>
              ))}
            </div>
          </section>

        </main>
      </div>
    </>
  );
}
