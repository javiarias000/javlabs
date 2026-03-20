import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import PortalLayout from '../../components/PortalLayout';
import api from '../../services/api';
import './AutomationLogsErrorTracking.css';

const STATUS_CONFIG = {
  success: { label: 'Exito',     cls: 'text-green-500', dot: 'bg-green-500', icon: 'terminal'     },
  error:   { label: 'Error',     cls: 'text-red-500',   dot: 'bg-red-500',   icon: 'error_outline' },
  running: { label: 'Corriendo', cls: 'text-primary',   dot: 'bg-primary animate-pulse', icon: 'play_circle' },
  waiting: { label: 'Esperando', cls: 'text-slate-400', dot: 'bg-slate-500', icon: 'hourglass_empty' },
};

const calcDuration = (start, stop) => {
  if (!start || !stop) return '—';
  const ms = new Date(stop) - new Date(start);
  if (ms < 1000)  return `${ms}ms`;
  if (ms < 60000) return `${(ms/1000).toFixed(1)}s`;
  return `${Math.floor(ms/60000)}m ${Math.floor((ms%60000)/1000)}s`;
};

export default function AutomationLogsErrorTracking() {
  const navigate = useNavigate();

  const [executions, setExecutions] = useState([]);
  const [workflows,  setWorkflows]  = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error,      setError]      = useState('');
  const [lastUpdate, setLastUpdate] = useState(null);

  // Filtros
  const [filterStatus,   setFilterStatus]   = useState('');
  const [filterWorkflow, setFilterWorkflow] = useState('');
  const [limit,          setLimit]          = useState(50);
  const [page,           setPage]           = useState(1);
  const PER_PAGE = 20;

  const fetchData = useCallback(async (isRefresh = false) => {
    isRefresh ? setRefreshing(true) : setLoading(true);
    setError('');
    try {
      const [execRes, wfRes] = await Promise.all([
        api.get(`/n8n/executions?limit=${limit}${filterStatus ? `&status=${filterStatus}` : ''}${filterWorkflow ? `&workflowId=${filterWorkflow}` : ''}`),
        api.get('/n8n/workflows'),
      ]);
      const execs = execRes.data?.data || execRes.data || [];
      const wfs   = wfRes.data?.data   || wfRes.data   || [];
      setExecutions(execs);
      setWorkflows(wfs);
      setLastUpdate(new Date());
      setPage(1);
    } catch {
      setError('No se pudo conectar con n8n.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [limit, filterStatus, filterWorkflow]);

  useEffect(() => { fetchData(); }, [fetchData]);

  // Enriquecer ejecuciones con nombre del workflow
  const enriched = executions.map(e => ({
    ...e,
    workflowName: workflows.find(w => w.id === e.workflowId)?.name || e.workflowId,
  }));

  // Paginacion
  const totalPages = Math.ceil(enriched.length / PER_PAGE);
  const paginated  = enriched.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  // Stats rapidas
  const totalSuccess = executions.filter(e => e.status === 'success').length;
  const totalErrors  = executions.filter(e => e.status === 'error').length;
  const totalRunning = executions.filter(e => e.status === 'running').length;

  return (
    <PortalLayout>
      <div className="flex flex-col h-screen overflow-hidden">

        {/* Header */}
        <header className="h-16 flex items-center justify-between px-8 border-b border-primary/20 bg-background-dark/80 backdrop-blur-md z-30 flex-shrink-0">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3 text-primary">
              <span className="material-symbols-outlined text-3xl">terminal</span>
              <h1 className="font-michroma text-sm tracking-wider text-slate-100 uppercase">Logs de Ejecucion</h1>
            </div>
            <div className="h-6 w-[1px] bg-primary/20"></div>
            <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest">
              <span className="text-green-500">{totalSuccess} exitosas</span>
              <span className="text-red-400">{totalErrors} errores</span>
              {totalRunning > 0 && <span className="text-primary animate-pulse">{totalRunning} corriendo</span>}
            </div>
          </div>
          <div className="flex items-center gap-3">
            {lastUpdate && (
              <span className="text-[10px] text-slate-500 uppercase tracking-widest">
                {lastUpdate.toLocaleTimeString('es-ES')}
              </span>
            )}
            <button onClick={() => fetchData(true)} disabled={refreshing}
              className="flex items-center gap-2 px-4 py-2 border border-primary/30 text-primary hover:bg-primary/10 transition-all text-[10px] font-bold uppercase tracking-widest disabled:opacity-50">
              <span className={`material-symbols-outlined text-sm ${refreshing ? 'animate-spin' : ''}`}>refresh</span>
              {refreshing ? 'Actualizando...' : 'Refresh'}
            </button>
          </div>
        </header>

        {/* Filtros */}
        <div className="h-14 border-b border-primary/10 flex items-center px-8 gap-4 bg-background-dark/20 flex-shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Estado:</span>
            <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
              className="bg-slate-900 border border-slate-700 text-slate-300 text-[10px] px-3 py-1 uppercase tracking-widest outline-none focus:border-primary">
              <option value="">Todos</option>
              <option value="success">Exito</option>
              <option value="error">Error</option>
              <option value="running">Corriendo</option>
              <option value="waiting">Esperando</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Workflow:</span>
            <select value={filterWorkflow} onChange={e => setFilterWorkflow(e.target.value)}
              className="bg-slate-900 border border-slate-700 text-slate-300 text-[10px] px-3 py-1 uppercase tracking-widest outline-none focus:border-primary max-w-[200px]">
              <option value="">Todos</option>
              {workflows.map(w => (
                <option key={w.id} value={w.id}>{w.name.slice(0, 40)}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Mostrar:</span>
            <select value={limit} onChange={e => setLimit(Number(e.target.value))}
              className="bg-slate-900 border border-slate-700 text-slate-300 text-[10px] px-3 py-1 outline-none focus:border-primary">
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
          <div className="ml-auto flex gap-2">
            <button onClick={() => { setFilterStatus(''); setFilterWorkflow(''); setLimit(50); }}
              className="px-4 py-1 border border-slate-700 text-[10px] uppercase tracking-widest text-slate-400 hover:text-white transition-all">
              Limpiar
            </button>
            <button onClick={() => fetchData(true)} disabled={refreshing}
              className="px-6 py-1 bg-primary text-white text-[10px] uppercase font-bold tracking-widest hover:brightness-110 transition-all disabled:opacity-50">
              Actualizar
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mx-8 mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded flex items-center gap-2 flex-shrink-0">
            <span className="material-symbols-outlined text-red-400 text-sm">error</span>
            <p className="text-xs text-red-400">{error}</p>
          </div>
        )}

        {/* Tabla */}
        <div className="flex-1 overflow-auto custom-scrollbar p-8">
          {loading ? (
            <div className="flex items-center justify-center h-48 text-slate-500">
              <span className="material-symbols-outlined animate-spin mr-2">progress_activity</span>
              Conectando con n8n...
            </div>
          ) : enriched.length === 0 ? (
            <div className="text-center py-20 text-slate-500">
              <span className="material-symbols-outlined text-5xl mb-4 block">inbox</span>
              <p className="text-sm uppercase tracking-widest">No hay ejecuciones registradas</p>
            </div>
          ) : (
            <>
              <table className="w-full border-collapse">
                <thead>
                  <tr className="text-left border-b border-slate-700">
                    {['ID', 'Workflow', 'Inicio', 'Duracion', 'Estado', 'Accion'].map(h => (
                      <th key={h} className="pb-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest px-4">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="text-sm font-medium">
                  {paginated.map(exec => {
                    const cfg = STATUS_CONFIG[exec.status] || STATUS_CONFIG.waiting;
                    const dur = calcDuration(exec.startedAt, exec.stoppedAt);
                    return (
                      <tr key={exec.id} className="border-b border-slate-800 hover:bg-white/5 transition-colors cursor-pointer group">
                        <td className={`py-4 px-4 font-mono text-xs ${exec.status === 'error' ? 'text-red-400' : 'text-primary'}`}>
                          #{exec.id}
                        </td>
                        <td className="py-4 px-4 max-w-[220px]">
                          <p className="text-slate-200 truncate text-sm">{exec.workflowName}</p>
                          <p className="text-slate-600 text-[10px] font-mono mt-0.5">{exec.workflowId}</p>
                        </td>
                        <td className="py-4 px-4 text-slate-400 text-xs">
                          {exec.startedAt ? new Date(exec.startedAt).toLocaleString('es', { dateStyle: 'short', timeStyle: 'short' }) : '—'}
                        </td>
                        <td className="py-4 px-4 text-slate-400 text-xs font-mono">{dur}</td>
                        <td className="py-4 px-4">
                          <span className={`flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest ${cfg.cls}`}>
                            <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`}></span>
                            {cfg.label}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <span className={`material-symbols-outlined ${exec.status === 'error' ? 'text-red-600' : 'text-slate-600 group-hover:text-primary'} transition-colors`}>
                              {cfg.icon}
                            </span>
                            {exec.status === 'error' && (
                              <button onClick={() => navigate(`/automatizaciones/errores`)}
                                className="text-[10px] text-red-400 hover:text-red-300 uppercase tracking-widest font-bold transition-colors">
                                Ver
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {/* Paginacion */}
              {totalPages > 1 && (
                <div className="mt-8 flex justify-between items-center text-slate-500 text-xs uppercase tracking-widest">
                  <span>Mostrando {Math.min(page * PER_PAGE, enriched.length)} de {enriched.length}</span>
                  <div className="flex items-center gap-2">
                    <button onClick={() => setPage(p => p - 1)} disabled={page === 1}
                      className="p-2 border border-slate-700 hover:border-primary transition-colors disabled:opacity-30">
                      <span className="material-symbols-outlined text-sm">chevron_left</span>
                    </button>
                    {[...Array(Math.min(totalPages, 5))].map((_, i) => (
                      <button key={i} onClick={() => setPage(i + 1)}
                        className={`w-8 h-8 border text-xs font-bold transition-colors ${page === i + 1 ? 'border-primary bg-primary/20 text-white' : 'border-slate-700 hover:border-primary'}`}>
                        {i + 1}
                      </button>
                    ))}
                    <button onClick={() => setPage(p => p + 1)} disabled={page === totalPages}
                      className="p-2 border border-slate-700 hover:border-primary transition-colors disabled:opacity-30">
                      <span className="material-symbols-outlined text-sm">chevron_right</span>
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </PortalLayout>
  );
}
