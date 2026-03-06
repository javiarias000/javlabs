import { Link, useNavigate } from 'react-router-dom';
import './WorkflowDetailsVariant22.css';

export default function WorkflowDetailsVariant22() {
  const navigate = useNavigate();
  return (
    <>
      <div className="relative flex h-screen w-full flex-col overflow-hidden">
<header className="flex items-center justify-between border-b border-slate-800 bg-pure-black/90 backdrop-blur-md px-10 py-6 z-50">
<div className="flex flex-col gap-1">
<nav className="flex gap-2 text-[10px] uppercase tracking-[0.2em] text-slate-500 font-montserrat">
<span>Soporte</span>
<span>/</span>
<span className="text-electric-blue">Nueva Incidencia</span>
</nav>
<h1 className="text-xl font-michroma text-white tracking-widest uppercase">Reporte de Incidencia Técnica</h1>
</div>
<div className="flex items-center gap-6">
<div className="flex items-center gap-3">
<div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-8 border border-slate-700" style='background-image: url("https://lh3.googleusercontent.com/aida-public/AB6AXuBJTjPLmOeB0oaBtR-CH_svh3tvgczUuiDPTS5_1wnRF-O_XucoSLlvOaxlaXqKuDqL5_Kry2xQXy4USHb785xK5zNtfz8J2K7va8yfrjJBR1Ilj4ZSInyrXUxIsyABe29P-ZCQ1InsV3VlZJBRcodgHlrBEOPvAefV7Q9CZ_bYgcTsr0MsFqLtJpN02vC8UfwBoqVAsdn4zQhbRcxiuMjbLdEOshcFRpwtTdgKuxO2useKkxiRtwmSuiHlU7IGnbzScIwdTMWEjqQ");'></div>
<span className="text-xs font-semibold text-slate-300">JAV LABS ADMIN</span>
</div>
</div>
</header>
<main className="flex flex-1 overflow-hidden p-10 gap-8">
<section className="flex-1 bg-pure-black border border-slate-800 p-8 overflow-y-auto">
<form className="space-y-8">
<div className="grid grid-cols-2 gap-6">
<div className="col-span-2 space-y-2">
<label className="block text-[10px] uppercase tracking-widest text-slate-400 font-semibold">Asunto de la Incidencia</label>
<input className="w-full bg-slate-900/50 border border-slate-700 rounded-none px-4 py-3 text-sm focus:border-electric-blue focus:ring-0 transition-colors placeholder:text-slate-600" placeholder="Ej. Error en la sincronización de leads" type="text" />
</div>
<div className="space-y-2">
<label className="block text-[10px] uppercase tracking-widest text-slate-400 font-semibold">Prioridad</label>
<select className="w-full bg-slate-900/50 border border-slate-700 rounded-none px-4 py-3 text-sm focus:border-electric-blue focus:ring-0 transition-colors appearance-none">
<option>Baja</option>
<option>Media</option>
<option>Alta</option>
<option className="text-red-500">Crítica</option>
</select>
</div>
<div className="space-y-2">
<label className="block text-[10px] uppercase tracking-widest text-slate-400 font-semibold">Relacionar Flujo</label>
<select className="w-full bg-slate-900/50 border border-slate-700 rounded-none px-4 py-3 text-sm focus:border-electric-blue focus:ring-0 transition-colors appearance-none">
<option>Ninguno</option>
<option selected="">CRM Sync</option>
<option>Data Enrichment</option>
<option>Email Automation</option>
</select>
</div>
<div className="col-span-2 space-y-2">
<label className="block text-[10px] uppercase tracking-widest text-slate-400 font-semibold">Descripción Detallada</label>
<textarea className="w-full bg-slate-900/50 border border-slate-700 rounded-none px-4 py-3 text-sm focus:border-electric-blue focus:ring-0 transition-colors placeholder:text-slate-600 resize-none" placeholder="Describe los pasos para reproducir el error..." rows="6"></textarea>
</div>
</div>
<div className="space-y-2">
<label className="block text-[10px] uppercase tracking-widest text-slate-400 font-semibold">Documentación Adjunta</label>
<div className="gradient-border p-8 flex flex-col items-center justify-center border-dashed border-2 border-transparent cursor-pointer group hover:bg-slate-900/40 transition-all">
<span className="material-symbols-outlined text-slate-500 mb-2 group-hover:text-electric-blue transition-colors">cloud_upload</span>
<p className="text-sm font-semibold text-slate-300">Subir Log o Captura</p>
<p className="text-[10px] text-slate-500 mt-1 uppercase tracking-tighter">Arrastra y suelta archivos .log, .json, .png hasta 10MB</p>
</div>
</div>
<div className="flex items-center justify-end gap-4 pt-4 border-t border-slate-800">
<button className="px-8 py-3 text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-white transition-colors" type="button">
                            Cancelar
                        </button>
<button className="px-10 py-3 bg-gradient-to-r from-electric-blue to-accent-violet text-white text-xs font-bold uppercase tracking-[0.2em] shadow-[0_0_20px_rgba(46,49,255,0.3)] hover:scale-[1.02] transition-transform" type="submit" onClick={() => navigate('/soporte/ticket')}>Enviar Ticket</button>
</div>
</form>
</section>
<aside className="w-[400px] flex flex-col gap-6">
<div className="bg-pure-black border border-slate-800 p-6">
<div className="flex items-center gap-2 mb-6">
<span className="material-symbols-outlined text-electric-blue text-sm">terminal</span>
<h2 className="text-xs font-bold uppercase tracking-widest text-white">Contexto Técnico: CRM Sync</h2>
</div>
<div className="space-y-4">
<p className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold">Últimos 3 Errores Detectados</p>
<div className="bg-slate-900/30 border-l-2 border-red-500 p-4 space-y-2">
<div className="flex justify-between items-center">
<span className="text-[10px] font-mono text-red-400">Error 500: Internal Server</span>
<span className="text-[9px] text-slate-500">14:22:01</span>
</div>
<code className="block text-[11px] font-mono text-slate-300 overflow-x-auto whitespace-nowrap">
                                &#123;"status": "fail", "reason": "Timeout mapping step #2"&#125;
                            </code>
</div>
<div className="bg-slate-900/30 border-l-2 border-red-500 p-4 space-y-2">
<div className="flex justify-between items-center">
<span className="text-[10px] font-mono text-red-400">Auth Error: API Key</span>
<span className="text-[9px] text-slate-500">14:18:45</span>
</div>
<code className="block text-[11px] font-mono text-slate-300 overflow-x-auto whitespace-nowrap">
                                &#123;"msg": "Invalid credentials provided for Salesforce"&#125;
                            </code>
</div>
<div className="bg-slate-900/30 border-l-2 border-red-500 p-4 space-y-2">
<div className="flex justify-between items-center">
<span className="text-[10px] font-mono text-red-400">Validation Fail</span>
<span className="text-[9px] text-slate-500">13:55:12</span>
</div>
<code className="block text-[11px] font-mono text-slate-300 overflow-x-auto whitespace-nowrap">
                                &#123;"field": "email", "issue": "Missing @ domain"&#125;
                            </code>
</div>
</div>
</div>
<div className="bg-slate-900/20 border border-slate-800/50 p-6">
<h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4">Información del Sistema</h3>
<div className="space-y-3 font-mono text-[10px] text-slate-500">
<div className="flex justify-between">
<span>ID de Sesión:</span>
<span className="text-slate-300">JAV-992-LAB</span>
</div>
<div className="flex justify-between">
<span>Versión Engine:</span>
<span className="text-slate-300">v2.4.1-stable</span>
</div>
<div className="flex justify-between">
<span>Región:</span>
<span className="text-slate-300">EU-WEST-1</span>
</div>
</div>
</div>
</aside>
</main>
</div>
    </>
  );
}
