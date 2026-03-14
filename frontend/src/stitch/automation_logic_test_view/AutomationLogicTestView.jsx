import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PortalLayout from '../../components/PortalLayout';
import api from '../../services/api';
import './AutomationLogicTestView.css';

export default function AutomationLogicTestView() {
  const navigate = useNavigate();
  const [workflows, setWorkflows] = useState([]);
  const [selected,  setSelected]  = useState(null);
  const [loading,   setLoading]   = useState(true);
  const [toggling,  setToggling]  = useState(null);
  const [error,     setError]     = useState('');

  useEffect(() => {
    api.get('/n8n/workflows')
      .then(({ data }) => setWorkflows(data.data || data))
      .catch(() => setError('No se pudo conectar con n8n.'))
      .finally(() => setLoading(false));
  }, []);

  const toggleWorkflow = async (wf) => {
    setToggling(wf.id);
    try {
      const action = wf.active ? 'deactivate' : 'activate';
      await api.patch(`/n8n/workflows/${wf.id}/${action}`);
      setWorkflows(prev => prev.map(w => w.id === wf.id ? { ...w, active: !w.active } : w));
      if (selected?.id === wf.id) setSelected(prev => ({ ...prev, active: !prev.active }));
    } catch {
      setError('Error al cambiar el estado del workflow.');
    } finally {
      setToggling(null);
    }
  };

  const getWebhookUrl = (wf) => {
    const node = wf.nodes?.find(n => n.type?.toLowerCase().includes('webhook'));
    if (!node?.parameters?.path) return null;
    return `https://n8n-n8n.ak7rlh.easypanel.host/webhook/${node.parameters.path}`;
  };

  const getTriggerType = (wf) => {
    const t = wf.nodes?.find(n =>
      n.type?.toLowerCase().includes('trigger') ||
      n.type?.toLowerCase().includes('webhook') ||
      n.type?.toLowerCase().includes('schedule') ||
      n.type?.toLowerCase().includes('cron')
    );
    if (!t) return 'Manual';
    if (t.type?.toLowerCase().includes('webhook')) return 'Webhook';
    if (t.type?.toLowerCase().includes('schedule') || t.type?.toLowerCase().includes('cron')) return 'Schedule';
    return 'Trigger';
  };

  const n8nUrl = 'https://n8n-n8n.ak7rlh.easypanel.host';

  return (
    <PortalLayout>
      <div className="flex flex-col min-h-screen">
        <main className="flex-1 flex flex-col max-w-[1440px] mx-auto w-full px-6 py-8 gap-8">

          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <span>Automatizaciones</span>
              <span className="material-symbols-outlined text-xs">chevron_right</span>
              <span className="text-primary font-semibold">Workflows n8n</span>
            </div>
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold uppercase tracking-tight text-white">Workflows n8n</h1>
              <button onClick={() => navigate('/automatizaciones/nueva')}
                className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded flex items-center gap-2 text-sm font-bold uppercase tracking-widest transition-all">
                <span className="material-symbols-outlined text-[18px]">add</span>
                Nuevo Workflow
              </button>
            </div>
          </div>

          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/30 rounded flex items-center gap-3">
              <span className="material-symbols-outlined text-red-400">error</span>
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          <div className="flex flex-col lg:flex-row gap-6 flex-1">

            <div className="flex-1 flex flex-col gap-3">
              <p className="text-xs font-bold uppercase tracking-widest text-slate-500">
                {loading ? 'Cargando...' : `${workflows.length} workflows encontrados`}
              </p>

              {loading ? (
                [...Array(3)].map((_, i) => (
                  <div key={i} className="bg-slate-800/40 border border-slate-800 rounded p-5 animate-pulse h-20" />
                ))
              ) : workflows.length === 0 ? (
                <div className="text-center py-20 text-slate-500">
                  <span className="material-symbols-outlined text-5xl mb-4 block">account_tree</span>
                  <p className="text-sm uppercase tracking-widest">No hay workflows en n8n</p>
                </div>
              ) : workflows.map(wf => {
                const isSelected = selected?.id === wf.id;
                const isBusy    = toggling === wf.id;
                const trigger   = getTriggerType(wf);
                const webhook   = getWebhookUrl(wf);
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
                        <button
                          onClick={e => { e.stopPropagation(); toggleWorkflow(wf); }}
                          disabled={isBusy}
                          className={`px-3 py-1.5 text-xs font-bold uppercase tracking-widest border rounded transition-all disabled:opacity-50 ${wf.active ? 'border-slate-700 text-slate-400 hover:text-white' : 'border-primary text-primary hover:bg-primary/10'}`}>
                          {isBusy ? '...' : wf.active ? 'Desactivar' : 'Activar'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="w-full lg:w-96 flex flex-col gap-4">
              {selected ? (
                <div className="flex flex-col gap-4">
                  <div className="bg-slate-800/40 border border-slate-800 rounded p-6">
                    <h3 className="text-white font-bold text-sm uppercase tracking-widest mb-4 border-b border-slate-700 pb-3">
                      Detalle del Workflow
                    </h3>
                    <div className="space-y-3">
                      {[
                        { label: 'Nombre',   value: selected.name },
                        { label: 'ID',       value: selected.id, mono: true },
                        { label: 'Trigger',  value: getTriggerType(selected) },
                        { label: 'Nodos',    value: `${selected.nodes?.length || 0} nodos` },
                        { label: 'Updated',  value: selected.updatedAt ? new Date(selected.updatedAt).toLocaleString('es') : '—' },
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

                  <a href={`${n8nUrl}/workflow/${selected.id}`} target="_blank" rel="noreferrer"
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
        </main>

        <footer className="py-6 px-10 text-center border-t border-primary/10">
          <p className="text-[10px] text-slate-500 uppercase tracking-widest">JAV LABS © 2024 - Enterprise Automation Engine</p>
        </footer>
      </div>
    </PortalLayout>
  );
}
