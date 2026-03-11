import { Link, useNavigate } from 'react-router-dom';
import './TicketConversationView.css';

export default function TicketConversationView() {
  const navigate = useNavigate();
  return (
    <>
      <div className="relative flex h-screen w-full flex-col overflow-hidden circuit-bg">

<header className="flex items-center justify-between border-b border-white/10 bg-background-dark/80 backdrop-blur-md px-8 py-4 z-10">
<div className="flex items-center gap-6">
<div className="flex items-center gap-3 text-primary">
<span className="material-symbols-outlined text-3xl">terminal</span>
<h2 className="font-michroma text-lg tracking-wider text-white">JAV LABS</h2>
</div>
<div className="h-6 w-[1px] bg-white/10"></div>
<div className="flex flex-col">
<h1 className="font-michroma text-sm md:text-base text-white tracking-tight uppercase">TICKET #JL-1024: ERROR EN CRM SYNC</h1>
</div>
<div className="violet-gradient-border px-3 py-0.5 bg-accent-violet/10">
<span className="text-[10px] font-bold tracking-[0.2em] text-accent-violet uppercase">En Progreso</span>
</div>
</div>
<div className="flex items-center gap-6">
<nav className="hidden md:flex items-center gap-6 text-xs font-medium tracking-widest uppercase text-slate-400">
<Link to="/dashboard" className="hover:text-primary transition-colors">Dashboard</Link>
<Link to="/soporte/ticket" className="text-white border-b border-primary">Tickets</Link>
<Link to="/automatizaciones/logs" className="hover:text-primary transition-colors">Logs</Link>
</nav>
<div className="flex items-center gap-4">
<button className="text-slate-400 hover:text-white transition-colors">
<span className="material-symbols-outlined">notifications</span>
</button>
<div className="size-8 bg-primary/20 border border-primary/50 flex items-center justify-center">
<span className="text-xs font-bold">JV</span>
</div>
</div>
</div>
</header>
<main className="flex flex-1 overflow-hidden">

<aside className="w-80 bg-navy-deep border-r border-white/5 flex flex-col p-6 gap-8 overflow-y-auto">
<section>
<h3 className="text-[10px] font-bold tracking-[0.2em] text-slate-500 uppercase mb-4 italic">Ticket Metadata</h3>
<div className="space-y-4">
<div className="flex items-start gap-3">
<span className="material-symbols-outlined text-primary text-sm">engineering</span>
<div>
<p className="text-[10px] text-slate-500 uppercase tracking-tighter">Técnico Asignado</p>
<p className="text-sm font-medium text-slate-200">Ing. Javier V.</p>
</div>
</div>
<div className="flex items-start gap-3">
<span className="material-symbols-outlined text-red-500 text-sm">priority_high</span>
<div>
<p className="text-[10px] text-slate-500 uppercase tracking-tighter">Prioridad</p>
<p className="text-sm font-medium text-red-400">Alta / Crítica</p>
</div>
</div>
<div className="flex items-start gap-3">
<span className="material-symbols-outlined text-slate-400 text-sm">calendar_today</span>
<div>
<p className="text-[10px] text-slate-500 uppercase tracking-tighter">Creado</p>
<p className="text-sm font-medium text-slate-200">24 Oct 2023 - 14:30</p>
</div>
</div>
</div>
</section>
<section className="bg-black/40 border border-white/5 p-4">
<h3 className="text-[10px] font-bold tracking-[0.2em] text-primary uppercase mb-3">Referencia de Error</h3>
<div className="font-mono text-[11px] text-slate-400 bg-black/60 p-3 mb-3 break-all">
                        ERR_SYNC_092: Authentication failed for CRM_API_GATEWAY (Node: US-EAST-1)
                    </div>
<a className="flex items-center justify-between text-[11px] text-primary hover:underline group" href="/automatizaciones/logs">
<span>Ver Automation Log Completo</span>
<span className="material-symbols-outlined text-xs group-hover:translate-x-1 transition-transform">arrow_forward</span>
</a>
</section>
<section className="mt-auto">
<div className="p-4 border border-white/5 bg-primary/5">
<p className="text-[10px] text-slate-400 mb-2">SLA DE RESPUESTA</p>
<div className="w-full bg-white/10 h-1">
<div className="bg-primary h-full w-[85%]"></div>
</div>
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
<span className="text-[10px] font-bold tracking-widest text-accent-violet uppercase italic">Ing. Javier V. (JAV LABS)</span>
</div>
<div className="bg-white/5 p-5 text-sm leading-relaxed text-slate-200 tech-msg-border border-r border-b border-l border-white/5">
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
<span className="text-[10px] font-bold tracking-widest text-accent-violet uppercase italic">Ing. Javier V. (JAV LABS)</span>
</div>
<div className="bg-white/5 p-5 text-sm leading-relaxed text-slate-200 tech-msg-border border-r border-b border-l border-white/5">
                                Fragmento de la respuesta del servidor:
                                <div className="mt-4 p-4 bg-black font-mono text-[12px] text-green-400 border border-white/5">
                                    &#123;<br />
                                      "status": "error",<br />
                                      "code": 401,<br />
                                      "message": "Unauthorized: API Key has been rotated"<br />
                                    &#125;
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
<span className="text-[10px] uppercase font-bold tracking-tighter">Insertar Fragmento de Código</span>
</button>
</div>
<div className="relative">
<textarea className="w-full bg-black border border-white/10 p-4 text-sm focus:border-primary focus:ring-1 focus:ring-primary/20 text-slate-100 placeholder:text-slate-600 resize-none min-h-[100px]" placeholder="Escribe un mensaje técnico..."></textarea>
</div>
<div className="flex justify-between items-center">
<button className="border border-white/10 px-6 py-2 text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all" onClick={() => navigate('/soporte/ticket')}>Cerrar Ticket</button>
<button className="bg-gradient-to-r from-primary to-accent-violet px-8 py-2 text-[11px] font-bold uppercase tracking-[0.2em] text-white hover:opacity-90 transition-opacity">
                                Enviar Mensaje
                            </button>
</div>
</div>
</div>
</div>
</main>

<footer className="h-8 bg-black border-t border-white/5 px-6 flex items-center justify-between">
<div className="flex gap-4">
<div className="flex items-center gap-2">
<div className="size-1.5 rounded-full bg-green-500 animate-pulse"></div>
<span className="text-[9px] text-slate-500 uppercase tracking-widest">Automation Engine: Online</span>
</div>
<div className="flex items-center gap-2">
<span className="text-[9px] text-slate-500 uppercase tracking-widest">Latencia: 24ms</span>
</div>
</div>
<div className="text-[9px] text-slate-600 uppercase tracking-widest">
                © 2023 JAV LABS Automation Portal v2.4.0
            </div>
</footer>
</div>
    </>
  );
}
