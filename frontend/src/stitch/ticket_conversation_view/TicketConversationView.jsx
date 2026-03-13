import { Link, useNavigate } from 'react-router-dom';
import PortalLayout from '../../components/PortalLayout';
import './TicketConversationView.css';

export default function TicketConversationView() {
  const navigate = useNavigate();
  return (
    <PortalLayout>
      <div className="flex flex-col h-screen overflow-hidden circuit-bg">

        <div className="flex flex-1 overflow-hidden">
          <aside className="w-80 bg-navy-deep border-r border-white/5 flex flex-col p-6 gap-8 overflow-y-auto">
            <section>
              <h3 className="text-[10px] font-bold tracking-[0.2em] text-slate-500 uppercase mb-4">Ticket Metadata</h3>
              <div className="space-y-4">
                {[
                  { icon: 'engineering',   color: 'text-primary',   label: 'Técnico Asignado', value: 'Ing. Javier V.',      valueColor: 'text-slate-200' },
                  { icon: 'priority_high', color: 'text-red-500',   label: 'Prioridad',        value: 'Alta / Crítica',       valueColor: 'text-red-400'   },
                  { icon: 'calendar_today',color: 'text-slate-400', label: 'Creado',            value: '24 Oct 2023 - 14:30', valueColor: 'text-slate-200' },
                ].map(m => (
                  <div key={m.label} className="flex items-start gap-3">
                    <span className={`material-symbols-outlined text-sm ${m.color}`}>{m.icon}</span>
                    <div>
                      <p className="text-[10px] text-slate-500 uppercase tracking-tighter">{m.label}</p>
                      <p className={`text-sm font-medium ${m.valueColor}`}>{m.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="bg-black/40 border border-white/5 p-4">
              <h3 className="text-[10px] font-bold tracking-[0.2em] text-primary uppercase mb-3">Referencia de Error</h3>
              <div className="font-mono text-[11px] text-slate-400 bg-black/60 p-3 mb-3 break-all">
                ERR_SYNC_092: Authentication failed for CRM_API_GATEWAY (Node: US-EAST-1)
              </div>
              <Link to="/automatizaciones/logs" className="flex items-center justify-between text-[11px] text-primary hover:underline group">
                <span>Ver Automation Log Completo</span>
                <span className="material-symbols-outlined text-xs group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </Link>
            </section>

            <section className="mt-auto">
              <div className="p-4 border border-white/5 bg-primary/5">
                <p className="text-[10px] text-slate-400 mb-2">SLA DE RESPUESTA</p>
                <div className="w-full bg-white/10 h-1"><div className="bg-primary h-full w-[85%]"></div></div>
                <p className="text-[10px] text-right mt-1 text-primary">85% Restante</p>
              </div>
            </section>
          </aside>

          <div className="flex-1 flex flex-col bg-background-dark relative">
            <div className="flex-1 overflow-y-auto p-8 space-y-8 scroll-smooth">

              <div className="flex flex-col items-start max-w-2xl">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] font-bold tracking-widest text-slate-500 uppercase">Cliente Portal</span>
                  <span className="text-[10px] text-slate-600">14:35 PM</span>
                </div>
                <div className="border border-primary/40 bg-primary/5 p-5 text-sm leading-relaxed text-slate-200">
                  Hola equipo de JAV LABS. Notamos que desde las 14:00 los prospectos de Facebook Ads no se están sincronizando con nuestro CRM. El log del servidor muestra errores de autenticación repetitivos. ¿Pueden revisar la API Key?
                </div>
              </div>

              <div className="flex flex-col items-end">
                <div className="max-w-2xl w-full">
                  <div className="flex items-center justify-end gap-2 mb-2">
                    <span className="text-[10px] text-slate-600">14:42 PM</span>
                    <span className="text-[10px] font-bold tracking-widest text-accent-violet uppercase">Ing. Javier V. (JAV LABS)</span>
                  </div>
                  <div className="bg-white/5 p-5 text-sm leading-relaxed text-slate-200 border-r border-b border-l border-white/5">
                    Recibido. Estoy analizando los logs de la pasarela US-EAST-1. Parece que el token de portador ha expirado prematuramente o fue revocado por el proveedor.
                    <br /><br />
                    Estoy realizando una prueba de conexión manual con las nuevas credenciales ahora mismo.
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-end">
                <div className="max-w-2xl w-full">
                  <div className="flex items-center justify-end gap-2 mb-2">
                    <span className="text-[10px] text-slate-600">14:45 PM</span>
                    <span className="text-[10px] font-bold tracking-widest text-accent-violet uppercase">Ing. Javier V. (JAV LABS)</span>
                  </div>
                  <div className="bg-white/5 p-5 text-sm leading-relaxed text-slate-200 border-r border-b border-l border-white/5">
                    Fragmento de la respuesta del servidor:
                    <div className="mt-4 p-4 bg-black font-mono text-[12px] text-green-400 border border-white/5">
                      {`{\n  "status": "error",\n  "code": 401,\n  "message": "Unauthorized: API Key has been rotated"\n}`}
                    </div>
                    <p className="mt-4">Por favor, confirmen si alguien del equipo de TI de su lado rotó las llaves hace poco.</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-start max-w-2xl">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] font-bold tracking-widest text-slate-500 uppercase">Cliente Portal</span>
                  <span className="text-[10px] text-slate-600">14:48 PM</span>
                </div>
                <div className="border border-primary/40 bg-primary/5 p-5 text-sm leading-relaxed text-slate-200">
                  Efectivamente, hubo un mantenimiento de seguridad hoy. Adjunto el nuevo log de acceso generado.
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-white/10 bg-black/60 backdrop-blur-sm">
              <div className="max-w-4xl mx-auto flex flex-col gap-4">
                <div className="flex items-center gap-2 text-slate-500 mb-1">
                  <button className="flex items-center gap-2 px-3 py-1 hover:text-primary transition-colors border border-white/5 bg-white/5">
                    <span className="material-symbols-outlined text-sm">attach_file</span>
                    <span className="text-[10px] uppercase font-bold tracking-tighter">Adjuntar Log</span>
                  </button>
                  <button className="flex items-center gap-2 px-3 py-1 hover:text-primary transition-colors border border-white/5 bg-white/5">
                    <span className="material-symbols-outlined text-sm">code</span>
                    <span className="text-[10px] uppercase font-bold tracking-tighter">Insertar Código</span>
                  </button>
                </div>
                <textarea className="w-full bg-black border border-white/10 p-4 text-sm focus:border-primary text-slate-100 placeholder:text-slate-600 resize-none min-h-[100px]" placeholder="Escribe un mensaje técnico..."></textarea>
                <div className="flex justify-between items-center">
                  <button onClick={() => navigate('/soporte/ticket')} className="border border-white/10 px-6 py-2 text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all">Cerrar Ticket</button>
                  <button className="px-8 py-2 text-[11px] font-bold uppercase tracking-[0.2em] text-white hover:opacity-90 transition-opacity" style={{ background: 'linear-gradient(90deg, #0d7ff2, #8b5cf6)' }}>Enviar Mensaje</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <footer className="h-8 bg-black border-t border-white/5 px-6 flex items-center justify-between flex-shrink-0">
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <div className="size-1.5 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-[9px] text-slate-500 uppercase tracking-widest">Automation Engine: Online</span>
            </div>
            <span className="text-[9px] text-slate-500 uppercase tracking-widest">Latencia: 24ms</span>
          </div>
          <div className="text-[9px] text-slate-600 uppercase tracking-widest">© 2024 JAV LABS Automation Portal v2.4.0</div>
        </footer>
      </div>
    </PortalLayout>
  );
}
