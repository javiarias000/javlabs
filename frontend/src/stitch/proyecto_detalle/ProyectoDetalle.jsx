import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PortalLayout from '../../components/PortalLayout';
import api from '../../services/api';

const N8N_URL = 'https://n8n-n8n.ak7rlh.easypanel.host';
const fmt = (n) => (n >= 1000 ? n.toLocaleString('es-ES') : String(n ?? 0));

export default function ProyectoDetalle() {
  const { key }       = useParams();
  const navigate      = useNavigate();
  const [data,        setData]        = useState(null);
  const [loading,     setLoading]     = useState(true);
  const [refreshing,  setRefreshing]  = useState(false);
  const [error,       setError]       = useState('');
  const [lastUpdate,  setLastUpdate]  = useState(null);
  const [toggling,    setToggling]    = useState(null);

  const fetchData = useCallback(async (isRefresh = false) => {
    isRefresh ? setRefreshing(true) : setLoading(true);
    setError('');
    try {
      const { data: res } = await api.get(`/n8n/projects/${key}`);
      setData(res);
      setLastUpdate(new Date());
    } catch {
      setError('No se pudo cargar el proyecto.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [key]);

  useEffect(() => {
    fetchData();
    // Auto-refresh cada 30 segundos
    const interval = setInterval(() => fetchData(true), 30000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const toggleWorkflow = async (wf) => {
    setToggling(wf.id);
    try {
      const action = wf.active ? 'deactivate' : 'activate';
      await api.patch(`/n8n/workflows/${wf.id}/${action}`);
      await fetchData(true);
    } catch {
      setError('Error al cambiar el estado.');
    } finally {
      setToggling(null);
    }
  };

  if (loading) return (
    <PortalLayout>
      <div className="flex items-center justify-center min-h-screen text-slate-500">
        <span className="material-symbols-outlined animate-spin mr-2 text-4xl">progress_activity</span>
      </div>
    </PortalLayout>
  );

  if (error || !data) return (
    <PortalLayout>
      <div className="flex flex-col items-center justify-center min-h-screen gap-4 text-slate-500">
        <span className="material-symbols-outlined text-5xl">error</span>
        <p>{error || 'Proyecto no encontrado.'}</p>
        <button onClick={() => navigate('/dashboard/performance')}
          className="px-6 py-2 bg-primary text-white rounded text-sm font-bold uppercase">
          Volver
        </button>
      </div>
    </PortalLayout>
  );

  const { stats, workflows, recentExecutions, name } = data;
  const successRate = stats?.successRate ?? 0;
  const activeCount = workflows?.filter(w => w.active).length ?? 0;

  return (
    <PortalLayout>
      <div className="flex-1 overflow-y-auto p-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
              <button onClick={() => navigate('/dashboard/performance')} className="hover:text-primary transition-colors">
                Rendimiento
              </button>
              <span className="material-symbols-outlined text-xs">chevron_right</span>
              <span className="text-primary font-semibold">{name}</span>
            </div>
            <h1 className="font-michroma text-2xl text-white uppercase tracking-tight">{name}</h1>
            <p className="text-slate-500 text-xs mt-1">
              {lastUpdate ? `Actualizado: ${lastUpdate.toLocaleTimeString('es-ES')}` : ''}
              {' '}{refreshing && <span className="text-primary">• Actualizando...</span>}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => fetchData(true)} disabled={refreshing}
              className="flex items-center gap-2 px-4 py-2 border border-primary/30 text-primary hover:bg-primary/10 transition-all text-[10px] font-bold uppercase tracking-widest disabled:opacity-50">
              <span className={`material-symbols-outlined text-sm ${refreshing ? 'animate-spin' : ''}`}>refresh</span>
              Refresh
            </button>
            <a href={`${N8N_URL}`} target="_blank" rel="noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-[10px] font-bold uppercase tracking-widest hover:opacity-90 transition-all">
              <span className="material-symbols-outlined text-sm">open_in_new</span>
              Abrir n8n
            </a>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          {[
            { label: 'Total Ejecuciones', value: fmt(stats?.total),   icon: 'rocket_launch', color: 'from-primary to-blue-900',     text: `${activeCount} workflows activos`          },
            { label: 'Exitosas',          value: fmt(stats?.success), icon: 'verified',      color: 'from-emerald-500 to-teal-800', text: `${successRate}% tasa de exito`             },
            { label: 'Errores',           value: fmt(stats?.errors),  icon: 'warning',       color: 'from-amber-500 to-orange-800', text: `${stats?.errors > 0 ? 'Requiere atencion' : 'Sin errores'}` },
            { label: 'Tiempo Promedio',   value: stats?.avgTimeSeconds ? `${stats.avgTimeSeconds}s` : 'N/A', icon: 'speed', color: 'from-purple-600 to-indigo-900', text: 'Por ejecucion' },
          ].map(kpi => (
            <div key={kpi.label} className="bg-neutral-dark border border-primary/10 p-6 flex flex-col justify-between group hover:border-primary transition-colors">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs uppercase tracking-widest text-slate-500 font-bold">{kpi.label}</p>
                  <h3 className="text-3xl font-bold mt-2 text-white">{kpi.value}</h3>
                </div>
                <div className={`w-10 h-10 bg-gradient-to-br ${kpi.color} flex items-center justify-center`}>
                  <span className="material-symbols-outlined text-white">{kpi.icon}</span>
                </div>
              </div>
              <p className="text-xs text-slate-400 mt-4">{kpi.text}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

          {/* Workflows */}
          <div className="xl:col-span-2 space-y-6">
            <div className="bg-neutral-dark border border-primary/10 overflow-hidden">
              <div className="px-6 py-4 bg-primary/5 border-b border-primary/10 flex justify-between items-center">
                <h4 className="font-michroma text-xs text-white uppercase tracking-wider">Workflows</h4>
                <span className="text-[10px] text-primary font-bold uppercase">{workflows?.length} total</span>
              </div>
              <table className="w-full text-left border-collapse">
                <thead className="bg-neutral-dark/80 font-michroma text-[10px] text-slate-500 uppercase border-b border-primary/10">
                  <tr>
                    <th className="px-6 py-3">Nombre</th>
                    <th className="px-6 py-3">Estado</th>
                    <th className="px-6 py-3">Accion</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {workflows?.map((wf, i) => (
                    <tr key={wf.id} className={`border-b border-white/5 hover:bg-white/5 transition-colors ${i % 2 === 0 ? 'bg-white/[0.02]' : ''}`}>
                      <td className="px-6 py-4">
                        <p className="text-slate-100 font-medium text-sm truncate max-w-[280px]">{wf.name}</p>
                        <p className="text-slate-600 text-[10px] font-mono mt-0.5">{wf.id}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-[10px] font-bold border uppercase ${
                          wf.active
                            ? 'bg-green-500/10 text-green-500 border-green-500/30'
                            : 'bg-slate-500/10 text-slate-400 border-slate-500/30'
                        }`}>
                          <span className={`w-1 h-1 rounded-full ${wf.active ? 'bg-green-500 animate-pulse' : 'bg-slate-500'}`}></span>
                          {wf.active ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button onClick={() => toggleWorkflow(wf)} disabled={toggling === wf.id}
                            className="text-primary hover:text-white transition-colors disabled:opacity-50"
                            title={wf.active ? 'Desactivar' : 'Activar'}>
                            <span className="material-symbols-outlined text-lg">
                              {toggling === wf.id ? 'progress_activity' : wf.active ? 'pause_circle' : 'play_circle'}
                            </span>
                          </button>
                          <a href={`${N8N_URL}/workflow/${wf.id}`} target="_blank" rel="noreferrer"
                            className="text-slate-500 hover:text-primary transition-colors">
                            <span className="material-symbols-outlined text-lg">open_in_new</span>
                          </a>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Ejecuciones recientes */}
            {recentExecutions?.length > 0 && (
              <div className="bg-neutral-dark border border-primary/10 overflow-hidden">
                <div className="px-6 py-4 bg-primary/5 border-b border-primary/10">
                  <h4 className="font-michroma text-xs text-white uppercase tracking-wider">Ejecuciones Recientes</h4>
                </div>
                <table className="w-full text-left border-collapse">
                  <thead className="bg-neutral-dark/80 font-michroma text-[10px] text-slate-500 uppercase border-b border-primary/10">
                    <tr>
                      <th className="px-6 py-3">ID</th>
                      <th className="px-6 py-3">Workflow</th>
                      <th className="px-6 py-3">Estado</th>
                      <th className="px-6 py-3">Inicio</th>
                    </tr>
                  </thead>
                  <tbody className="text-xs">
                    {recentExecutions.map(exec => (
                      <tr key={exec.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                        <td className="px-6 py-3 font-mono text-slate-500">#{exec.id}</td>
                        <td className="px-6 py-3 text-slate-300 truncate max-w-[200px]">{exec.workflowName}</td>
                        <td className="px-6 py-3">
                          <span className={`px-2 py-0.5 text-[9px] font-bold uppercase rounded ${
                            exec.status === 'success' ? 'bg-emerald-500/10 text-emerald-500' :
                            exec.status === 'error'   ? 'bg-red-500/10 text-red-400' :
                            'bg-slate-500/10 text-slate-400'
                          }`}>{exec.status}</span>
                        </td>
                        <td className="px-6 py-3 text-slate-500">
                          {new Date(exec.startedAt).toLocaleString('es', { dateStyle: 'short', timeStyle: 'short' })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Panel lateral */}
          <div className="space-y-6">
            {/* Tasa de exito visual */}
            <div className="bg-neutral-dark border border-primary/10 p-6">
              <h4 className="font-michroma text-xs text-white uppercase tracking-wider mb-6">Performance Score</h4>
              <div className="flex items-center justify-center mb-6">
                <div className="relative size-32">
                  <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
                    <circle cx="60" cy="60" r="50" fill="none" stroke="#1e293b" strokeWidth="10" />
                    <circle cx="60" cy="60" r="50" fill="none" stroke="#0d7ff2" strokeWidth="10"
                      strokeDasharray={`${successRate * 3.14} 314`}
                      strokeLinecap="round" className="transition-all duration-700" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="font-michroma text-2xl font-bold text-white">{successRate}%</span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="bg-emerald-500/10 border border-emerald-500/20 p-3 rounded">
                  <p className="text-emerald-400 font-bold text-lg">{fmt(stats?.success)}</p>
                  <p className="text-slate-500 text-[10px] uppercase tracking-widest">Exitosas</p>
                </div>
                <div className="bg-red-500/10 border border-red-500/20 p-3 rounded">
                  <p className="text-red-400 font-bold text-lg">{fmt(stats?.errors)}</p>
                  <p className="text-slate-500 text-[10px] uppercase tracking-widest">Errores</p>
                </div>
              </div>
            </div>

            {/* Estado general */}
            <div className="bg-neutral-dark border border-primary/10 p-6">
              <h4 className="font-michroma text-xs text-white uppercase tracking-wider mb-4">Estado del Proyecto</h4>
              <div className="space-y-3">
                {[
                  { label: 'Workflows totales', value: workflows?.length ?? 0 },
                  { label: 'Workflows activos', value: activeCount },
                  { label: 'Ejecuciones totales', value: fmt(stats?.total) },
                  { label: 'En ejecucion ahora', value: stats?.running ?? 0 },
                ].map(m => (
                  <div key={m.label} className="flex justify-between items-center py-2 border-b border-slate-800">
                    <span className="text-slate-400 text-xs">{m.label}</span>
                    <span className="text-white font-bold text-sm">{m.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
}
