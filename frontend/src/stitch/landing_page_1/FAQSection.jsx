import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './FAQSection.css';

const faqs = [
  {
    question: '¿Cuánto tiempo toma implementar?',
    answer: '2-4 semanas desde que apruebas el plan. Tú solo participas en: reunión de diagnóstico (1h), revisión de propuesta (30min), y pruebas/validación (1-2h). Todo el desarrollo lo hacemos nosotros.'
  },
  {
    question: '¿Qué pasa si necesito cambiar algo después?',
    answer: 'Los ajustes menores están incluidos. Cambios grandes los cotizamos aparte, pero rara vez son necesarios porquecemos bien el primer diseño. En planes Profesional y Empresarial, incluyes optimizaciones mensuales sin costo extra.'
  },
  {
    question: '¿Puedo cancelar en cualquier momento?',
    answer: 'Sí, cancelas cuando quieras. No tienes permanencia. Eso sí: el setup es una sola vez y no se devuelve (ya gastamos tiempo/recursos en crear tu sistema). Pero si no estás contento en los primeros 30 días, devolvemos el setup completo.'
  },
  {
    question: '¿Qué pasa si mi negocio crece y necesito más interacciones?',
    answer: 'Fácil — escalas al plan siguiente. Te ajustamos la diferencia proporcional. Ningún problema. Así de simple: si pasas de 1,000 a 6,000 interacciones/mes, pasas del Plan Básico al Profesional y listo. Seguimos funcionando sin interrupciones.'
  },
  {
    question: '¿Mis datos están seguros?',
    answer: 'Totalmente. Todos los datos se almacenan en servidores con encriptación. No vendemos ni compartimos tu información. Tienes acceso completo para exportar cuando quieras.'
  },
  {
    question: '¿Necesito saber programar?',
    answer: 'NO. Cero. Nada. Tú solo: respondes algunas preguntas sobre tu negocio, apruebas el diseño, usas el sistema (como usas WhatsApp o Gmail), y das feedback. Nosotros hacemos el resto.'
  },
  {
    question: '¿Puedo conectar mi CRM actual?',
    answer: 'Sí, en planes Profesional y Empresarial. Conectamos prácticamente cualquier sistema con API: Salesforce, HubSpot, Pipedrive, Google Sheets, Airtable, Shopify, WooCommerce, y cientos más. En Plan Básico, incluimos Google Sheets si lo necesitas.'
  },
  {
    question: '¿El sistema funciona en Ecuador/LATAM?',
    answer: 'Sí, completamente. Usamos WhatsApp Business API que funciona perfectamente en Ecuador. Las_monedas, horarios, y formas de pago locales están soportadas. Todo en español.'
  }
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-24 md:py-32 bg-background-dark section-spaced">
      <div className="container mx-auto px-6">
        <div className="mb-16 text-center">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 mb-6">
            <span className="material-symbols-outlined text-primary">question_answer</span>
            <span className="text-primary text-sm font-bold uppercase tracking-widest font-montserrat">Preguntas Frecuentes</span>
          </div>
          <h2 className="font-michroma text-3xl md:text-4xl text-white uppercase mb-4 leading-tight">
            Aún tienes <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">dudas</span>?
          </h2>
          <p className="font-montserrat text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
            Respuestas claras a las preguntas más comunes.
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, idx) => (
            <motion.div
              key={idx}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: idx * 0.05 } }
              }}
              className="bg-navy-darker border border-slate-800 rounded-xl overflow-hidden"
            >
              <button
                onClick={() => toggle(idx)}
                className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-slate-800/30 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <span className="material-symbols-outlined text-primary text-2xl flex-shrink-0">
                    {openIndex === idx ? 'remove' : 'add'}
                  </span>
                  <h3 className="font-montserrat text-base md:text-lg text-white font-semibold leading-tight">
                    {faq.question}
                  </h3>
                </div>
              </button>

              <AnimatePresence>
                {openIndex === idx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6 pt-0">
                      <div className="h-px bg-slate-800 mb-4" />
                      <p className="font-montserrat text-sm text-slate-300 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="font-montserrat text-slate-400 text-sm max-w-xl mx-auto">
            ¿No encuentras lo que buscas?{' '}
            <a href="/contacto" className="text-primary hover:text-accent transition-colors font-semibold">
              Hablemos directamente
            </a>
            {' '} y te respondemos en menos de 24h.
          </p>
        </div>
      </div>
    </section>
  );
}
