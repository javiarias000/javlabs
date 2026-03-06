import { Link, useNavigate } from 'react-router-dom';
import './AutomationPerformanceDashboard.css';

export default function AutomationPerformanceDashboard() {
  const navigate = useNavigate();
  return (
    <>
      <div className="flex h-screen overflow-hidden">

<aside className="w-64 flex-shrink-0 border-r border-primary/20 bg-neutral-dark flex flex-col">
<div className="p-6 border-b border-primary/10">
<div className="flex items-center gap-3">
<div className="w-10 h-10 bg-primary flex items-center justify-center">
<span className="material-symbols-outlined text-white">bolt</span>
</div>
<div className="flex flex-col">
<h1 className="font-michroma text-sm tracking-tighter text-white">JAV LABS</h1>
<p className="text-[10px] uppercase tracking-widest text-primary font-bold">Automation Agency</p>
</div>
</div>
</div>
<nav className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
<div className="px-3 py-2 bg-primary/20 border-l-2 border-primary flex items-center gap-3 text-primary">
<span className="material-symbols-outlined">dashboard</span>
<span className="text-sm font-medium">Dashboard</span>
</div>
<div className="px-3 py-2 flex items-center gap-3 text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer">
<span className="material-symbols-outlined">memory</span>
<span className="text-sm font-medium">Automations</span>
</div>
<div className="px-3 py-2 flex items-center gap-3 text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer">
<span className="material-symbols-outlined">analytics</span>
<span className="text-sm font-medium">Performance</span>
</div>
<div className="px-3 py-2 flex items-center gap-3 text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer">
<span className="material-symbols-outlined">terminal</span>
<span className="text-sm font-medium">System Logs</span>
</div>
<div className="px-3 py-2 flex items-center gap-3 text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer">
<span className="material-symbols-outlined">hub</span>
<span className="text-sm font-medium">Integrations</span>
</div>
<div className="mt-8 pt-4 border-t border-white/5">
<div className="px-3 py-2 flex items-center gap-3 text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer">
<span className="material-symbols-outlined">settings</span>
<span className="text-sm font-medium">Settings</span>
</div>
<div className="px-3 py-2 flex items-center gap-3 text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer">
<span className="material-symbols-outlined">support</span>
<span className="text-sm font-medium">Agent Support</span>
</div>
</div>
</nav>
<div className="p-4">
<button className="w-full bg-primary hover:bg-blue-700 text-white font-bold py-3 text-xs uppercase tracking-widest transition-all" onClick={() => navigate('/workflow/v1')}>New Workflow</button>
</div>
</aside>

<main className="flex-1 flex flex-col min-w-0 bg-background-dark">

<header className="h-16 flex items-center justify-between px-8 border-b border-primary/20 bg-neutral-dark/50 backdrop-blur-md">
<div className="flex items-center gap-6">
<h2 className="font-michroma text-xs uppercase tracking-wider text-slate-400">System Monitoring</h2>
<div className="h-4 w-px bg-primary/20"></div>
<div className="flex items-center gap-2 text-green-500">
<span className="material-symbols-outlined text-sm">check_circle</span>
<span className="text-[10px] uppercase font-bold tracking-tighter">API Stable</span>
</div>
</div>
<div className="flex items-center gap-6">
<div className="relative group">
<span className="material-symbols-outlined text-slate-400 group-hover:text-primary cursor-pointer">search</span>
</div>
<div className="relative">
<span className="material-symbols-outlined text-slate-400 hover:text-white cursor-pointer">notifications</span>
<span className="absolute -top-1 -right-1 w-2 h-2 bg-primary"></span>
</div>
<div className="flex items-center gap-3 pl-4 border-l border-primary/20">
<div className="text-right">
<p className="text-xs font-bold text-slate-100">Dev Operator</p>
<p className="text-[10px] text-slate-500 uppercase">Tier 3 Access</p>
</div>
<div className="w-10 h-10 border border-primary/30 p-0.5">
<img className="w-full h-full object-cover" data-alt="User profile avatar of a developer" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBJe6Dz1HeCJc04nAEiW9OUYE8fqyF1rw_b3qn36XBCENWc7oCl2eqqYu2kHFtMEgpv8KDv-9BWc5NIiKHmUgCUYdV5wwFPiIXNlRiPFapfcjdHyQ8yc1KFoTeCnrudrD_Yjg2F3hwHNh-sMDwZSdrj_XPLPmwam3ENIhZUSIwCYjHxT29p6J_jHmFj_Uv38cf_s2YKikcFv7D5eRTId7qsLmJK5rO8hEx5nf1nR2B-pN6BwajGPYQpwW5QCPoF0pbWrHcbFoYMNkY" />
</div>
</div>
</div>
</header>

<div className="flex-1 overflow-y-auto p-8 custom-scrollbar">

<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
<div className="bg-neutral-dark border border-primary/10 p-6 flex flex-col justify-between group hover:border-primary transition-colors">
<div className="flex justify-between items-start">
<div>
<p className="text-xs uppercase tracking-widest text-slate-500 font-bold">Total Operations</p>
<h3 className="text-3xl font-bold mt-2 text-white">4,812,042</h3>
</div>
<div className="w-10 h-10 bg-gradient-to-br from-primary to-blue-900 flex items-center justify-center">
<span className="material-symbols-outlined text-white">rocket_launch</span>
</div>
</div>
<div className="mt-4 flex items-center gap-2 text-green-500">
<span className="material-symbols-outlined text-sm">trending_up</span>
<span className="text-xs font-medium">+14.2% vs prev period</span>
</div>
</div>
<div className="bg-neutral-dark border border-primary/10 p-6 flex flex-col justify-between group hover:border-primary transition-colors">
<div className="flex justify-between items-start">
<div>
<p className="text-xs uppercase tracking-widest text-slate-500 font-bold">Error Margin</p>
<h3 className="text-3xl font-bold mt-2 text-white">0.02%</h3>
</div>
<div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-800 flex items-center justify-center">
<span className="material-symbols-outlined text-white">warning</span>
</div>
</div>
<div className="mt-4 flex items-center gap-2 text-green-500">
<span className="material-symbols-outlined text-sm">trending_down</span>
<span className="text-xs font-medium">-0.01% stability increase</span>
</div>
</div>
<div className="bg-neutral-dark border border-primary/10 p-6 flex flex-col justify-between group hover:border-primary transition-colors">
<div className="flex justify-between items-start">
<div>
<p className="text-xs uppercase tracking-widest text-slate-500 font-bold">Avg. Latency</p>
<h3 className="text-3xl font-bold mt-2 text-white">124ms</h3>
</div>
<div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-indigo-900 flex items-center justify-center">
<span className="material-symbols-outlined text-white">speed</span>
</div>
</div>
<div className="mt-4 flex items-center gap-2 text-slate-400">
<span className="material-symbols-outlined text-sm">horizontal_rule</span>
<span className="text-xs font-medium">Standard performance</span>
</div>
</div>
<div className="bg-neutral-dark border border-primary/10 p-6 flex flex-col justify-between group hover:border-primary transition-colors">
<div className="flex justify-between items-start">
<div>
<p className="text-xs uppercase tracking-widest text-slate-500 font-bold">Cost Saved</p>
<h3 className="text-3xl font-bold mt-2 text-white">$42.8k</h3>
</div>
<div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-800 flex items-center justify-center">
<span className="material-symbols-outlined text-white">payments</span>
</div>
</div>
<div className="mt-4 flex items-center gap-2 text-green-500">
<span className="material-symbols-outlined text-sm">trending_up</span>
<span className="text-xs font-medium">+8% efficiency uplift</span>
</div>
</div>
</div>

<div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

<div className="xl:col-span-2 space-y-6">
<div className="bg-neutral-dark border border-primary/10 overflow-hidden">
<div className="px-6 py-4 bg-primary/5 border-b border-primary/10 flex justify-between items-center">
<h4 className="font-michroma text-xs text-white uppercase tracking-wider">Active Automations Engine</h4>
<span className="text-[10px] text-primary font-bold uppercase tracking-widest">Real-time update</span>
</div>
<div className="overflow-x-auto">
<table className="w-full text-left border-collapse">
<thead className="bg-neutral-dark/80 font-michroma text-[10px] text-slate-500 uppercase border-b border-primary/10">
<tr>
<th className="px-6 py-4">ID</th>
<th className="px-6 py-4">Process Name</th>
<th className="px-6 py-4">Thread Status</th>
<th className="px-6 py-4">Throughput</th>
<th className="px-6 py-4">Actions</th>
</tr>
</thead>
<tbody className="text-sm">
<tr className="border-b border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition-colors">
<td className="px-6 py-4 font-mono text-[10px] text-slate-500">#AF-2901</td>
<td className="px-6 py-4 font-bold">Salesforce Lead Router</td>
<td className="px-6 py-4">
<span className="inline-flex items-center px-2 py-0.5 text-[10px] font-bold bg-green-500/10 text-green-500 border border-green-500/30 uppercase">Operational</span>
</td>
<td className="px-6 py-4">
<div className="w-full bg-slate-800 h-1 max-w-[100px]">
<div className="bg-primary h-full w-[85%]"></div>
</div>
</td>
<td className="px-6 py-4">
<button className="text-primary hover:text-white transition-colors">
<span className="material-symbols-outlined text-lg">tune</span>
</button>
</td>
</tr>
<tr className="border-b border-white/5 hover:bg-white/[0.05] transition-colors">
<td className="px-6 py-4 font-mono text-[10px] text-slate-500">#AF-2902</td>
<td className="px-6 py-4 font-bold">Invoice OCR Pipeline</td>
<td className="px-6 py-4">
<span className="inline-flex items-center px-2 py-0.5 text-[10px] font-bold bg-primary/10 text-primary border border-primary/30 uppercase">Processing</span>
</td>
<td className="px-6 py-4">
<div className="w-full bg-slate-800 h-1 max-w-[100px]">
<div className="bg-primary h-full w-[42%]"></div>
</div>
</td>
<td className="px-6 py-4">
<button className="text-primary hover:text-white transition-colors">
<span className="material-symbols-outlined text-lg">tune</span>
</button>
</td>
</tr>
<tr className="border-b border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition-colors">
<td className="px-6 py-4 font-mono text-[10px] text-slate-500">#AF-2905</td>
<td className="px-6 py-4 font-bold">Customer Data Sync</td>
<td className="px-6 py-4">
<span className="inline-flex items-center px-2 py-0.5 text-[10px] font-bold bg-amber-500/10 text-amber-500 border border-amber-500/30 uppercase">Pending</span>
</td>
<td className="px-6 py-4">
<div className="w-full bg-slate-800 h-1 max-w-[100px]">
<div className="bg-primary h-full w-[12%]"></div>
</div>
</td>
<td className="px-6 py-4">
<button className="text-primary hover:text-white transition-colors">
<span className="material-symbols-outlined text-lg">tune</span>
</button>
</td>
</tr>
<tr className="border-b border-white/5 hover:bg-white/[0.05] transition-colors">
<td className="px-6 py-4 font-mono text-[10px] text-slate-500">#AF-2909</td>
<td className="px-6 py-4 font-bold">Legacy API Proxy</td>
<td className="px-6 py-4">
<span className="inline-flex items-center px-2 py-0.5 text-[10px] font-bold bg-slate-500/10 text-slate-400 border border-slate-500/30 uppercase">Inactive</span>
</td>
<td className="px-6 py-4">
<div className="w-full bg-slate-800 h-1 max-w-[100px]">
<div className="bg-slate-700 h-full w-0"></div>
</div>
</td>
<td className="px-6 py-4">
<button className="text-primary hover:text-white transition-colors">
<span className="material-symbols-outlined text-lg">tune</span>
</button>
</td>
</tr>
</tbody>
</table>
</div>
</div>

<div className="grid grid-cols-2 gap-6">
<div className="bg-neutral-dark border border-primary/10 p-6">
<h4 className="font-michroma text-[10px] text-slate-500 uppercase mb-4 tracking-wider">Error Distribution</h4>
<div className="space-y-4">
<div className="flex justify-between items-center text-xs">
<span className="text-slate-400">Timeout Errors</span>
<span className="font-bold text-white">12%</span>
</div>
<div className="w-full bg-slate-800 h-1.5">
<div className="bg-amber-500 h-full w-[12%]"></div>
</div>
<div className="flex justify-between items-center text-xs pt-2">
<span className="text-slate-400">Auth Failures</span>
<span className="font-bold text-white">4%</span>
</div>
<div className="w-full bg-slate-800 h-1.5">
<div className="bg-primary h-full w-[4%]"></div>
</div>
</div>
</div>
<div className="bg-neutral-dark border border-primary/10 p-6">
<h4 className="font-michroma text-[10px] text-slate-500 uppercase mb-4 tracking-wider">Queue Density</h4>
<div className="flex items-center justify-center h-24">
<div className="flex gap-1 items-end h-full w-full px-2">
<div className="flex-1 bg-primary/20 h-1/4"></div>
<div className="flex-1 bg-primary/40 h-2/4"></div>
<div className="flex-1 bg-primary/60 h-3/4"></div>
<div className="flex-1 bg-primary/80 h-full"></div>
<div className="flex-1 bg-primary h-5/6"></div>
<div className="flex-1 bg-primary/70 h-3/5"></div>
<div className="flex-1 bg-primary/40 h-2/5"></div>
</div>
</div>
</div>
</div>
</div>

<div className="space-y-6">
<div className="bg-neutral-dark border border-primary/10 p-6 h-full min-h-[500px] flex flex-col">
<h4 className="font-michroma text-xs text-white uppercase tracking-wider mb-8">Efficiency Delta</h4>
<div className="flex-1 flex gap-4">
<div className="w-1 bg-primary/10 relative">
<div className="absolute bottom-0 left-0 w-full bg-primary" style={{ height: '78%' }}></div>
</div>
<div className="flex-1 space-y-8">
<div>
<p className="text-[10px] text-primary font-bold uppercase tracking-widest mb-1">Peak Efficiency</p>
<p className="text-2xl font-bold text-white">99.98%</p>
<p className="text-xs text-slate-500 mt-1 leading-relaxed">System-wide resource allocation is optimized for current load of 4.2k requests/sec.</p>
</div>
<div>
<p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">Data Volume (24h)</p>
<p className="text-2xl font-bold text-white">12.4 TB</p>
<div className="flex items-center gap-1 text-primary mt-1">
<span className="material-symbols-outlined text-sm">rocket</span>
<span className="text-xs">Max Capacity reached</span>
</div>
</div>
<div className="pt-8 border-t border-white/5 mt-auto">
<h5 className="font-michroma text-[9px] text-slate-500 uppercase mb-4 tracking-widest">Active System Nodes</h5>
<div className="flex flex-wrap gap-2">
<div className="px-2 py-1 bg-primary/10 border border-primary/30 text-[9px] font-bold text-primary">US-EAST-1</div>
<div className="px-2 py-1 bg-primary/10 border border-primary/30 text-[9px] font-bold text-primary">EU-WEST-2</div>
<div className="px-2 py-1 bg-slate-800 border border-slate-700 text-[9px] font-bold text-slate-400">AP-SOUTH-1</div>
<div className="px-2 py-1 bg-primary/10 border border-primary/30 text-[9px] font-bold text-primary">SA-EAST-1</div>
</div>
</div>
</div>
</div>
<button className="mt-8 w-full border border-primary text-primary hover:bg-primary hover:text-white transition-all py-3 font-michroma text-[10px] uppercase tracking-widest" onClick={() => navigate('/automatizaciones/logs')}>Download Logs</button>
</div>
</div>
</div>

<footer className="mt-8 pt-6 border-t border-primary/10 flex flex-wrap justify-between items-center text-[10px] uppercase tracking-widest text-slate-500 font-bold">
<div className="flex items-center gap-6">
<div className="flex items-center gap-2">
<span className="w-1.5 h-1.5 bg-green-500"></span>
<span>Mainnet Connected</span>
</div>
<div className="flex items-center gap-2">
<span className="w-1.5 h-1.5 bg-green-500"></span>
<span>Database Sync Stable</span>
</div>
<div className="flex items-center gap-2">
<span className="w-1.5 h-1.5 bg-primary"></span>
<span>Automation Engine v4.2.1</span>
</div>
</div>
<div className="mt-4 lg:mt-0">
                        © 2024 JAV LABS SYSTEMS INTERFACE
                    </div>
</footer>
</div>
</main>
</div>
    </>
  );
}
