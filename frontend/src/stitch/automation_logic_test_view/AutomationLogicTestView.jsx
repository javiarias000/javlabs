import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, useParams } from 'react-router-dom';
import PortalLayout from '../../components/PortalLayout';
import api from '../../services/api';
import './AutomationLogicTestView.css';

const N8N_URL = 'https://n8n-n8n.ak7rlh.easypanel.host';

const PROJECT_RULES = [
  { key: 'dentilook',  keywords: ['dentilook', 'clinica', 'dental', 'cita', 'recordatorio citas', 'rag - carga', 'carga documentos', 'buscador de leads'] },
  { key: 'sama_shala', keywords: ['sama_shala', 'sama shala'] },
  { key: 'facturas',   keywords: ['factura', 'datos_facturas'] },
  { key: 'violin',     keywords: ['violin', 'clases_magistrales'] },
];

const getProjectKey = (name) => {
  const lower = name.toLowerCase();
  for (const rule of PROJECT_RULES) {
    if (rule.keywords.some(k => lower.includes(k))) return rule.key;
  }
  if (name.includes(' — ') || name.includes(' - ')) {
    const sep   = name.includes(' — ') ? ' — ' : ' - ';
    const parts = name.split(sep);
    if (parts.length > 1) return parts[0].trim().toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
  }
  if (name.includes('_')) return name.split('_')[0].toLowerCase();
  return 'general';
};

