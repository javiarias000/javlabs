import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import PortalLayout from '../../components/PortalLayout';
import api from '../../services/api';
import './AutomationPerformanceDashboard.css';

// ─── helpers ─────────────────────────────────────────────────────────────────
const statusConfig = (active) => active
  ? { label: 'Operational', cls: 'bg-green-500/10 text-green-500 border-green-500/30' }
  : { label: 'Inactive',    cls: 'bg-slate-500/10 text-slate-400 border-slate-500/30' };

const fmt = (n) => n >= 1000 ? n.toLocaleString('es-ES') : String(n);

export default function AutomationPerformanceDashboard() {
  const navigate = useNavigate();

  const [projects,   setProjects]   = useState([]);
  const [workflows,  setWorkflows]  = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [error,      setError]      = useState(null);

  // ─── fetch ──────────────────────────────────────────────────────
  const fetchData = useCallback(async (isRefresh = false) => {
    isRefresh ? setRefreshing(true) : setLoading(true);
    setError(null);
    try {
      const [projRes, wfRes] = await Promise.all([
        api.get('/n8n/projects'),
        api.get('/n8n/workflows'),
      ]);
      setProjects(projRes.data?.projects || projRes.data || []);
      setWorkflows(wfRes.data?.data       || wfRes.data  || []);
      setLastUpdate(new Date());
    } catch (err) {
      setError('No se pudo conectar con n8n. Verifica la configuración.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  // ─── KPIs calculados ────────────────────────────────────────────
  const totalExecs    = projects.reduce((s, p) => s + (p.executions || 0), 0);
  const totalErrors   = projects.reduce((s, p) => s + (p.errors     || 0), 0);
  const totalSuccess  = projects.reduce((s, p) => s + (p.success    || 0), 0);
  const activeWfs     = workflows.filter(w => w.active).length;
  const errorRate     = totalExecs > 0 ? ((totalErrors / totalExecs) * 100).toFixed(2) : '0.00';
  const successRate   = totalExecs > 0 ? Math.round((totalSuccess / totalExecs) * 100) : 0;

  // Avg latency — calculado desde avgTimeSeconds de proyectos
  const projsWithTime = projects.filter(p => p.stats?.avgTimeSeconds > 0);
  const avgLatency    = projsWithTime.length > 0
    ? Math.round(projsWithTime.reduce((s, p) => s + p.stats.avgTimeSeconds, 0) / projsWithTime.length * 1000)
    : null;

  // Error distribution por proyecto (top 5)
  const errorDist = [...projects]
    .filter(p => p.executions > 0)
    .sort((a, b) => b.errors - a.errors)
    .slice(0, 5);

  // Queue density — ejecuciones por proyecto para el bar chart
  const maxExecs    = Math.max(...projects.map(p => p.executions || 0), 1);
  const densityBars = projects.slice(0, 7).map(p => ({
    name: p.name,
    pct:  Math.round(((p.executions || 0) / maxExecs) * 100),
  }));

  // ─── toggle workflow ────────────────────────────────────────────
  const toggleWorkflow = async (wf) => {
    try {
      const endpoint = wf.active
        ? `/n8n/workflows/${wf.id}/deactivate`
        : `/n8n/workflows/${wf.id}/activate`;
      await api.patch(endpoint);
      await fetchData(true);
    } catch {
      alert('No se pudo cambiar el estado del workflow.');
    }
  };

  // ─── render ─────────────────────────────────────────────────────
  return (
    <PortalLayout>
      <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">

        {/* ── Page header ── */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="font-michroma text-white text-lg uppercase tracking-wider">System Monitoring</h2>
            <p className="text-slate-500 text-xs mt-1">
              {lastUpdate
                ? `Última actualización: ${lastUpdate.toLocaleTimeString('es-ES')}`
                : 'Cargando datos en tiempo real...'}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* Estado API */}
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded border text-[10px] font-bold uppercase tracking-widest ${
              error
                ? 'bg-red-500/10 border-red-500/30 text-red-400'
                : 'bg-green-500/10 border-green-500/30 text-green-500'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${error ? 'bg-red-500' : 'bg-green-500'}`}></span>
              {error ? 'API Error' : 'API Stable'}
            </div>
            {/* Refresh */}
            <button
              onClick={() => fetchData(true)}
              disabled={refreshing}
              className="flex items-center gap-2 px-4 py-2 border border-primary/30 text-primary hover:bg-primary/10 transition-all text-[10px] font-bold uppercase tracking-widest font-michroma disabled:opacity-50">
              <span className={`material-symbols-outlined text-sm ${refreshing ? 'animate-spin' : ''}`}>
                {refreshing ? 'progress_activity' : 'refresh'}
              </span>
              {refreshing ? 'Actualizando...' : 'Refresh'}
            </button>
          </div>
        </div>

        {/* ── Error banner ── */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-center gap-3">
            <span className="material-symbols-outlined">error</span>
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 gap-4 text-slate-500">
            <span className="material-symbols-outlined text-4xl animate-spin">progress_activity</span>
            <span className="text-sm uppercase tracking-widest font-michroma">Conectando con n8n...</span>
          </div>
        ) : (
          <>
            {/* ── KPIs ── */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {/* Total Operations */}
              <div className="bg-neutral-dark border border-primary/10 p-6 flex flex-col justify-between group hover:border-primary transition-colors">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs uppercase tracking-widest text-slate-500 font-bold">Total Operations</p>
                    <h3 className="text-3xl font-bold mt-2 text-white">{fmt(totalExecs)}</h3>
                  </div>
                  <div className="w-10 h-10 bg-gradient-to-br from-primary to-blue-900 flex items-center justify-center">
                    <span className="material-symbols-outlined text-white">rocket_launch</span>
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-2 text-slate-400">
                  <span className="material-symbols-outlined text-sm">hub</span>
                  <span className="text-xs font-medium">{activeWfs} workflows activos</span>
                </div>
              </div>

              {/* Error Margin */}
              <div className="bg-neutral-dark border border-primary/10 p-6 flex flex-col justify-between group hover:border-primary transition-colors">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs uppercase tracking-widest text-slate-500 font-bold">Error Margin</p>
                    <h3 className={`text-3xl font-bold mt-2 ${parseFloat(errorRate) > 10 ? 'text-red-400' : 'text-white'}`}>
                      {errorRate}%
                    </h3>
                  </div>
                  <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-800 flex items-center justify-center">
                    <span className="material-symbols-outlined text-white">warning</span>
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-2 text-slate-400">
                  <span className="material-symbols-outlined text-sm">error_outline</span>
                  <span className="text-xs font-medium">{fmt(totalErrors)} errores totales</span>
                </div>
              </div>

              {/* Avg Latency */}
              <div className="bg-neutral-dark border border-primary/10 p-6 flex flex-col justify-between group hover:border-primary transition-colors">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs uppercase tracking-widest text-slate-500 font-bold">Avg. Latency</p>
                    <h3 className="text-3xl font-bold mt-2 text-white">
                      {avgLatency !== null ? `${avgLatency}ms` : 'N/A'}
                    </h3>
                  </div>
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-indigo-900 flex items-center justify-center">
                    <span className="material-symbols-outlined text-white">speed</span>
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-2 text-slate-400">
                  <span className="material-symbols-outlined text-sm">timer</span>
                  <span className="text-xs font-medium">Tiempo promedio de ejecución</span>
                </div>
              </div>

              {/* Success Rate */}
              <div className="bg-neutral-dark border border-primary/10 p-6 flex flex-col justify-between group hover:border-primary transition-colors">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs uppercase tracking-widest text-slate-500 font-bold">Success Rate</p>
                    <h3 className={`text-3xl font-bold mt-2 ${successRate >= 80 ? 'text-emerald-400' : successRate >= 50 ? 'text-amber-400' : 'text-red-400'}`}>
                      {successRate}%
                    </h3>
                  </div>
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-800 flex items-center justify-center">
                    <span className="material-symbols-outlined text-white">verified</span>
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-2 text-emerald-500">
                  <span className="material-symbols-outlined text-sm">check_circle</span>
                  <span className="text-xs font-medium">{fmt(totalSuccess)} ejecuciones exitosas</span>
                </div>
              </div>
            </div>

            {/* ── Main grid ── */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

              {/* Left col — tabla + charts */}
              <div className="xl:col-span-2 space-y-6">

                {/* Tabla de workflows */}
                <div className="bg-neutral-dark border border-primary/10 overflow-hidden">
                  <div className="px-6 py-4 bg-primary/5 border-b border-primary/10 flex justify-between items-center">
                    <h4 className="font-michroma text-xs text-white uppercase tracking-wider">Active Automations Engine</h4>
                    <span className="text-[10px] text-primary font-bold uppercase tracking-widest">
                      {workflows.length} workflows
                    </span>
                  </div>
                  {workflows.length === 0 ? (
                    <div className="p-8 text-center text-slate-500 text-sm">
                      No hay workflows en n8n.
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead className="bg-neutral-dark/80 font-michroma text-[10px] text-slate-500 uppercase border-b border-primary/10">
                          <tr>
                            <th className="px-6 py-4">ID</th>
                            <th className="px-6 py-4">Workflow</th>
                            <th className="px-6 py-4">Estado</th>
                            <th className="px-6 py-4">Proyecto</th>
                            <th className="px-6 py-4">Acción</th>
                          </tr>
                        </thead>
                        <tbody className="text-sm">
                          {workflows.map((wf, i) => {
                            const s        = statusConfig(wf.active);
                            const projKey  = wf.name.split(/[_\-—]/)[0].trim().toLowerCase().replace(/\s+/g, '_');
                            const projMatch = projects.find(p => p.key === projKey) || projects.find(p => wf.name.toLowerCase().includes(p.key));
                            const pKey     = projMatch?.key || projKey;
                            return (
                              <tr key={wf.id}
                                className={`border-b border-white/5 hover:bg-white/[0.05] transition-colors cursor-pointer ${i % 2 === 0 ? 'bg-white/[0.02]' : ''}`}
                                onClick={() => navigate(`/proyectos/${pKey}`)}>
                                <td className="px-6 py-4 font-mono text-[10px] text-slate-500">
                                  #{String(wf.id).slice(-6).toUpperCase()}
                                </td>
                                <td className="px-6 py-4 font-bold text-slate-100 max-w-[200px] truncate">
                                  {wf.name}
                                </td>
                                <td className="px-6 py-4">
                                  <span className={`inline-flex items-center px-2 py-0.5 text-[10px] font-bold border uppercase ${s.cls}`}>
                                    {s.label}
                                  </span>
                                </td>
                                <td className="px-6 py-4">
                                  <span className="text-primary text-xs font-bold hover:underline truncate max-w-[120px] block">
                                    {projMatch?.name || wf.name.split(/[_\-—]/)[0].trim() || '—'}
                                  </span>
                                </td>
                                <td className="px-6 py-4" onClick={e => e.stopPropagation()}>
                                  <button
                                    onClick={() => toggleWorkflow(wf)}
                                    title={wf.active ? 'Desactivar' : 'Activar'}
                                    className="text-primary hover:text-white transition-colors">
                                    <span className="material-symbols-outlined text-lg">
                                      {wf.active ? 'pause_circle' : 'play_circle'}
                                    </span>
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {/* Charts row */}
                <div className="grid grid-cols-2 gap-6">

                  {/* Error distribution por proyecto */}
                  <div className="bg-neutral-dark border border-primary/10 p-6">
                    <h4 className="font-michroma text-[10px] text-slate-500 uppercase mb-4 tracking-wider">Error Distribution</h4>
                    {errorDist.length === 0 ? (
                      <p className="text-slate-600 text-xs">Sin errores registrados.</p>
                    ) : (
                      <div className="space-y-3">
                        {errorDist.map(p => {
                          const pct = p.executions > 0
                            ? Math.round((p.errors / p.executions) * 100)
                            : 0;
                          return (
                            <div key={p.name}>
                              <div className="flex justify-between items-center text-xs mb-1">
                                <span className="text-slate-400 truncate max-w-[120px]">{p.name}</span>
                                <span className="font-bold text-white">{pct}%</span>
                              </div>
                              <div className="w-full bg-slate-800 h-1.5">
                                <div
                                  className={`h-full transition-all ${pct > 20 ? 'bg-red-500' : 'bg-amber-500'}`}
                                  style={{ width: `${pct}%` }}></div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Queue density — ejecuciones por proyecto */}
                  <div className="bg-neutral-dark border border-primary/10 p-6">
                    <h4 className="font-michroma text-[10px] text-slate-500 uppercase mb-4 tracking-wider">Queue Density</h4>
                    {densityBars.length === 0 ? (
                      <p className="text-slate-600 text-xs">Sin datos.</p>
                    ) : (
                      <div className="flex items-end gap-1 h-24 w-full">
                        {densityBars.map((b, i) => (
                          <div key={i} className="flex-1 flex flex-col items-center gap-1 h-full justify-end group relative">
                            <div
                              className="w-full bg-primary transition-all duration-500"
                              style={{ height: `${Math.max(b.pct, 4)}%`, opacity: 0.3 + (b.pct / 100) * 0.7 }}>
                            </div>
                            {/* tooltip */}
                            <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-slate-900 border border-slate-700 text-[9px] text-white px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                              {b.name}: {b.pct}%
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right col — Efficiency panel */}
              <div className="space-y-6">
                <div className="bg-neutral-dark border border-primary/10 p-6 min-h-[500px] flex flex-col">
                  <h4 className="font-michroma text-xs text-white uppercase tracking-wider mb-8">Efficiency Delta</h4>
                  <div className="flex-1 flex gap-4">
                    {/* Barra vertical — success rate */}
                    <div className="w-1 bg-primary/10 relative flex-shrink-0">
                      <div
                        className="absolute bottom-0 left-0 w-full bg-primary transition-all duration-700"
                        style={{ height: `${successRate}%` }}></div>
                    </div>
                    <div className="flex-1 space-y-8">
                      {/* Success rate */}
                      <div>
                        <p className="text-[10px] text-primary font-bold uppercase tracking-widest mb-1">Peak Efficiency</p>
                        <p className="text-2xl font-bold text-white">{successRate}%</p>
                        <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                          {totalExecs > 0
                            ? `${fmt(totalSuccess)} operaciones exitosas de ${fmt(totalExecs)} totales.`
                            : 'Sin ejecuciones registradas aún.'}
                        </p>
                      </div>

                      {/* Proyectos activos */}
                      <div>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">Proyectos Activos</p>
                        <p className="text-2xl font-bold text-white">
                          {projects.filter(p => p.status === 'ACTIVE').length}
                          <span className="text-slate-500 text-base font-normal"> / {projects.length}</span>
                        </p>
                        <div className="flex items-center gap-1 text-primary mt-1">
                          <span className="material-symbols-outlined text-sm">folder_open</span>
                          <span className="text-xs">{activeWfs} workflows en ejecución</span>
                        </div>
                      </div>

                      {/* Proyectos list */}
                      <div className="pt-6 border-t border-white/5">
                        <h5 className="font-michroma text-[9px] text-slate-500 uppercase mb-4 tracking-widest">Proyectos n8n</h5>
                        <div className="flex flex-wrap gap-2">
                          {projects.slice(0, 6).map(p => (
                            <div key={p.key}
                              className={`px-2 py-1 border text-[9px] font-bold cursor-pointer transition-colors ${
                                p.status === 'ACTIVE'
                                  ? 'bg-primary/10 border-primary/30 text-primary hover:bg-primary/20'
                                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500'
                              }`}
                              onClick={() => navigate(`/proyectos/${p.key}`)}>
                              {p.name.toUpperCase().slice(0, 12)}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => navigate('/automatizaciones/logs')}
                    className="mt-8 w-full border border-primary text-primary hover:bg-primary hover:text-white transition-all py-3 font-michroma text-[10px] uppercase tracking-widest">
                    Ver Logs
                  </button>
                </div>
              </div>
            </div>

            {/* ── Footer ── */}
            <footer className="mt-8 pt-6 border-t border-primary/10 flex flex-wrap justify-between items-center text-[10px] uppercase tracking-widest text-slate-500 font-bold">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <span className={`w-1.5 h-1.5 rounded-full ${error ? 'bg-red-500' : 'bg-green-500'}`}></span>
                  <span>{error ? 'n8n Disconnected' : 'n8n Connected'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                  <span>Database Sync Stable</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                  <span>{workflows.length} Workflows Loaded</span>
                </div>
              </div>
              <div className="mt-4 lg:mt-0">© 2026 JAV LABS SYSTEMS INTERFACE</div>
            </footer>
          </>
        )}
      </div>
    </PortalLayout>
  );
}