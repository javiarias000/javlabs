import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PortalLayout from '../components/PortalLayout';
import api from '../services/api';

const N8N_URL = 'https://n8n-n8n.ak7rlh.easypanel.host';

// ─── helpers ─────────────────────────────────────────────────────
const fmt    = (n) => (n >= 1000 ? n.toLocaleString('es-ES') : String(n ?? 0));
const timeAgo = (iso) => {
  if (!iso) return '—';
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1)  return 'ahora';
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  return `${Math.floor(h / 24)}d`;
};
const duration = (start, stop) => {
  if (!start || !stop) return '—';
  const ms = new Date(stop) - new Date(start);
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(1)}s`;
};

export default function ProjectDetailView() {
  const navigate          = useNavigate();
  const { key }           = useParams();
  const [data,       setData]       = useState(null);
  const [loading,    setLoading]    = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error,      setError]      = useState(null);
  const [toggling,   setToggling]   = useState(null);
  const [editName,   setEditName]   = useState(false);
  const [newName,    setNewName]    = useState('');
  const [saving,     setSaving]     = useState(false);
  const [activeTab,  setActiveTab]  = useState('overview'); // overview | workflows | executions

  // ─── fetch ──────────────────────────────────────────────────────
  const fetchData = useCallback(async (isRefresh = false) => {
    isRefresh ? setRefreshing(true) : setLoading(true);
    setError(null);
    try {
      const { data: d } = await api.get(`/n8n/projects/${key}`);
      setData(d);
      setNewName(d.name);
    } catch {
      setError('No se pudo cargar el proyecto. Verifica la conexión con n8n.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [key]);

  useEffect(() => { fetchData(); }, [fetchData]);

  // ─── toggle workflow ─────────────────────────────────────────────
  const toggleWorkflow = async (wf) => {
    setToggling(wf.id);
    try {
      const action = wf.active ? 'deactivate' : 'activate';
      await api.post(`/n8n/workflows/${wf.id}/${action}`);
      setData(prev => ({
        ...prev,
        workflows: prev.workflows.map(w =>
          w.id === wf.id ? { ...w, active: !w.active } : w
        ),
        activeWorkflows: prev.workflows.filter(w =>
          w.id === wf.id ? !wf.active : w.active
        ).length,
      }));
    } catch {
      setError('Error al cambiar el estado del workflow.');
    } finally {
      setToggling(null);
    }
  };

  // ─── rename project ──────────────────────────────────────────────
  const saveName = async () => {
    if (!newName.trim()) return;
    setSaving(true);
    try {
      await api.patch(`/n8n/projects/${key}`, { name: newName.trim() });
      setData(prev => ({ ...prev, name: newName.trim() }));
      setEditName(false);
    } catch {
      setError('Error al renombrar el proyecto.');
    } finally {
      setSaving(false);
    }
  };

  // ─── computed ────────────────────────────────────────────────────
  const stats        = data?.stats        || {};
  const workflows    = data?.workflows    || [];
  const executions   = data?.recentExecutions || [];
  const activeWfs    = workflows.filter(w => w.active).length;

  // Distribución de estados de ejecuciones
  const execByStatus = executions.reduce((acc, e) => {
    acc[e.status] = (acc[e.status] || 0) + 1;
    return acc;
  }, {});

  // Actividad por hora (últimas 20 ejecuciones)
  const activityByHour = executions.reduce((acc, e) => {
    if (!e.startedAt) return acc;
    const h = new Date(e.startedAt).getHours();
    acc[h] = (acc[h] || 0) + 1;
    return acc;
  }, {});
  const maxHourCount = Math.max(...Object.values(activityByHour), 1);

  // ─── tabs ────────────────────────────────────────────────────────
  const tabs = [
    { id: 'overview',    label: 'Overview',    icon: 'dashboard'     },
    { id: 'workflows',   label: 'Workflows',   icon: 'account_tree'  },
    { id: 'executions',  label: 'Ejecuciones', icon: 'history'       },
  ];

  if (loading) return (
    <PortalLayout>
      <div className="flex flex-col items-center justify-center h-96 gap-4 text-slate-500">
        <span className="material-symbols-outlined text-4xl animate-spin">progress_activity</span>
        <span className="text-xs uppercase tracking-widest font-michroma">Cargando proyecto...</span>
      </div>
    </PortalLayout>
  );

  return (
    <PortalLayout>
      <div className="p-8 space-y-8">

        {/* ── Breadcrumb ── */}
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <button onClick={() => navigate('/dashboard/overview')} className="hover:text-primary transition-colors">Dashboard</button>
          <span className="material-symbols-outlined text-xs">chevron_right</span>
          <button onClick={() => navigate('/automatizaciones/logica')} className="hover:text-primary transition-colors">Proyectos n8n</button>
          <span className="material-symbols-outlined text-xs">chevron_right</span>
          <span className="text-primary font-semibold">{data?.name || key}</span>
        </div>

        {/* ── Header ── */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            {editName ? (
              <div className="flex items-center gap-3">
                <input value={newName} onChange={e => setNewName(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && saveName()}
                  className="bg-slate-900 border border-primary text-white text-2xl font-bold px-3 py-1 rounded outline-none w-64"
                  autoFocus />
                <button onClick={saveName} disabled={saving}
                  className="px-3 py-1.5 bg-primary text-white text-xs font-bold rounded uppercase tracking-widest disabled:opacity-50">
                  {saving ? '...' : 'Guardar'}
                </button>
                <button onClick={() => setEditName(false)}
                  className="px-3 py-1.5 border border-slate-700 text-slate-400 text-xs rounded">
                  Cancelar
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold text-white uppercase tracking-tight font-michroma">
                  {data?.name || key?.replace(/_/g, ' ')}
                </h1>
                <button onClick={() => setEditName(true)}
                  className="text-slate-600 hover:text-primary transition-colors">
                  <span className="material-symbols-outlined text-sm">edit</span>
                </button>
              </div>
            )}
            {data?.description && (
              <p className="text-slate-400 text-sm mt-1">{data.description}</p>
            )}
          </div>

          <div className="flex items-center gap-3">
            {/* Estado */}
            <div className={`flex items-center gap-2 px-3 py-1.5 border rounded text-[10px] font-bold uppercase tracking-widest ${
              activeWfs > 0
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                : 'bg-slate-500/10 border-slate-700 text-slate-500'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${activeWfs > 0 ? 'bg-emerald-500 animate-pulse' : 'bg-slate-500'}`}></span>
              {activeWfs > 0 ? 'Activo' : 'Inactivo'}
            </div>

            {/* Abrir en n8n */}
            <a href={N8N_URL} target="_blank" rel="noreferrer"
              className="flex items-center gap-2 px-4 py-2 border border-slate-700 text-slate-300 hover:border-primary hover:text-primary transition-all text-xs font-bold uppercase tracking-widest rounded">
              <span className="material-symbols-outlined text-sm">open_in_new</span>
              n8n
            </a>

            {/* Refresh */}
            <button onClick={() => fetchData(true)} disabled={refreshing}
              className="flex items-center gap-2 px-4 py-2 border border-primary/30 text-primary hover:bg-primary/10 transition-all text-xs font-bold uppercase tracking-widest rounded disabled:opacity-50">
              <span className={`material-symbols-outlined text-sm ${refreshing ? 'animate-spin' : ''}`}>
                {refreshing ? 'progress_activity' : 'refresh'}
              </span>
              {refreshing ? 'Actualizando...' : 'Refresh'}
            </button>
          </div>
        </div>

        {/* ── Error ── */}
        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/30 rounded flex items-center gap-3">
            <span className="material-symbols-outlined text-red-400">error</span>
            <p className="text-sm text-red-400">{error}</p>
            <button onClick={() => setError(null)} className="ml-auto text-red-400 hover:text-red-300">
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
          </div>
        )}

        {/* ── KPIs ── */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { label: 'Total Ejecuciones', value: fmt(stats.total),       icon: 'play_circle',  color: 'text-primary',      border: 'border-primary/20'      },
            { label: 'Exitosas',          value: fmt(stats.success),     icon: 'check_circle', color: 'text-emerald-400',  border: 'border-emerald-500/20'  },
            { label: 'Errores',           value: fmt(stats.errors),      icon: 'error',        color: 'text-red-400',      border: 'border-red-500/20'      },
            { label: 'En Ejecución',      value: fmt(stats.running),     icon: 'pending',      color: 'text-amber-400',    border: 'border-amber-500/20'    },
            { label: 'Tasa de Éxito',     value: `${stats.successRate ?? 0}%`, icon: 'verified', color: stats.successRate >= 80 ? 'text-emerald-400' : stats.successRate >= 50 ? 'text-amber-400' : 'text-red-400', border: 'border-violet-500/20' },
            { label: 'Tiempo Promedio',   value: stats.avgTimeSeconds ? `${stats.avgTimeSeconds}s` : '—', icon: 'timer', color: 'text-violet-400', border: 'border-violet-500/20' },
          ].map(k => (
            <div key={k.label} className={`bg-slate-900/60 border ${k.border} rounded-lg p-4`}>
              <div className="flex items-center gap-2 mb-2">
                <span className={`material-symbols-outlined text-sm ${k.color}`}>{k.icon}</span>
                <p className="text-[9px] text-slate-500 uppercase tracking-widest font-bold">{k.label}</p>
              </div>
              <p className={`font-michroma text-2xl font-bold ${k.color}`}>{k.value}</p>
            </div>
          ))}
        </div>

        {/* ── Tabs ── */}
        <div className="border-b border-slate-800 flex gap-1">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              className={`flex items-center gap-2 px-5 py-3 text-xs font-bold uppercase tracking-widest transition-all border-b-2 -mb-px ${
                activeTab === t.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-slate-500 hover:text-white'
              }`}>
              <span className="material-symbols-outlined text-sm">{t.icon}</span>
              {t.label}
            </button>
          ))}
        </div>

        {/* ══ TAB: OVERVIEW ══════════════════════════════════════════ */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Success rate visual */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-6">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Tasa de Éxito</h3>
              <div className="flex items-center justify-center mb-4">
                <div className="relative size-32">
                  <svg className="size-32 -rotate-90" viewBox="0 0 120 120">
                    <circle cx="60" cy="60" r="50" fill="none" stroke="#1e293b" strokeWidth="12" />
                    <circle cx="60" cy="60" r="50" fill="none"
                      stroke={stats.successRate >= 80 ? '#10b981' : stats.successRate >= 50 ? '#f59e0b' : '#ef4444'}
                      strokeWidth="12"
                      strokeDasharray={`${(stats.successRate ?? 0) * 3.14} 314`}
                      strokeLinecap="round" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-bold text-white font-michroma">{stats.successRate ?? 0}%</span>
                    <span className="text-[9px] text-slate-500 uppercase">éxito</span>
                  </div>
                </div>
              </div>
              <div className="space-y-2 text-xs">
                {[
                  { label: 'Exitosas', value: stats.success, color: 'bg-emerald-500' },
                  { label: 'Errores',  value: stats.errors,  color: 'bg-red-500'     },
                  { label: 'Running',  value: stats.running, color: 'bg-amber-500'   },
                ].map(r => (
                  <div key={r.label} className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${r.color}`}></div>
                    <span className="text-slate-400 flex-1">{r.label}</span>
                    <span className="text-white font-bold">{fmt(r.value)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Actividad por hora */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-6">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">
                Actividad por Hora
                <span className="text-slate-600 normal-case font-normal ml-2">(últimas {executions.length} ejec.)</span>
              </h3>
              {Object.keys(activityByHour).length === 0 ? (
                <div className="flex items-center justify-center h-32 text-slate-600 text-xs">Sin datos</div>
              ) : (
                <div className="flex items-end gap-1 h-32">
                  {Array.from({ length: 24 }, (_, h) => ({
                    h,
                    count: activityByHour[h] || 0,
                  })).map(({ h, count }) => (
                    <div key={h} className="flex-1 flex flex-col items-center gap-1 h-full justify-end group relative">
                      <div
                        className="w-full bg-primary transition-all duration-500 rounded-sm"
                        style={{ height: `${count > 0 ? Math.max((count / maxHourCount) * 100, 8) : 2}%`, opacity: count > 0 ? 0.4 + (count / maxHourCount) * 0.6 : 0.1 }}>
                      </div>
                      {count > 0 && (
                        <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-slate-800 border border-slate-700 text-[9px] text-white px-1.5 py-0.5 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                          {h}:00 — {count}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
              <div className="flex justify-between text-[9px] text-slate-600 mt-1">
                <span>00:00</span><span>12:00</span><span>23:00</span>
              </div>
            </div>

            {/* Distribución de estados */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-6">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Estado de Ejecuciones</h3>
              <div className="space-y-4">
                {[
                  { key: 'success', label: 'Exitosas', color: 'bg-emerald-500', textColor: 'text-emerald-400' },
                  { key: 'error',   label: 'Errores',  color: 'bg-red-500',     textColor: 'text-red-400'     },
                  { key: 'running', label: 'Running',  color: 'bg-amber-500',   textColor: 'text-amber-400'   },
                  { key: 'waiting', label: 'Waiting',  color: 'bg-slate-500',   textColor: 'text-slate-400'   },
                ].map(s => {
                  const count = execByStatus[s.key] || 0;
                  const pct   = executions.length > 0 ? Math.round((count / executions.length) * 100) : 0;
                  return (
                    <div key={s.key}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className={s.textColor}>{s.label}</span>
                        <span className="text-slate-400">{count} ({pct}%)</span>
                      </div>
                      <div className="w-full bg-slate-800 h-1.5 rounded-full">
                        <div className={`h-full rounded-full ${s.color} transition-all duration-700`}
                          style={{ width: `${pct}%` }}></div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Workflows activos vs total */}
              <div className="mt-6 pt-4 border-t border-slate-800">
                <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-3">Workflows</p>
                <div className="flex items-end gap-2">
                  <span className="text-3xl font-bold text-white font-michroma">{activeWfs}</span>
                  <span className="text-slate-500 text-sm mb-1">/ {workflows.length} activos</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2">
                  <div className="h-full bg-primary rounded-full transition-all duration-700"
                    style={{ width: workflows.length > 0 ? `${(activeWfs / workflows.length) * 100}%` : '0%' }}>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ══ TAB: WORKFLOWS ═════════════════════════════════════════ */}
        {activeTab === 'workflows' && (
          <div className="space-y-3">
            {workflows.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-slate-600">
                <span className="material-symbols-outlined text-5xl mb-3">account_tree</span>
                <p className="text-xs uppercase tracking-widest">No hay workflows en este proyecto</p>
              </div>
            ) : workflows.map((wf, i) => (
              <div key={wf.id}
                className={`border rounded-lg p-5 transition-all ${wf.active ? 'border-primary/30 bg-primary/5' : 'border-slate-800 bg-slate-900/40'}`}>
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className={`size-2.5 rounded-full flex-shrink-0 ${wf.active ? 'bg-primary animate-pulse' : 'bg-slate-600'}`}></div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="text-white font-bold text-sm truncate">{wf.name}</h3>
                      </div>
                      <p className="text-[10px] text-slate-500 font-mono mt-0.5">ID: {wf.id}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded border ${
                      wf.active
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                        : 'bg-slate-500/10 border-slate-700 text-slate-500'
                    }`}>
                      {wf.active ? 'Activo' : 'Inactivo'}
                    </span>
                    <button
                      onClick={() => toggleWorkflow(wf)}
                      disabled={toggling === wf.id}
                      className={`px-4 py-1.5 text-xs font-bold uppercase tracking-widest border rounded transition-all disabled:opacity-50 ${
                        wf.active
                          ? 'border-slate-700 text-slate-400 hover:text-white hover:border-slate-500'
                          : 'border-primary text-primary hover:bg-primary/10'
                      }`}>
                      {toggling === wf.id ? '...' : wf.active ? 'Desactivar' : 'Activar'}
                    </button>
                    <a href={`${N8N_URL}/workflow/${wf.id}`} target="_blank" rel="noreferrer"
                      className="p-1.5 text-slate-500 hover:text-primary transition-colors"
                      title="Abrir en n8n">
                      <span className="material-symbols-outlined text-sm">open_in_new</span>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ══ TAB: EJECUCIONES ═══════════════════════════════════════ */}
        {activeTab === 'executions' && (
          <div>
            {executions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-slate-600">
                <span className="material-symbols-outlined text-5xl mb-3">history</span>
                <p className="text-xs uppercase tracking-widest">Sin ejecuciones recientes</p>
              </div>
            ) : (
              <div className="border border-slate-800 rounded-lg overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-slate-900/80 border-b border-slate-800">
                    <tr>
                      {['ID', 'Workflow', 'Estado', 'Duración', 'Inicio', 'Hace'].map(h => (
                        <th key={h} className="px-5 py-3 text-[10px] uppercase font-bold text-slate-500 tracking-widest">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/50">
                    {executions.map(exec => (
                      <tr key={exec.id} className="hover:bg-slate-800/30 transition-colors">
                        <td className="px-5 py-3 font-mono text-[10px] text-slate-500">#{String(exec.id).slice(-8)}</td>
                        <td className="px-5 py-3 text-sm text-slate-200 max-w-[220px] truncate">{exec.workflowName}</td>
                        <td className="px-5 py-3">
                          <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded border ${
                            exec.status === 'success' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' :
                            exec.status === 'error'   ? 'bg-red-500/10 border-red-500/30 text-red-400'             :
                            exec.status === 'running' ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'        :
                            'bg-slate-500/10 border-slate-700 text-slate-500'
                          }`}>
                            {exec.status}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-xs text-slate-400 font-mono">
                          {duration(exec.startedAt, exec.stoppedAt)}
                        </td>
                        <td className="px-5 py-3 text-xs text-slate-500">
                          {exec.startedAt ? new Date(exec.startedAt).toLocaleString('es-ES', { dateStyle: 'short', timeStyle: 'short' }) : '—'}
                        </td>
                        <td className="px-5 py-3 text-xs text-slate-600">{timeAgo(exec.startedAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

      </div>
    </PortalLayout>
  );
}