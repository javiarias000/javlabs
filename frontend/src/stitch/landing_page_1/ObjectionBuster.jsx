import { motion } from 'framer-motion';
import './ObjectionBuster.css';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } }
};

const comparisonRows = [
  { feature: 'Configuración inicial', tool: '✗ Tú lo configuras (40-80 horas)', service: '✓ Nosotros lo creamos por ti (2-4 semanas)' },
  { feature: 'Tiempo de implementación', tool: '40-80 horas de tu tiempo', service: '2-4 semanas (nosotros trabajando)' },
  { feature: 'Soporte técnico', tool: 'Chatbot/foro (48h+ respuesta)', service: 'Ingeniero asignado (<12h)' },
  { feature: 'Personalización', tool: 'Límites de la herramienta', service: 'Totalmente a tu medida' },
  { feature: 'Mantenimiento', tool: '✗ Tú lo mantienes', service: '✓ Nosotros lo monitoreamos 24/7' },
  { feature: 'Mejoras continuas', tool: '✗ No incluidas', service: '✓ Sin costo extra mensual' },
  { feature: 'Escalabilidad', tool: 'Límites de plan, pagas más', service: 'Crecimiento ilimitado' },
  { feature: 'Integraciones', tool: 'Solo las que soporta la herramienta', service: 'Lo que sea que necesites (API)' },
  { feature: 'Entrenamiento', tool: 'Tutoriales genéricos', service: 'Capacitación personalizada' },
  { feature: 'Responsable si falla', tool: '✗ Tú', service: '✓ Nosotros (no tú)' }
];

