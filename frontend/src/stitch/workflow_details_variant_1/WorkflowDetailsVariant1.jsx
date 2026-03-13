import { Link, useNavigate } from 'react-router-dom';
import PortalLayout from '../../components/PortalLayout';
import './WorkflowDetailsVariant1.css';

export default function WorkflowDetailsVariant1() {
  const navigate = useNavigate();
  return (
    <PortalLayout>
      <div className="flex flex-col min-h-screen">
        <main className="flex-1 p-8 max-w-[1440px] mx-auto w-full">

          <div className="mb-8">
            <div className="flex items-center gap-2 font-montserrat text-sm text-slate-500 mb-2">
              <span>Proyectos</span>
              <span className="material-symbols-outlined text-xs">chevron_right</span>
              <span className="text-primary">CRM Sync</span>
            </div>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <h1 className="font-michroma text-2xl lg:text-3xl text-slate-100 uppercase tracking-tight">DETALLES DEL FLUJO: CRM SYNC</h1>
              <div className="flex items-center gap-3">
                <button className="px-6 py-2 bg-slate-800 text-sm font-bold uppercase tracking-wider hover:bg-slate-700 transition-colors">Pausar</button>
                <button className="px-6 py-2 bg-primary text-white text-sm font-bold uppercase tracking-wider hover:bg-blue-600 transition-colors">Editar Flujo</button>
              </div>
            </div>
          </div>

          <div className="w-full border-y border-slate-800 py-3 mb-10 flex items-center justify-between px-4">
            <div className="flex items-center gap-3">
              <div className="size-2 rounded-full bg-primary glow-dot"></div>
              <span className="text-xs font-bold uppercase tracking-widest text-primary">Estado: Activo</span>
            </div>
            <div className="text-[10px] text-slate-500 uppercase tracking-widest font-medium">Última sincronización: Hace 2 minutos</div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8">
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-6">Visualización de Pasos</h3>
              <div className="flex flex-col">
                {[
                  { tag: 'Trigger', icon: 'bolt',       title: 'Nuevo Lead',          desc: 'Origen: Webhook / landing-page-main'                            },
                  { tag: 'Filtro',  icon: 'filter_alt', title: 'Región: LATAM',        desc: "Condición: country_code matches ['MX', 'CO', 'CL', 'PE']"       },
                  { tag: 'Acción',  icon: 'cloud_sync', title: 'Crear en Salesforce',  desc: 'Objeto: Lead / Mapping: Standard V2'                            },
                ].map((step, i) => (
                  <div key={step.tag}>
                    <div className="w-full max-w-md bg-slate-900 p-6 border border-slate-800 gradient-top-border">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-[10px] font-bold text-primary uppercase tracking-tighter">{step.tag}</span>
                        <span className="material-symbols-outlined text-slate-400 text-lg">{step.icon}</span>
                      </div>
                      <h4 className="font-michroma text-sm text-slate-100 mb-1">{step.title}</h4>
                      <p className="text-xs text-slate-500">{step.desc}</p>
                    </div>
                    {i < 2 && <div className="workflow-line"></div>}
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col gap-4">
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Métricas de Rendimiento</h3>
              {[
                { label: 'Ejecuciones Totales', value: '12,842', sub: null,                          bar: 75  },
                { label: 'Tasa de Éxito',       value: '99.8%',  sub: '+0.2% vs semana anterior',   bar: 99  },
                { label: 'Tiempo Ahorrado',      value: '420h',   sub: 'Calculado según proceso manual estándar.', bar: null },
              ].map(m => (
                <div key={m.label} className="bg-slate-900/50 border border-slate-800 p-6">
                  <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">{m.label}</p>
                  <p className="font-michroma text-2xl text-slate-100">{m.value}</p>
                  {m.bar && <div className="mt-4 h-1 bg-slate-800"><div className="h-1 bg-primary" style={{ width: `${m.bar}%` }}></div></div>}
                  {m.sub && <p className="text-[10px] text-primary mt-2 flex items-center gap-1 uppercase tracking-tighter"><span className="material-symbols-outlined text-xs">trending_up</span> {m.sub}</p>}
                  {!m.bar && !m.sub && null}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-16">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500">Logs de Ejecución en Tiempo Real</h3>
              <button onClick={() => navigate('/automatizaciones/logs')} className="text-[10px] uppercase font-bold text-primary flex items-center gap-1">
                Ver todos los logs <span className="material-symbols-outlined text-xs">arrow_forward</span>
              </button>
            </div>
            <div className="overflow-x-auto border border-slate-800">
              <table className="w-full text-left border-collapse bg-slate-900">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-900/50">
                    {['Timestamp', 'Execution ID', 'Event', 'Duration', 'Status'].map(h => (
                      <th key={h} className={`p-4 text-[10px] uppercase font-bold text-slate-400 tracking-wider ${h === 'Status' ? 'text-right' : ''}`}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="text-xs font-montserrat">
                  {[
                    { ts: '2023-10-24 14:30:05', id: '#EXE-882190', event: 'Lead Conversion: Juan Perez',      dur: '1.2s',  status: 'Success', cls: 'bg-emerald-500/10 text-emerald-500' },
                    { ts: '2023-10-24 14:28:12', id: '#EXE-882189', event: 'Lead Conversion: Maria Garcia',    dur: '0.9s',  status: 'Success', cls: 'bg-emerald-500/10 text-emerald-500' },
                    { ts: '2023-10-24 14:25:01', id: '#EXE-882188', event: 'Filter Rejected: Out of Region',   dur: '0.1s',  status: 'Skipped', cls: 'bg-slate-500/10 text-slate-500'     },
                    { ts: '2023-10-24 14:22:44', id: '#EXE-882187', event: 'API Timeout: Salesforce Auth',     dur: '15.0s', status: 'Error',   cls: 'bg-rose-500/10 text-rose-500'       },
                  ].map(row => (
                    <tr key={row.id} className="border-b border-slate-900 hover:bg-slate-900/30 transition-colors">
                      <td className="p-4 text-slate-500">{row.ts}</td>
                      <td className="p-4 font-mono text-slate-400">{row.id}</td>
                      <td className="p-4 text-slate-300">{row.event}</td>
                      <td className="p-4 text-slate-500">{row.dur}</td>
                      <td className="p-4 text-right">
                        <span className={`px-2 py-1 font-bold uppercase text-[9px] ${row.cls}`}>{row.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>

        <footer className="mt-20 border-t border-slate-800 p-8 flex justify-between items-center opacity-50">
          <div className="text-[10px] uppercase tracking-widest font-bold">JAV LABS AUTOMATION ENGINE v4.2.0</div>
          <div className="flex gap-4">
            <span className="material-symbols-outlined text-sm">terminal</span>
            <span className="material-symbols-outlined text-sm">settings_ethernet</span>
            <span className="material-symbols-outlined text-sm">database</span>
          </div>
        </footer>
      </div>
    </PortalLayout>
  );
}
