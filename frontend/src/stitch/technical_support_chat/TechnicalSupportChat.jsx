import { Link, useNavigate } from 'react-router-dom';
import './TechnicalSupportChat.css';

export default function TechnicalSupportChat() {
  return (
    <>
      <div className="relative flex h-screen w-full flex-col">

<header className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 px-8 py-4 bg-background-light dark:bg-background-dark z-20">
<div className="flex items-center gap-8">
<div className="flex items-center gap-3">
<div className="size-6 bg-primary flex items-center justify-center">
<span className="material-symbols-outlined text-white text-sm">settings_input_component</span>
</div>
<h2 className="text-lg font-bold tracking-tight uppercase italic">JAV LABS <span className="font-light not-italic text-slate-400">Support</span></h2>
</div>
<nav className="hidden md:flex items-center gap-6">
<a className="text-xs font-semibold uppercase tracking-widest text-slate-500 hover:text-primary transition-colors" href="/automatizaciones/logs">Console</a>
<Link to="/soporte/ticket" className="text-xs font-semibold uppercase tracking-widest text-white border-b-2 border-primary pb-1">Active Tickets</Link>
<a className="text-xs font-semibold uppercase tracking-widest text-slate-500 hover:text-primary transition-colors" href="/automatizaciones">Nodes</a>
</nav>
</div>
<div className="flex items-center gap-6">
<div className="hidden lg:flex items-center bg-slate-100 dark:bg-system-gray px-3 py-1.5 border border-slate-200 dark:border-slate-700">
<span className="material-symbols-outlined text-slate-400 text-sm">search</span>
<input className="bg-transparent border-none focus:ring-0 text-sm w-48 placeholder:text-slate-500" placeholder="Search diagnostic logs..." type="text" />
</div>
<div className="flex items-center gap-3 border-l border-slate-800 pl-6">
<div className="text-right">
<p className="text-xs font-bold">OPERATOR_042</p>
<p className="text-[10px] text-primary uppercase font-bold tracking-tighter">Level 3 Engineer</p>
</div>
<div className="size-10 bg-slate-800 border border-slate-700" data-alt="Technical operator profile avatar">
<img alt="Operator avatar" className="w-full h-full object-cover grayscale" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCZ4dNCjH14HwJfSztVRkwrIAJiKkATkqWZkRbG2TuRw91Ioiy6o-0AU1mAtJBeiWH-d_0bR3IJtu-okXhp1ZpAQuv5UiFJUuCWEZBBZZp-bt4VHeS1Hqihg2S27mskkcD275tog0sUsSD8ALAJqXILmCSuQP5Pi83xDow9akmDhUxnzPB8t0SDeLaFhRmaosmItZh9XRxPREeIlabr3qt_aDN0EAN6uDtG2_AVnbHZJcvYteH8aH_jeZe7IYne1A7yb4ND61wPQ_8" />
</div>
</div>
</div>
</header>
<div className="flex flex-1 overflow-hidden">

<aside className="w-80 border-r border-slate-200 dark:border-slate-800 flex flex-col bg-slate-50 dark:bg-[#0c0c1a] hidden xl:flex">
<div className="p-6 border-b border-slate-800">
<span className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] block mb-2">Case Registry</span>
<h3 className="text-xl font-bold leading-tight">#82931-GAMMA</h3>
<p className="text-sm text-slate-500 mt-1">Automation System Calibration: Node-04 Cluster</p>
</div>
<div className="p-6 space-y-6">
<div>
<span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-3">System Status</span>
<div className="flex items-center gap-2 text-red-500">
<span className="material-symbols-outlined fill-1 text-sm">error</span>
<span className="text-xs font-mono font-bold uppercase">Critical Latency</span>
</div>
</div>
<div>
<span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-3">Target Node</span>
<div className="bg-system-gray p-3 border-l-2 border-primary">
<p className="text-xs font-mono">ID: JAV-NX-9902</p>
<p className="text-xs font-mono text-slate-400 mt-1">LOC: US-EAST-1</p>
</div>
</div>
</div>
<div className="mt-auto p-6">
<button className="w-full py-3 bg-transparent border border-slate-700 text-[10px] font-bold uppercase tracking-widest hover:bg-slate-800 transition-all">
                        Terminate Session
                    </button>
</div>
</aside>

<main className="flex-1 flex flex-col relative bg-background-light dark:bg-background-dark">

<div className="flex-1 overflow-y-auto p-8 relative scrollbar-hide">

<div className="absolute left-12 top-0 bottom-0 w-px resolution-path-line opacity-30"></div>
<div className="max-w-4xl mx-auto space-y-12 relative">

<div className="relative pl-16">
<div className="absolute left-[-22px] top-1 size-4 bg-background-dark border border-primary rounded-full z-10 flex items-center justify-center">
<div className="size-1.5 bg-primary rounded-full"></div>
</div>
<div className="border-t border-b border-slate-800/50 py-4 mb-4">
<div className="flex items-center gap-3 mb-2">
<span className="material-symbols-outlined text-primary text-lg">terminal</span>
<span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">System Event / 10:00:42 AM</span>
</div>
<div className="bg-system-gray/50 p-4 font-mono text-sm border border-slate-800/50">
<span className="text-primary mr-2">&gt;</span> initializing_diagnostic_sequence --target=node-04
                                    <br />
<span className="text-green-500 mr-2">&gt;</span> handshake_complete: status_ok
                                </div>
</div>
</div>

<div className="relative pl-16 group">
<div className="absolute left-[-22px] top-1 size-4 bg-background-dark border border-slate-500 rounded-full z-10"></div>
<div className="flex flex-col gap-2">
<div className="flex items-center gap-2">
<span className="text-xs font-bold uppercase tracking-tighter">Site_Lead_Alpha</span>
<span className="text-[10px] text-slate-500 font-mono">10:05 AM</span>
</div>
<div className="bg-white dark:bg-slate-100 text-slate-900 p-5 max-w-xl shadow-2xl border-l-4 border-slate-300">
<p className="text-sm font-medium leading-relaxed">The actuator on Node-04 is failing to meet the calibration baseline. We are seeing a 140ms delay in response timing. Need immediate override.</p>
</div>
</div>
</div>

<div className="relative pl-16 flex justify-end">
<div className="flex flex-col gap-2 items-end">
<div className="flex items-center gap-2">
<span className="text-[10px] text-slate-500 font-mono">10:08 AM</span>
<span className="text-xs font-bold uppercase tracking-tighter text-primary">JAV_TECH_SUPPORT</span>
</div>
<div className="bg-primary text-white p-5 max-w-xl border-r-4 border-brand-accent">
<p className="text-sm font-medium leading-relaxed">Acknowledged. Running a remote kernel sync to bypass the local controller latency. Please standby while I re-route the signal through the backup bus.</p>
</div>
</div>
</div>

<div className="relative pl-16">
<div className="absolute left-[-22px] top-1 size-4 bg-background-dark border border-primary rounded-full z-10 flex items-center justify-center shadow-[0_0_10px_rgba(13,13,242,0.5)]">
<div className="size-1.5 bg-primary rounded-full"></div>
</div>
<div className="py-4">
<div className="flex items-center gap-3 mb-2">
<span className="material-symbols-outlined text-brand-accent text-lg">monitoring</span>
<span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Diagnostic Output / 10:12:15 AM</span>
</div>
<div className="bg-black p-5 font-mono text-xs border border-slate-800 leading-relaxed overflow-hidden relative">
<div className="absolute top-0 right-0 p-2 text-[8px] text-slate-700 font-bold uppercase">Live Log</div>
<p className="text-slate-400">[INFO] Executing remote test on Actuator_ID: 04-B</p>
<p className="text-yellow-500">[WARN] High impedance detected in secondary actuator coil</p>
<p className="text-primary font-bold">[EXEC] Signal re-routing: Successful</p>
<div className="mt-3 h-1 w-full bg-slate-900">
<div className="h-full bg-primary w-2/3"></div>
</div>
</div>
</div>
</div>

<div className="relative pl-16">
<div className="absolute left-[-22px] top-1 size-4 bg-background-dark border border-slate-500 rounded-full z-10"></div>
<div className="flex flex-col gap-2">
<div className="flex items-center gap-2">
<span className="text-xs font-bold uppercase tracking-tighter">Site_Lead_Alpha</span>
<span className="text-[10px] text-slate-500 font-mono">10:15 AM</span>
</div>
<div className="bg-white dark:bg-slate-100 text-slate-900 p-5 max-w-xl border-l-4 border-slate-300">
<p className="text-sm font-medium leading-relaxed">Latency just dropped to 12ms. Calibration is back within green parameters. Can you confirm if this is a permanent fix or a temporary bypass?</p>
</div>
</div>
</div>
</div>
</div>

<div className="absolute right-8 bottom-32 z-30">
<div className="flex flex-col gap-2">
<div className="group relative flex items-center justify-end">
<div className="bg-black/90 border border-slate-800 p-3 pr-10 -mr-8 opacity-0 group-hover:opacity-100 transition-all pointer-events-none group-hover:pointer-events-auto">
<p className="text-[10px] font-bold uppercase tracking-widest text-white whitespace-nowrap">Share Live Screen</p>
</div>
<button className="size-12 bg-gradient-to-br from-primary to-brand-accent flex items-center justify-center shadow-xl hover:scale-110 transition-transform">
<span className="material-symbols-outlined text-white">screen_share</span>
</button>
</div>
<div className="group relative flex items-center justify-end">
<div className="bg-black/90 border border-slate-800 p-3 pr-10 -mr-8 opacity-0 group-hover:opacity-100 transition-all pointer-events-none group-hover:pointer-events-auto">
<p className="text-[10px] font-bold uppercase tracking-widest text-white whitespace-nowrap">Request Video Call</p>
</div>
<button className="size-12 bg-gradient-to-br from-primary to-brand-accent flex items-center justify-center shadow-xl hover:scale-110 transition-transform">
<span className="material-symbols-outlined text-white">videocam</span>
</button>
</div>
</div>
</div>

<div className="p-8 bg-background-light dark:bg-[#080814] border-t border-slate-200 dark:border-slate-800">
<div className="max-w-4xl mx-auto">
<div className="relative flex items-center bg-white dark:bg-system-gray border border-slate-300 dark:border-slate-700 shadow-xl">
<div className="px-4 text-slate-500">
<span className="material-symbols-outlined">add_circle</span>
</div>
<textarea className="w-full bg-transparent border-none focus:ring-0 py-4 text-sm font-medium placeholder:text-slate-600 resize-none" placeholder="Enter technical command or message..." rows="1"></textarea>
<div className="px-4 flex items-center gap-4">
<span className="material-symbols-outlined text-slate-500 cursor-pointer hover:text-white transition-colors">attach_file</span>
<button className="bg-primary hover:bg-brand-accent px-6 py-2 text-[10px] font-bold uppercase tracking-widest text-white transition-colors">
                                    Execute
                                </button>
</div>
</div>
<div className="flex justify-between items-center mt-3 px-1">
<div className="flex gap-4">
<div className="flex items-center gap-1.5">
<div className="size-1.5 bg-green-500 rounded-full animate-pulse"></div>
<span className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter">Secure_Channel_Active</span>
</div>
<div className="flex items-center gap-1.5">
<span className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter">Encryption: AES-256</span>
</div>
</div>
<span className="text-[9px] font-mono text-slate-600">CMD + ENTER TO SEND</span>
</div>
</div>
</div>
</main>

<aside className="w-72 border-l border-slate-200 dark:border-slate-800 flex flex-col bg-slate-50 dark:bg-[#0c0c1a] hidden lg:flex">
<div className="p-6 border-b border-slate-800">
<span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-4">Node Metrics</span>
<div className="space-y-4">
<div>
<div className="flex justify-between text-[10px] font-mono mb-1">
<span>CPU LOAD</span>
<span className="text-primary">42.8%</span>
</div>
<div className="h-1 w-full bg-slate-800">
<div className="h-full bg-primary w-[42.8%]"></div>
</div>
</div>
<div>
<div className="flex justify-between text-[10px] font-mono mb-1">
<span>IO LATENCY</span>
<span className="text-red-500">114ms</span>
</div>
<div className="h-1 w-full bg-slate-800">
<div className="h-full bg-red-500 w-[85%]"></div>
</div>
</div>
</div>
</div>
<div className="p-6 overflow-y-auto">
<span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-4">Diagnostic Assets</span>
<div className="grid grid-cols-2 gap-2">
<div className="aspect-square bg-slate-800 border border-slate-700 flex flex-col items-center justify-center gap-2 hover:border-primary transition-colors cursor-pointer" data-alt="Technical schematic diagram thumbnail">
<span className="material-symbols-outlined text-slate-500">architecture</span>
<span className="text-[8px] font-bold uppercase text-slate-500">Schematic</span>
</div>
<div className="aspect-square bg-slate-800 border border-slate-700 flex flex-col items-center justify-center gap-2 hover:border-primary transition-colors cursor-pointer" data-alt="System log report thumbnail">
<span className="material-symbols-outlined text-slate-500">description</span>
<span className="text-[8px] font-bold uppercase text-slate-500">Logs_Node04</span>
</div>
<div className="aspect-square bg-slate-800 border border-slate-700 flex flex-col items-center justify-center gap-2 hover:border-primary transition-colors cursor-pointer" data-alt="Calibration data chart thumbnail">
<span className="material-symbols-outlined text-slate-500">analytics</span>
<span className="text-[8px] font-bold uppercase text-slate-500">Cal_Data</span>
</div>
<div className="aspect-square bg-slate-800 border border-slate-700 flex flex-col items-center justify-center gap-2 hover:border-primary transition-colors cursor-pointer" data-alt="Video feed thumbnail">
<span className="material-symbols-outlined text-slate-500">videocam</span>
<span className="text-[8px] font-bold uppercase text-slate-500">CAM_B_FEED</span>
</div>
</div>
</div>
</aside>
</div>
</div>
    </>
  );
}
