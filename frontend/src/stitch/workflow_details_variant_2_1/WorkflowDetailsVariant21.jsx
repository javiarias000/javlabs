import { Link, useNavigate } from 'react-router-dom';
import './WorkflowDetailsVariant21.css';

export default function WorkflowDetailsVariant21() {
  return (
    <>
      <div className="relative flex h-screen w-full flex-col overflow-hidden">
<header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-slate-800 bg-background-dark/80 backdrop-blur-md px-10 py-4 z-50">
<div className="flex items-center gap-4 text-white">
<div className="size-6 text-primary">
<svg fill="none" viewbox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
<path d="M13.8261 30.5736C16.7203 29.8826 20.2244 29.4783 24 29.4783C27.7756 29.4783 31.2797 29.8826 34.1739 30.5736C36.9144 31.2278 39.9967 32.7669 41.3563 33.8352L24.8486 7.36089C24.4571 6.73303 23.5429 6.73303 23.1514 7.36089L6.64374 33.8352C8.00331 32.7669 11.0856 31.2278 13.8261 30.5736Z" fill="currentColor"></path>
<path clip-rule="evenodd" d="M39.998 35.764C39.9944 35.7463 39.9875 35.7155 39.9748 35.6706C39.9436 35.5601 39.8949 35.4259 39.8346 35.2825C39.8168 35.2403 39.7989 35.1993 39.7813 35.1602C38.5103 34.2887 35.9788 33.0607 33.7095 32.5189C30.9875 31.8691 27.6413 31.4783 24 31.4783C20.3587 31.4783 17.0125 31.8691 14.2905 32.5189C12.0012 33.0654 9.44505 34.3104 8.18538 35.1832C8.17384 35.2075 8.16216 35.233 8.15052 35.2592C8.09919 35.3751 8.05721 35.4886 8.02977 35.589C8.00356 35.6848 8.00039 35.7333 8.00004 35.7388C8.00004 35.739 8 35.7393 8.00004 35.7388C8.00004 35.7641 8.0104 36.0767 8.68485 36.6314C9.34546 37.1746 10.4222 37.7531 11.9291 38.2772C14.9242 39.319 19.1919 40 24 40C28.8081 40 33.0758 39.319 36.0709 38.2772C37.5778 37.7531 38.6545 37.1746 39.3151 36.6314C39.9006 36.1499 39.9857 35.8511 39.998 35.764ZM4.95178 32.7688L21.4543 6.30267C22.6288 4.4191 25.3712 4.41909 26.5457 6.30267L43.0534 32.777C43.0709 32.8052 43.0878 32.8338 43.104 32.8629L41.3563 33.8352C43.104 32.8629 43.1038 32.8626 43.104 32.8629L43.1051 32.865L43.1065 32.8675L43.1101 32.8739L43.1199 32.8918C43.1276 32.906 43.1377 32.9246 43.1497 32.9473C43.1738 32.9925 43.2062 33.0545 43.244 33.1299C43.319 33.2792 43.4196 33.489 43.5217 33.7317C43.6901 34.1321 44 34.9311 44 35.7391C44 37.4427 43.003 38.7775 41.8558 39.7209C40.6947 40.6757 39.1354 41.4464 37.385 42.0552C33.8654 43.2794 29.133 44 24 44C18.867 44 14.1346 43.2794 10.615 42.0552C8.86463 41.4464 7.30529 40.6757 6.14419 39.7209C4.99695 38.7775 3.99999 37.4427 3.99999 35.7391C3.99999 34.8725 4.29264 34.0922 4.49321 33.6393C4.60375 33.3898 4.71348 33.1804 4.79687 33.0311C4.83898 32.9556 4.87547 32.8935 4.9035 32.8471C4.91754 32.8238 4.92954 32.8043 4.93916 32.7889L4.94662 32.777L4.95178 32.7688ZM35.9868 29.004L24 9.77997L12.0131 29.004C12.4661 28.8609 12.9179 28.7342 13.3617 28.6282C16.4281 27.8961 20.0901 27.4783 24 27.4783C27.9099 27.4783 31.5719 27.8961 34.6383 28.6282C35.082 28.7342 35.5339 28.8609 35.9868 29.004Z" fill="currentColor" fill-rule="evenodd"></path>
</svg>
</div>
<h2 className="text-xl font-bold tracking-tight">JAV LABS</h2>
</div>
<div className="flex flex-1 justify-center gap-10">
<Link to="/dashboard" className="text-sm font-medium hover:text-primary transition-colors">Dashboard</Link>
<Link to="/workflow/v1" className="text-sm font-medium border-b-2 border-primary pb-1">Workflows</Link>
<Link to="/automatizaciones/logs" className="text-sm font-medium hover:text-primary transition-colors">Logs</Link>
<a className="text-sm font-medium hover:text-primary transition-colors" href="/">Settings</a>
</div>
<div className="flex items-center gap-4">
<button className="gradient-border group px-5 py-2 rounded text-sm font-bold transition-all hover:opacity-80">
<span className="text-white">Pausar Flujo</span>
</button>
<button className="bg-gradient-to-r from-primary to-accent-violet px-6 py-2 rounded text-sm font-bold text-white shadow-[0_0_15px_rgba(13,13,242,0.4)] hover:scale-105 transition-transform">
                    Guardar Cambios
                </button>
<div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-9 ml-2 border border-slate-700" data-alt="User profile avatar circle" style='background-image: url("https://lh3.googleusercontent.com/aida-public/AB6AXuBJTjPLmOeB0oaBtR-CH_svh3tvgczUuiDPTS5_1wnRF-O_XucoSLlvOaxlaXqKuDqL5_Kry2xQXy4USHb785xK5zNtfz8J2K7va8yfrjJBR1Ilj4ZSInyrXUxIsyABe29P-ZCQ1InsV3VlZJBRcodgHlrBEOPvAefV7Q9CZ_bYgcTsr0MsFqLtJpN02vC8UfwBoqVAsdn4zQhbRcxiuMjbLdEOshcFRpwtTdgKuxO2useKkxiRtwmSuiHlU7IGnbzScIwdTMWEjqQ");'></div>
</div>
</header>
<main className="flex flex-1 overflow-hidden">
<div className="flex-1 relative flex flex-col bg-background-dark grid-texture overflow-auto">
<div className="p-8 pb-0">
<nav className="flex gap-2 text-xs uppercase tracking-widest text-slate-500 mb-2">
<span>Workflows</span>
<span>/</span>
<span className="text-primary">Data Sync Automation</span>
</nav>
<h1 className="text-4xl font-black tracking-tighter text-white">Workflow Editor</h1>
</div>

<div className="flex-1 flex flex-col items-center justify-center gap-12 p-20 relative">

<div className="w-72 p-6 bg-slate-900 border border-slate-800 rounded shadow-2xl relative z-10 group cursor-pointer hover:border-primary/50 transition-colors">
<div className="flex items-center gap-4 mb-4">
<div className="p-3 bg-primary/20 rounded-lg text-primary">
<span className="material-symbols-outlined">api</span>
</div>
<div>
<h3 className="font-bold text-white">Webhook Trigger</h3>
<p className="text-xs text-slate-500 font-mono">POST /v1/incoming</p>
</div>
</div>
<div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
<div className="h-full bg-primary w-full opacity-60"></div>
</div>
</div>

<div className="h-12 w-1 bg-gradient-to-b from-primary to-accent-violet opacity-80"></div>

<div className="w-80 p-6 bg-neutral-dark rounded border-2 border-primary shadow-[0_0_30px_rgba(13,13,242,0.3)] relative z-20 group cursor-pointer scale-105">
<div className="absolute -top-3 -right-3 bg-primary text-[10px] font-bold px-2 py-0.5 rounded text-white uppercase tracking-tighter">Selected</div>
<div className="flex items-center gap-4 mb-4">
<div className="p-3 bg-primary/30 rounded-lg text-primary">
<span className="material-symbols-outlined">transform</span>
</div>
<div>
<h3 className="font-bold text-white">Data Mapping</h3>
<p className="text-xs text-slate-400 font-mono">JSON Transformation</p>
</div>
</div>
<div className="space-y-2">
<div className="h-1.5 w-full bg-slate-800 rounded-full"></div>
<div className="h-1.5 w-3/4 bg-slate-800 rounded-full"></div>
</div>
</div>

<div className="h-12 w-1 bg-gradient-to-b from-accent-violet to-primary opacity-80"></div>

<div className="w-72 p-6 bg-slate-900 border border-slate-800 rounded shadow-2xl relative z-10 group cursor-pointer hover:border-primary/50 transition-colors">
<div className="flex items-center gap-4 mb-4">
<div className="p-3 bg-accent-violet/20 rounded-lg text-accent-violet">
<span className="material-symbols-outlined">cloud_sync</span>
</div>
<div>
<h3 className="font-bold text-white">API Call</h3>
<p className="text-xs text-slate-500 font-mono">PUT /records/batch</p>
</div>
</div>
<div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
<div className="h-full bg-accent-violet w-0"></div>
</div>
</div>
</div>
</div>

<aside className="w-[450px] bg-neutral-dark border-l border-slate-800 flex flex-col z-50">
<div className="p-6 border-b border-slate-800 flex items-center justify-between">
<div>
<h2 className="text-white font-bold text-lg">Step Configuration</h2>
<p className="text-slate-500 text-xs font-mono uppercase">Data Mapping #2</p>
</div>
<button className="text-slate-500 hover:text-white">
<span className="material-symbols-outlined">close</span>
</button>
</div>
<div className="flex-1 overflow-auto p-6 font-mono text-sm">
<div className="mb-8">
<label className="block text-slate-400 text-xs mb-3 uppercase tracking-widest font-display">Mapping Rules</label>
<div className="bg-slate-900/50 p-4 rounded border border-slate-800 space-y-4">
<div className="flex items-center justify-between gap-4">
<span className="text-primary">Source Key</span>
<span className="material-symbols-outlined text-slate-600 text-xs">arrow_forward</span>
<span className="text-accent-violet">Target Key</span>
</div>
<div className="flex flex-col gap-2">
<div className="flex items-center justify-between bg-black/40 p-2 rounded">
<span className="text-slate-300">user_id</span>
<span className="text-slate-500">→</span>
<span className="text-slate-100">externalId</span>
</div>
<div className="flex items-center justify-between bg-black/40 p-2 rounded">
<span className="text-slate-300">full_name</span>
<span className="text-slate-500">→</span>
<span className="text-slate-100">displayName</span>
</div>
<div className="flex items-center justify-between bg-black/40 p-2 rounded border border-primary/30">
<span className="text-slate-300">created_at</span>
<span className="text-slate-500">→</span>
<span className="text-slate-100">timestamp</span>
</div>
</div>
</div>
</div>
<div>
<label className="block text-slate-400 text-xs mb-3 uppercase tracking-widest font-display">JSON Output Preview</label>
<div className="bg-slate-900/50 p-4 rounded border border-slate-800 text-xs leading-relaxed overflow-hidden">
<pre className="text-slate-300">&#123;
  <span className="text-accent-violet">"externalId"</span>: <span className="text-primary">"USR-9284"</span>,
  <span className="text-accent-violet">"displayName"</span>: <span className="text-primary">"John Doe"</span>,
  <span className="text-accent-violet">"timestamp"</span>: <span className="text-primary">"2023-10-24T12:00:00Z"</span>,
  <span className="text-accent-violet">"metadata"</span>: &#123;
    <span className="text-accent-violet">"source"</span>: <span className="text-primary">"web-portal"</span>,
    <span className="text-accent-violet">"priority"</span>: 1
  &#125;
&#125;</pre>
</div>
</div>
</div>
<div className="p-6 bg-slate-900/50 border-t border-slate-800">
<button className="w-full bg-primary/10 hover:bg-primary/20 text-primary font-bold py-3 rounded-lg border border-primary/20 transition-all flex items-center justify-center gap-2">
<span className="material-symbols-outlined text-sm">play_arrow</span>
                        Test Step Output
                    </button>
</div>
</aside>
</main>
<div className="absolute bottom-6 left-10 flex gap-4">
<button className="bg-background-dark/90 border border-slate-700 p-3 rounded shadow-lg text-slate-400 hover:text-white">
<span className="material-symbols-outlined">zoom_in</span>
</button>
<button className="bg-background-dark/90 border border-slate-700 p-3 rounded shadow-lg text-slate-400 hover:text-white">
<span className="material-symbols-outlined">zoom_out</span>
</button>
<button className="bg-background-dark/90 border border-slate-700 p-3 rounded shadow-lg text-slate-400 hover:text-white">
<span className="material-symbols-outlined">recenter</span>
</button>
</div>
</div>
    </>
  );
}
