import { Link, useNavigate } from 'react-router-dom';
import './ClientDashboard.css';

export default function ClientDashboard() {
  return (
    <>
      <div className="flex h-screen overflow-hidden">

<aside className="w-64 bg-sidebar-dark border-r border-slate-800 flex flex-col shrink-0">
<div className="p-6 flex items-center gap-3 border-b border-slate-800">
<div className="size-10 bg-primary flex items-center justify-center font-technical text-white text-xl">
                    JL
                </div>
<div className="flex flex-col">
<h1 className="text-slate-100 text-sm font-bold tracking-widest font-technical uppercase">JAV LABS</h1>
<p className="text-slate-400 text-[10px] uppercase tracking-tighter">Automation Agency</p>
</div>
</div>
<nav className="flex-1 px-3 py-6 space-y-2">
<a className="flex items-center gap-3 px-4 py-3 bg-primary/10 border-l-2 border-primary text-primary transition-all" href="/">
<span className="material-symbols-outlined text-[20px]">dashboard</span>
<span className="text-sm font-medium uppercase tracking-wider">Resumen</span>
</a>
<a className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-slate-100 hover:bg-slate-800/50 transition-all border-l-2 border-transparent" href="/">
<span className="material-symbols-outlined text-[20px]">account_tree</span>
<span className="text-sm font-medium uppercase tracking-wider">Proyectos</span>
</a>
<a className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-slate-100 hover:bg-slate-800/50 transition-all border-l-2 border-transparent" href="/">
<span className="material-symbols-outlined text-[20px]">analytics</span>
<span className="text-sm font-medium uppercase tracking-wider">Reportes</span>
</a>
<a className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-slate-100 hover:bg-slate-800/50 transition-all border-l-2 border-transparent" href="/">
<span className="material-symbols-outlined text-[20px]">support_agent</span>
<span className="text-sm font-medium uppercase tracking-wider">Soporte</span>
</a>
</nav>
<div className="p-4 border-t border-slate-800">
<div className="flex items-center gap-3 px-2">
<div className="size-8 bg-slate-700" data-alt="User avatar placeholder"></div>
<div className="flex flex-col overflow-hidden">
<p className="text-xs font-bold text-slate-200 truncate uppercase tracking-tight">Admin Principal</p>
<p className="text-[10px] text-slate-500 truncate">v.2.4.0-stable</p>
</div>
</div>
</div>
</aside>

<main className="flex-1 flex flex-col min-w-0 overflow-hidden">

<header className="h-16 border-b border-slate-800 bg-background-dark px-8 flex items-center justify-between">
<div className="flex items-center gap-4">
<span className="material-symbols-outlined text-primary">terminal</span>
<h2 className="text-slate-100 text-lg font-technical uppercase tracking-tight">BIENVENIDO, CLIENTE</h2>
</div>
<div className="flex items-center gap-6">
<div className="flex items-center gap-2">
<button className="p-2 text-slate-400 hover:text-primary transition-colors">
<span className="material-symbols-outlined">notifications</span>
</button>
<button className="p-2 text-slate-400 hover:text-primary transition-colors">
<span className="material-symbols-outlined">settings</span>
</button>
</div>
<div className="h-8 w-[1px] bg-slate-800"></div>
<div className="flex items-center gap-3">
<span className="text-xs font-medium text-slate-400 uppercase tracking-widest">Estado: <span className="text-emerald-500">Online</span></span>
</div>
</div>
</header>

<div className="flex-1 overflow-y-auto custom-scrollbar p-8 space-y-8">

<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
<div className="bg-sidebar-dark p-6 geometric-border flex flex-col gap-2">
<span className="text-[10px] text-primary font-bold uppercase tracking-[0.2em]">Operational Status</span>
<p className="text-slate-400 text-xs uppercase font-medium">Procesos Activos</p>
<div className="flex items-end justify-between">
<h3 className="text-3xl font-technical text-slate-100">12</h3>
<span className="text-emerald-500 text-sm font-bold flex items-center gap-1">
<span className="material-symbols-outlined text-sm">trending_up</span> +2%
                            </span>
</div>
</div>
<div className="bg-sidebar-dark p-6 geometric-border flex flex-col gap-2">
<span className="text-[10px] text-accent-blue font-bold uppercase tracking-[0.2em]">Resource Efficiency</span>
<p className="text-slate-400 text-xs uppercase font-medium">Horas Ahorradas</p>
<div className="flex items-end justify-between">
<h3 className="text-3xl font-technical text-slate-100">450<span className="text-sm ml-1 text-slate-500">h</span></h3>
<span className="text-rose-500 text-sm font-bold flex items-center gap-1">
<span className="material-symbols-outlined text-sm">trending_down</span> -5%
                            </span>
</div>
</div>
<div className="bg-sidebar-dark p-6 geometric-border flex flex-col gap-2">
<span className="text-[10px] text-primary font-bold uppercase tracking-[0.2em]">Investment Return</span>
<p className="text-slate-400 text-xs uppercase font-medium">ROI Mensual</p>
<div className="flex items-end justify-between">
<h3 className="text-3xl font-technical text-slate-100">+24%</h3>
<span className="text-emerald-500 text-sm font-bold flex items-center gap-1">
<span className="material-symbols-outlined text-sm">trending_up</span> +12%
                            </span>
</div>
</div>
</div>

<div className="bg-sidebar-dark border border-slate-800 p-8">
<div className="flex items-center justify-between mb-8">
<div>
<h2 className="text-slate-100 text-lg font-technical uppercase">Efficiency over Time</h2>
<p className="text-slate-500 text-xs mt-1">Live data feed from node-j5_automation_server</p>
</div>
<div className="flex gap-2">
<button className="px-4 py-1 text-[10px] font-bold uppercase tracking-tighter border border-slate-700 hover:border-primary text-slate-400 hover:text-white transition-all">Daily</button>
<button className="px-4 py-1 text-[10px] font-bold uppercase tracking-tighter border border-primary bg-primary/20 text-white">Weekly</button>
</div>
</div>
<div className="relative h-64 w-full">

<svg fill="none" height="100%" preserveaspectratio="none" viewbox="0 0 1000 200" width="100%" xmlns="http://www.w3.org/2000/svg">
<defs>
<lineargradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
<stop offset="0%" stop-color="#9947e6" stop-opacity="0.3"></stop>
<stop offset="100%" stop-color="#9947e6" stop-opacity="0"></stop>
</lineargradient>
</defs>
<path d="M0,150 L100,120 L200,140 L300,80 L400,100 L500,40 L600,60 L700,30 L800,50 L900,10 L1000,20 V200 H0 Z" fill="url(#chartGradient)"></path>
<path d="M0,150 L100,120 L200,140 L300,80 L400,100 L500,40 L600,60 L700,30 L800,50 L900,10 L1000,20" stroke="#9947e6" stroke-width="2" vector-effect="non-scaling-stroke"></path>
</svg>

<div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-10">
<div className="border-b border-slate-100 w-full h-0"></div>
<div className="border-b border-slate-100 w-full h-0"></div>
<div className="border-b border-slate-100 w-full h-0"></div>
<div className="border-b border-slate-100 w-full h-0"></div>
</div>
</div>
<div className="flex justify-between mt-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
<span>WK 01</span>
<span>WK 02</span>
<span>WK 03</span>
<span>WK 04</span>
<span>WK 05</span>
</div>
</div>

<div className="bg-sidebar-dark border border-slate-800">
<div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
<h2 className="text-slate-100 text-sm font-technical uppercase tracking-wider">Current Workflows</h2>
<button className="text-xs text-primary font-bold uppercase tracking-widest flex items-center gap-2">
                            View All <span className="material-symbols-outlined text-sm">arrow_forward</span>
</button>
</div>
<div className="overflow-x-auto">
<table className="w-full text-left border-collapse">
<thead className="bg-black/40 text-[10px] uppercase font-bold text-slate-500 tracking-[0.1em]">
<tr>
<th className="px-6 py-4">ID</th>
<th className="px-6 py-4">Workflow Name</th>
<th className="px-6 py-4">Status</th>
<th className="px-6 py-4">Uptime</th>
<th className="px-6 py-4 text-right">Actions</th>
</tr>
</thead>
<tbody className="text-sm divide-y divide-slate-800">
<tr className="hover:bg-slate-800/30 transition-colors">
<td className="px-6 py-4 font-technical text-[10px] text-slate-400">#JL-8842</td>
<td className="px-6 py-4 text-slate-200 font-medium">CRM Lead Distribution</td>
<td className="px-6 py-4">
<div className="flex items-center gap-2">
<div className="size-2 bg-emerald-500 shadow-[0_0_8px_#10b981]"></div>
<span className="text-xs uppercase text-emerald-500 font-bold">Active</span>
</div>
</td>
<td className="px-6 py-4 text-slate-400">99.98%</td>
<td className="px-6 py-4 text-right">
<button className="text-slate-500 hover:text-white"><span className="material-symbols-outlined">more_horiz</span></button>
</td>
</tr>
<tr className="hover:bg-slate-800/30 transition-colors">
<td className="px-6 py-4 font-technical text-[10px] text-slate-400">#JL-9021</td>
<td className="px-6 py-4 text-slate-200 font-medium">Automatic Invoicing Node</td>
<td className="px-6 py-4">
<div className="flex items-center gap-2">
<div className="size-2 bg-primary shadow-[0_0_8px_#9947e6]"></div>
<span className="text-xs uppercase text-primary font-bold">Processing</span>
</div>
</td>
<td className="px-6 py-4 text-slate-400">94.12%</td>
<td className="px-6 py-4 text-right">
<button className="text-slate-500 hover:text-white"><span className="material-symbols-outlined">more_horiz</span></button>
</td>
</tr>
<tr className="hover:bg-slate-800/30 transition-colors">
<td className="px-6 py-4 font-technical text-[10px] text-slate-400">#JL-7733</td>
<td className="px-6 py-4 text-slate-200 font-medium">Data Scraping ETL</td>
<td className="px-6 py-4">
<div className="flex items-center gap-2">
<div className="size-2 bg-amber-500 shadow-[0_0_8px_#f59e0b]"></div>
<span className="text-xs uppercase text-amber-500 font-bold">Pending</span>
</div>
</td>
<td className="px-6 py-4 text-slate-400">100.0%</td>
<td className="px-6 py-4 text-right">
<button className="text-slate-500 hover:text-white"><span className="material-symbols-outlined">more_horiz</span></button>
</td>
</tr>
<tr className="hover:bg-slate-800/30 transition-colors">
<td className="px-6 py-4 font-technical text-[10px] text-slate-400">#JL-4412</td>
<td className="px-6 py-4 text-slate-200 font-medium">Slack Integration Webhook</td>
<td className="px-6 py-4">
<div className="flex items-center gap-2">
<div className="size-2 bg-emerald-500 shadow-[0_0_8px_#10b981]"></div>
<span className="text-xs uppercase text-emerald-500 font-bold">Active</span>
</div>
</td>
<td className="px-6 py-4 text-slate-400">99.45%</td>
<td className="px-6 py-4 text-right">
<button className="text-slate-500 hover:text-white"><span className="material-symbols-outlined">more_horiz</span></button>
</td>
</tr>
</tbody>
</table>
</div>
</div>
</div>
</main>
</div>
    </>
  );
}
