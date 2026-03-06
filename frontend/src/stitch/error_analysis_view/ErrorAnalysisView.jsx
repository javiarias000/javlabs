import { Link, useNavigate } from 'react-router-dom';
import './ErrorAnalysisView.css';

export default function ErrorAnalysisView() {
  const navigate = useNavigate();
  return (
    <>
      <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden technical-grid">

<header className="flex items-center justify-between border-b border-slate-800 bg-background-dark/80 backdrop-blur-md px-8 py-4 sticky top-0 z-50">
<div className="flex items-center gap-8">
<div className="flex items-center gap-3 text-primary">
<span className="material-symbols-outlined text-3xl">terminal</span>
<h2 className="font-michroma text-lg tracking-wider text-slate-100">JAV LABS</h2>
</div>
<nav className="hidden md:flex items-center gap-6">
<a className="text-xs uppercase tracking-widest text-slate-400 hover:text-primary transition-colors" href="/">Terminal</a>
<a className="text-xs uppercase tracking-widest text-primary border-b border-primary pb-1" href="/">Incidencias</a>
<a className="text-xs uppercase tracking-widest text-slate-400 hover:text-primary transition-colors" href="/">Nodos</a>
<a className="text-xs uppercase tracking-widest text-slate-400 hover:text-primary transition-colors" href="/">SLA</a>
</nav>
</div>
<div className="flex items-center gap-6">
<div className="hidden lg:flex items-center bg-navy-muted border border-slate-800 px-3 py-1.5">
<span className="material-symbols-outlined text-slate-500 text-sm mr-2">search</span>
<input className="bg-transparent border-none focus:ring-0 text-xs text-slate-100 placeholder:text-slate-600 w-48 p-0 uppercase tracking-tighter" placeholder="BUSCAR LOG ID..." type="text" />
</div>
<button className="bg-gradient-to-r from-primary to-purple-600 text-white text-[10px] font-bold uppercase tracking-widest px-6 py-2.5 hover:opacity-90 transition-opacity" onClick={() => navigate('/contacto')}>Contactar Soporte Técnico</button>
<div className="w-8 h-8 border border-primary p-0.5">
<div className="w-full h-full bg-slate-800" data-alt="User avatar placeholder profile image"></div>
</div>
</div>
</header>
<main className="flex-1 flex flex-col p-8 gap-8 max-w-[1600px] mx-auto w-full">

<div className="flex flex-col gap-2">
<h1 className="font-michroma text-4xl text-slate-100 tracking-tight uppercase">Análisis de Incidencias</h1>
<div className="flex items-center gap-4">
<span className="h-px w-12 bg-primary"></span>
<p className="text-slate-500 text-xs uppercase tracking-[0.2em]">Technical precision error tracking for JAV LABS automation.</p>
</div>
</div>

<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
<div className="bg-navy-muted border-l-4 border-primary p-6 flex flex-col gap-1 group hover:bg-slate-900 transition-colors">
<span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Tasa de Error</span>
<div className="flex items-end gap-2">
<span className="text-3xl font-bold text-slate-100">0.2%</span>
<span className="text-emerald-500 text-xs mb-1">▼ 0.05%</span>
</div>
<div className="w-full bg-slate-800 h-1 mt-4">
<div className="bg-primary h-full w-[0.2%]"></div>
</div>
</div>
<div className="bg-navy-muted border-l-4 border-slate-700 p-6 flex flex-col gap-1 group hover:bg-slate-900 transition-colors">
<span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Promedio de Resolución</span>
<div className="flex items-end gap-2">
<span className="text-3xl font-bold text-slate-100">14m 30s</span>
</div>
<div className="w-full bg-slate-800 h-1 mt-4">
<div className="bg-slate-600 h-full w-[45%]"></div>
</div>
</div>
<div className="bg-navy-muted border-l-4 border-error-glow p-6 flex flex-col gap-1 group hover:bg-slate-900 transition-colors">
<span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Alertas Críticas</span>
<div className="flex items-center gap-3">
<span className="text-3xl font-bold text-slate-100">2 Active</span>
<span className="relative flex h-3 w-3">
<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-error-glow opacity-75"></span>
<span className="relative inline-flex rounded-full h-3 w-3 bg-error-glow"></span>
</span>
</div>
<div className="w-full bg-slate-800 h-1 mt-4">
<div className="bg-error-glow h-full w-full"></div>
</div>
</div>
</div>

<div className="grid grid-cols-1 lg:grid-cols-10 gap-8 items-start">

<div className="lg:col-span-4 flex flex-col gap-4">
<h3 className="font-michroma text-[10px] text-slate-500 uppercase tracking-widest mb-2">Real-time Pings</h3>
<div className="flex flex-col border-l border-slate-800 ml-3">

<div className="relative pl-8 pb-8 group">
<div className="absolute left-[-6px] top-1 w-3 h-3 bg-primary rotate-45 glow-diamond"></div>
<div className="bg-navy-muted/50 p-4 border border-primary/30">
<div className="flex justify-between items-start mb-1">
<span className="text-xs font-bold text-primary uppercase tracking-tighter">Error de Conexión API</span>
<span className="text-[10px] font-mono text-slate-500 tracking-tighter">10:45:02:445</span>
</div>
<p className="text-[11px] text-slate-400 font-mono leading-relaxed">Critical timeout detected on gateway-cluster-04. Retrying in 500ms...</p>
<div className="mt-3 flex gap-2">
<span className="px-2 py-0.5 bg-primary/10 text-primary text-[9px] font-bold uppercase tracking-widest border border-primary/20">Critical</span>
<span className="px-2 py-0.5 bg-slate-800 text-slate-400 text-[9px] font-bold uppercase tracking-widest border border-slate-700 font-mono">ID: 0x992B</span>
</div>
</div>
</div>

<div className="relative pl-8 pb-8 group">
<div className="absolute left-[-6px] top-1 w-3 h-3 bg-primary rotate-45 glow-diamond"></div>
<div className="bg-navy-muted/50 p-4 border border-primary/30">
<div className="flex justify-between items-start mb-1">
<span className="text-xs font-bold text-primary uppercase tracking-tighter">Timeout en Base de Datos</span>
<span className="text-[10px] font-mono text-slate-500 tracking-tighter">10:42:15:102</span>
</div>
<p className="text-[11px] text-slate-400 font-mono leading-relaxed">Latency threshold exceeded (&gt;2500ms). DB Node 02 reported congestion.</p>
<div className="mt-3 flex gap-2">
<span className="px-2 py-0.5 bg-primary/10 text-primary text-[9px] font-bold uppercase tracking-widest border border-primary/20">Network</span>
<span className="px-2 py-0.5 bg-slate-800 text-slate-400 text-[9px] font-bold uppercase tracking-widest border border-slate-700 font-mono">ID: 0x110F</span>
</div>
</div>
</div>

<div className="relative pl-8 pb-8 group opacity-60 hover:opacity-100 transition-opacity">
<div className="absolute left-[-4px] top-1.5 w-2 h-2 bg-slate-600 rotate-45"></div>
<div className="bg-transparent p-4 border border-slate-800">
<div className="flex justify-between items-start mb-1">
<span className="text-xs font-bold text-slate-300 uppercase tracking-tighter">Ping Exitoso</span>
<span className="text-[10px] font-mono text-slate-500 tracking-tighter">10:35:00:000</span>
</div>
<p className="text-[11px] text-slate-500 font-mono leading-relaxed">System heartbeat acknowledged. All services reporting nominal status.</p>
</div>
</div>

<div className="relative pl-8 pb-8 group opacity-40 hover:opacity-100 transition-opacity">
<div className="absolute left-[-4px] top-1.5 w-2 h-2 bg-slate-600 rotate-45"></div>
<div className="bg-transparent p-4 border border-slate-800">
<div className="flex justify-between items-start mb-1">
<span className="text-xs font-bold text-slate-300 uppercase tracking-tighter">Autenticación Bypass</span>
<span className="text-[10px] font-mono text-slate-500 tracking-tighter">10:30:12:881</span>
</div>
</div>
</div>
</div>
</div>

<div className="lg:col-span-6 flex flex-col gap-4 h-full">
<div className="flex justify-between items-center mb-2">
<h3 className="font-michroma text-[10px] text-slate-500 uppercase tracking-widest">Technical View: Input vs Output</h3>
<div className="flex gap-4">
<span className="flex items-center gap-2 text-[9px] text-emerald-500 uppercase font-bold"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Live Stream</span>
<span className="flex items-center gap-2 text-[9px] text-slate-500 uppercase font-bold">Node: EU-WEST-1</span>
</div>
</div>
<div className="flex flex-col border border-slate-800 bg-background-dark h-[600px] overflow-hidden">

<div className="flex divide-x divide-slate-800 border-b border-slate-800 bg-navy-muted">
<div className="flex-1 px-4 py-2 flex items-center justify-between">
<span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Request Body (Input)</span>
<span className="material-symbols-outlined text-sm text-slate-600">code</span>
</div>
<div className="flex-1 px-4 py-2 flex items-center justify-between">
<span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Server Response (Output)</span>
<span className="material-symbols-outlined text-sm text-primary">error</span>
</div>
</div>

<div className="flex-1 flex divide-x divide-slate-800 font-mono text-xs code-scrollbar overflow-y-auto">

<div className="flex-1 bg-background-dark p-4 flex gap-4">
<div className="text-slate-700 text-right select-none pr-2 border-r border-slate-900/50">
                                    1<br />2<br />3<br />4<br />5<br />6<br />7<br />8<br />9<br />10<br />11<br />12<br />13<br />14<br />15
                                </div>
<div className="text-slate-300 whitespace-pre">
<span className="text-purple-400">&#123;</span>
<span className="text-slate-500">"header"</span>: <span className="text-emerald-400">&#123;</span>
<span className="text-slate-500">"agent"</span>: <span className="text-primary">"JAV_LABS_AUTO"</span>,
    <span className="text-slate-500">"version"</span>: <span className="text-primary">"4.0.1"</span>
<span className="text-emerald-400">&#125;</span>,
  <span className="text-slate-500">"payload"</span>: <span className="text-emerald-400">&#123;</span>
<span className="text-slate-500">"task_id"</span>: <span className="text-primary">"TX-9902"</span>,
    <span className="text-slate-500">"action"</span>: <span className="text-primary">"DEPLOY_SEQUENCE"</span>,
    <span className="text-slate-500">"params"</span>: <span className="text-emerald-400">&#123;</span>
<span className="text-slate-500">"retry"</span>: <span className="text-blue-400">true</span>,
      <span className="text-slate-500">"timeout"</span>: <span className="text-blue-400">5000</span>
<span className="text-emerald-400">&#125;</span>
<span className="text-emerald-400">&#125;</span>
<span className="text-purple-400">&#125;</span></div>
</div>

<div className="flex-1 bg-navy-muted/30 p-4 flex gap-4 relative">
<div className="text-slate-700 text-right select-none pr-2 border-r border-slate-900/50">
                                    1<br />2<br />3<br />4<br />5<br />6<br />7<br />8<br />9<br />10<br />11<br />12<br />13<br />14<br />15
                                </div>
<div className="text-slate-300 whitespace-pre relative z-10">
<span className="text-error-glow font-bold">HTTP/1.1 504 Gateway Timeout</span>
<span className="text-slate-500">Content-Type: application/json</span>
<span className="text-purple-400">&#123;</span>
<span className="text-slate-500">"error"</span>: <span className="text-error-glow">"UPSTREAM_TIMEOUT"</span>,
  <span className="text-slate-500">"message"</span>: <span className="text-slate-400">"Request to node-02
  timed out after 5000ms."</span>,
  <span className="text-slate-500">"trace_id"</span>: <span className="text-primary">"jav-778-992-aa"</span>
<span className="text-purple-400">&#125;</span></div>

<div className="absolute inset-0 bg-primary/5 pointer-events-none"></div>
<div className="absolute top-4 left-0 w-full h-5 bg-primary/20 border-y border-primary/40 pointer-events-none"></div>
</div>
</div>

<div className="bg-navy-muted border-t border-slate-800 px-4 py-2 flex justify-between items-center">
<div className="flex gap-4">
<span className="text-[9px] font-mono text-slate-500 uppercase">UTF-8</span>
<span className="text-[9px] font-mono text-slate-500 uppercase">JSON</span>
<span className="text-[9px] font-mono text-slate-500 uppercase">Lines: 15</span>
</div>
<div className="flex items-center gap-3">
<button className="text-slate-500 hover:text-white transition-colors">
<span className="material-symbols-outlined text-sm">content_copy</span>
</button>
<button className="text-slate-500 hover:text-white transition-colors">
<span className="material-symbols-outlined text-sm">fullscreen</span>
</button>
</div>
</div>
</div>
</div>
</div>

<div className="mt-auto border-t border-slate-800 py-6 flex flex-wrap justify-between items-center gap-6">
<div className="flex gap-12">
<div className="flex flex-col">
<span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Core Engine Status</span>
<div className="flex items-center gap-2">
<span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
<span className="text-xs text-slate-300 font-bold uppercase tracking-tighter">Operational</span>
</div>
</div>
<div className="flex flex-col">
<span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Active Threads</span>
<div className="flex items-center gap-2">
<span className="text-xs text-slate-300 font-bold font-mono tracking-tighter">1,204 / 2,000</span>
</div>
</div>
<div className="flex flex-col">
<span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Uptime</span>
<div className="flex items-center gap-2">
<span className="text-xs text-slate-300 font-bold font-mono tracking-tighter">99.98%</span>
</div>
</div>
</div>
<div className="flex items-center gap-4 text-slate-500 text-[9px] uppercase tracking-widest">
<span>© 2024 JAV LABS Automation Agency</span>
<span className="h-4 w-px bg-slate-800"></span>
<span>System v4.0.12-build-88</span>
</div>
</div>
</main>
</div>
    </>
  );
}
