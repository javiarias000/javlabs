import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PortalLayout from '../../components/PortalLayout';
import api from '../../services/api';
import './AutomationManagementTable.css';

export default function AutomationManagementTable() {
  const navigate = useNavigate();
  const [workflows, setWorkflows] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get('/n8n/workflows');
      setWorkflows(res.data?.data || res.data || []);
    } catch (error) {
      console.error('Error fetching workflows:', error);
      setWorkflows([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Calcular estadísticas globales desde workflows reales
  const totalWorkflows = workflows.length;
  const activeWorkflows = workflows.filter(w => w.active).length;
  const totalExecutions = workflows.reduce((sum, wf) => sum + (wf.executionCount || 0), 0);
  const avgSuccessRate = totalWorkflows > 0
    ? Math.round(workflows.reduce((sum, wf) => sum + (wf.successRate || 0), 0) / totalWorkflows)
    : 0;

  // Mapear n8n workflows a formato de tabla
  const tableData = workflows.map(wf => ({
    id: `0x${wf.id.slice(-4).toUpperCase()}`,
    name: wf.name,
    trigger: wf.webhookUrl ? 'WEBHOOK' : wf.schedule ? 'SCHEDULE' : 'MANUAL',
    rate: wf.successRate || 0,
    status: wf.active ? 'Active' : 'Inactive',
    statusClass: wf.active ? 'text-emerald-500' : 'text-slate-500',
    lastRun: wf.updatedAt ? new Date(wf.updatedAt).toLocaleString('es-ES', { dateStyle: 'short', timeStyle: 'short' }) : '—',
    wfId: wf.id,
  })).sort((a, b) => b.rate - a.rate).slice(0, 20);

  return (
    <PortalLayout>
      <header className="border-b border-slate-800 bg-background-dark/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-[1440px] mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-12">
            <div className="flex items-center gap-3">
              <div className="size-8 gradient-primary flex items-center justify-center">
                <span className="material-symbols-outlined text-white text-xl">terminal</span>
              </div>
              <h1 className="text-xl font-bold tracking-tighter text-white">JAV LABS</h1>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <button onClick={() => navigate('/automatizaciones/nueva')} className="gradient-primary px-6 py-2 text-xs font-bold tracking-widest uppercase text-white hover:opacity-90 transition-opacity flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">add</span>
              Nueva Automatización
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-[1440px] mx-auto w-full px-6 py-8">
        <div className="grid grid-cols-4 gap-px bg-slate-800 border border-slate-800 mb-8">
          <div className="bg-background-dark p-4 flex flex-col gap-1">
            <span className="text-[10px] text-slate-500 font-bold tracking-[0.2em] uppercase">Total Workflows</span>
            <div className="flex items-end justify-between">
              <span className="text-2xl font-bold text-white tracking-tighter">{totalWorkflows}</span>
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
              <span className="text-2xl font-bold text-white tracking-tighter">{activeWorkflows}</span>
              <span className="text-emerald-500 text-xs font-bold">{totalWorkflows > 0 ? Math.round((activeWorkflows/totalWorkflows)*100) : 0}%</span>
            </div>
          </div>
          <div className="bg-background-dark p-4 flex flex-col gap-1">
            <span className="text-[10px] text-slate-500 font-bold tracking-[0.2em] uppercase">Avg Success Rate</span>
            <div className="flex items-end justify-between">
              <span className="text-2xl font-bold text-white tracking-tighter">{avgSuccessRate}%</span>
            </div>
          </div>
          <div className="bg-background-dark p-4 flex flex-col gap-1">
            <span className="text-[10px] text-slate-500 font-bold tracking-[0.2em] uppercase">Total Executions</span>
            <div className="flex items-end justify-between">
              <span className="text-2xl font-bold text-white tracking-tighter">{totalExecutions.toLocaleString()}</span>
              <span className="text-primary text-xs font-bold">FROM N8N</span>
            </div>
          </div>
        </div>

        <div className="bg-background-dark border border-slate-800">
          <div className="p-4 border-b border-slate-800 flex justify-between items-center">
            <h2 className="text-xs font-bold tracking-[0.3em] uppercase text-slate-400">Active Automations Registry</h2>
            <div className="flex gap-2">
              <button onClick={fetchData} className="p-1 hover:bg-slate-900 text-slate-500" title="Refresh">
                <span className="material-symbols-outlined text-lg">refresh</span>
              </button>
            </div>
          </div>
          {loading ? (
            <div className="p-12 text-center text-slate-500">
              <span className="material-symbols-outlined animate-spin text-4xl block mb-3">progress_activity</span>
              Cargando workflows...
            </div>
          ) : tableData.length === 0 ? (
            <div className="p-12 text-center text-slate-500">
              <span className="material-symbols-outlined text-4xl block mb-3">inbox</span>
              <p className="text-sm uppercase tracking-widest">No hay workflows configurados</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-900/50">
                      <th className="px-6 py-4 text-[10px] font-bold tracking-widest text-slate-500 uppercase border-b border-slate-800">ID</th>
                      <th className="px-6 py-4 text-[10px] font-bold tracking-widest text-slate-500 uppercase border-b border-slate-800">Name</th>
                      <th className="px-6 py-4 text-[10px] font-bold tracking-widest text-slate-500 uppercase border-b border-slate-800">Trigger</th>
                      <th className="px-6 py-4 text-[10px] font-bold tracking-widest text-slate-500 uppercase border-b border-slate-800">Success Rate</th>
                      <th className="px-6 py-4 text-[10px] font-bold tracking-widest text-slate-500 uppercase border-b border-slate-800">Status</th>
                      <th className="px-6 py-4 text-[10px] font-bold tracking-widest text-slate-500 uppercase border-b border-slate-800">Last Run</th>
                      <th className="px-6 py-4 text-[10px] font-bold tracking-widest text-slate-500 uppercase border-b border-slate-800 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-900">
                    {tableData.map(row => (
                      <tr key={row.id} className="group hover:bg-slate-900/30 transition-colors">
                        <td className="px-6 py-5 font-mono text-xs text-slate-500 tracking-wider">{row.id}</td>
                        <td className="px-6 py-5 font-bold text-sm tracking-tight">{row.name}</td>
                        <td className="px-6 py-5"><span className="bg-slate-800 px-2 py-1 text-[10px] font-bold text-slate-300 tracking-widest">{row.trigger}</span></td>
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <div className="w-24 h-1 bg-slate-800"><div className="h-full bg-primary" style={{ width: `${row.rate}%` }}></div></div>
                            <span className="text-xs font-bold text-white">{row.rate}%</span>
                          </div>
                        </td>
                        <td className="px-6 py-5"><span className={`text-[10px] font-bold uppercase tracking-widest ${row.statusClass}`}>{row.status}</span></td>
                        <td className="px-6 py-5 text-xs text-slate-400">{row.lastRun}</td>
                        <td className="px-6 py-5 text-right">
                          <button onClick={() => navigate(`/workflow/${row.wfId}`)} className="text-primary text-[10px] font-bold tracking-widest uppercase hover:underline">Inspect</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="p-4 border-t border-slate-800 flex justify-between items-center text-[10px] text-slate-500 font-bold tracking-widest uppercase">
                <span>Showing {tableData.length} of {totalWorkflows} Workflows</span>
                <div className="flex gap-4">
                  <button className="text-slate-500 cursor-not-allowed flex items-center gap-1" disabled>
                    <span className="material-symbols-outlined text-sm">chevron_left</span> Previous
                  </button>
                  <button className="text-slate-500 cursor-not-allowed flex items-center gap-1" disabled>
                    Next <span className="material-symbols-outlined text-sm">chevron_right</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </main>

      <footer className="border-t border-slate-800 bg-background-dark py-6 px-6">
        <div className="max-w-[1440px] mx-auto flex justify-between items-center opacity-50">
          <div className="text-[10px] tracking-[0.3em] font-bold uppercase">© 2026 JAV LABS Automation Platform</div>
          <div className="flex gap-8 text-[10px] tracking-[0.3em] font-bold uppercase">
            <a href="/soporte/chat" className="hover:text-white">Soporte</a>
          </div>
        </div>
      </footer>
    </PortalLayout>
  );
}
