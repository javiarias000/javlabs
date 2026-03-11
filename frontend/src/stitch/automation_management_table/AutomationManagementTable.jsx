import { Link, useNavigate } from 'react-router-dom';
import './AutomationManagementTable.css';

export default function AutomationManagementTable() {
  return (
    <>
      <div className="flex flex-col min-h-screen">

<header className="border-b border-slate-800 bg-background-dark/80 backdrop-blur-md sticky top-0 z-50">
<div className="max-w-[1440px] mx-auto px-6 h-16 flex items-center justify-between">
<div className="flex items-center gap-12">
<div className="flex items-center gap-3">
<div className="size-8 gradient-primary flex items-center justify-center">
<span className="material-symbols-outlined text-white text-xl">terminal</span>
</div>
<h1 className="text-xl font-bold tracking-tighter text-white">JAV LABS</h1>
</div>
<nav className="hidden md:flex items-center gap-8">
<Link to="/dashboard" className="text-primary font-medium text-sm tracking-widest uppercase">Dashboard</Link>
<Link to="/automatizaciones" className="text-slate-400 hover:text-white font-medium text-sm tracking-widest uppercase transition-colors">Automations</Link>
<a className="text-slate-400 hover:text-white font-medium text-sm tracking-widest uppercase transition-colors" href="/dashboard/performance">Infrastructure</a>
<a className="text-slate-400 hover:text-white font-medium text-sm tracking-widest uppercase transition-colors" href="/dashboard/performance">Analytics</a>
</nav>
</div>
<div className="flex items-center gap-6">
<div className="relative group">
<span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">search</span>
<input className="bg-slate-900 border border-slate-800 text-xs tracking-widest px-10 py-2 w-64 focus:border-primary focus:ring-0 outline-none uppercase" placeholder="CMD + K TO SEARCH" type="text" />
</div>
<button className="gradient-primary px-6 py-2 text-xs font-bold tracking-widest uppercase text-white hover:opacity-90 transition-opacity flex items-center gap-2">
<span className="material-symbols-outlined text-sm">add</span>
                        Nueva Automatización
                    </button>
<div className="size-8 bg-slate-800 border border-slate-700" data-alt="User avatar placeholder with geometric pattern"></div>
</div>
</div>
</header>
<main className="flex-1 max-w-[1440px] mx-auto w-full px-6 py-8">

<div className="grid grid-cols-4 gap-px bg-slate-800 border border-slate-800 mb-8">
<div className="bg-background-dark p-4 flex flex-col gap-1">
<span className="text-[10px] text-slate-500 font-bold tracking-[0.2em] uppercase">Global Throughput</span>
<div className="flex items-end justify-between">
<span className="text-2xl font-bold text-white tracking-tighter">842.12 <span className="text-xs text-slate-500">REQ/S</span></span>
<div className="h-6 w-16 bg-primary/10 flex items-end gap-0.5 px-1 pb-1">
<div className="flex-1 bg-primary h-1/2"></div>
<div className="flex-1 bg-primary h-3/4"></div>
<div className="flex-1 bg-primary h-2/3"></div>
<div className="flex-1 bg-primary h-full"></div>
</div>
</div>
</div>
<div className="bg-background-dark p-4 flex flex-col gap-1">
<span className="text-[10px] text-slate-500 font-bold tracking-[0.2em] uppercase">Active Instances</span>
<div className="flex items-end justify-between">
<span className="text-2xl font-bold text-white tracking-tighter">12,403</span>
<span className="text-emerald-500 text-xs font-bold">+5.2%</span>
</div>
</div>
<div className="bg-background-dark p-4 flex flex-col gap-1">
<span className="text-[10px] text-slate-500 font-bold tracking-[0.2em] uppercase">System Health</span>
<div className="flex items-end justify-between">
<span className="text-2xl font-bold text-white tracking-tighter">99.98<span className="text-xs text-slate-500">%</span></span>
<div className="flex gap-1 h-1 w-20">
<div className="h-full bg-emerald-500 flex-1"></div>
<div className="h-full bg-emerald-500 flex-1"></div>
<div className="h-full bg-emerald-500 flex-1"></div>
<div className="h-full bg-slate-800 flex-1"></div>
</div>
</div>
</div>
<div className="bg-background-dark p-4 flex flex-col gap-1">
<span className="text-[10px] text-slate-500 font-bold tracking-[0.2em] uppercase">Memory Usage</span>
<div className="flex items-end justify-between">
<span className="text-2xl font-bold text-white tracking-tighter">4.2 <span className="text-xs text-slate-500">TB</span></span>
<span className="text-primary text-xs font-bold">STABLE</span>
</div>
</div>
</div>

<div className="bg-background-dark border border-slate-800">
<div className="p-4 border-b border-slate-800 flex justify-between items-center">
<h2 className="text-xs font-bold tracking-[0.3em] uppercase text-slate-400">Active Automations Registry</h2>
<div className="flex gap-2">
<button className="p-1 hover:bg-slate-900 text-slate-500"><span className="material-symbols-outlined text-lg">filter_list</span></button>
<button className="p-1 hover:bg-slate-900 text-slate-500"><span className="material-symbols-outlined text-lg">download</span></button>
</div>
</div>
<div className="overflow-x-auto">
<table className="w-full text-left border-collapse">
<thead>
<tr className="bg-slate-900/50">
<th className="px-6 py-4 text-[10px] font-bold tracking-widest text-slate-500 uppercase border-b border-slate-800">ID</th>
<th className="px-6 py-4 text-[10px] font-bold tracking-widest text-slate-500 uppercase border-b border-slate-800">Name</th>
<th className="px-6 py-4 text-[10px] font-bold tracking-widest text-slate-500 uppercase border-b border-slate-800">Trigger Type</th>
<th className="px-6 py-4 text-[10px] font-bold tracking-widest text-slate-500 uppercase border-b border-slate-800">Success Rate</th>
<th className="px-6 py-4 text-[10px] font-bold tracking-widest text-slate-500 uppercase border-b border-slate-800">Status</th>
<th className="px-6 py-4 text-[10px] font-bold tracking-widest text-slate-500 uppercase border-b border-slate-800">Last Run</th>
<th className="px-6 py-4 text-[10px] font-bold tracking-widest text-slate-500 uppercase border-b border-slate-800 text-right">Actions</th>
</tr>
</thead>
<tbody className="divide-y divide-slate-900">

<tr className="group hover:bg-slate-900/30 transition-colors">
<td className="px-6 py-5 font-mono text-xs text-slate-500 tracking-wider">0x4F2A</td>
<td className="px-6 py-5 font-bold text-sm tracking-tight">Market Alpha Core</td>
<td className="px-6 py-5">
<span className="bg-slate-800 px-2 py-1 text-[10px] font-bold text-slate-300 tracking-widest">API_REST</span>
</td>
<td className="px-6 py-5">
<div className="flex items-center gap-3">
<div className="w-24 h-1 bg-slate-800">
<div className="h-full gradient-primary w-[98%]"></div>
</div>
<span className="text-xs font-bold text-white">98%</span>
</div>
</td>
<td className="px-6 py-5">
<div className="status-badge-success px-3 py-1 text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Active</div>
</td>
<td className="px-6 py-5 text-xs text-slate-400">2023.10.24 14:22:01</td>
<td className="px-6 py-5 text-right">
<button className="text-primary text-[10px] font-bold tracking-widest uppercase hover:underline">Inspect</button>
</td>
</tr>

<tr className="bg-slate-900/40">
<td className="px-6 py-0 overflow-hidden" colspan="7">
<div className="py-6 grid grid-cols-2 gap-8 border-t border-slate-800/50">
<div className="flex flex-col gap-3">
<div className="flex items-center justify-between">
<h4 className="text-[10px] font-bold text-slate-500 tracking-widest uppercase flex items-center gap-2">
<span className="material-symbols-outlined text-sm">code</span> Input Payload (JSON)
                                                </h4>
<span className="text-[9px] bg-slate-800 px-1 text-slate-400">application/json</span>
</div>
<div className="bg-black border border-slate-800 p-4 font-mono text-[11px] text-slate-400 leading-relaxed overflow-x-auto">
<pre>&#123;
  "request_id": "0x4F2A-SYS-882",
  "source": "alpha_vantage",
  "symbol": "BTCUSD",
  "metrics": ["volume", "close", "rsi"],
  "interval": "1m"
&#125;</pre>
</div>
</div>
<div className="flex flex-col gap-3">
<div className="flex items-center justify-between">
<h4 className="text-[10px] font-bold text-slate-500 tracking-widest uppercase flex items-center gap-2">
<span className="material-symbols-outlined text-sm">terminal</span> Output Log
                                                </h4>
<span className="text-[9px] text-emerald-500">STATUS_OK</span>
</div>
<div className="bg-black border border-slate-800 p-4 font-mono text-[11px] text-slate-400 leading-relaxed h-[116px] overflow-y-auto custom-scrollbar">
<div className="text-slate-600 mb-1">[14:22:01] Initializing Market Alpha Core...</div>
<div className="text-slate-600 mb-1">[14:22:02] Authenticating with AlphaVantage...</div>
<div className="text-emerald-500/80 mb-1">[14:22:03] Payload delivered. Process: SUCCESS</div>
<div className="text-slate-600">[14:22:04] Thread terminated safely.</div>
</div>
</div>
</div>
</td>
</tr>

<tr className="group hover:bg-slate-900/30 transition-colors">
<td className="px-6 py-5 font-mono text-xs text-slate-500 tracking-wider">0x91BC</td>
<td className="px-6 py-5 font-bold text-sm tracking-tight">Data Sync Beta</td>
<td className="px-6 py-5">
<span className="bg-slate-800 px-2 py-1 text-[10px] font-bold text-slate-300 tracking-widest">WEBHOOK</span>
</td>
<td className="px-6 py-5">
<div className="flex items-center gap-3">
<div className="w-24 h-1 bg-slate-800">
<div className="h-full bg-amber-500 w-[92%]"></div>
</div>
<span className="text-xs font-bold text-white">92%</span>
</div>
</td>
<td className="px-6 py-5">
<div className="status-badge-warning px-3 py-1 text-[10px] font-bold text-amber-500 uppercase tracking-widest">Latency High</div>
</td>
<td className="px-6 py-5 text-xs text-slate-400">2023.10.24 14:15:33</td>
<td className="px-6 py-5 text-right">
<button className="text-primary text-[10px] font-bold tracking-widest uppercase hover:underline">Inspect</button>
</td>
</tr>

<tr className="group hover:bg-slate-900/30 transition-colors">
<td className="px-6 py-5 font-mono text-xs text-slate-500 tracking-wider">0x77DE</td>
<td className="px-6 py-5 font-bold text-sm tracking-tight">System Cleanup Task</td>
<td className="px-6 py-5">
<span className="bg-slate-800 px-2 py-1 text-[10px] font-bold text-slate-300 tracking-widest">SCHEDULE</span>
</td>
<td className="px-6 py-5">
<div className="flex items-center gap-3">
<div className="w-24 h-1 bg-slate-800">
<div className="h-full gradient-primary w-full"></div>
</div>
<span className="text-xs font-bold text-white">100%</span>
</div>
</td>
<td className="px-6 py-5">
<div className="status-badge-success px-3 py-1 text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Active</div>
</td>
<td className="px-6 py-5 text-xs text-slate-400">2023.10.24 12:00:00</td>
<td className="px-6 py-5 text-right">
<button className="text-primary text-[10px] font-bold tracking-widest uppercase hover:underline">Inspect</button>
</td>
</tr>

<tr className="group hover:bg-slate-900/30 transition-colors">
<td className="px-6 py-5 font-mono text-xs text-slate-500 tracking-wider">0x33A1</td>
<td className="px-6 py-5 font-bold text-sm tracking-tight">Auth Validator Proxy</td>
<td className="px-6 py-5">
<span className="bg-slate-800 px-2 py-1 text-[10px] font-bold text-slate-300 tracking-widest">API_REST</span>
</td>
<td className="px-6 py-5">
<div className="flex items-center gap-3">
<div className="w-24 h-1 bg-slate-800">
<div className="h-full bg-red-500 w-[45%]"></div>
</div>
<span className="text-xs font-bold text-white">45%</span>
</div>
</td>
<td className="px-6 py-5">
<div className="status-badge-error px-3 py-1 text-[10px] font-bold text-red-500 uppercase tracking-widest">Critical Error</div>
</td>
<td className="px-6 py-5 text-xs text-slate-400">2023.10.24 13:50:21</td>
<td className="px-6 py-5 text-right">
<button className="text-primary text-[10px] font-bold tracking-widest uppercase hover:underline">Inspect</button>
</td>
</tr>
</tbody>
</table>
</div>
<div className="p-4 border-t border-slate-800 flex justify-between items-center text-[10px] text-slate-500 font-bold tracking-widest uppercase">
<span>Showing 4 of 1,280 Automations</span>
<div className="flex gap-4">
<button className="hover:text-white flex items-center gap-1"><span className="material-symbols-outlined text-sm">chevron_left</span> Previous</button>
<div className="flex gap-2">
<span className="text-white border-b border-primary px-1">1</span>
<span className="hover:text-white cursor-pointer px-1">2</span>
<span className="hover:text-white cursor-pointer px-1">3</span>
<span>...</span>
<span className="hover:text-white cursor-pointer px-1">128</span>
</div>
<button className="hover:text-white flex items-center gap-1">Next <span className="material-symbols-outlined text-sm">chevron_right</span></button>
</div>
</div>
</div>

<div className="mt-8 flex gap-4">
<div className="flex-1 bg-slate-900 p-6 border border-slate-800">
<h3 className="text-xs font-bold tracking-[0.2em] text-slate-500 uppercase mb-4">Latest Infrastructure Logs</h3>
<div className="space-y-3 font-mono text-[11px] text-slate-400">
<div className="flex gap-4"><span className="text-slate-600">14:22:10</span> <span className="text-primary">INFO</span> Node us-east-1 deployed successfully.</div>
<div className="flex gap-4"><span className="text-slate-600">14:22:15</span> <span className="text-amber-500">WARN</span> Memory pressure detected on cluster.B</div>
<div className="flex gap-4"><span className="text-slate-600">14:22:20</span> <span className="text-primary">INFO</span> Auto-scaling event triggered for app-validator.</div>
</div>
</div>
<div className="w-80 bg-slate-900 p-6 border border-slate-800 flex flex-col justify-between">
<div>
<h3 className="text-xs font-bold tracking-[0.2em] text-slate-500 uppercase mb-4">Connection Health</h3>
<div className="flex items-center gap-4 mb-2">
<span className="text-[10px] text-slate-400 w-12">REDIS</span>
<div className="h-1 flex-1 bg-slate-800"><div className="h-full bg-emerald-500 w-full"></div></div>
<span className="text-[10px] font-bold text-white">ACTIVE</span>
</div>
<div className="flex items-center gap-4 mb-2">
<span className="text-[10px] text-slate-400 w-12">DB_CL</span>
<div className="h-1 flex-1 bg-slate-800"><div className="h-full bg-emerald-500 w-[80%]"></div></div>
<span className="text-[10px] font-bold text-white">STABLE</span>
</div>
<div className="flex items-center gap-4">
<span className="text-[10px] text-slate-400 w-12">GATE</span>
<div className="h-1 flex-1 bg-slate-800"><div className="h-full bg-amber-500 w-[40%]"></div></div>
<span className="text-[10px] font-bold text-amber-500">DELAY</span>
</div>
</div>
<button className="w-full border border-slate-700 py-2 text-[10px] font-bold tracking-widest uppercase hover:bg-slate-800 transition-colors">View All Connections</button>
</div>
</div>
</main>
</div>
<footer className="mt-auto border-t border-slate-800 bg-background-dark py-6 px-6">
<div className="max-w-[1440px] mx-auto flex justify-between items-center opacity-50">
<div className="text-[10px] tracking-[0.3em] font-bold uppercase">© 2023 JAV LABS Automation Platform</div>
<div className="flex gap-8 text-[10px] tracking-[0.3em] font-bold uppercase">
<a className="hover:text-white" href="/dashboard/overview">API Docs</a>
<a className="hover:text-white" href="/automatizaciones">Status Page</a>
<Link to="/soporte/chat" className="hover:text-white">Support</Link>
</div>
</div>
</footer>
    </>
  );
}
