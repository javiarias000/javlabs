import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import SEO from '../../components/SEO';
import './ServicesPageVariant1.css';

export default function ServicesPageVariant1() {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState(0);

  const faqs = [
    {
      id: 0,
      question: '¿Un agente de IA es lo mismo que un chatbot?',
      answer: 'No. Un chatbot responde preguntas. Un agente de IA toma decisiones, ejecuta herramientas reales (buscar en web, escribir en bases de datos, enviar emails, llamar APIs) y completa tareas de principio a fin sin intervención humana. Un chatbot informa; un agente actúa.',
    },
    {
      id: 1,
      question: '¿Cuánto tiempo toma una implementación estándar?',
      answer: 'Los proyectos de automatización básicos se despliegan en 2-3 semanas. Las soluciones con agentes IA complejos o desarrollo web completo pueden tomar de 4 a 12 semanas dependiendo del alcance y las integraciones requeridas.',
    },
    {
      id: 2,
      question: '¿Es necesario reemplazar mis herramientas actuales?',
      answer: 'No. Nuestra especialidad es la integración. Los agentes y automatizaciones se conectan sobre tu stack tecnológico actual (Salesforce, HubSpot, SAP, Google Workspace, etc.) para potenciarlo sin fricciones ni migraciones costosas.',
    },
    {
      id: 3,
      question: '¿Ofrecen garantía de ROI?',
      answer: 'Sí. En proyectos de automatización y agentes IA garantizamos un retorno medible en los primeros 90 días o extendemos el soporte sin costo adicional.',
    },
    {
      id: 4,
      question: '¿Pueden gestionar mis campañas de Facebook aunque no tenga conocimientos de marketing?',
      answer: 'Absolutamente. Nos encargamos de toda la estrategia: definición del público, creación de anuncios, segmentación, presupuesto y optimización continua. Tú solo apruebas la dirección creativa y recibes los reportes.',
    },
  ];

  const servicesFaqSchema = faqs.map(faq => ({
    question: faq.question,
    answer: faq.answer,
  }));

  const servicesList = [
    {
      name: 'Configuración de Agentes de Inteligencia Artificial',
      description: 'Diseñamos, configuramos y desplegamos agentes IA autónomos que ejecutan tareas completas dentro de tu empresa. Incluye chatbots, asistentes con IA generativa y agentes de acción que usan herramientas reales.',
      price: 'Varía según complejidad',
    },
    {
      name: 'Desarrollo Web y Bases de Datos',
      description: 'Landing pages, portales, aplicaciones web y diseño de bases de datos relacionales y no relacionales con APIs a medida.',
      price: 'Varía según proyecto',
    },
    {
      name: 'Campañas Publicitarias en Meta (Facebook/Instagram)',
      description: 'Creación, segmentación, gestión y optimización de campañas de pago en Facebook e Instagram para captar leads y ventas.',
      price: 'Varía según presupuesto',
    },
    {
      name: 'Automatización de Procesos',
      description: 'Recupera 40+ horas mensuales eliminando tareas repetitivas con workflows n8n que conectan todas tus herramientas.',
      price: 'Varía según proyecto',
    },
    {
      name: 'Integración de Sistemas',
      description: 'Conectamos tu CRM, calendario, email y herramientas en un solo sistema que comparte datos automáticamente.',
      price: 'Incluido en todos los planes',
    },
  ];

  const agentUses = [
    { icon: 'support_agent',  title: 'Soporte de primer nivel',    desc: 'Responde tickets, resuelve dudas frecuentes y escala solo lo que requiere un humano.' },
    { icon: 'bar_chart',      title: 'Reportes automáticos',       desc: 'Lee tu base de datos y genera informes semanales sin que nadie los pida.' },
    { icon: 'mark_email_read',title: 'Gestión de correo',          desc: 'Clasifica, prioriza y responde emails siguiendo las políticas de tu empresa.' },
    { icon: 'person_check',   title: 'Calificación de leads',      desc: 'Evalúa prospectos, hace preguntas y agenda reuniones automáticamente.' },
    { icon: 'chat',           title: 'Chatbot con tu tono de voz', desc: 'Asistente de IA generativa que atiende clientes 24/7 respondiendo como tú.' },
    { icon: 'inventory_2',    title: 'Onboarding de clientes',     desc: 'Guía a nuevos clientes, recopila documentos y activa servicios sin fricción.' },
  ];

  const agentPhases = [
    { num: '01', title: 'Diagnóstico',          desc: 'Mapeamos qué procesos internos pueden delegarse a un agente.' },
    { num: '02', title: 'Selección del modelo', desc: 'Claude para razonamiento complejo, Hermes para ejecución local privada, u otros según el caso.' },
    { num: '03', title: 'Configuración',        desc: 'Instrucciones, herramientas, memoria de largo plazo (RAG) y límites de acción.' },
    { num: '04', title: 'Integración',          desc: 'El agente se conecta a n8n, WhatsApp, Slack, email, CRM o cualquier API existente.' },
    { num: '05', title: 'Despliegue',           desc: 'En la nube (Anthropic / OpenRouter) o auto-hospedado para máxima privacidad.' },
    { num: '06', title: 'Monitoreo continuo',   desc: 'Dashboard de ejecuciones, costos y tasa de éxito. Revisión mensual de prompts.' },
  ];

  const agentTools = [
    { label: 'Claude (Anthropic)', icon: 'psychology' },
    { label: 'Hermes (Nous Research)', icon: 'smart_toy' },
    { label: 'Ollama (local)', icon: 'dns' },
    { label: 'OpenRouter', icon: 'route' },
    { label: 'n8n', icon: 'account_tree' },
    { label: 'LangChain', icon: 'link' },
    { label: 'RAG / Vector Store', icon: 'database' },
    { label: 'WhatsApp / Slack', icon: 'chat' },
  ];

  const complementaryServices = [
    {
      icon: 'code',
      title: 'Desarrollo Web y Bases de Datos',
      desc: 'Landing pages, portales y aplicaciones web a medida, con bases de datos y APIs diseñadas para escalar.',
      items: [
        'Landing pages y sitios corporativos',
        'Aplicaciones web y portales de cliente',
        'Bases de datos relacionales y NoSQL',
        'APIs REST a medida',
      ],
      colorClass: 'text-primary',
      tag: 'Operativo',
    },
    {
      icon: 'campaign',
      title: 'Campañas en Meta (Facebook/Instagram)',
      desc: 'Gestionamos tus campañas de pago en Facebook e Instagram para captar leads calificados y aumentar ventas.',
      items: [
        'Estrategia y creación de anuncios',
        'Segmentación de audiencias',
        'Optimización continua del presupuesto',
        'Reportes de rendimiento mensuales',
      ],
      colorClass: 'text-accent',
      tag: 'Marketing',
    },
    {
      icon: 'memory',
      title: 'Automatización de Procesos',
      desc: 'Recupera 40+ horas mensuales eliminando tareas repetitivas con workflows que conectan todas tus herramientas.',
      items: [
        'Workflows n8n personalizados',
        'Eliminación de tareas manuales',
        'Funcionamiento 24/7 sin intervención',
        'Reducción de error humano',
      ],
      colorClass: 'text-primary',
      tag: 'Operativo',
    },
    {
      icon: 'hub',
      title: 'Integración de Sistemas',
      desc: 'Conectamos tu CRM, calendario, email y herramientas en un solo sistema que comparte datos en tiempo real.',
      items: [
        'Conexión de CRM, email y calendario',
        'Sincronización de datos automática',
        'Sin duplicar información',
        'Implementación en días, no meses',
      ],
      colorClass: 'text-primary',
      tag: 'Operativo',
    },
  ];

  return (
    <>
      <SEO
        title="Servicios de Agentes IA, Desarrollo Web y Marketing | JAV LABS Ecuador"
        description="Agentes IA autónomos (Claude, Hermes), Desarrollo Web y Bases de Datos, Campañas Meta, Automatización de Procesos e Integración de Sistemas. Todo para que tu empresa opere sola."
        ogTitle="Agentes de IA, Web y Marketing Digital | JAV LABS"
        ogDescription="Configuramos agentes IA que actúan por tu empresa, construimos tu presencia digital y gestionamos tus campañas en Facebook. Consultoría especializada en Ecuador."
        ogImage="/Logo2.png"
        canonicalUrl="/servicios"
        breadcrumbItems={[
          { name: 'Inicio', url: '/' },
          { name: 'Servicios', url: '/servicios' },
        ]}
        faqSchema={servicesFaqSchema}
        serviceName="Configuración de Agentes de Inteligencia Artificial"
        serviceDescription="Diseñamos, configuramos y desplegamos agentes IA autónomos que ejecutan tareas completas dentro de tu empresa usando Claude, Hermes, Ollama y n8n."
      />

      {/* ── HERO ── */}
      <section className="relative services-hero flex flex-col items-center justify-center text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/5 to-transparent opacity-60" />
        <div className="relative z-10 max-w-4xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-white text-4xl md:text-5xl lg:text-6xl font-michroma mb-6 tracking-tight leading-tight">
              AGENTES QUE TRABAJAN.<br className="hidden md:block" /> EMPRESA QUE CRECE.
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-primary to-accent mx-auto mb-8 rounded-full" />
            <p className="text-text-secondary font-montserrat text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
              Configuramos agentes de IA, construimos tu presencia digital y gestionamos tu marketing — todo para que tu empresa opere sola.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-10"
          >
            <button
              onClick={() => navigate('/contacto')}
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary to-accent text-white font-montserrat font-bold text-sm uppercase tracking-widest rounded-lg shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300"
            >
              <span>Comenzar ahora</span>
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
          </motion.div>
        </div>
      </section>

      {/* ── SERVICIO PRINCIPAL: AGENTES IA ── */}
      <section className="services-section max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-accent/10 border border-accent/30 mb-6">
            <span className="material-symbols-outlined text-accent">stars</span>
            <span className="text-accent text-sm font-bold uppercase tracking-widest font-montserrat">Servicio Principal</span>
          </div>
          <h2 className="text-white text-3xl md:text-4xl font-michroma mb-4">
            Configuración de <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Agentes de IA</span>
          </h2>
          <p className="text-text-secondary font-montserrat max-w-2xl mx-auto">
            No es un chatbot. Es un sistema autónomo que recibe una tarea, decide qué pasos dar, ejecuta herramientas reales y entrega resultados — sin intervención humana en el medio.
          </p>
        </motion.div>

        {/* Card principal */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative rounded-2xl border border-accent/30 overflow-hidden mb-20"
          style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.08) 0%, rgba(13,127,242,0.06) 50%, rgba(139,92,246,0.04) 100%)' }}
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-accent/60 to-transparent" />

          <div className="p-8 md:p-12">
            {/* Header de la card */}
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-10">
              <div className="flex items-start gap-5">
                <div className="size-16 flex-shrink-0 rounded-xl flex items-center justify-center border border-accent/40 bg-accent/10 shadow-lg shadow-accent/10">
                  <span className="material-symbols-outlined text-accent text-3xl">smart_toy</span>
                </div>
                <div>
                  <h3 className="text-white font-michroma text-xl md:text-2xl mb-2">Agentes de Inteligencia Artificial</h3>
                  <p className="text-text-secondary font-montserrat text-sm max-w-2xl leading-relaxed">
                    Diseñamos, configuramos y desplegamos agentes IA que automatizan procesos completos: desde atención al cliente con IA generativa hasta análisis de datos, generación de reportes y ejecución de tareas técnicas internas.
                  </p>
                </div>
              </div>
              <button
                onClick={() => navigate('/contacto')}
                className="flex-shrink-0 self-start inline-flex items-center gap-2 px-6 py-3 rounded-lg font-montserrat font-bold text-sm uppercase tracking-widest text-white transition-all hover:scale-105"
                style={{ background: 'linear-gradient(to right, #7c3aed, #0d7ff2)' }}
              >
                <span>Quiero esto</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </div>

            {/* Casos de uso */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
              {agentUses.map((use, i) => (
                <motion.div
                  key={use.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.07 }}
                  className="flex gap-4 p-4 rounded-xl border border-slate-700/50 bg-slate-900/40 hover:border-accent/30 transition-colors"
                >
                  <span className="material-symbols-outlined text-accent text-xl flex-shrink-0 mt-0.5">{use.icon}</span>
                  <div>
                    <p className="text-white font-montserrat font-bold text-sm mb-1">{use.title}</p>
                    <p className="text-text-secondary font-montserrat text-xs leading-relaxed">{use.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Fases */}
            <div className="mb-10">
              <p className="text-slate-400 font-montserrat text-xs uppercase tracking-widest mb-6 font-bold">Cómo lo implementamos</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {agentPhases.map((phase, i) => (
                  <motion.div
                    key={phase.num}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.07 }}
                    className="flex gap-4 items-start"
                  >
                    <div className="flex-shrink-0 size-8 rounded-full border border-primary/40 bg-primary/10 flex items-center justify-center">
                      <span className="text-primary font-michroma text-xs">{phase.num}</span>
                    </div>
                    <div>
                      <p className="text-white font-montserrat font-bold text-sm mb-1">{phase.title}</p>
                      <p className="text-text-secondary font-montserrat text-xs leading-relaxed">{phase.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Herramientas */}
            <div>
              <p className="text-slate-400 font-montserrat text-xs uppercase tracking-widest mb-4 font-bold">Tecnologías que usamos</p>
              <div className="flex flex-wrap gap-2">
                {agentTools.map(tool => (
                  <span
                    key={tool.label}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-700 bg-slate-800/50 text-slate-300 font-montserrat text-xs"
                  >
                    <span className="material-symbols-outlined text-primary text-sm">{tool.icon}</span>
                    {tool.label}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
        </motion.div>

        {/* ── SERVICIOS COMPLEMENTARIOS ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 mb-4">
            <span className="material-symbols-outlined text-primary">auto_awesome</span>
            <span className="text-primary text-sm font-bold uppercase tracking-widest font-montserrat">Servicios Complementarios</span>
          </div>
          <h2 className="text-white text-2xl md:text-3xl font-michroma mb-4">
            Todo lo que necesita tu <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">operación</span>
          </h2>
          <p className="text-text-secondary font-montserrat max-w-2xl mx-auto">
            Cada servicio es un sistema completo — no solo una herramienta.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {complementaryServices.map((service, idx) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className="service-card group"
            >
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-6">
                  <div className="service-icon">
                    <span className={`material-symbols-outlined text-2xl ${service.colorClass}`}>{service.icon}</span>
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded border ${
                    service.tag === 'Marketing'
                      ? 'text-accent border-accent/30 bg-accent/10'
                      : 'text-primary border-primary/30 bg-primary/10'
                  }`}>
                    {service.tag}
                  </span>
                </div>
                <h3 className="service-title">{service.title}</h3>
                <p className="service-desc">{service.desc}</p>
                <ul className="service-features">
                  {service.items.map(item => (
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

      {/* ── CÓMO TRABAJAMOS ── */}
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
              ASÍ CREAMOS TU <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">SISTEMA</span>
            </h2>
            <p className="text-text-secondary font-montserrat max-w-2xl mx-auto">
              En 3 pasos simples, sin que tú toques código.
            </p>
          </motion.div>

          <div className="relative hidden md:block">
            <div className="absolute top-12 left-0 right-0 h-0.5 bg-gradient-to-r from-primary/30 via-accent/30 to-primary/30" />
            <div className="relative flex justify-between">
              {[
                { num: '01', title: 'DIAGNÓSTICO',   desc: 'Nos cuentas tu negocio, qué procesos consumen tu tiempo, y qué quieres lograr.' },
                { num: '02', title: 'CONSTRUCCIÓN',  desc: 'Nuestro equipo desarrolla y despliega TODO. Tú NO tocas código.' },
                { num: '03', title: 'CRECIMIENTO',   desc: 'No te dejamos solo. Incluye monitoreo 24/7, mejoras mensuales y soporte permanente.' },
              ].map((step, idx) => (
                <div key={idx} className="relative flex-1 flex flex-col items-center text-center px-4">
                  <div
                    className="size-16 flex items-center justify-center font-michroma text-2xl mb-6 rounded-full bg-navy-darker border-2 shadow-lg"
                    style={{
                      borderColor: idx === 2 ? 'var(--color-accent)' : 'var(--color-primary)',
                      boxShadow: `0 0 30px ${idx === 2 ? 'rgba(139,92,246,0.3)' : 'rgba(13,127,242,0.3)'}`,
                    }}
                  >
                    {step.num}
                  </div>
                  <h4 className="text-white font-michroma text-lg mb-2">{step.title}</h4>
                  <p className="text-text-secondary text-sm max-w-xs">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-12 md:hidden">
            {[
              { num: '01', title: 'DIAGNÓSTICO',  desc: 'Nos cuentas tu negocio, qué procesos consumen tu tiempo, y qué quieres lograr.' },
              { num: '02', title: 'CONSTRUCCIÓN', desc: 'Nuestro equipo desarrolla y despliega TODO. Tú NO tocas código.' },
              { num: '03', title: 'CRECIMIENTO',  desc: 'No te dejamos solo. Incluye monitoreo 24/7, mejoras mensuales y soporte permanente.' },
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

      {/* ── COMPARATIVA ── */}
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
              Comparativa de <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Planes</span>
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
            className="overflow-x-auto rounded-xl border border-[var(--border-color)] shadow-2xl"
          >
            <table className="comparison-table">
              <thead>
                <tr style={{ background: 'linear-gradient(to right, rgba(13, 127, 242, 0.15), rgba(139, 92, 246, 0.15))' }}>
                  <th className="p-6 text-white font-michroma text-sm tracking-widest uppercase">Característica</th>
                  <th className="p-6 text-white font-michroma text-sm tracking-widest uppercase text-center">Básico</th>
                  <th className="p-6 text-white font-michroma text-sm tracking-widest uppercase text-center border-x border-[var(--border-color)] bg-primary/5">Profesional</th>
                  <th className="p-6 text-white font-michroma text-sm tracking-widest uppercase text-center">Enterprise</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-color">
                {[
                  { label: 'Agentes IA configurados',   basic: '1 agente',      pro: 'Hasta 3 agentes',     ent: 'Ilimitados',         check: false },
                  { label: 'Automatizaciones n8n',       basic: 'Hasta 5',       pro: 'Hasta 20',            ent: 'Ilimitadas',         check: false },
                  { label: 'Desarrollo Web',             basic: 'Landing page',  pro: 'Portal + BD',         ent: 'App completa',       check: false },
                  { label: 'Campañas Meta',              basic: null,            pro: true,                  ent: true,                 check: true  },
                  { label: 'Integraciones Custom',       basic: null,            pro: true,                  ent: true,                 check: true  },
                  { label: 'Soporte Técnico',            basic: 'Email (48h)',   pro: 'Prioritario 24/7',    ent: 'Manager Dedicado',   check: false },
                ].map((row, idx) => (
                  <motion.tr
                    key={row.label}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: idx * 0.08 }}
                    className="hover:bg-slate-800/50 transition-colors"
                  >
                    <td className="p-6 text-text-secondary font-medium">{row.label}</td>
                    <td className="p-6 text-center text-text-muted">
                      {row.check
                        ? <span className="material-symbols-outlined text-slate-600 text-xl">close</span>
                        : row.basic || <span className="material-symbols-outlined text-slate-600 text-xl">close</span>}
                    </td>
                    <td className="p-6 text-center text-white border-x border-[var(--border-color)] bg-primary/5">
                      {row.check
                        ? <span className="material-symbols-outlined text-primary text-xl">check_circle</span>
                        : <span className="font-semibold">{row.pro}</span>}
                    </td>
                    <td className="p-6 text-center text-text-muted">
                      {row.check
                        ? <span className="material-symbols-outlined text-primary text-xl">check_circle</span>
                        : row.ent}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="services-section max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-white text-3xl md:text-4xl font-michroma mb-4">
            Preguntas <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Frecuentes</span>
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
              transition={{ duration: 0.6, delay: idx * 0.08 }}
            >
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="accordion-item w-full text-left p-6"
                aria-expanded={openFaq === idx}
              >
                <div className="flex items-center justify-between gap-4">
                  <h3 className="text-white font-michroma text-lg pr-8">{faq.question}</h3>
                  <span className={`material-symbols-outlined text-primary transition-transform duration-300 ${openFaq === idx ? 'rotated' : ''}`}>
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
    </>
  );
}
