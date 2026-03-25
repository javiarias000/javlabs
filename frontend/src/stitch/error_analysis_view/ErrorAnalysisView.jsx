import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PortalLayout from '../../components/PortalLayout';
import api from '../../services/api';
import './ErrorAnalysisView.css';

export default function ErrorAnalysisView() {
  const navigate = useNavigate();
  const [executions, setExecutions] = useState([]);
  const [workflows, setWorkflows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);

  // Filtros
  const [filterStatus, setFilterStatus] = useState('error'); // Por defecto solo errores
  const [limit, setLimit] = useState(50);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [execRes, wfRes] = await Promise.all([
        api.get(`/n8n/executions?limit=${limit}${filterStatus ? `&status=${filterStatus}` : ''}`),
        api.get('/n8n/workflows'),
      ]);
      const execs = execRes.data?.data || execRes.data || [];
      const wfs = wfRes.data?.data || wfRes.data || [];
      setExecutions(execs);
      setWorkflows(wfs);
      setLastUpdate(new Date());
    } catch (err) {
      console.error('Error fetching execution data:', err);
      setError('No se pudo conectar con n8n para obtener datos de ejecución.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000); // Polling cada 10s
    return () => clearInterval(interval);
  }, [filterStatus, limit]);

  // Enriquecer ejecuciones con nombre del workflow
  const enriched = executions.map(e => ({
    ...e,
    workflowName: workflows.find(w => w.id === e.workflowId)?.name || e.workflowId,
  }));

  // Stats rápidas
  const totalErrors = enriched.length;
  const criticalErrors = enriched.filter(e => e.status === 'error').length;
  const workflowsWithErrors = [...new Set(enriched.map(e => e.workflowId))].length;
  const avgSuccessRate = workflows.length > 0
    ? Math.round(workflows.reduce((sum, wf) => sum + (wf.successRate || 0), 0) / workflows.length)
    : 0;

  if (loading && executions.length === 0) {
    return (
      <PortalLayout>
        <div className="flex items-center justify-center h-screen text-slate-500">
          <span className="material-symbols-outlined animate-spin mr-2">progress_activity</span>
          Analizando incidencias del sistema...
        </div>
      </PortalLayout>
    );
  }

  if (error && executions.length === 0) {
    return (
      <PortalLayout>
        <div className="p-8">
          <div className="p-4 bg-red-500/10 border border-red-500/30 rounded flex items-center gap-3 mb-4">
            <span className="material-symbols-outlined text-red-400">error</span>
            <p className="text-sm text-red-400">{error}</p>
          </div>
          <button onClick={fetchData} className="text-primary hover:underline text-sm">
            Reintentar conexión
          </button>
        </div>
      </PortalLayout>
    );
  }

  return (
    <PortalLayout>
      <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden technical-grid">
        <main className="flex-1 flex flex-col p-8 gap-8 max-w-[1600px] mx-auto w-full">

          <div className="flex flex-col gap-2">
            <h1 className="font-michroma text-4xl text-slate-100 tracking-tight uppercase">Análisis de Incidencias</h1>
            <div className="flex items-center gap-4">
              <span className="h-px w-12 bg-primary"></span>
              <p className="text-slate-500 text-xs uppercase tracking-[0.2em]">
                Monitoreo en tiempo real de errores en automatizaciones n8n
                {lastUpdate && <span className="ml-2 text-primary">· Actualizado: {lastUpdate.toLocaleTimeString('es-ES')}</span>}
              </p>
            </div>
          </div>

          {/* Métricas en tiempo real */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-navy-muted border-l-4 border-error-glow p-6 flex flex-col gap-1 hover:bg-slate-900 transition-colors">
              <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Errores Detectados</span>
              <div className="flex items-end gap-2">
                <span className="text-3xl font-bold text-slate-100">{criticalErrors}</span>
                <span className="text-red-400 text-xs mb-1">{totalErrors > 0 ? '▼ Activos' : '✓ Ninguno'}</span>
              </div>
              <div className="w-full bg-slate-800 h-1 mt-4"><div className="bg-error-glow h-full" style={{ width: `${Math.min(totalErrors * 10, 100)}%` }}></div></div>
            </div>
            <div className="bg-navy-muted border-l-4 border-primary p-6 flex flex-col gap-1 hover:bg-slate-900 transition-colors">
              <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Workflows Afectados</span>
              <div className="flex items-end gap-2">
                <span className="text-3xl font-bold text-slate-100">{workflowsWithErrors}</span>
                <span className="text-slate-400 text-xs mb-1">de {workflows.length}</span>
              </div>
              <div className="w-full bg-slate-800 h-1 mt-4"><div className="bg-primary h-full" style={{ width: `${workflows.length > 0 ? (workflowsWithErrors/workflows.length)*100 : 0}%` }}></div></div>
            </div>
            <div className="bg-navy-muted border-l-4 border-amber-500 p-6 flex flex-col gap-1 hover:bg-slate-900 transition-colors">
              <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Tasa de Éxito Global</span>
              <div className="flex items-end gap-2">
                <span className="text-3xl font-bold text-slate-100">{avgSuccessRate}%</span>
                <span className="text-emerald-500 text-xs mb-1">{avgSuccessRate >= 95 ? '✓ Excelente' : avgSuccessRate >= 80 ? '▲ Aceptable' : '▼ Crítico'}</span>
              </div>
              <div className="w-full bg-slate-800 h-1 mt-4"><div className={`h-full ${avgSuccessRate >= 90 ? 'bg-emerald-500' : avgSuccessRate >= 70 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${avgSuccessRate}%` }}></div></div>
            </div>
            <div className="bg-navy-muted border-l-4 border-slate-400 p-6 flex flex-col gap-1 hover:bg-slate-900 transition-colors">
              <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Última Ejecución</span>
              <div className="flex items-end gap-2">
                <span className="text-xl font-bold text-slate-100">{lastUpdate ? lastUpdate.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : '—'}</span>
              </div>
              <div className="flex items-center gap-2 mt-4">
                <span className={`relative flex h-2 w-2 ${executions.length > 0 ? 'bg-green-500' : 'bg-slate-500'}`}>
                  {executions.length > 0 && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>}
                </span>
                <span className="text-[10px] text-slate-400">Sistema {executions.length > 0 ? 'conectado' : 'esperando datos'}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-1 flex flex-col gap-4">
              <h3 className="font-michroma text-[10px] text-slate-500 uppercase tracking-widest mb-2">Error Stream (Últimos {Math.min(totalErrors, 10)})</h3>
              <div className="flex flex-col border-l border-slate-800 ml-3">
                {enriched.length === 0 ? (
                  <div className="p-6 text-center text-slate-500 text-sm">No hay errores registrados</div>
                ) : (
                  enriched.slice(0, 10).map((exec, i) => (
                    <div key={exec.id} className={`relative pl-8 pb-6 group ${exec.status !== 'error' ? 'opacity-60' : ''}`}>
                      <div className={`absolute left-[-6px] top-1 rotate-45 ${exec.status === 'error' ? 'w-3 h-3 bg-error-glow glow-diamond' : 'w-2 h-2 bg-slate-600'}`}></div>
                      <div className={`p-4 border ${exec.status === 'error' ? 'bg-red-500/5 border-red-500/30' : 'bg-slate-900/50 border-slate-800'}`}>
                        <div className="flex justify-between items-start mb-1">
                          <span className={`text-xs font-bold uppercase tracking-tighter ${exec.status === 'error' ? 'text-red-400' : 'text-slate-300'}`}>
                            {exec.status === 'error' ? 'FAIL' : exec.status.toUpperCase()}
                          </span>
                          <span className="text-[10px] font-mono text-slate-500 tracking-tighter">
                            #{exec.id} · {exec.startedAt ? new Date(exec.startedAt).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }) : '—'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-[10px] text-slate-400 font-mono">{exec.workflowName}</span>
                        </div>
                        {exec.status === 'error' && (
                          <div className="mt-2 flex gap-2">
                            <button onClick={() => navigate(`/workflow/${exec.workflowId}`)} className="text-[9px] px-2 py-1 bg-red-500/10 border border-red-500/30 text-red-400 uppercase tracking-widest hover:bg-red-500/20 transition-all">
                              Inspeccionar Workflow
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="lg:col-span-2 flex flex-col gap-4 h-full">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-michroma text-[10px] text-slate-500 uppercase tracking-widest">Ejecuciones Recientes con Errores</h3>
                <div className="flex gap-4">
                  <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="bg-slate-900 border border-slate-700 text-slate-300 text-[9px] px-3 py-1 uppercase tracking-widest outline-none focus:border-primary">
                    <option value="error">Solo Errores</option>
                    <option value="">Todos los Estados</option>
                    <option value="running">Corriendo</option>
                    <option value="success">Exitosos</option>
                    <option value="waiting">En Espera</option>
                  </select>
                  <button onClick={fetchData} className="text-[9px] px-3 py-1 border border-primary/30 text-primary hover:bg-primary/10 transition-all">
                    <span className="material-symbols-outlined text-sm align-middle mr-1">refresh</span>
                    Refresh
                  </button>
                </div>
              </div>
              <div className="flex flex-col border border-slate-800 bg-background-dark h-[600px] overflow-hidden">
                <div className="flex divide-x divide-slate-800 border-b border-slate-800 bg-navy-muted">
                  <div className="flex-1 px-4 py-2 flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Workflow</span>
                    <span className="material-symbols-outlined text-sm text-slate-600">terminal</span>
                  </div>
                  <div className="flex-1 px-4 py-2 flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Estado</span>
                    <span className="material-symbols-outlined text-sm text-primary">circle</span>
                  </div>
                  <div className="flex-1 px-4 py-2 flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Inicio</span>
                    <span className="material-symbols-outlined text-sm text-slate-600">schedule</span>
                  </div>
                  <div className="flex-1 px-4 py-2 flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Duración</span>
                    <span className="material-symbols-outlined text-sm text-slate-600">timer</span>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto font-mono text-xs">
                  {loading ? (
                    <div className="flex items-center justify-center h-full text-slate-500">
                      <span className="material-symbols-outlined animate-spin mr-2">progress_activity</span>
                      Cargando ejecuciones...
                    </div>
                  ) : enriched.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-slate-500">No hay datos</div>
                  ) : (
                    <table className="w-full border-collapse">
                      <tbody>
                        {enriched.slice(0, 50).map(exec => {
                          const dur = (() => {
                            if (!exec.startedAt || !exec.stoppedAt) return 'Running...';
                            const ms = new Date(exec.stoppedAt) - new Date(exec.startedAt);
                            if (ms < 1000) return `${ms}ms`;
                            if (ms < 60000) return `${(ms/1000).toFixed(1)}s`;
                            return `${Math.floor(ms/60000)}m ${Math.floor((ms%60000)/1000)}s`;
                          })();
                          return (
                            <tr key={exec.id} className={`border-b border-slate-800 hover:bg-white/5 transition-colors ${exec.status === 'error' ? 'bg-red-500/5' : ''}`}>
                              <td className="px-4 py-3 text-slate-300 max-w-[200px] truncate" title={exec.workflowName}>
                                <div className="flex items-center gap-2">
                                  <span className={`material-symbols-outlined text-sm ${exec.status === 'error' ? 'text-red-400' : 'text-slate-500'}`}>
                                    {exec.status === 'error' ? 'error_outline' : exec.status === 'running' ? 'play_circle' : 'check_circle'}
                                  </span>
                                  {exec.workflowName}
                                </div>
                                <span className="text-[10px] font-mono text-slate-600 block">{exec.workflowId.slice(0, 12)}...</span>
                              </td>
                              <td className="px-4 py-3">
                                <span className={`flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest ${
                                  exec.status === 'error' ? 'text-red-400' :
                                  exec.status === 'running' ? 'text-primary' :
                                  exec.status === 'success' ? 'text-emerald-500' : 'text-slate-400'
                                }`}>
                                  <span className={`h-1.5 w-1.5 rounded-full ${
                                    exec.status === 'error' ? 'bg-red-500' :
                                    exec.status === 'running' ? 'bg-primary animate-pulse' :
                                    exec.status === 'success' ? 'bg-emerald-500' : 'bg-slate-500'
                                  }`}></span>
                                  {exec.status === 'error' ? 'ERROR' : exec.status}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-slate-400 text-[10px]">
                                {exec.startedAt ? new Date(exec.startedAt).toLocaleString('es-ES', { dateStyle: 'short', timeStyle: 'short' }) : '—'}
                              </td>
                              <td className="px-4 py-3 text-slate-400 text-[10px] font-mono">{dur}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  )}
                </div>
                <div className="bg-navy-muted border-t border-slate-800 px-4 py-2 flex justify-between items-center text-[10px] text-slate-500">
                  <span>Mostrando {enriched.length} ejecuciones</span>
                  <span className="font-mono">n8n API · {new Date().toLocaleTimeString('es-ES')}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-800 py-4 flex flex-wrap justify-between items-center gap-4 text-[10px] text-slate-500">
            <div className="flex gap-8">
              <div className="flex flex-col">
                <span className="text-[9px] font-bold uppercase tracking-widest">Core Engine</span>
                <span className="text-xs text-emerald-500 font-mono">Operational</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] font-bold uppercase tracking-widest">n8n Status</span>
                <span className="text-xs text-emerald-500 font-mono">Connected</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] font-bold uppercase tracking-widest">Uptime</span>
                <span className="text-xs text-slate-300 font-mono">99.98%</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span>© 2024 JAV LABS Automation Agency</span>
              <span className="h-3 w-px bg-slate-800"></span>
              <span>System v4.0.12-build-88</span>
            </div>
          </div>

        </main>
      </div>
    </PortalLayout>
  );
}
