
export default function ClientDashboardOverview() {
  const navigate = useNavigate();
  return (
    <>
      <div className="flex min-h-screen">

<aside className="w-[240px] bg-nav-bg flex-shrink-0 flex flex-col border-r border-slate-800">
<div className="p-8 flex items-center gap-3">
<div className="size-10 bg-gradient-to-br from-primary to-violet-600 flex items-center justify-center rounded-lg shadow-lg shadow-primary/20">
<span className="text-white font-michroma text-xl">JV</span>
</div>
<div>
<h1 className="text-white font-michroma text-sm tracking-widest">JAV LABS</h1>
<p className="text-slate-400 text-[10px] uppercase tracking-tighter font-montserrat">Automation Agency</p>
</div>
</div>
<nav className="flex-1 px-4 py-4 space-y-2 font-montserrat">
<a className="flex items-center gap-3 px-4 py-3 rounded text-sm font-medium transition-all border-l-4 border-primary bg-gradient-to-r from-primary/20 to-transparent" href="/">
<span className="material-symbols-outlined text-primary">dashboard</span>
<span className="bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent font-bold">Dashboard</span>
</a>
<a className="flex items-center gap-3 px-4 py-3 rounded text-slate-400 hover:text-white hover:bg-slate-800/50 text-sm font-medium transition-all border-l-4 border-transparent" href="/">
<span className="material-symbols-outlined">folder_open</span>
<span>Mis Proyectos</span>
</a>
<a className="flex items-center gap-3 px-4 py-3 rounded text-slate-400 hover:text-white hover:bg-slate-800/50 text-sm font-medium transition-all border-l-4 border-transparent" href="/">
<span className="material-symbols-outlined">bolt</span>
<span>Automatizaciones</span>
</a>
<a className="flex items-center gap-3 px-4 py-3 rounded text-slate-400 hover:text-white hover:bg-slate-800/50 text-sm font-medium transition-all border-l-4 border-transparent" href="/">
<span className="material-symbols-outlined">analytics</span>
<span>Reportes</span>
</a>
<a className="flex items-center gap-3 px-4 py-3 rounded text-slate-400 hover:text-white hover:bg-slate-800/50 text-sm font-medium transition-all border-l-4 border-transparent" href="/">
<span className="material-symbols-outlined">support_agent</span>
<span>Soporte</span>
</a>
<a className="flex items-center gap-3 px-4 py-3 rounded text-slate-400 hover:text-white hover:bg-slate-800/50 text-sm font-medium transition-all border-l-4 border-transparent" href="/">
<span className="material-symbols-outlined">settings</span>
<span>Configuración</span>
</a>
</nav>
<div className="p-6 border-t border-slate-800">
<div className="bg-slate-800/40 p-4 rounded-xl border border-slate-700">
<p className="text-xs text-slate-400 font-montserrat mb-2">Plan Enterprise</p>
<div className="h-1.5 w-full bg-slate-700 rounded-full overflow-hidden">
<div className="h-full bg-primary w-3/4"></div>
</div>
</div>
</div>
</aside>

<main className="flex-1 flex flex-col min-w-0">

<header className="h-16 border-b border-slate-800 bg-background-dark/80 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-10">
<div className="flex items-center gap-4 w-96">
<div className="relative w-full group">
<span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-xl group-focus-within:text-primary transition-colors">search</span>
<input className="w-full bg-slate-800/50 border-none rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-1 focus:ring-primary placeholder:text-slate-500" placeholder="Buscar automatizaciones..." type="text" />
</div>
</div>
<div className="flex items-center gap-6">
<button className="relative text-slate-400 hover:text-white transition-colors">
<span className="material-symbols-outlined text-2xl">notifications</span>
<span className="absolute top-0 right-0 size-2 bg-red-500 rounded-full border-2 border-background-dark"></span>
</button>
<div className="h-8 w-px bg-slate-800"></div>
<div className="flex items-center gap-3">
<div className="text-right">
<p className="text-xs font-montserrat text-slate-400">Bienvenido,</p>
<p className="text-sm font-bold text-white">Alex Rivadeneira</p>
</div>
<div className="size-10 rounded-full bg-primary/20 border border-primary/40 p-0.5">
<img alt="Avatar del usuario" className="w-full h-full rounded-full bg-slate-800" data-alt="User profile avatar with friendly face" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDlIuqyJFQjzjitdFro14TLSmuLxRLQWIUOVaN2qMFDALyTkmKUSFJNcy7maJfazPMjVRYPiPYXdC-CGdh-i4_Knx8l4ENMt-pZOcMLp0B7gUPuEQojSwYFU3mcOgA3PlUQCFN7KJCn3CratpfzmrIMmfKwU5Ee7BaAW_4Hbm5JZnf285d83jkLmpkSl51lMCb-p2PHa4hptmV2ZMqzHjhF6tuEMWlT6GILL3qsVy2n55YxLXtPHqOJXkGk-cDR1iclM24w94wHacA" />
</div>
</div>
</div>
</header>
<div className="p-8 space-y-8 overflow-y-auto">

<section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
<div className="bg-card-bg p-6 border border-slate-700 relative overflow-hidden group">
<div className="absolute top-0 right-0 p-3 opacity-20 group-hover:opacity-100 transition-opacity">
<span className="material-symbols-outlined text-4xl text-primary">hub</span>
</div>
<p className="text-slate-400 text-xs font-montserrat uppercase tracking-wider">Automatizaciones Activas</p>
<div className="flex items-end justify-between mt-2">
<h3 className="font-michroma text-3xl text-white">24</h3>
<span className="text-emerald-400 text-xs font-bold bg-emerald-400/10 px-2 py-1 rounded">+12%</span>
</div>
</div>
<div className="bg-card-bg p-6 border border-slate-700 relative overflow-hidden group">
<div className="absolute top-0 right-0 p-3 opacity-20 group-hover:opacity-100 transition-opacity">
<span className="material-symbols-outlined text-4xl text-violet-500">memory</span>
</div>
<p className="text-slate-400 text-xs font-montserrat uppercase tracking-wider">Tareas Ejecutadas</p>
<div className="flex items-end justify-between mt-2">
<h3 className="font-michroma text-3xl text-white">12,850</h3>
<span className="text-rose-400 text-xs font-bold bg-rose-400/10 px-2 py-1 rounded">-5%</span>
</div>
</div>
<div className="bg-card-bg p-6 border border-slate-700 relative overflow-hidden group">
<div className="absolute top-0 right-0 p-3 opacity-20 group-hover:opacity-100 transition-opacity">
<span className="material-symbols-outlined text-4xl text-cyan-400">schedule</span>
</div>
<p className="text-slate-400 text-xs font-montserrat uppercase tracking-wider">Tiempo Ahorrado</p>
<div className="flex items-end justify-between mt-2">
<h3 className="font-michroma text-3xl text-white">450h</h3>
<span className="text-emerald-400 text-xs font-bold bg-emerald-400/10 px-2 py-1 rounded">+18%</span>
</div>
</div>
<div className="bg-card-bg p-6 border border-slate-700 relative overflow-hidden group">
<div className="absolute top-0 right-0 p-3 opacity-20 group-hover:opacity-100 transition-opacity">
<span className="material-symbols-outlined text-4xl text-amber-400">build</span>
</div>
<p className="text-slate-400 text-xs font-montserrat uppercase tracking-wider">Próximo Mantenimiento</p>
<div className="flex items-end justify-between mt-2">
<h3 className="font-michroma text-3xl text-white">12 Oct</h3>
<span className="text-slate-500 text-xs font-bold">Programado</span>
</div>
</div>
</section>
<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

<div className="lg:col-span-2 space-y-8">

<div className="bg-card-bg border border-slate-700 p-6 rounded-lg">
<div className="flex items-center justify-between mb-8">
<div>
<h4 className="text-white font-bold text-lg">Actividad de Automatización</h4>
<p className="text-slate-400 text-sm">Pings registrados en los últimos 30 días</p>
</div>
<select className="bg-slate-800 border-slate-700 text-xs rounded text-slate-300">
<option>Últimos 30 días</option>
<option>Últimos 7 días</option>
</select>
</div>
<div className="h-64 relative">

<div className="absolute inset-0 flex flex-col justify-between opacity-10">
<div className="border-t border-slate-100 w-full h-px"></div>
<div className="border-t border-slate-100 w-full h-px"></div>
<div className="border-t border-slate-100 w-full h-px"></div>
<div className="border-t border-slate-100 w-full h-px"></div>
<div className="border-t border-slate-100 w-full h-px"></div>
</div>

<svg className="w-full h-full relative z-10" preserveaspectratio="none" viewbox="0 0 1000 200">
<defs>
<lineargradient id="chartGradient" x1="0%" x2="0%" y1="0%" y2="100%">
<stop offset="0%" stop-color="#0d0df2" stop-opacity="0.3"></stop>
<stop offset="100%" stop-color="#0d0df2" stop-opacity="0"></stop>
</lineargradient>
</defs>
<path d="M0,150 Q100,80 200,120 T400,60 T600,140 T800,40 L1000,90 L1000,200 L0,200 Z" fill="url(#chartGradient)"></path>
<path d="M0,150 Q100,80 200,120 T400,60 T600,140 T800,40 L1000,90" fill="none" stroke="#0d0df2" stroke-width="3"></path>
</svg>
<div className="flex justify-between mt-4 text-[10px] font-montserrat text-slate-500 uppercase tracking-tighter">
<span>Semana 1</span>
<span>Semana 2</span>
<span>Semana 3</span>
<span>Semana 4</span>
</div>
</div>
</div>

<div className="bg-card-bg border border-slate-700 rounded-lg overflow-hidden">
<div className="px-6 py-4 border-b border-slate-700 flex items-center justify-between">
<h4 className="text-white font-bold">Proyectos en Curso</h4>
<button className="text-primary text-xs hover:underline">Ver todos</button>
</div>
<div className="overflow-x-auto">
<table className="w-full text-sm text-left">
<thead className="bg-slate-800/50 text-slate-400 text-xs uppercase font-montserrat">
<tr>
<th className="px-6 py-4">Proyecto</th>
<th className="px-6 py-4">Estado</th>
<th className="px-6 py-4">Progreso</th>
<th className="px-6 py-4">Responsable</th>
</tr>
</thead>
<tbody className="divide-y divide-slate-800">
<tr className="hover:bg-slate-800/30 transition-colors">
<td className="px-6 py-4 font-medium text-white">CRM Automation Engine</td>
<td className="px-6 py-4">
<span className="px-2 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 uppercase">Activo</span>
</td>
<td className="px-6 py-4">
<div className="flex items-center gap-3">
<div className="flex-1 h-1.5 bg-slate-700 rounded-full overflow-hidden">
<div className="h-full bg-gradient-to-r from-primary to-violet-500 w-[85%]"></div>
</div>
<span className="text-xs text-slate-400">85%</span>
</div>
</td>
<td className="px-6 py-4 text-slate-400">Alex R.</td>
</tr>
<tr className="hover:bg-slate-800/30 transition-colors">
<td className="px-6 py-4 font-medium text-white">SAP Data Bridge</td>
<td className="px-6 py-4">
<span className="px-2 py-1 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-500 border border-blue-500/20 uppercase">En Progreso</span>
</td>
<td className="px-6 py-4">
<div className="flex items-center gap-3">
<div className="flex-1 h-1.5 bg-slate-700 rounded-full overflow-hidden">
<div className="h-full bg-gradient-to-r from-primary to-violet-500 w-[42%]"></div>
</div>
<span className="text-xs text-slate-400">42%</span>
</div>
</td>
<td className="px-6 py-4 text-slate-400">Maria G.</td>
</tr>
<tr className="hover:bg-slate-800/30 transition-colors">
<td className="px-6 py-4 font-medium text-white">Legacy Scraper V2</td>
<td className="px-6 py-4">
<span className="px-2 py-1 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20 uppercase">Pausado</span>
</td>
<td className="px-6 py-4">
<div className="flex items-center gap-3">
<div className="flex-1 h-1.5 bg-slate-700 rounded-full overflow-hidden">
<div className="h-full bg-slate-500 w-[100%]"></div>
</div>
<span className="text-xs text-slate-400">100%</span>
</div>
</td>
<td className="px-6 py-4 text-slate-400">David L.</td>
</tr>
</tbody>
</table>
</div>
</div>
</div>

<div className="space-y-8">

<div className="bg-card-bg border border-slate-700 p-6 rounded-lg">
<h4 className="text-white font-bold mb-6">Actividad Reciente</h4>
<div className="space-y-6 relative">
<div className="absolute left-[11px] top-2 bottom-2 w-px bg-slate-800"></div>
<div className="relative flex gap-4">
<div className="size-6 rounded-full bg-primary flex-shrink-0 z-10 border-4 border-card-bg"></div>
<div>
<p className="text-sm text-slate-100 font-medium">Backup completado</p>
<p className="text-xs text-slate-500">Hace 15 min • CRM Automation</p>
</div>
</div>
<div className="relative flex gap-4">
<div className="size-6 rounded-full bg-violet-600 flex-shrink-0 z-10 border-4 border-card-bg"></div>
<div>
<p className="text-sm text-slate-100 font-medium">Nueva integración API</p>
<p className="text-xs text-slate-500">Hace 2 horas • SAP Data Bridge</p>
</div>
</div>
<div className="relative flex gap-4">
<div className="size-6 rounded-full bg-emerald-500 flex-shrink-0 z-10 border-4 border-card-bg"></div>
<div>
<p className="text-sm text-slate-100 font-medium">Script optimizado</p>
<p className="text-xs text-slate-500">Hace 5 horas • Legacy Scraper</p>
</div>
</div>
<div className="relative flex gap-4">
<div className="size-6 rounded-full bg-amber-500 flex-shrink-0 z-10 border-4 border-card-bg"></div>
<div>
<p className="text-sm text-slate-100 font-medium">Alerta de latencia</p>
<p className="text-xs text-slate-500">Ayer • Global Node</p>
</div>
</div>
</div>
</div>

<div className="bg-card-bg border border-slate-700 p-6 rounded-lg">
<h4 className="text-white font-bold mb-6">Acciones Rápidas</h4>
<div className="grid gap-3">
<button className="w-full p-4 flex items-center gap-3 rounded-lg border border-primary/30 bg-primary/5 hover:bg-primary/10 transition-all group">
<span className="material-symbols-outlined text-primary group-hover:scale-110 transition-transform">support_agent</span>
<span className="text-sm font-medium text-slate-200">Solicitar Soporte</span>
</button>
<button className="w-full p-4 flex items-center gap-3 rounded-lg border border-slate-700 bg-slate-800/30 hover:bg-slate-800/50 transition-all group">
<span className="material-symbols-outlined text-violet-500 group-hover:scale-110 transition-transform">summarize</span>
<span className="text-sm font-medium text-slate-200">Ver Reportes</span>
</button>
<button className="w-full p-4 flex items-center gap-3 rounded-lg border border-slate-700 bg-slate-800/30 hover:bg-slate-800/50 transition-all group">
<span className="material-symbols-outlined text-cyan-400 group-hover:scale-110 transition-transform">add_link</span>
<span className="text-sm font-medium text-slate-200">Agregar Integración</span>
</button>
</div>
</div>

<div className="relative overflow-hidden p-6 rounded-lg bg-gradient-to-br from-primary/80 to-violet-800">
<div className="relative z-10">
<h5 className="text-white font-bold mb-2">¿Necesitas ayuda?</h5>
<p className="text-white/80 text-xs mb-4 leading-relaxed">Nuestros ingenieros de automatización están disponibles 24/7 para resolver tus dudas.</p>
<button className="bg-white text-primary px-4 py-2 rounded text-xs font-bold hover:bg-slate-100 transition-colors uppercase tracking-wider" onClick={() => navigate('/contacto')}>Contactar</button>
</div>
<div className="absolute -bottom-4 -right-4 size-24 opacity-20">
<span className="material-symbols-outlined text-[100px] text-white">rocket_launch</span>
</div>
</div>
</div>
</div>
</div>
</main>
</div>
    </>
  );
}