export default function AutomationLogicTestView() {
  const navigate       = useNavigate();
  const { user }       = useAuth();
  const { key }        = useParams();
  const [workflows,    setWorkflows]    = useState([]);
  const [projectData,  setProjectData]  = useState(null);
  const [selected,     setSelected]     = useState(null);
  const [loading,      setLoading]      = useState(true);
  const [toggling,     setToggling]     = useState(null);
  const [error,        setError]        = useState('');
  const [editingName,  setEditingName]  = useState(false);
  const [newName,      setNewName]      = useState('');
  const [savingName,   setSavingName]   = useState(false);

  useEffect(() => {
    // Si es CLIENT y no hay key, redirigir a su proyecto
    if (!key && user?.role === 'CLIENT' && user?.n8nProjectKey) {
      navigate(`/automatizaciones/logica/${user.n8nProjectKey}`, { replace: true });
      return;
    }
    setLoading(true);
    if (key) {
      // Cargar detalle de proyecto especifico
      api.get(`/n8n/projects/${key}`)
        .then(({ data }) => {
          setProjectData(data);
          setWorkflows(data.workflows || []);
          setNewName(data.name);
        })
        .catch((err) => {
          console.error('Error loading project:', err);
          setError('No se pudo cargar el proyecto.');
        })
        .finally(() => setLoading(false));
    } else {
      // Cargar todos los workflows
      api.get('/n8n/workflows')
        .then(({ data }) => setWorkflows(data.data || data))
        .catch((err) => {
          console.error('Error loading workflows:', err);
          setError('No se pudo conectar con n8n.');
        })
        .finally(() => setLoading(false));
    }
  }, [key]);

  const toggleWorkflow = async (wf) => {
    setToggling(wf.id);
    try {
      const action = wf.active ? 'deactivate' : 'activate';
      await api.patch(`/n8n/workflows/${wf.id}/${action}`);
      setWorkflows(prev => prev.map(w => w.id === wf.id ? { ...w, active: !w.active } : w));
      if (selected?.id === wf.id) setSelected(prev => ({ ...prev, active: !prev.active }));
    } catch (err) {
      console.error('Error toggling workflow:', err);
      setError('Error al cambiar el estado del workflow.');
    } finally {
      setToggling(null);
    }
  };

  const saveProjectName = async () => {
    if (!newName.trim() || !key) return;
    setSavingName(true);
    try {
      await api.patch(`/n8n/projects/${key}`, { name: newName.trim() });
      setProjectData(prev => ({ ...prev, name: newName.trim() }));
      setEditingName(false);
    } catch (err) {
      console.error('Error renaming project:', err);
      setError('Error al renombrar el proyecto.');
    } finally {
      setSavingName(false);
    }
  };

  const getWebhookUrl = (wf) => {
    const node = wf.nodes?.find(n => n.type?.toLowerCase().includes('webhook'));
    if (!node?.parameters?.path) return null;
    return `${N8N_URL}/webhook/${node.parameters.path}`;
  };

  const getTriggerType = (wf) => {
    const t = wf.nodes?.find(n =>
      n.type?.toLowerCase().includes('trigger') ||
      n.type?.toLowerCase().includes('webhook') ||
      n.type?.toLowerCase().includes('schedule') ||
      n.type?.toLowerCase().includes('cron')
    );
    if (!t) return 'Manual';
    if (t.type?.toLowerCase().includes('webhook'))  return 'Webhook';
    if (t.type?.toLowerCase().includes('schedule') || t.type?.toLowerCase().includes('cron')) return 'Schedule';
    return 'Trigger';
  };

  const projectName = projectData?.name || (key ? key.replace(/_/g, ' ') : 'Todos los Workflows');

  return (
    <PortalLayout>
      <div className="flex flex-col min-h-screen">
        <main className="flex-1 flex flex-col max-w-[1440px] mx-auto w-full px-6 py-8 gap-8">

          {/* Header */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <button onClick={() => navigate('/dashboard/overview')} className="hover:text-primary transition-colors">Dashboard</button>
              <span className="material-symbols-outlined text-xs">chevron_right</span>
              <button onClick={() => navigate('/automatizaciones/logica')} className="hover:text-primary transition-colors">Proyectos n8n</button>
              {key && (
                <>
                  <span className="material-symbols-outlined text-xs">chevron_right</span>
                  <span className="text-primary font-semibold">{projectName}</span>
                </>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {editingName ? (
                  <div className="flex items-center gap-2">
                    <input value={newName} onChange={e => setNewName(e.target.value)}
                      className="bg-slate-900 border border-primary text-white text-2xl font-bold px-3 py-1 rounded outline-none"
                      autoFocus onKeyDown={e => e.key === 'Enter' && saveProjectName()} />
                    <button onClick={saveProjectName} disabled={savingName}
                      className="px-3 py-1 bg-primary text-white text-xs rounded font-bold disabled:opacity-50">
                      {savingName ? '...' : 'Guardar'}
                    </button>
                    <button onClick={() => setEditingName(false)}
                      className="px-3 py-1 border border-slate-700 text-slate-400 text-xs rounded">
                      Cancelar
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <h1 className="text-3xl font-bold uppercase tracking-tight text-white capitalize">{projectName}</h1>
                    {key && (
                      <button onClick={() => setEditingName(true)}
                        className="text-slate-500 hover:text-primary transition-colors">
                        <span className="material-symbols-outlined text-sm">edit</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
              <button onClick={() => navigate('/automatizaciones/nueva')}
                className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded flex items-center gap-2 text-sm font-bold uppercase tracking-widest transition-all">
                <span className="material-symbols-outlined text-[18px]">add</span>
                Nuevo Workflow
              </button>
            </div>

            {/* Metricas del proyecto si hay key */}
            {projectData && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Total Ejecuciones', value: projectData.stats?.total || 0,           color: 'text-primary'    },
                  { label: 'Exitosas',           value: projectData.stats?.success || 0,         color: 'text-emerald-400' },
                  { label: 'Errores',            value: projectData.stats?.errors || 0,          color: 'text-red-400'    },
                  { label: 'Tasa de Exito',      value: `${projectData.stats?.successRate || 0}%`, color: 'text-violet-400' },
                ].map(m => (
                  <div key={m.label} className="bg-slate-800/40 border border-slate-800 rounded p-4">
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">{m.label}</p>
                    <p className={`font-michroma text-2xl font-bold ${m.color}`}>{m.value}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Si no hay key, mostrar lista de proyectos */}
            {!key && !loading && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
                {[...new Set(workflows.map(w => getProjectKey(w.name)))].map(pKey => {
                  const pWorkflows = workflows.filter(w => getProjectKey(w.name) === pKey);
                  const active     = pWorkflows.filter(w => w.active).length;
                  return (
                    <button key={pKey} onClick={() => navigate(`/automatizaciones/logica/${pKey}`)}
                      className="bg-slate-800/40 border border-slate-800 rounded p-4 text-left hover:border-primary transition-all group">
                      <div className="flex items-center gap-2 mb-3">
                        <div className={`size-2 rounded-full ${active > 0 ? 'bg-primary animate-pulse' : 'bg-slate-500'}`}></div>
                        <span className={`text-[10px] font-bold uppercase tracking-widest ${active > 0 ? 'text-primary' : 'text-slate-500'}`}>
                          {active > 0 ? 'Activo' : 'Inactivo'}
                        </span>
                      </div>
                      <p className="text-white font-bold text-sm capitalize mb-1">{pKey.replace(/_/g, ' ')}</p>
                      <p className="text-slate-500 text-xs">{pWorkflows.length} workflows</p>
                      <div className="mt-3 flex items-center gap-1 text-primary text-[10px] font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                        Ver detalle <span className="material-symbols-outlined text-xs">arrow_forward</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/30 rounded flex items-center gap-3">
              <span className="material-symbols-outlined text-red-400">error</span>
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          {/* Lista de workflows */}
          <div className="flex flex-col lg:flex-row gap-6 flex-1">
            <div className="flex-1 flex flex-col gap-3">
              <p className="text-xs font-bold uppercase tracking-widest text-slate-500">
                {loading ? 'Cargando...' : `${workflows.length} workflows${key ? ` en ${projectName}` : ''}`}
              </p>

              {loading ? (
                [...Array(3)].map((_, i) => (
                  <div key={i} className="bg-slate-800/40 border border-slate-800 rounded p-5 animate-pulse h-20" />
                ))
              ) : workflows.length === 0 ? (
                <div className="text-center py-20 text-slate-500">
                  <span className="material-symbols-outlined text-5xl mb-4 block">account_tree</span>
                  <p className="text-sm uppercase tracking-widest">No hay workflows</p>
                </div>
              ) : workflows.map(wf => {
                const isSelected = selected?.id === wf.id;
                const isBusy     = toggling === wf.id;
                const trigger    = getTriggerType(wf);
                const webhook    = getWebhookUrl(wf);
                return (
                  <div key={wf.id}
                    onClick={() => setSelected(isSelected ? null : wf)}
                    className={`border rounded p-5 cursor-pointer transition-all ${isSelected ? 'border-primary bg-primary/5' : 'border-slate-800 bg-slate-800/40 hover:border-slate-700'}`}>
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className={`size-2 rounded-full flex-shrink-0 ${wf.active ? 'bg-primary animate-pulse' : 'bg-slate-500'}`}></div>
                        <div className="min-w-0">
                          <h3 className="text-white font-bold text-sm truncate">{wf.name}</h3>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-[10px] text-slate-500 uppercase tracking-widest">ID: {wf.id}</span>
                            <span className="text-[10px] px-2 py-0.5 rounded bg-slate-700 text-slate-400 uppercase tracking-widest">{trigger}</span>
                            {webhook && <span className="text-[10px] px-2 py-0.5 rounded bg-primary/10 text-primary uppercase tracking-widest">Webhook</span>}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <span className={`text-xs font-bold uppercase tracking-widest ${wf.active ? 'text-primary' : 'text-slate-500'}`}>
                          {wf.active ? 'Activo' : 'Inactivo'}
                        </span>
                        <button onClick={e => { e.stopPropagation(); toggleWorkflow(wf); }} disabled={isBusy}
                          className={`px-3 py-1.5 text-xs font-bold uppercase tracking-widest border rounded transition-all disabled:opacity-50 ${wf.active ? 'border-slate-700 text-slate-400 hover:text-white' : 'border-primary text-primary hover:bg-primary/10'}`}>
                          {isBusy ? '...' : wf.active ? 'Desactivar' : 'Activar'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Panel de detalle */}
            <div className="w-full lg:w-96 flex flex-col gap-4">
              {selected ? (
                <div className="flex flex-col gap-4">
                  <div className="bg-slate-800/40 border border-slate-800 rounded p-6">
                    <h3 className="text-white font-bold text-sm uppercase tracking-widest mb-4 border-b border-slate-700 pb-3">
                      Detalle del Workflow
                    </h3>
                    <div className="space-y-3">
                      {[
                        { label: 'Nombre',  value: selected.name },
                        { label: 'ID',      value: selected.id, mono: true },
                        { label: 'Trigger', value: getTriggerType(selected) },
                        { label: 'Nodos',   value: `${selected.nodes?.length || 0} nodos` },
                        { label: 'Updated', value: selected.updatedAt ? new Date(selected.updatedAt).toLocaleString('es') : '—' },
                      ].map(m => (
                        <div key={m.label}>
                          <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">{m.label}</p>
                          <p className={`text-sm text-white ${m.mono ? 'font-mono text-xs text-slate-400' : 'font-medium'}`}>{m.value}</p>
                        </div>
                      ))}
                      <div>
                        <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Estado</p>
                        <div className="flex items-center gap-2">
                          <span className={`size-2 rounded-full ${selected.active ? 'bg-primary animate-pulse' : 'bg-slate-500'}`}></span>
                          <span className={`text-sm font-bold ${selected.active ? 'text-primary' : 'text-slate-500'}`}>
                            {selected.active ? 'Activo' : 'Inactivo'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {getWebhookUrl(selected) && (
                    <div className="bg-slate-800/40 border border-slate-800 rounded p-6">
                      <h3 className="text-white font-bold text-xs uppercase tracking-widest mb-3">Webhook URL</h3>
                      <div className="flex gap-2">
                        <input readOnly value={getWebhookUrl(selected)}
                          className="flex-1 bg-slate-900 border border-slate-700 text-slate-300 text-xs px-3 py-2 rounded font-mono" />
                        <button onClick={() => navigator.clipboard.writeText(getWebhookUrl(selected))}
                          className="px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded transition-colors">
                          <span className="material-symbols-outlined text-sm">content_copy</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {selected.nodes?.length > 0 && (
                    <div className="bg-slate-800/40 border border-slate-800 rounded p-6">
                      <h3 className="text-white font-bold text-xs uppercase tracking-widest mb-3">Nodos</h3>
                      <div className="flex flex-col gap-2 max-h-48 overflow-y-auto">
                        {selected.nodes.map((node, i) => (
                          <div key={i} className="flex items-center gap-3 p-2 bg-slate-900 rounded">
                            <span className="material-symbols-outlined text-primary text-sm">account_tree</span>
                            <div>
                              <p className="text-xs text-white font-medium">{node.name}</p>
                              <p className="text-[10px] text-slate-500">{node.type?.split('.')?.pop()}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <a href={`${N8N_URL}/workflow/${selected.id}`} target="_blank" rel="noreferrer"
                    className="flex items-center justify-center gap-2 px-6 py-3 border border-slate-700 text-slate-300 hover:border-primary hover:text-primary transition-all rounded text-xs font-bold uppercase tracking-widest">
                    <span className="material-symbols-outlined text-sm">open_in_new</span>
                    Abrir en n8n
                  </a>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-slate-600 py-20 border border-dashed border-slate-800 rounded">
                  <span className="material-symbols-outlined text-4xl mb-3">account_tree</span>
                  <p className="text-xs uppercase tracking-widest">Selecciona un workflow</p>
                </div>
              )}
            </div>
          </div>

          {/* Ejecuciones recientes si hay proyecto */}
          {projectData?.recentExecutions?.length > 0 && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4">Ejecuciones Recientes</h3>
              <div className="overflow-x-auto border border-slate-800 rounded">
                <table className="w-full text-left border-collapse bg-slate-900">
                  <thead>
                    <tr className="border-b border-slate-800 bg-slate-900/50">
                      {['ID', 'Workflow', 'Estado', 'Inicio'].map(h => (
                        <th key={h} className="p-4 text-[10px] uppercase font-bold text-slate-400 tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="text-xs">
                    {projectData.recentExecutions.map(exec => (
                      <tr key={exec.id} className="border-b border-slate-900 hover:bg-slate-900/30 transition-colors">
                        <td className="p-4 font-mono text-slate-500">#{exec.id}</td>
                        <td className="p-4 text-slate-300 truncate max-w-[200px]">{exec.workflowName}</td>
                        <td className="p-4">
                          <span className={`px-2 py-1 font-bold uppercase text-[9px] rounded ${
                            exec.status === 'success' ? 'bg-emerald-500/10 text-emerald-500' :
                            exec.status === 'error'   ? 'bg-red-500/10 text-red-500' :
                            'bg-slate-500/10 text-slate-500'
                          }`}>{exec.status}</span>
                        </td>
                        <td className="p-4 text-slate-500">{new Date(exec.startedAt).toLocaleString('es')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>

        <footer className="py-6 px-10 text-center border-t border-primary/10">
          <p className="text-[10px] text-slate-500 uppercase tracking-widest">JAV LABS © 2024 - Enterprise Automation Engine</p>
        </footer>
      </div>
    </PortalLayout>
  );
}