export default function ObjectionBuster() {
  return (
    <section className="py-24 md:py-32 bg-navy-darker section-spaced">
      <div className="container mx-auto px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeInUp}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 mb-6">
            <span className="material-symbols-outlined text-primary">payments</span>
            <span className="text-primary text-sm font-bold uppercase tracking-widest font-montserrat">¿Por qué esto no es $50/mes?</span>
          </div>
          <h2 className="font-michroma text-3xl md:text-4xl text-white uppercase mb-4 leading-tight">
            Herramienta vs. <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Sistema Completo</span>
          </h2>
          <p className="font-montserrat text-slate-400 text-lg max-w-3xl mx-auto leading-relaxed">
            Existen herramientas baratas ($30-50/mes) que prometen "automatización sin código". Es cierto que existen.
            Pero hay una diferencia GIGANTE entre comprar acceso a una plataforma y contratar un sistema automatizado completo que funcione desde el día 1.
          </p>
        </motion.div>

        {/* Comparison Table */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeInUp}
          className="mb-12 overflow-hidden rounded-xl border border-slate-800"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 bg-navy-darker">
            {/* Header */}
            <div className="p-6 font-montserrat text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-800">
              Lo que incluyes
            </div>
            <div className="p-6 font-montserrat text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800 bg-slate-900/30">
              Herramientas $50/mes<br/>
              <span className="text-slate-500 font-normal">(Zapier, Make, n8n cloud)</span>
            </div>
            <div className="p-6 font-montserrat text-xs font-bold text-primary uppercase tracking-wider border-b border-primary/30 bg-primary/5">
              Nuestro Servicio<br/>
              <span className="text-primary/70 font-normal">(Sistema completo)</span>
            </div>
          </div>

          {/* Rows */}
          {comparisonRows.map((row, idx) => (
            <div
              key={idx}
              className={`grid grid-cols-1 md:grid-cols-3 ${idx % 2 === 0 ? 'bg-navy-darker' : 'bg-navy-darker/50'} border-b border-slate-800 last:border-b-0`}
            >
              <div className="p-6 font-montserrat text-sm text-white border-r border-slate-800">
                {row.feature}
              </div>
              <div className="p-6 font-montserrat text-sm text-slate-400 border-r border-slate-800 bg-slate-900/20">
                {row.tool}
              </div>
              <div className="p-6 font-montserrat text-sm text-primary bg-primary/5">
                {row.service}
              </div>
            </div>
          ))}
        </motion.div>

        {/* Detailed explanation */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeInUp}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start"
        >
          <div>
            <h3 className="font-michroma text-xl text-white uppercase mb-4">Las herramientas baratas requieren...</h3>
            <ul className="space-y-3 font-montserrat text-sm text-slate-300">
              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined text-accent mt-0.5">close</span>
                <span><strong>Que tú aprendas a usarla:</strong> 30-100 horas de tutoriales y cursos antes de crear algo útil</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined text-accent mt-0.5">close</span>
                <span><strong>Que tú diseñes los flujos:</strong> probablemente mal, porque no tienes experiencia</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined text-accent mt-0.5">close</span>
                <span><strong>Que tú conectes todo:</strong> APIs, webhooks, errores, manejo de authentication</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined text-accent mt-0.5">close</span>
                <span><strong>Que tú depures cuando falle:</strong> sin saber por qué, cada cambio nuevo te toma horas</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined text-accent mt-0.5">close</span>
                <span><strong>Que tú actualices:</strong> cuando cambian las APIs, rompen conexiones</span>
              </li>
            </ul>
            <p className="font-montserrat text-slate-400 mt-4 text-sm italic">
              Ejemplo: Compras Zapier por $50/mes. Tienes 3 meses para crear 5 automatizaciones.
              <br/><br/>
              • 2 meses viendo tutoriales<br/>
              • 1 mes probando y depurando<br/>
              • Resultado: un flujo que funciona 80% del tiempo, cuando falla no sabes por qué, y cada cambio nuevo te toma horas.
            </p>
          </div>

          <div>
            <h3 className="font-michroma text-xl text-white uppercase mb-4">Nuestro servicio incluye...</h3>
            <ul className="space-y-3 font-montserrat text-sm text-slate-300">
              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined text-green-400 mt-0.5">check_circle</span>
                <span><strong>Nosotros hacemos TODO por ti:</strong> desde el diseño hasta la implementación</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined text-green-400 mt-0.5">check_circle</span>
                <span><strong>Te entregamos funcionando:</strong> en 2-4 semanas tienes el sistema en producción</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined text-green-400 mt-0.5">check_circle</span>
                <span><strong>Tú usas, no construyes:</strong> no tocas código, solo apruebas y das feedback</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined text-green-400 mt-0.5">check_circle</span>
                <span><strong>Nosotros respondemos si falla:</strong> soporte 24/7 con ingenieros reales</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined text-green-400 mt-0.5">check_circle</span>
                <span><strong>Mejoras cada mes:</strong> el sistema se adapta y crece contigo sin costo extra</span>
              </li>
            </ul>
            <p className="font-montserrat text-slate-400 mt-4 text-sm italic">
              Es la diferencia entre:<br/><br/>
              🔧 Comprar un martillo y construir tu casa tú mismo<br/>
              🏠 Contratar un contratista que te entrega la casa lista
            </p>
          </div>
        </motion.div>

        {/* ROI Calculations */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeInUp}
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          <div className="bg-navy-darker border border-primary/20 rounded-xl p-6 text-center">
            <h4 className="font-michroma text-primary text-2xl mb-4">Plan Básico</h4>
            <p className="text-slate-400 text-sm mb-4">Valor que obtienes: 15+ horas/semana liberadas = 60h/mes</p>
            <div className="text-slate-300 text-sm space-y-2">
              <p>Costaría contratar asistente: <strong className="text-white">$600-900/mes</strong></p>
              <p className="text-green-400">Ahorro neto: $528-828/mes</p>
              <p className="text-slate-500 text-xs">ROI: 700-1150%</p>
            </div>
          </div>

          <div className="bg-navy-darker border border-accent/20 rounded-xl p-6 text-center">
            <h4 className="font-michroma text-accent text-2xl mb-4">Plan Profesional</h4>
            <p className="text-slate-400 text-sm mb-4">Valor: 40+ horas/semana = 160h/mes</p>
            <div className="text-slate-300 text-sm space-y-2">
              <p>Costaría contratar 2 personas: <strong className="text-white">$1,200-1,800/mes</strong></p>
              <p className="text-green-400">Ahorro neto: $1,050-1,650/mes</p>
              <p className="text-slate-500 text-xs">ROI: 700-1100%</p>
            </div>
          </div>

          <div className="bg-navy-darker border border-primary/40 rounded-xl p-6 text-center">
            <h4 className="font-michroma text-primary text-2xl mb-4">Plan Empresarial</h4>
            <p className="text-slate-400 text-sm mb-4">Valor: 80+ horas/semana = 320h/mes</p>
            <div className="text-slate-300 text-sm space-y-2">
              <p>Costaría contratar equipo de 4: <strong className="text-white">$2,400-3,600/mes</strong></p>
              <p className="text-green-400">Ahorro neto: $2,160-3,360/mes</p>
              <p className="text-slate-500 text-xs">ROI: 900-1400%</p>
            </div>
          </div>
        </motion.div>

        {/* Cost of not automating */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeInUp}
          className="mt-12 p-6 bg-accent/10 border border-accent/30 rounded-xl"
        >
          <h3 className="font-michroma text-accent text-xl uppercase mb-4 text-center">El costo de NO automatizar</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-montserrat text-sm text-slate-300 text-center">
            <div>
              <div className="material-symbols-outlined text-4xl text-accent mb-2">hourglass_empty</div>
              <p><strong>Tu tiempo perdido</strong><br/>60+ horas/mes en tareas repetitivas que podrías delegar</p>
            </div>
            <div>
              <div className="material-symbols-outlined text-4xl text-accent mb-2">趋势</div>
              <p><strong>Oportunidad perdida</strong><br/>Mientras respondes manualmente, pierdes ventas y clientes</p>
            </div>
            <div>
              <div className="material-symbols-outlined text-4xl text-accent mb-2">sentiment_dissatisfied</div>
              <p><strong>Clientes frustrados</strong><br/>Respuestas lentas = experiencias pobres = menos referidos</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
