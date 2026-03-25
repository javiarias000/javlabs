import { useNavigate } from 'react-router-dom';
import ROICalculator from './ROICalculator';
import PublicNavbar from '../../components/PublicNavbar';
import ObjectionBuster from '../landing_page_1/ObjectionBuster';
import { motion } from 'framer-motion';
import './PricingPage.css';

export default function PricingPage() {
  const navigate = useNavigate();

  const plans = [
    {
      name: 'BÁSICO',
      tagline: 'INICIO',
      price: '$72',
      period: '/mes',
      setup: '+ $210 setup (único pago)',
      description: 'Ideal para emprendedores que quieren automatizar su primera tarea y recuperar 15+ horas semanales.',
      features: [
        '1 Sistema automatizado completo',
        'Hasta 1,000 interacciones/mes',
        'Integración con 1 canal',
        'Google Calendar incluido',
        'Soporte técnico básico',
        'Panel de monitoreo'
      ],
      color: 'primary',
      gradient: 'from-primary to-accent'
    },
    {
      name: 'PROFESIONAL',
      tagline: 'CRECIMIENTO',
      badge: 'MÁS POPULAR',
      price: '$150',
      period: '/mes',
      setup: '+ $420 setup (único pago)',
      description: 'Para negocios en crecimiento que automatizan 2-3 procesos y quieren un agente de IA que responda como tú.',
      features: [
        'Hasta 3 sistemas automatizados completos',
        'Hasta 5,000 interacciones mensuales',
        'Multi-canal (WhatsApp + Email + Web)',
        'Agente IA personalizado',
        'Recordatorios y seguimientos automáticos',
        'Reportes y métricas avanzadas',
        'Soporte prioritario 24/7',
        'Optimización mensual sin costo extra'
      ],
      color: 'accent',
      gradient: 'from-accent to-primary',
      popular: true
    },
    {
      name: 'EMPRESARIAL',
      tagline: 'ESCALA',
      price: '$240',
      period: '/mes',
      setup: '+ $720 setup (único pago)',
      description: 'Para organizaciones que necesitan automatización total, IA avanzada y soporte dedicado 24/7.',
      features: [
        'Flujos ilimitados',
        'Hasta 20,000 interacciones mensuales',
        'Todos los canales de comunicación',
        'IA con procesamiento de lenguaje natural avanzado',
        'Dashboard administrativo completo',
        'Integraciones con CRM y APIs externas',
        'Soporte dedicado 24/7',
        'Mejoras y mantenimiento continuo'
      ],
      color: 'primary',
      gradient: 'from-primary via-accent to-primary'
    }
  ];

  return (
    <div className="min-h-screen bg-navy-darker">
      <PublicNavbar />

      {/* HERO SECTION */}
      <section className="pricing-hero relative overflow-hidden pricing-hero-bg">
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="plan-badge mx-auto mb-8">
              <span className="material-symbols-outlined">payments</span>
              <span>Planes y Precios</span>
            </div>

            <h1 className="font-michroma text-4xl md:text-5xl lg:text-6xl text-white mb-6 tracking-tight leading-tight">
              INVIERTE EN AUTOMATIZACIÓN,<br className="hidden md:block" /> NO EN SALARIOS
            </h1>

            <div className="decorative-line" />

            <p className="font-montserrat text-lg md:text-xl text-text-secondary max-w-3xl mx-auto leading-relaxed">
              Planes transparentes sin sorpresas. Elige el que se ajuste a tu volumen de trabajo.
            </p>
          </motion.div>
        </div>
      </section>

      {/* PRICING CARDS */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">

            {plans.map((plan, idx) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: idx * 0.15 }}
                className={`pricing-card relative flex flex-col ${plan.popular ? 'pricing-card-popular' : ''}`}
              >
                {plan.popular && (
                  <div className="popular-badge">
                    {plan.badge}
                  </div>
                )}

                <div className="flex-1 flex flex-col">
                  {/* Header */}
                  <div className="plan-header">
                    <div className="flex items-center justify-between mb-3">
                      <span className={`plan-tagline ${plan.popular ? 'plan-tagline-popular' : 'text-text-muted'}`}>
                        {plan.tagline}
                      </span>
                    </div>
                    <h3 className="plan-name">{plan.name}</h3>
                    <div className="plan-price">
                      <span className="plan-price-amount">{plan.price}</span>
                      <span className="plan-price-period">{plan.period}</span>
                    </div>
                    <p className="plan-setup">{plan.setup}</p>
                    <p className="plan-description">
                      {plan.description}
                    </p>
                  </div>

                  {/* Features */}
                  <div className="plan-features">
                    {plan.features.map((feature, fIdx) => (
                      <motion.div
                        key={fIdx}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: fIdx * 0.03 }}
                        className="plan-feature"
                      >
                        <span className="material-symbols-outlined text-color-primary">check_circle</span>
                        <span className="plan-feature-text">{feature}</span>
                      </motion.div>
                    ))}
                  </div>

                  {/* CTA Button */}
                  <button
                    onClick={() => navigate('/contacto')}
                    className={`pricing-cta ${plan.popular ? 'pricing-cta-popular' : 'pricing-cta-secondary'}`}
                  >
                    Comenzar
                  </button>
                </div>
              </motion.div>
            ))}

          </div>
        </div>
      </section>

      {/* ROI CALCULATOR */}
      <section className="roi-section">
        <div className="max-w-7xl mx-auto px-6">
          <ROICalculator />
        </div>
      </section>

      {/* OBJECTION BUSTER */}
      <section className="objections-section">
        <div className="max-w-7xl mx-auto px-6">
          <ObjectionBuster />
        </div>
      </section>

      {/* FOOTER */}
      <footer className="pricing-footer">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="flex items-center gap-3 text-white mb-6">
              <span className="material-symbols-outlined text-2xl text-color-primary">settings_input_component</span>
              <h2 className="text-lg font-michroma tracking-widest">JAV LABS</h2>
            </div>
            <p className="footer-text">
              Automatizamos tus procesos para que recuperes 20+ horas cada semana. Sistemas completos, sin que toques código.
            </p>
            <div className="mt-6">
              <p className="text-white text-sm font-montserrat font-bold mb-3">Contáctanos</p>
              <div className="space-y-3 text-text-secondary text-sm font-montserrat">
                <p><span className="material-symbols-outlined text-color-primary text-sm align-middle mr-2">mail</span>jorge.arias.amauta@gmail.com</p>
                <p><span className="material-symbols-outlined text-color-primary text-sm align-middle mr-2">call</span>+593 967 685 172</p>
                <p><span className="material-symbols-outlined text-color-primary text-sm align-middle mr-2">location_on</span>Ambato, Ecuador</p>
              </div>
            </div>
          </div>
          <div>
            <h4 className="footer-heading text-white">Empresa</h4>
            <div className="footer-links">
              {['Nosotros', 'Servicios', 'Precios', 'Casos de Éxito'].map((item) => (
                <a key={item} className="footer-link" href="/">{item}</a>
              ))}
            </div>
          </div>
          <div>
            <h4 className="footer-heading text-white">Soporte</h4>
            <div className="footer-links">
              {['Contacto', 'Portal de Clientes', 'FAQ', 'Documentación'].map((item) => (
                <a key={item} className="footer-link" href="/">{item}</a>
              ))}
            </div>
          </div>
          <div>
            <h4 className="footer-heading text-white">¿Listo para automatizar?</h4>
            <p className="footer-text mb-4">Agenda una consulta gratis y descubre cuántas horas ahorrarías.</p>
            <button
              onClick={() => navigate('/contacto')}
              className="w-full text-white font-bold py-3 px-6 text-xs uppercase tracking-widest rounded-lg hover:opacity-90 transition-all"
              style={{ background: 'var(--gradient-primary)' }}>
              Consulta Gratis →
            </button>
          </div>
        </div>
        <div className="footer-bottom">
          <p className="footer-copyright">© {new Date().getFullYear()} JAV LABS. Todos los derechos reservados.</p>
          <div className="flex gap-8 text-text-muted text-xs">
            {['Privacidad', 'Términos', 'Cookies'].map((item) => (
              <a key={item} href="/" className="footer-link">{item}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
