import { Link, useNavigate } from 'react-router-dom';
import './AutomationLogicTestView.css';

export default function AutomationLogicTestView() {
  const navigate = useNavigate();
  return (
    <>
      <header className="flex items-center justify-between border-b border-primary/20 px-6 py-4 bg-background-dark/80 backdrop-blur-md sticky top-0 z-50">
<div className="flex items-center gap-4">
<div className="text-primary">
<span className="material-symbols-outlined text-4xl">rocket_launch</span>
</div>
<h2 className="text-xl font-bold tracking-tight">JAV LABS</h2>
</div>
<nav className="hidden md:flex items-center gap-8">
<Link to="/dashboard" className="text-sm font-medium hover:text-primary transition-colors">Dashboard</Link>
<Link to="/workflow/v1" className="text-sm font-medium text-primary border-b-2 border-primary">Workflows</Link>
<Link to="/automatizaciones/logs" className="text-sm font-medium hover:text-primary transition-colors">Logs</Link>
<a className="text-sm font-medium hover:text-primary transition-colors" href="/dashboard/overview">Settings</a>
</nav>
<div className="flex items-center gap-4">
<button className="bg-primary hover:bg-primary/90 text-white text-sm font-bold px-6 py-2 rounded shadow-lg shadow-primary/20 transition-all" onClick={() => navigate('/automatizaciones/nueva')}>New Automation</button>
<div className="w-10 h-10 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center overflow-hidden">
<img className="w-full h-full object-cover" data-alt="User profile avatar with geometric pattern" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD4Yjaa1Rf2VJQDYuOGkIahrvzgBGFCgQUtb-Lk9wtjbhP9vIIWevdUmVnj7TOPMZVQ6rYJXhK5LWVmg2fKV3tX-EOR11f_OrTB25kitJ8ZZSbp6t4z7AjrCTmCtJs6Zo4uFFjqqQz-ZdID7xRrWR3KPJFe4VfCztyuUimpDXIGloC3KmzYgNeNWajMzzXGys4lgtF9DhDw38buitG1-oujHsgC3QQv-iNWCJR7HHp6adJWil7TEs2NJd4k8JtG26WGrkJX2nQ1d74" />
</div>
</div>
</header>
<main className="flex-1 flex flex-col max-w-[1440px] mx-auto w-full px-6 py-8 gap-8">

<div className="flex flex-col gap-6">
<div className="flex items-center gap-2 text-sm text-slate-500">
<span>Workflows</span>
<span className="material-symbols-outlined text-xs">chevron_right</span>
<span>JAV LABS Wizard</span>
<span className="material-symbols-outlined text-xs">chevron_right</span>
<span className="text-primary font-semibold">Logic &amp; Action</span>
</div>
<div className="grid grid-cols-4 gap-4">
<div className="flex items-center gap-3 px-4 py-3 rounded border border-slate-200 dark:border-slate-800 opacity-60">
<span className="material-symbols-outlined text-primary">bolt</span>
<p className="text-sm font-medium">1. Trigger</p>
</div>
<div className="flex items-center gap-3 px-4 py-3 rounded border border-slate-200 dark:border-slate-800 opacity-60">
<span className="material-symbols-outlined text-primary">database</span>
<p className="text-sm font-medium">2. Data Source</p>
</div>
<div className="flex items-center gap-3 px-4 py-3 rounded border-2 border-primary bg-primary/10 shadow-[0_0_15px_rgba(140,37,244,0.3)]">
<span className="material-symbols-outlined text-primary">account_tree</span>
<p className="text-sm font-bold">3. Acción (Active)</p>
</div>
<div className="flex items-center gap-3 px-4 py-3 rounded border border-slate-200 dark:border-slate-800 opacity-60">
<span className="material-symbols-outlined">visibility</span>
<p className="text-sm font-medium">4. Review</p>
</div>
</div>
</div>
<div className="flex flex-col lg:flex-row gap-8 flex-1 min-h-[600px]">

<div className="flex-[2] flex flex-col gap-4">
<div className="flex items-center justify-between">
<h3 className="text-xl font-bold">Logic Canvas</h3>
<div className="flex gap-2">
<button className="px-3 py-1.5 rounded border border-primary/40 text-xs font-bold hover:bg-primary/10 flex items-center gap-2">
<span className="material-symbols-outlined text-sm">filter_alt</span> ADD FILTER
                        </button>
<button className="px-3 py-1.5 rounded border border-primary/40 text-xs font-bold hover:bg-primary/10 flex items-center gap-2">
<span className="material-symbols-outlined text-sm">transform</span> TRANSFORM
                        </button>
</div>
</div>
<div className="flex-1 rounded border-2 border-dashed border-primary/20 bg-slate-50 dark:bg-slate-900/50 logic-grid relative overflow-hidden p-12">
<div className="flex items-center justify-center h-full gap-16 relative z-10">

<div className="w-48 p-4 bg-background-dark border border-primary rounded shadow-xl relative">
<div className="absolute -top-3 left-4 bg-primary text-[10px] px-2 py-0.5 font-bold uppercase">Filtro</div>
<p className="text-xs text-slate-400 mb-2">Condition</p>
<p className="text-sm font-bold">Price &gt; 1000 USD</p>
<span className="material-symbols-outlined absolute -right-3 top-1/2 -translate-y-1/2 bg-primary rounded-full text-sm p-1">check</span>
</div>

<div className="w-16 h-[2px] bg-gradient-to-r from-primary to-blue-500 relative">
<div className="absolute right-0 -top-1 border-t-4 border-b-4 border-l-4 border-transparent border-l-blue-500"></div>
</div>

<div className="w-48 p-4 bg-background-dark border border-blue-500 rounded shadow-xl relative">
<div className="absolute -top-3 left-4 bg-blue-500 text-[10px] px-2 py-0.5 font-bold uppercase text-white">Transformación</div>
<p className="text-xs text-slate-400 mb-2">JS Mapper</p>
<p className="text-sm font-bold">Format: Currency</p>
<span className="material-symbols-outlined absolute -right-3 top-1/2 -translate-y-1/2 bg-blue-500 rounded-full text-sm p-1">code</span>
</div>

<div className="w-16 h-[2px] bg-gradient-to-r from-blue-500 to-primary relative">
<div className="absolute right-0 -top-1 border-t-4 border-b-4 border-l-4 border-transparent border-l-primary"></div>
</div>

<div className="w-48 p-4 bg-primary/20 border-2 border-primary rounded shadow-2xl animate-pulse">
<div className="absolute -top-3 left-4 bg-primary text-[10px] px-2 py-0.5 font-bold uppercase">Acción Final</div>
<p className="text-xs text-slate-400 mb-2">Select Target</p>
<p className="text-sm italic text-primary/60">Waiting selection...</p>
</div>
</div>
</div>
</div>

<div className="flex-1 flex flex-col gap-4">
<h3 className="text-xl font-bold">Target Integration</h3>
<div className="grid grid-cols-2 gap-4">
<button className="group p-6 rounded bg-slate-900 border border-slate-800 hover:border-blue-400 hover:shadow-[0_0_15px_rgba(59,130,246,0.2)] transition-all flex flex-col items-center gap-3">
<span className="material-symbols-outlined text-4xl text-slate-500 group-hover:text-blue-400">cloud_sync</span>
<span className="text-sm font-bold">Salesforce</span>
</button>
<button className="group p-6 rounded bg-slate-900 border border-slate-800 hover:border-blue-400 hover:shadow-[0_0_15px_rgba(59,130,246,0.2)] transition-all flex flex-col items-center gap-3">
<span className="material-symbols-outlined text-4xl text-slate-500 group-hover:text-blue-400">forum</span>
<span className="text-sm font-bold">Slack</span>
</button>
<button className="group p-6 rounded bg-slate-900 border border-slate-800 hover:border-blue-400 hover:shadow-[0_0_15px_rgba(59,130,246,0.2)] transition-all flex flex-col items-center gap-3">
<span className="material-symbols-outlined text-4xl text-slate-500 group-hover:text-blue-400">hub</span>
<span className="text-sm font-bold">HubSpot</span>
</button>
<button className="group p-6 rounded bg-slate-900 border border-slate-800 hover:border-blue-400 hover:shadow-[0_0_15px_rgba(59,130,246,0.2)] transition-all flex flex-col items-center gap-3">
<span className="material-symbols-outlined text-4xl text-slate-500 group-hover:text-blue-400">api</span>
<span className="text-sm font-bold">Custom API</span>
</button>
</div>
<div className="mt-auto p-4 rounded bg-primary/5 border border-primary/20">
<p className="text-xs text-slate-400 mb-2 font-bold uppercase tracking-widest">Resumen de lógica</p>
<p className="text-sm leading-relaxed">Se filtrarán las entradas con precio superior a 1000, se transformarán a formato moneda regional y se enviará un payload JSON al destino seleccionado.</p>
</div>
</div>
</div>

<div className="rounded border border-slate-800 bg-black/40 overflow-hidden shadow-2xl">
<div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800">
<div className="flex items-center gap-2">
<span className="material-symbols-outlined text-sm text-green-500">terminal</span>
<span className="text-xs font-bold font-mono tracking-tighter">CONSOLA DE PRUEBAS V2.0</span>
</div>
<div className="flex gap-4">
<span className="text-[10px] text-slate-500 font-mono">STATUS: READY</span>
<span className="text-[10px] text-slate-500 font-mono">RUNTIME: 12ms</span>
</div>
</div>
<div className="grid grid-cols-2 divide-x divide-slate-800 p-4 font-mono text-[11px] leading-relaxed">
<div className="pr-4">
<p className="text-blue-400 mb-2 uppercase font-bold text-[10px]">// Mock Input Data</p>
<pre className="text-slate-300">&#123;
  "id": "ORD-5521",
  "customer": "John Doe",
  "amount": 1250.50,
  "currency": "USD",
  "timestamp": "2023-10-27T14:30:00Z"
&#125;</pre>
</div>
<div className="pl-4">
<p className="text-primary mb-2 uppercase font-bold text-[10px]">// Mock Output Data (Preview)</p>
<pre className="text-slate-300">&#123;
  "status": "filtered_passed",
  "formatted_amount": "$1,250.50",
  "payload_ready": true,
  "action": "PENDING_TARGET"
&#125;</pre>
</div>
</div>
</div>

<div className="flex items-center justify-between pt-4 border-t border-slate-800">
<button className="text-slate-400 hover:text-white flex items-center gap-2 text-sm font-bold transition-colors">
<span className="material-symbols-outlined">arrow_back</span> REGRESAR
            </button>
<div className="flex gap-4">
<button className="px-8 py-3 rounded border border-slate-700 font-bold text-sm hover:bg-slate-800 transition-all">
                    GUARDAR BORRADOR
                </button>
<button className="px-10 py-3 rounded bg-gradient-to-r from-primary to-blue-600 text-white font-black text-sm tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all">
                    FINALIZAR Y ACTIVAR
                </button>
</div>
</div>
</main>
<footer className="mt-auto py-6 px-10 text-center border-t border-primary/10">
<p className="text-[10px] text-slate-500 uppercase tracking-widest">JAV LABS © 2024 - Enterprise Automation Engine</p>
</footer>
    </>
  );
}
