import { Link, useNavigate } from 'react-router-dom';
import './AutomationLogsErrorTracking.css';

export default function AutomationLogsErrorTracking() {
  return (
    <>
      <div className="flex flex-col h-screen overflow-hidden">

<header className="h-16 flex items-center justify-between px-8 border-b border-primary/20 bg-background-dark/80 backdrop-blur-md z-30">
<div className="flex items-center gap-6">
<div className="flex items-center gap-3 text-primary">
<span className="material-symbols-outlined text-3xl">settings_input_component</span>
<h1 className="font-michroma text-sm tracking-wider text-slate-100 uppercase">Registro de Automatizaciones</h1>
</div>
<div className="h-6 w-[1px] bg-primary/20"></div>
<nav className="flex gap-6">
<Link to="/automatizaciones/logs" className="text-xs uppercase tracking-widest text-primary font-bold">Logs</Link>
<Link to="/dashboard" className="text-xs uppercase tracking-widest text-slate-400 hover:text-white transition-colors">Dashboard</Link>
<a className="text-xs uppercase tracking-widest text-slate-400 hover:text-white transition-colors" href="/dashboard/overview">Configuración</a>
</nav>
</div>
<div className="flex items-center gap-4">
<div className="relative w-72">
<span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">search</span>
<input className="w-full bg-slate-900/50 border border-slate-700 text-[10px] py-2 pl-10 pr-4 focus:ring-1 focus:ring-primary focus:border-primary outline-none uppercase tracking-tighter" placeholder="BUSCAR POR ID O FLUJO..." type="text" />
</div>
<button className="flex items-center gap-2 px-4 py-2 border border-slate-700 bg-slate-900/50 hover:bg-slate-800 transition-colors">
<span className="material-symbols-outlined text-sm">account_circle</span>
<span className="text-[10px] font-bold uppercase tracking-widest">JAV_ADMIN</span>
</button>
</div>
</header>
<div className="flex flex-1 overflow-hidden">

<aside className="w-16 border-r border-primary/10 flex flex-col items-center py-6 gap-8 bg-background-dark/40">
<span className="material-symbols-outlined text-primary cursor-pointer">grid_view</span>
<span className="material-symbols-outlined text-slate-500 cursor-pointer hover:text-white">analytics</span>
<span className="material-symbols-outlined text-slate-500 cursor-pointer hover:text-white">history</span>
<span className="material-symbols-outlined text-slate-500 cursor-pointer hover:text-white">report_problem</span>
</aside>

<main className="flex-1 flex flex-col overflow-hidden">

<div className="h-14 border-b border-primary/10 flex items-center px-8 gap-4 bg-background-dark/20">
<div className="flex items-center gap-2">
<span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Estado:</span>
<button className="flex items-center gap-2 px-3 py-1 border border-slate-700 text-[10px] uppercase tracking-tighter hover:border-primary transition-colors">
                            Todos <span className="material-symbols-outlined text-xs">expand_more</span>
</button>
</div>
<div className="flex items-center gap-2">
<span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Flujo:</span>
<button className="flex items-center gap-2 px-3 py-1 border border-slate-700 text-[10px] uppercase tracking-tighter hover:border-primary transition-colors">
                            Todos <span className="material-symbols-outlined text-xs">expand_more</span>
</button>
</div>
<div className="flex items-center gap-2">
<span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Rango de Fechas:</span>
<button className="flex items-center gap-2 px-3 py-1 border border-slate-700 text-[10px] uppercase tracking-tighter hover:border-primary transition-colors">
                            Últimas 24 Horas <span className="material-symbols-outlined text-xs">calendar_today</span>
</button>
</div>
<div className="ml-auto flex gap-2">
<button className="px-4 py-1 border border-slate-700 text-[10px] uppercase tracking-widest text-slate-400 hover:text-white transition-all">Limpiar Filtros</button>
<button className="px-6 py-1 bg-primary text-white text-[10px] uppercase font-bold tracking-widest hover:brightness-110 transition-all">Actualizar</button>
</div>
</div>

<div className="flex-1 overflow-auto custom-scrollbar p-8">
<table className="w-full border-collapse">
<thead>
<tr className="text-left border-b border-slate-700">
<th className="pb-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest px-4">ID de Ejecución</th>
<th className="pb-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest px-4">Flujo</th>
<th className="pb-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest px-4">Inicio</th>
<th className="pb-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest px-4">Duración</th>
<th className="pb-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest px-4">Estado</th>
<th className="pb-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest px-4">Acciones</th>
</tr>
</thead>
<tbody className="text-sm font-medium">
<tr className="border-b border-slate-800 hover:bg-white/5 transition-colors cursor-pointer group">
<td className="py-4 px-4 font-mono text-xs text-primary">#JV-99281</td>
<td className="py-4 px-4">Shopify Inventory Sync</td>
<td className="py-4 px-4 text-slate-400">24 Oct 2023 - 14:20:05</td>
<td className="py-4 px-4 text-slate-400">1.2s</td>
<td className="py-4 px-4">
<span className="flex items-center gap-2 text-green-500 text-[10px] uppercase font-bold tracking-widest">
<span className="h-1.5 w-1.5 rounded-full bg-green-500"></span> Éxito
                                    </span>
</td>
<td className="py-4 px-4">
<span className="material-symbols-outlined text-slate-600 group-hover:text-primary transition-colors">terminal</span>
</td>
</tr>
<tr className="border-b border-slate-800 error-row hover:brightness-125 transition-all cursor-pointer group">
<td className="py-4 px-4 font-mono text-xs text-red-400">#JV-99280</td>
<td className="py-4 px-4">Stripe Webhook Handler</td>
<td className="py-4 px-4 text-slate-400">24 Oct 2023 - 14:18:12</td>
<td className="py-4 px-4 text-slate-400">0.8s</td>
<td className="py-4 px-4">
<span className="flex items-center gap-2 text-red-500 text-[10px] uppercase font-bold tracking-widest">
<span className="h-1.5 w-1.5 rounded-full bg-red-500"></span> Error
                                    </span>
</td>
<td className="py-4 px-4">
<span className="material-symbols-outlined text-red-600">error_outline</span>
</td>
</tr>
<tr className="border-b border-slate-800 hover:bg-white/5 transition-colors cursor-pointer group">
<td className="py-4 px-4 font-mono text-xs text-primary">#JV-99279</td>
<td className="py-4 px-4">Daily Sales Report Generator</td>
<td className="py-4 px-4 text-slate-400">24 Oct 2023 - 09:00:00</td>
<td className="py-4 px-4 text-slate-400">45.5s</td>
<td className="py-4 px-4">
<span className="flex items-center gap-2 text-green-500 text-[10px] uppercase font-bold tracking-widest">
<span className="h-1.5 w-1.5 rounded-full bg-green-500"></span> Éxito
                                    </span>
</td>
<td className="py-4 px-4">
<span className="material-symbols-outlined text-slate-600 group-hover:text-primary transition-colors">terminal</span>
</td>
</tr>
<tr className="border-b border-slate-800 error-row hover:brightness-125 transition-all cursor-pointer group">
<td className="py-4 px-4 font-mono text-xs text-red-400">#JV-99278</td>
<td className="py-4 px-4">CRM Contact Push</td>
<td className="py-4 px-4 text-slate-400">24 Oct 2023 - 08:45:30</td>
<td className="py-4 px-4 text-slate-400">2.1s</td>
<td className="py-4 px-4">
<span className="flex items-center gap-2 text-red-500 text-[10px] uppercase font-bold tracking-widest">
<span className="h-1.5 w-1.5 rounded-full bg-red-500"></span> Error
                                    </span>
</td>
<td className="py-4 px-4">
<span className="material-symbols-outlined text-red-600">error_outline</span>
</td>
</tr>
<tr className="border-b border-slate-800 hover:bg-white/5 transition-colors cursor-pointer group">
<td className="py-4 px-4 font-mono text-xs text-primary">#JV-99277</td>
<td className="py-4 px-4">AWS S3 Media Backup</td>
<td className="py-4 px-4 text-slate-400">24 Oct 2023 - 04:00:01</td>
<td className="py-4 px-4 text-slate-400">15m 12s</td>
<td className="py-4 px-4">
<span className="flex items-center gap-2 text-green-500 text-[10px] uppercase font-bold tracking-widest">
<span className="h-1.5 w-1.5 rounded-full bg-green-500"></span> Éxito
                                    </span>
</td>
<td className="py-4 px-4">
<span className="material-symbols-outlined text-slate-600 group-hover:text-primary transition-colors">terminal</span>
</td>
</tr>
</tbody>
</table>
<div className="mt-8 flex justify-center">
<nav className="flex items-center gap-2">
<button className="p-2 border border-slate-700 hover:border-primary transition-colors"><span className="material-symbols-outlined text-sm">chevron_left</span></button>
<button className="w-8 h-8 border border-primary bg-primary/20 text-xs font-bold">1</button>
<button className="w-8 h-8 border border-slate-700 hover:border-primary text-xs font-bold transition-colors">2</button>
<button className="w-8 h-8 border border-slate-700 hover:border-primary text-xs font-bold transition-colors">3</button>
<button className="p-2 border border-slate-700 hover:border-primary transition-colors"><span className="material-symbols-outlined text-sm">chevron_right</span></button>
</nav>
</div>
</div>
</main>

<aside className="w-[450px] bg-black border-l border-red-900/30 flex flex-col z-40 relative">
<div className="p-6 border-b border-slate-800">
<div className="flex items-center justify-between mb-8">
<h2 className="font-michroma text-xs tracking-widest text-red-500 uppercase">Detalle del Error</h2>
<button className="text-slate-500 hover:text-white"><span className="material-symbols-outlined text-lg">close</span></button>
</div>
<div className="space-y-4">
<div className="flex justify-between items-center text-[10px] uppercase tracking-widest">
<span className="text-slate-500">ID de Ejecución</span>
<span className="text-white font-mono">#JV-99280</span>
</div>
<div className="flex justify-between items-center text-[10px] uppercase tracking-widest">
<span className="text-slate-500">Flujo Relacionado</span>
<span className="text-white">Stripe Webhook Handler</span>
</div>
<div className="flex justify-between items-center text-[10px] uppercase tracking-widest">
<span className="text-slate-500">Código de Error</span>
<span className="text-red-400 font-mono">HTTP_500_INTERNAL_FAIL</span>
</div>
</div>
</div>
<div className="flex-1 p-6 overflow-auto custom-scrollbar">
<h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-4">Stack Trace / JSON Response</h3>
<div className="bg-slate-900 p-4 font-mono text-[11px] leading-relaxed text-slate-300 border border-slate-800 overflow-x-auto">
<pre>&#123;
  "timestamp": "2023-10-24T14:18:12Z",
  "status": 500,
  "error": "Internal Server Error",
  "path": "/api/v1/stripe/webhooks",
  "message": "Signature verification failed",
  "details": &#123;
    "expected_sig": "whsec_23984729384...",
    "received_sig": "null",
    "handler": "checkout.session.completed",
    "exception": "Stripe\\Exception\\SignatureVerificationException"
  &#125;,
  "trace": [
    "at vendor/stripe/stripe-php/lib/Webhook.php:45",
    "at app/Handlers/StripeHandler.php:22",
    "at app/Controllers/WebhookController.php:12"
  ]
&#125;</pre>
</div>
</div>
<div className="p-6 border-t border-slate-800 bg-background-dark/50 space-y-3">
<button className="w-full py-3 bg-gradient-to-r from-red-600 to-primary text-[10px] font-michroma tracking-widest text-white uppercase hover:brightness-110 transition-all flex items-center justify-center gap-2">
<span className="material-symbols-outlined text-sm">refresh</span> Reintentar Ejecución
                    </button>
<button className="w-full py-3 border border-slate-700 text-[10px] font-michroma tracking-widest text-slate-400 uppercase hover:text-white hover:border-white transition-all flex items-center justify-center gap-2">
<span className="material-symbols-outlined text-sm">download</span> Descargar Reporte
                    </button>
</div>
</aside>
</div>
</div>

<div className="fixed top-0 left-0 w-full h-full pointer-events-none opacity-5 mix-blend-overlay z-0">
<div className="w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
</div>
    </>
  );
}
