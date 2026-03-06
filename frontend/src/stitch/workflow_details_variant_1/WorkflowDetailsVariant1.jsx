import { Link, useNavigate } from 'react-router-dom';
import './WorkflowDetailsVariant1.css';

export default function WorkflowDetailsVariant1() {
  return (
    <>
      <header className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 px-8 py-4 bg-background-light dark:bg-background-dark">
<div className="flex items-center gap-8">
<div className="flex items-center gap-3">
<div className="size-8 bg-primary flex items-center justify-center">
<span className="material-symbols-outlined text-white">bolt</span>
</div>
<h2 className="font-michroma text-lg tracking-wider text-slate-900 dark:text-slate-100">JAV LABS</h2>
</div>
<nav className="hidden md:flex items-center gap-8">
<Link to="/dashboard" className="text-primary text-sm font-medium">Dashboard</Link>
<Link to="/workflow/v1" className="text-slate-500 dark:text-slate-400 text-sm font-medium hover:text-primary">Workflows</Link>
<Link to="/automatizaciones/logs" className="text-slate-500 dark:text-slate-400 text-sm font-medium hover:text-primary">Logs</Link>
<a className="text-slate-500 dark:text-slate-400 text-sm font-medium hover:text-primary" href="/">Settings</a>
</nav>
</div>
<div className="flex items-center gap-6">
<div className="relative hidden sm:block">
<span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">search</span>
<input className="bg-slate-100 dark:bg-slate-800 border-none pl-10 pr-4 py-2 text-sm focus:ring-1 focus:ring-primary w-64" placeholder="Search workflow..." type="text" />
</div>
<div className="flex items-center gap-4">
<button className="p-2 text-slate-400 hover:text-primary">
<span className="material-symbols-outlined">notifications</span>
</button>
<div className="size-10 bg-slate-200 dark:bg-slate-800" data-alt="User profile avatar placeholder">
<img alt="Profile" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCtUNvDQ_XjlQ5tNkjbJESWubHoWfHnf3tqQ3kkrZRXkvThXUD_v9eBPMetm0XhdOkGjDmCbDbRjLOUnompPY1VTz9mwULX6pAslMg9JWQUQwwqpsskhkIqOZBBgoyoFwmnSxrYxjKqlghf-YHT4tWcLwCI2vqnuu72Si3caWAeY6RglugliqJm6Zvw5Kl41NAvovOgziyUQZXJ8LuMGiKjAl4k4rNYG2-PuD0YRJas7ysxbfhKj-nPEaYO2O_d6HNjbCEcWzFzAPQ" />
</div>
</div>
</div>
</header>

<main className="p-8 max-w-[1440px] mx-auto">

<div className="mb-8">
<div className="flex items-center gap-2 font-montserrat text-sm text-slate-500 dark:text-slate-400 mb-2">
<span>Proyectos</span>
<span className="material-symbols-outlined text-xs">chevron_right</span>
<span className="text-primary">CRM Sync</span>
</div>
<div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
<h1 className="font-michroma text-2xl lg:text-3xl text-slate-900 dark:text-slate-100 uppercase tracking-tight">DETALLES DEL FLUJO: CRM SYNC</h1>
<div className="flex items-center gap-3">
<button className="px-6 py-2 bg-slate-200 dark:bg-slate-800 text-sm font-bold uppercase tracking-wider hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors">Pausar</button>
<button className="px-6 py-2 bg-primary text-white text-sm font-bold uppercase tracking-wider hover:bg-blue-600 transition-colors">Editar Flujo</button>
</div>
</div>
</div>

<div className="w-full border-y border-slate-200 dark:border-slate-800 py-3 mb-10 flex items-center justify-between px-4">
<div className="flex items-center gap-3">
<div className="size-2 rounded-full bg-primary glow-dot"></div>
<span className="text-xs font-bold uppercase tracking-widest text-primary">Estado: Activo</span>
</div>
<div className="text-[10px] text-slate-500 uppercase tracking-widest font-medium">Última sincronización: Hace 2 minutos</div>
</div>
<div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

<div className="lg:col-span-8">
<h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-6">Visualización de Pasos</h3>
<div className="flex flex-col">

<div className="w-full max-w-md bg-white dark:bg-black p-6 border border-slate-200 dark:border-slate-800 gradient-top-border">
<div className="flex items-center justify-between mb-4">
<span className="text-[10px] font-bold text-primary uppercase tracking-tighter">Trigger</span>
<span className="material-symbols-outlined text-slate-400 text-lg">bolt</span>
</div>
<h4 className="font-michroma text-sm text-slate-900 dark:text-slate-100 mb-1">Nuevo Lead</h4>
<p className="text-xs text-slate-500">Origen: Webhook / landing-page-main</p>
</div>
<div className="workflow-line"></div>

<div className="w-full max-w-md bg-white dark:bg-black p-6 border border-slate-200 dark:border-slate-800 gradient-top-border">
<div className="flex items-center justify-between mb-4">
<span className="text-[10px] font-bold text-primary uppercase tracking-tighter">Filtro</span>
<span className="material-symbols-outlined text-slate-400 text-lg">filter_alt</span>
</div>
<h4 className="font-michroma text-sm text-slate-900 dark:text-slate-100 mb-1">Región: LATAM</h4>
<p className="text-xs text-slate-500">Condición: country_code matches ['MX', 'CO', 'CL', 'PE']</p>
</div>
<div className="workflow-line"></div>

<div className="w-full max-w-md bg-white dark:bg-black p-6 border border-slate-200 dark:border-slate-800 gradient-top-border">
<div className="flex items-center justify-between mb-4">
<span className="text-[10px] font-bold text-primary uppercase tracking-tighter">Acción</span>
<span className="material-symbols-outlined text-slate-400 text-lg">cloud_sync</span>
</div>
<h4 className="font-michroma text-sm text-slate-900 dark:text-slate-100 mb-1">Crear en Salesforce</h4>
<p className="text-xs text-slate-500">Objeto: Lead / Mapping: Standard V2</p>
</div>
</div>
</div>

<div className="lg:col-span-4 flex flex-col gap-4">
<h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Métricas de Rendimiento</h3>
<div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 p-6">
<p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Ejecuciones Totales</p>
<p className="font-michroma text-2xl text-slate-900 dark:text-slate-100">12,842</p>
<div className="mt-4 h-1 bg-slate-200 dark:bg-slate-800">
<div className="h-1 bg-primary w-3/4"></div>
</div>
</div>
<div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 p-6">
<p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Tasa de Éxito</p>
<p className="font-michroma text-2xl text-slate-900 dark:text-slate-100">99.8%</p>
<p className="text-[10px] text-primary mt-2 flex items-center gap-1 uppercase tracking-tighter">
<span className="material-symbols-outlined text-xs">trending_up</span> +0.2% vs semana anterior
                    </p>
</div>
<div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 p-6">
<p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Tiempo Ahorrado</p>
<p className="font-michroma text-2xl text-slate-900 dark:text-slate-100">420h</p>
<p className="text-xs text-slate-500 mt-2">Calculado según proceso manual estándar.</p>
</div>
</div>
</div>

<div className="mt-16">
<div className="flex items-center justify-between mb-6">
<h3 className="text-xs font-bold uppercase tracking-widest text-slate-500">Logs de Ejecución en Tiempo Real</h3>
<button className="text-[10px] uppercase font-bold text-primary flex items-center gap-1">
                    Ver todos los logs <span className="material-symbols-outlined text-xs">arrow_forward</span>
</button>
</div>
<div className="overflow-x-auto border border-slate-200 dark:border-slate-800">
<table className="w-full text-left border-collapse bg-white dark:bg-black">
<thead>
<tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
<th className="p-4 text-[10px] uppercase font-bold text-slate-400 tracking-wider">Timestamp</th>
<th className="p-4 text-[10px] uppercase font-bold text-slate-400 tracking-wider">Execution ID</th>
<th className="p-4 text-[10px] uppercase font-bold text-slate-400 tracking-wider">Event</th>
<th className="p-4 text-[10px] uppercase font-bold text-slate-400 tracking-wider">Duration</th>
<th className="p-4 text-[10px] uppercase font-bold text-slate-400 tracking-wider text-right">Status</th>
</tr>
</thead>
<tbody className="text-xs font-montserrat">
<tr className="border-b border-slate-100 dark:border-slate-900 hover:bg-slate-50 dark:hover:bg-slate-900/30 transition-colors">
<td className="p-4 text-slate-500">2023-10-24 14:30:05</td>
<td className="p-4 font-mono text-slate-400">#EXE-882190</td>
<td className="p-4 dark:text-slate-300">Lead Conversion: Juan Perez</td>
<td className="p-4 text-slate-500">1.2s</td>
<td className="p-4 text-right">
<span className="px-2 py-1 bg-emerald-500/10 text-emerald-500 font-bold uppercase text-[9px]">Success</span>
</td>
</tr>
<tr className="border-b border-slate-100 dark:border-slate-900 hover:bg-slate-50 dark:hover:bg-slate-900/30 transition-colors">
<td className="p-4 text-slate-500">2023-10-24 14:28:12</td>
<td className="p-4 font-mono text-slate-400">#EXE-882189</td>
<td className="p-4 dark:text-slate-300">Lead Conversion: Maria Garcia</td>
<td className="p-4 text-slate-500">0.9s</td>
<td className="p-4 text-right">
<span className="px-2 py-1 bg-emerald-500/10 text-emerald-500 font-bold uppercase text-[9px]">Success</span>
</td>
</tr>
<tr className="border-b border-slate-100 dark:border-slate-900 hover:bg-slate-50 dark:hover:bg-slate-900/30 transition-colors">
<td className="p-4 text-slate-500">2023-10-24 14:25:01</td>
<td className="p-4 font-mono text-slate-400">#EXE-882188</td>
<td className="p-4 dark:text-slate-300">Filter Rejected: Out of Region</td>
<td className="p-4 text-slate-500">0.1s</td>
<td className="p-4 text-right">
<span className="px-2 py-1 bg-slate-500/10 text-slate-500 font-bold uppercase text-[9px]">Skipped</span>
</td>
</tr>
<tr className="border-b border-slate-100 dark:border-slate-900 hover:bg-slate-50 dark:hover:bg-slate-900/30 transition-colors">
<td className="p-4 text-slate-500">2023-10-24 14:22:44</td>
<td className="p-4 font-mono text-slate-400">#EXE-882187</td>
<td className="p-4 dark:text-slate-300">API Timeout: Salesforce Auth</td>
<td className="p-4 text-slate-500">15.0s</td>
<td className="p-4 text-right">
<span className="px-2 py-1 bg-rose-500/10 text-rose-500 font-bold uppercase text-[9px]">Error</span>
</td>
</tr>
</tbody>
</table>
</div>
</div>
</main>

<footer className="mt-20 border-t border-slate-200 dark:border-slate-800 p-8 flex justify-between items-center opacity-50">
<div className="text-[10px] uppercase tracking-widest font-bold">JAV LABS AUTOMATION ENGINE v4.2.0</div>
<div className="flex gap-4">
<span className="material-symbols-outlined text-sm">terminal</span>
<span className="material-symbols-outlined text-sm">settings_ethernet</span>
<span className="material-symbols-outlined text-sm">database</span>
</div>
</footer>
    </>
  );
}
