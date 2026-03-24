import { motion } from 'framer-motion';
import './ExamplesSection.css';

const examples = [
  {
    industry: 'Clínica Médica o Consultorio',
    icon: 'medical_services',
    problem: 'Pierden pacientes porque no responden rápido a mensajes de WhatsApp. El personal pasa 3+ horas diarias agendando, confirmando y recordando. Hay huecos en el calendario que no se llenan.',
    solution: [
      'WhatsApp Business automatizado que responde 24/7',
      'Sistema de recordatorios automáticos (reduce ausentismo de 30% a 5%)',
      'Pre-consulta digital automática'
    ],
    results: [
      '15+ horas semanales liberadas',
      '40% más citas agendadas',
      'Costo: $72-$240/mes vs 1 asistente full-time ($600+ mes)'
    ]
  },
  {
    industry: 'Negocio Local',
    icon: 'storefront',
    problem: 'Clientes preguntan por WhatsApp y no responden a tiempo. Pierden ventas fuera de horario. No capturan leads de la web. Pedidos por deliverys se pierden o hay errores.',
    solution: [
      'Catálogo automático en WhatsApp con fotos y precios',
      'Sistema de pedidos por WhatsApp que notifica a cocina/tienda',
      'Captura automática de leads de web'
    ],
    results: [
      'Ventas 24/7 sin estar presente',
      '60% menos errores en pedidos',
      '100% de leads capturados'
    ]
  },
  {
    industry: 'E-commerce o Tienda Online',
    icon: 'shopping_cart',
    problem: 'Consultas repetitivas consumen 4+ horas diarias. Carritos abandonados no se recuperan. No hay seguimiento automático post-compra.',
    solution: [
      'FAQ inteligente 24/7 que deriva a humano cuando es complejo',
      'Recuperación automática de carritos abandonados',
      'Post-compra automatizado con seguimiento de envío'
    ],
    results: [
      '25% recuperación de carritos abandonados',
      '80% de consultas resueltas automáticamente',
      '3-5 horas diarias liberadas'
    ]
  }
];

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } }
};

export default function ExamplesSection() {
  return (
    <section className="py-24 md:py-32 bg-background-dark section-spaced">
      <div className="container mx-auto px-6">
        <div className="mb-16 text-center">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 mb-6">
            <span className="material-symbols-outlined text-primary">example</span>
            <span className="text-primary text-sm font-bold uppercase tracking-widest font-montserrat">Ejemplos Reales</span>
          </div>
          <h2 className="font-michroma text-3xl md:text-4xl text-white uppercase mb-4 leading-tight">
            Lo que puedes <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">automatizar hoy</span>
          </h2>
          <p className="font-montserrat text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
           casos de uso concretos para diferentes tipos de negocio. Esto es lo que obtienes en la práctica.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {examples.map((example, idx) => (
            <motion.div
              key={idx}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeInUp}
              className="flex flex-col bg-navy-darker border border-slate-800 rounded-xl p-6 md:p-8 hover:border-primary/40 transition-all duration-300"
            >
              {/* Industry Icon & Name */}
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-2xl">{example.icon}</span>
                </div>
                <h3 className="font-michroma text-lg text-white uppercase leading-tight">{example.industry}</h3>
              </div>

              {/* Problem */}
              <div className="mb-6">
                <h4 className="font-montserrat text-xs font-bold text-accent uppercase tracking-wider mb-2">Problema actual</h4>
                <p className="font-montserrat text-sm text-slate-300 leading-relaxed">{example.problem}</p>
              </div>

              {/* Solution */}
              <div className="mb-6 flex-1">
                <h4 className="font-montserrat text-xs font-bold text-primary uppercase tracking-wider mb-3">Solución automatizada</h4>
                <ul className="flex flex-col gap-2">
                  {example.solution.map((item, sidx) => (
                    <li key={sidx} className="flex items-start gap-2 text-sm text-slate-400">
                      <span className="material-symbols-outlined text-primary text-sm mt-0.5 flex-shrink-0">check_circle</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Results */}
              <div className="pt-6 border-t border-slate-800">
                <h4 className="font-montserrat text-xs font-bold text-green-400 uppercase tracking-wider mb-3">Resultado concreto</h4>
                <ul className="flex flex-col gap-2">
                  {example.results.map((result, ridx) => (
                    <li key={ridx} className="flex items-start gap-2 text-sm text-slate-300">
                      <span className="material-symbols-outlined text-green-400 text-sm mt-0.5 flex-shrink-0">trending_up</span>
                      {result}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="font-montserrat text-slate-400 text-sm max-w-2xl mx-auto">
            Estos son solo 3 ejemplos. Automatizamos CUALQUIER proceso repetitivo que consuma tu tiempo o el de tu equipo.
            ¿Tienes un caso específico? <a href="/contacto" className="text-primary hover:text-accent transition-colors">Hablemos de tu negocio</a>
          </p>
        </div>
      </div>
    </section>
  );
}
