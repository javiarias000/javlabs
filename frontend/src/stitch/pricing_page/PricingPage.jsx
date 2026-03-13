import { useNavigate } from 'react-router-dom';
import ROICalculator from './ROICalculator';
import PublicNavbar from '../../components/PublicNavbar';

export default function PricingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background-dark">
      <PublicNavbar />

      <section className="py-32 bg-background-dark relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #0d7ff2 1px, transparent 0)', backgroundSize: '48px 48px' }} />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <span className="material-symbols-outlined text-primary text-sm">payments</span>
              <span className="text-primary text-xs font-bold uppercase tracking-widest font-montserrat">Planes y Precios</span>
            </div>
            <h1 className="font-michroma text-3xl md:text-5xl text-white uppercase mb-4">Soluciones para cada negocio</h1>
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

      {/* Footer simple */}
      <footer className="border-t border-slate-800 py-8 text-center">
        <p className="text-slate-500 text-xs font-montserrat">© 2024 JAV LABS. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}
