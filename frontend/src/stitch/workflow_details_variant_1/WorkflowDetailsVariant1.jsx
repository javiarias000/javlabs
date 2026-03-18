import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PortalLayout from '../../components/PortalLayout';
import api from '../../services/api';
import './WorkflowDetailsVariant1.css';

const STATUS_CONFIG = {
  ACTIVE:   { label: 'Activo',   dot: 'bg-primary animate-pulse', text: 'text-primary'   },
  PAUSED:   { label: 'Pausado',  dot: 'bg-slate-500',              text: 'text-slate-500' },
  ERROR:    { label: 'Error',    dot: 'bg-red-500 animate-pulse',  text: 'text-red-500'   },
  INACTIVE: { label: 'Inactivo', dot: 'bg-slate-600',              text: 'text-slate-600' },
};

const TYPE_ICONS = {
  API_INTEGRATION: 'hub',
  PROCESS:         'account_tree',
  CHATBOT:         'chat',
  CRM:             'contacts',
};

export default function WorkflowDetailsVariant1() {
  const navigate    = useNavigate();
  const { id }      = useParams();
  const [auto,      setAuto]      = useState(null);
  const [loading,   setLoading]   = useState(true);
  const [toggling,  setToggling]  = useState(false);
  const [error,     setError]     = useState('');

  useEffect(() => {
    if (!id) { setError('No se especifico una automatizacion.'); setLoading(false); return; }
    api.get(`/automations/${id}`)
      .then(({ data }) => setAuto(data))
      .catch(() => setError('No se encontro la automatizacion.'))
      .finally(() => setLoading(false));
  }, [id]);

  const toggleStatus = async () => {
    if (!auto) return;
    const newStatus = auto.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE';
    setToggling(true);
    try {
      await api.patch(`/automations/${id}`, { status: newStatus });
      setAuto(prev => ({ ...prev, status: newStatus }));
    } catch {
      setError('Error al cambiar el estado.');
    } finally {
      setToggling(false);
    }
  };

  const openN8n = () => {
    window.open('https://n8n-n8n.ak7rlh.easypanel.host', '_blank');
  };

  if (loading) return (
    <PortalLayout>
      <div className="flex items-center justify-center min-h-screen text-slate-500">
        <span className="material-symbols-outlined animate-spin mr-2">progress_activity</span> Cargando...
      </div>
    </PortalLayout>
  );

  if (error || !auto) return (
    <PortalLayout>
      <div className="flex flex-col items-center justify-center min-h-screen text-slate-500 gap-4">
        <span className="material-symbols-outlined text-5xl">error</span>
        <p>{error || 'Automatizacion no encontrada.'}</p>
        <button onClick={() => navigate('/automatizaciones')}
          className="px-6 py-2 bg-primary text-white rounded text-sm font-bold uppercase tracking-widest hover:opacity-90">
          Ver automatizaciones
        </button>
      </div>
    </PortalLayout>
  );

  const cfg     = STATUS_CONFIG[auto.status] || STATUS_CONFIG.INACTIVE;
  const isPaused = auto.status === 'PAUSED';
  const successRate = auto.tasksRun > 0 ? 99 : 0;
  const typeIcon = TYPE_ICONS[auto.type] || 'bolt';

  return (
    <PortalLayout>
      <div className="flex flex-col min-h-screen">
        <main className="flex-1 p-8 max-w-[1440px] mx-auto w-full">

          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-2 font-montserrat text-sm text-slate-500 mb-2">
              <button onClick={() => navigate('/automatizaciones')} className="hover:text-primary transition-colors">Automatizaciones</button>
              <span className="material-symbols-outlined text-xs">chevron_right</span>
              <span className="text-primary">{auto.project?.name || 'Proyecto'}</span>
              <span className="material-symbols-outlined text-xs">chevron_right</span>
              <span className="text-slate-300">{auto.name}</span>
            </div>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <h1 className="font-michroma text-2xl lg:text-3xl text-slate-100 uppercase tracking-tight">
                {auto.name}
              </h1>
              <div className="flex items-center gap-3">
                <button onClick={toggleStatus} disabled={toggling}
                  className={`px-6 py-2 text-sm font-bold uppercase tracking-wider transition-colors disabled:opacity-50 ${
                    isPaused ? 'bg-primary text-white hover:bg-blue-600' : 'bg-slate-800 text-white hover:bg-slate-700'
                  }`}>
                  {toggling ? '...' : isPaused ? 'Reanudar' : 'Pausar'}
                </button>
                <button onClick={openN8n}
                  className="px-6 py-2 bg-primary text-white text-sm font-bold uppercase tracking-wider hover:bg-blue-600 transition-colors flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">open_in_new</span>
                  Editar en n8n
                </button>
              </div>
            </div>
          </div>

          {/* Status bar */}
          <div className="w-full border-y border-slate-800 py-3 mb-10 flex items-center justify-between px-4">
            <div className="flex items-center gap-3">
              <div className={`size-2 rounded-full ${cfg.dot}`}></div>
              <span className={`text-xs font-bold uppercase tracking-widest ${cfg.text}`}>Estado: {cfg.label}</span>
            </div>
            <div className="flex items-center gap-6 text-[10px] text-slate-500 uppercase tracking-widest font-medium">
              <span>Tipo: {auto.type?.replace('_', ' ')}</span>
              <span>Creado: {new Date(auto.createdAt).toLocaleDateString('es')}</span>
              <span>ID: {auto.id.slice(0, 8)}...</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

            {/* Left — flow visualization */}
            <div className="lg:col-span-8">
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-6">Visualizacion del Flujo</h3>
              <div className="flex flex-col">
                {[
                  { tag: 'Trigger', icon: 'bolt',        title: auto.type === 'API_INTEGRATION' ? 'Webhook Trigger' : 'Schedule Trigger', desc: auto.webhookUrl ? `URL: ${auto.webhookUrl.slice(0, 50)}...` : 'Trigger configurado en n8n' },
                  { tag: 'Proceso', icon: typeIcon,       title: auto.name,          desc: auto.description || 'Flujo configurado en n8n' },
                  { tag: 'Output',  icon: 'cloud_upload', title: 'Enviar resultado', desc: 'Destino configurado en n8n' },
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

              {/* Webhook URL si existe */}
              {auto.webhookUrl && (
                <div className="mt-8 bg-slate-900 border border-slate-800 p-6">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">Webhook URL</h3>
                  <div className="flex gap-2">
                    <input readOnly value={auto.webhookUrl}
                      className="flex-1 bg-slate-800 border border-slate-700 text-slate-300 text-xs px-3 py-2 font-mono" />
                    <button onClick={() => navigator.clipboard.writeText(auto.webhookUrl)}
                      className="px-3 py-2 bg-slate-700 hover:bg-slate-600 transition-colors">
                      <span className="material-symbols-outlined text-sm">content_copy</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Right — metrics */}
            <div className="lg:col-span-4 flex flex-col gap-4">
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Metricas de Rendimiento</h3>
              {[
                { label: 'Tareas Ejecutadas', value: auto.tasksRun?.toLocaleString() || '0', bar: Math.min((auto.tasksRun / 100) * 100, 100), sub: null },
                { label: 'Tasa de Exito',     value: auto.tasksRun > 0 ? `${successRate}%` : 'N/A', bar: successRate, sub: auto.tasksRun > 0 ? 'Basado en ejecuciones' : null },
                { label: 'Tiempo Ahorrado',   value: `${auto.timeSaved ?? 0}h`, bar: null, sub: 'Calculado segun proceso manual estandar.' },
              ].map(m => (
                <div key={m.label} className="bg-slate-900/50 border border-slate-800 p-6">
                  <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">{m.label}</p>
                  <p className="font-michroma text-2xl text-slate-100">{m.value}</p>
                  {m.bar !== null && <div className="mt-4 h-1 bg-slate-800"><div className="h-1 bg-primary transition-all" style={{ width: `${m.bar}%` }}></div></div>}
                  {m.sub && <p className="text-[10px] text-slate-500 mt-2 uppercase tracking-tighter">{m.sub}</p>}
                </div>
              ))}

              {/* Info del proyecto */}
              {auto.project && (
                <div className="bg-slate-900/50 border border-slate-800 p-6">
                  <p className="text-[10px] uppercase font-bold text-slate-400 mb-3">Proyecto</p>
                  <p className="text-white font-medium text-sm">{auto.project.name}</p>
                  <p className="text-slate-500 text-xs mt-1">ID: {auto.project.id?.slice(0,8)}...</p>
                </div>
              )}

              {/* Acciones */}
              <div className="flex flex-col gap-2">
                <button onClick={openN8n}
                  className="w-full px-4 py-3 border border-primary/40 text-primary text-xs font-bold uppercase tracking-widest hover:bg-primary/10 transition-all flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined text-sm">open_in_new</span>
                  Ver en n8n
                </button>
                <button onClick={() => navigate('/automatizaciones/logs')}
                  className="w-full px-4 py-3 border border-slate-700 text-slate-400 text-xs font-bold uppercase tracking-widest hover:text-white hover:border-white transition-all flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined text-sm">terminal</span>
                  Ver Logs
                </button>
              </div>
            </div>
          </div>

          {/* Footer info */}
          <div className="mt-16 border-t border-slate-800 pt-8 flex flex-wrap justify-between items-center gap-4 text-[10px] text-slate-600 uppercase tracking-widest">
            <div>JAV LABS AUTOMATION ENGINE v4.2.0</div>
            <div className="flex gap-6">
              <span>Creado: {new Date(auto.createdAt).toLocaleString('es')}</span>
              <span>Actualizado: {new Date(auto.updatedAt).toLocaleString('es')}</span>
            </div>
          </div>
        </main>
      </div>
    </PortalLayout>
  );
}
