import { Link, useNavigate } from 'react-router-dom';
import './ActiveAutomationsListView.css';

export default function ActiveAutomationsListView() {
  return (
    <>
      <aside className="w-64 border-r border-slate-200 dark:border-slate-800 flex flex-col h-screen sticky top-0 bg-background-light dark:bg-background-dark">
<div className="p-6 flex flex-col gap-8 h-full">
<div className="flex items-center gap-3">
<div className="w-10 h-10 rounded bg-primary flex items-center justify-center text-white">
<span className="material-symbols-outlined">biotech</span>
</div>
<div>
<h2 className="text-lg font-bold font-display tracking-tight uppercase">JAV LABS</h2>
<p className="text-xs text-slate-500 dark:text-slate-400 font-body">Portal de Cliente</p>
</div>
</div>
<nav className="flex flex-col gap-2">
<a className="flex items-center gap-3 px-3 py-2 rounded text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" href="/">
<span className="material-symbols-outlined text-[20px]">dashboard</span>
<span className="text-sm font-medium">Dashboard</span>
</a>
<a className="flex items-center gap-3 px-3 py-2 rounded bg-primary/10 text-primary transition-colors" href="/">
<span className="material-symbols-outlined text-[20px]">settings_input_component</span>
<span className="text-sm font-medium">Automatizaciones</span>
</a>
<a className="flex items-center gap-3 px-3 py-2 rounded text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" href="/">
<span className="material-symbols-outlined text-[20px]">terminal</span>
<span className="text-sm font-medium">Logs de Ejecución</span>
</a>
<a className="flex items-center gap-3 px-3 py-2 rounded text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" href="/">
<span className="material-symbols-outlined text-[20px]">corporate_fare</span>
<span className="text-sm font-medium">Departamentos</span>
</a>
</nav>
<div className="mt-auto pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-2">
<a className="flex items-center gap-3 px-3 py-2 rounded text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" href="/">
<span className="material-symbols-outlined text-[20px]">settings</span>
<span className="text-sm font-medium">Configuración</span>
</a>
<a className="flex items-center gap-3 px-3 py-2 rounded text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" href="/">
<span className="material-symbols-outlined text-[20px]">help_center</span>
<span className="text-sm font-medium">Soporte</span>
</a>
</div>
</div>
</aside>

<main className="flex-1 p-8 overflow-y-auto">

<header className="flex justify-between items-end mb-10">
<div>
<h1 className="text-4xl font-bold font-display uppercase tracking-tighter text-slate-900 dark:text-white leading-none">
                    Automatizaciones Activas
                </h1>
<p className="text-slate-500 dark:text-slate-400 font-body mt-2">
                    Actualmente hay <span className="text-primary font-bold">12 flujos</span> en ejecución continua.
                </p>
</div>
<button className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded flex items-center gap-2 font-display text-sm font-bold uppercase tracking-widest transition-all">
<span className="material-symbols-outlined text-[18px]">add</span>
                Nueva Automatización
            </button>
</header>

<div className="bg-slate-100 dark:bg-slate-800/50 p-2 rounded-lg mb-8 flex flex-wrap gap-2 items-center">
<div className="flex-1 min-w-[300px] relative">
<span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
<input className="w-full bg-white dark:bg-slate-900 border-none rounded py-2.5 pl-10 pr-4 text-sm focus:ring-1 focus:ring-primary dark:text-slate-200 placeholder:text-slate-500" placeholder="Buscar automatización por nombre o ID..." type="text" />
</div>
<div className="flex gap-2">
<div className="relative group">
<button className="flex items-center gap-2 bg-white dark:bg-slate-900 px-4 py-2.5 rounded text-sm font-medium border border-slate-200 dark:border-slate-800">
                        Estado: Todos
                        <span className="material-symbols-outlined text-[18px] text-slate-400">expand_more</span>
</button>
</div>
<div className="relative group">
<button className="flex items-center gap-2 bg-white dark:bg-slate-900 px-4 py-2.5 rounded text-sm font-medium border border-slate-200 dark:border-slate-800">
                        Departamento
                        <span className="material-symbols-outlined text-[18px] text-slate-400">expand_more</span>
</button>
</div>
<div className="relative group">
<button className="flex items-center gap-2 bg-white dark:bg-slate-900 px-4 py-2.5 rounded text-sm font-medium border border-slate-200 dark:border-slate-800">
                        Prioridad
                        <span className="material-symbols-outlined text-[18px] text-slate-400">expand_more</span>
</button>
</div>
</div>
</div>

<section className="flex flex-col gap-4">

<div className="automation-card bg-white dark:bg-slate-card p-6 rounded border border-slate-200 dark:border-slate-800 transition-all cursor-default">
<div className="flex items-center justify-between gap-6">
<div className="w-1/4">
<h3 className="text-xl font-bold font-display uppercase tracking-tight text-slate-900 dark:text-white">CRM Sync v2.0</h3>
<div className="flex items-center gap-2 mt-2">
<span className="status-pulse w-2 h-2 rounded-full bg-primary block"></span>
<span className="text-xs font-bold font-body uppercase text-primary tracking-widest">Activo</span>
</div>
</div>
<div className="flex-1 flex items-center justify-center">
<div className="flex items-center gap-4 relative">
<div className="w-8 h-8 rounded bg-slate-100 dark:bg-slate-900 flex items-center justify-center">
<span className="material-symbols-outlined text-[18px] text-primary">database</span>
</div>
<div className="w-16 h-[1px] bg-gradient-to-r from-primary to-primary/20"></div>
<div className="w-8 h-8 rounded bg-slate-100 dark:bg-slate-900 flex items-center justify-center">
<span className="material-symbols-outlined text-[18px] text-primary">hub</span>
</div>
<div className="w-16 h-[1px] bg-gradient-to-r from-primary/20 to-primary"></div>
<div className="w-8 h-8 rounded bg-slate-100 dark:bg-slate-900 flex items-center justify-center">
<span className="material-symbols-outlined text-[18px] text-primary">cloud_sync</span>
</div>
</div>
</div>
<div className="w-1/3 grid grid-cols-3 gap-4 border-l border-slate-200 dark:border-slate-700 pl-6">
<div className="flex flex-col">
<span className="text-[10px] text-slate-400 font-body uppercase font-bold tracking-widest">Uptime</span>
<span className="text-sm font-display font-medium text-slate-700 dark:text-slate-200">99.9%</span>
</div>
<div className="flex flex-col">
<span className="text-[10px] text-slate-400 font-body uppercase font-bold tracking-widest">Last Run</span>
<span className="text-sm font-display font-medium text-slate-700 dark:text-slate-200">2 min ago</span>
</div>
<div className="flex flex-col">
<span className="text-[10px] text-slate-400 font-body uppercase font-bold tracking-widest">Tasks</span>
<span className="text-sm font-display font-medium text-slate-700 dark:text-slate-200">1.2k</span>
</div>
</div>
<div className="flex items-center gap-4 ml-4">
<button className="text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-slate-100 transition-colors border border-slate-700 px-3 py-1.5 rounded bg-transparent">Pausar</button>
<Link to="/automatizaciones/logs" className="text-xs font-bold uppercase tracking-widest text-primary hover:underline">Ver Logs</Link>
<button className="text-slate-400 hover:text-primary transition-colors">
<span className="material-symbols-outlined text-[20px]">settings</span>
</button>
</div>
</div>
</div>

<div className="automation-card bg-white dark:bg-slate-card p-6 rounded border border-slate-200 dark:border-slate-800 transition-all cursor-default">
<div className="flex items-center justify-between gap-6">
<div className="w-1/4">
<h3 className="text-xl font-bold font-display uppercase tracking-tight text-slate-900 dark:text-white">RRHH Onboarding</h3>
<div className="flex items-center gap-2 mt-2">
<span className="w-2 h-2 rounded-full bg-slate-500 block"></span>
<span className="text-xs font-bold font-body uppercase text-slate-500 tracking-widest">Pausado</span>
</div>
</div>
<div className="flex-1 flex items-center justify-center opacity-40 grayscale">
<div className="flex items-center gap-4 relative">
<div className="w-8 h-8 rounded bg-slate-100 dark:bg-slate-900 flex items-center justify-center">
<span className="material-symbols-outlined text-[18px]">person_add</span>
</div>
<div className="w-16 h-[1px] bg-slate-700"></div>
<div className="w-8 h-8 rounded bg-slate-100 dark:bg-slate-900 flex items-center justify-center">
<span className="material-symbols-outlined text-[18px]">mail</span>
</div>
<div className="w-16 h-[1px] bg-slate-700"></div>
<div className="w-8 h-8 rounded bg-slate-100 dark:bg-slate-900 flex items-center justify-center">
<span className="material-symbols-outlined text-[18px]">badge</span>
</div>
</div>
</div>
<div className="w-1/3 grid grid-cols-3 gap-4 border-l border-slate-200 dark:border-slate-700 pl-6">
<div className="flex flex-col">
<span className="text-[10px] text-slate-400 font-body uppercase font-bold tracking-widest">Uptime</span>
<span className="text-sm font-display font-medium text-slate-700 dark:text-slate-200">95.0%</span>
</div>
<div className="flex flex-col">
<span className="text-[10px] text-slate-400 font-body uppercase font-bold tracking-widest">Last Run</span>
<span className="text-sm font-display font-medium text-slate-700 dark:text-slate-200">1h ago</span>
</div>
<div className="flex flex-col">
<span className="text-[10px] text-slate-400 font-body uppercase font-bold tracking-widest">Tasks</span>
<span className="text-sm font-display font-medium text-slate-700 dark:text-slate-200">450</span>
</div>
</div>
<div className="flex items-center gap-4 ml-4">
<button className="text-xs font-bold uppercase tracking-widest text-primary transition-colors border border-primary/40 px-3 py-1.5 rounded bg-primary/10">Reanudar</button>
<Link to="/automatizaciones/logs" className="text-xs font-bold uppercase tracking-widest text-primary hover:underline">Ver Logs</Link>
<button className="text-slate-400 hover:text-primary transition-colors">
<span className="material-symbols-outlined text-[20px]">settings</span>
</button>
</div>
</div>
</div>

<div className="automation-card bg-white dark:bg-slate-card p-6 rounded border border-slate-200 dark:border-slate-800 transition-all cursor-default">
<div className="flex items-center justify-between gap-6">
<div className="w-1/4">
<h3 className="text-xl font-bold font-display uppercase tracking-tight text-slate-900 dark:text-white">Finanzas Ledger</h3>
<div className="flex items-center gap-2 mt-2">
<span className="w-2 h-2 rounded-full bg-red-500 block animate-pulse"></span>
<span className="text-xs font-bold font-body uppercase text-red-500 tracking-widest">Alerta</span>
</div>
</div>
<div className="flex-1 flex items-center justify-center">
<div className="flex items-center gap-4 relative">
<div className="w-8 h-8 rounded bg-slate-100 dark:bg-slate-900 flex items-center justify-center">
<span className="material-symbols-outlined text-[18px] text-primary">account_balance</span>
</div>
<div className="w-16 h-[1px] bg-red-500/50"></div>
<div className="w-8 h-8 rounded bg-red-500/10 flex items-center justify-center">
<span className="material-symbols-outlined text-[18px] text-red-500">warning</span>
</div>
<div className="w-16 h-[1px] bg-red-500/50"></div>
<div className="w-8 h-8 rounded bg-slate-100 dark:bg-slate-900 flex items-center justify-center">
<span className="material-symbols-outlined text-[18px] text-primary">summarize</span>
</div>
</div>
</div>
<div className="w-1/3 grid grid-cols-3 gap-4 border-l border-slate-200 dark:border-slate-700 pl-6">
<div className="flex flex-col">
<span className="text-[10px] text-slate-400 font-body uppercase font-bold tracking-widest">Uptime</span>
<span className="text-sm font-display font-medium text-slate-700 dark:text-slate-200">88.2%</span>
</div>
<div className="flex flex-col">
<span className="text-[10px] text-slate-400 font-body uppercase font-bold tracking-widest">Last Run</span>
<span className="text-sm font-display font-medium text-slate-700 dark:text-slate-200">5 min ago</span>
</div>
<div className="flex flex-col">
<span className="text-[10px] text-slate-400 font-body uppercase font-bold tracking-widest">Tasks</span>
<span className="text-sm font-display font-medium text-slate-700 dark:text-slate-200">890</span>
</div>
</div>
<div className="flex items-center gap-4 ml-4">
<button className="text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-slate-100 transition-colors border border-slate-700 px-3 py-1.5 rounded bg-transparent">Pausar</button>
<Link to="/automatizaciones/logs" className="text-xs font-bold uppercase tracking-widest text-primary hover:underline">Ver Logs</Link>
<button className="text-slate-400 hover:text-primary transition-colors">
<span className="material-symbols-outlined text-[20px]">settings</span>
</button>
</div>
</div>
</div>

<div className="automation-card bg-white dark:bg-slate-card p-6 rounded border border-slate-200 dark:border-slate-800 transition-all cursor-default">
<div className="flex items-center justify-between gap-6">
<div className="w-1/4">
<h3 className="text-xl font-bold font-display uppercase tracking-tight text-slate-900 dark:text-white">API Gateway X</h3>
<div className="flex items-center gap-2 mt-2">
<span className="status-pulse w-2 h-2 rounded-full bg-primary block"></span>
<span className="text-xs font-bold font-body uppercase text-primary tracking-widest">Activo</span>
</div>
</div>
<div className="flex-1 flex items-center justify-center">
<div className="flex items-center gap-4 relative">
<div className="w-8 h-8 rounded bg-slate-100 dark:bg-slate-900 flex items-center justify-center">
<span className="material-symbols-outlined text-[18px] text-primary">api</span>
</div>
<div className="w-16 h-[1px] bg-gradient-to-r from-primary to-primary/20"></div>
<div className="w-8 h-8 rounded bg-slate-100 dark:bg-slate-900 flex items-center justify-center">
<span className="material-symbols-outlined text-[18px] text-primary">security</span>
</div>
<div className="w-16 h-[1px] bg-gradient-to-r from-primary/20 to-primary"></div>
<div className="w-8 h-8 rounded bg-slate-100 dark:bg-slate-900 flex items-center justify-center">
<span className="material-symbols-outlined text-[18px] text-primary">output</span>
</div>
</div>
</div>
<div className="w-1/3 grid grid-cols-3 gap-4 border-l border-slate-200 dark:border-slate-700 pl-6">
<div className="flex flex-col">
<span className="text-[10px] text-slate-400 font-body uppercase font-bold tracking-widest">Uptime</span>
<span className="text-sm font-display font-medium text-slate-700 dark:text-slate-200">100%</span>
</div>
<div className="flex flex-col">
<span className="text-[10px] text-slate-400 font-body uppercase font-bold tracking-widest">Last Run</span>
<span className="text-sm font-display font-medium text-slate-700 dark:text-slate-200">10s ago</span>
</div>
<div className="flex flex-col">
<span className="text-[10px] text-slate-400 font-body uppercase font-bold tracking-widest">Tasks</span>
<span className="text-sm font-display font-medium text-slate-700 dark:text-slate-200">15.4k</span>
</div>
</div>
<div className="flex items-center gap-4 ml-4">
<button className="text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-slate-100 transition-colors border border-slate-700 px-3 py-1.5 rounded bg-transparent">Pausar</button>
<Link to="/automatizaciones/logs" className="text-xs font-bold uppercase tracking-widest text-primary hover:underline">Ver Logs</Link>
<button className="text-slate-400 hover:text-primary transition-colors">
<span className="material-symbols-outlined text-[20px]">settings</span>
</button>
</div>
</div>
</div>
</section>

<footer className="mt-8 flex justify-between items-center text-slate-500 dark:text-slate-400 text-xs font-body uppercase tracking-widest">
<div>Mostrando 4 de 12 automatizaciones</div>
<div className="flex gap-4">
<button className="flex items-center gap-1 hover:text-primary transition-colors disabled:opacity-30" disabled="">
<span className="material-symbols-outlined text-[16px]">chevron_left</span> Anterior
                </button>
<div className="flex gap-2">
<span className="text-primary font-bold">1</span>
<span className="hover:text-primary cursor-pointer">2</span>
<span className="hover:text-primary cursor-pointer">3</span>
</div>
<button className="flex items-center gap-1 hover:text-primary transition-colors">
                    Siguiente <span className="material-symbols-outlined text-[16px]">chevron_right</span>
</button>
</div>
</footer>
</main>
    </>
  );
}
