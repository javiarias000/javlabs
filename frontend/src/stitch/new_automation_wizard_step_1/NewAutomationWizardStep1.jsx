import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PortalLayout from '../../components/PortalLayout';
import api from '../../services/api';
import './NewAutomationWizardStep1.css';

const TRIGGER_TYPES = [
  { id: 'WEBHOOK',   icon: 'settings_ethernet', label: 'Webhook',   desc: 'Recibe datos en tiempo real via HTTP POST.' },
  { id: 'SCHEDULE',  icon: 'schedule',           label: 'Schedule',  desc: 'Ejecuta la automatización en intervalos programados.' },
  { id: 'APP_EVENT', icon: 'widgets',             label: 'App Event', desc: 'Dispara según acciones internas del sistema.' },
];

const TYPE_MAP = { WEBHOOK: 'API_INTEGRATION', SCHEDULE: 'PROCESS', APP_EVENT: 'PROCESS' };
const N8N_URL  = 'https://n8n-n8n.ak7rlh.easypanel.host';

export default function NewAutomationWizardStep1() {
  const navigate = useNavigate();
  const [trigger,     setTrigger]     = useState('WEBHOOK');
  const [name,        setName]        = useState('');
  const [description, setDescription] = useState('');
  const [projectId,   setProjectId]   = useState('');
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState('');
  const [projects,    setProjects]    = useState([]);
  const [loadingProj, setLoadingProj] = useState(false);
  const [created,     setCreated]     = useState(null);

  useState(() => {
    setLoadingProj(true);
    api.get('/projects')
      .then(({ data }) => setProjects(data?.projects || data || []))
      .catch(() => {})
      .finally(() => setLoadingProj(false));
  }, []);

  const handleSubmit = async () => {
    setError('');
    if (!name.trim()) return setError('El nombre es obligatorio.');
    if (!projectId)   return setError('Selecciona un proyecto.');
    setLoading(true);
    try {
      const { data } = await api.post('/automations', {
        name:        name.trim(),
        description: description.trim(),
        type:        TYPE_MAP[trigger],
        projectId,
        webhookUrl:  trigger === 'WEBHOOK' ? `${N8N_URL}/webhook/${crypto.randomUUID().slice(0,8)}` : null,
      });
      setCreated(data);
    } catch (err) {
      setError(err.response?.data?.error || 'Error al crear la automatización.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setCreated(null); setName(''); setDescription('');
    setProjectId(''); setTrigger('WEBHOOK'); setError('');
  };

  if (created) {
    return (
      <PortalLayout>
        <div className="flex flex-col min-h-screen bg-background-dark items-center justify-center px-6">
          <div className="w-full max-w-lg text-center">
            <div className="size-20 bg-primary/10 border border-primary/30 rounded-full flex items-center justify-center mx-auto mb-8">
              <span className="material-symbols-outlined text-primary text-4xl">check_circle</span>
            </div>
            <h1 className="text-white text-3xl font-bold tracking-tight mb-3">Automatizacion Creada</h1>
            <p className="text-slate-400 mb-2">
              <span className="text-white font-bold">{created.name}</span> fue registrada exitosamente.
            </p>
            <p className="text-slate-500 text-sm mb-10">Ahora configura la logica, triggers y nodos en n8n.</p>
            <div className="flex flex-col gap-4">
              <a href={N8N_URL} target="_blank" rel="noreferrer"
                className="flex items-center justify-center gap-3 px-8 py-4 text-white font-bold uppercase tracking-widest rounded hover:opacity-90 transition-all"
                style={{ background: 'linear-gradient(90deg, #0d7ff2, #8b5cf6)' }}>
                <span className="material-symbols-outlined">open_in_new</span>
                Configurar en n8n
              </a>
              <button onClick={() => navigate('/automatizaciones')}
                className="px-8 py-3 border border-slate-700 text-slate-400 hover:text-white hover:border-white font-bold uppercase tracking-widest rounded transition-all text-sm">
                Ver todas las automatizaciones
              </button>
              <button onClick={resetForm}
                className="text-slate-600 hover:text-slate-400 text-xs uppercase tracking-widest transition-colors">
                Crear otra automatizacion
              </button>
            </div>
          </div>
        </div>
      </PortalLayout>
    );
  }

  return (
    <PortalLayout>
      <div className="flex flex-col min-h-screen bg-background-dark">
        <main className="flex-1 flex flex-col items-center justify-start py-12 px-6">
          <div className="w-full max-w-5xl">
            <div className="mb-8 w-full">
              <div className="flex items-center justify-between mb-2">
                {[
                  { n: '1.', label: 'Trigger', active: true  },
                  { n: '2.', label: 'Logica',  active: false },
                  { n: '3.', label: 'Accion',  active: false },
                  { n: '4.', label: 'Test',    active: false },
                ].map(s => (
                  <div key={s.label} className="flex items-center gap-2">
                    <span className={s.active ? 'text-primary font-bold' : 'text-slate-500'}>{s.n}</span>
                    <span className={`uppercase tracking-widest text-sm ${s.active ? 'text-slate-100 font-bold' : 'text-slate-500'}`}>{s.label}</span>
                  </div>
                ))}
              </div>
              <div className="h-1 w-full bg-slate-800"></div>
            </div>

            <div className="bg-slate-900 border border-slate-800 shadow-2xl flex flex-col md:flex-row min-h-[600px]">
              <div className="flex-1 p-10 border-r border-slate-800">
                <div className="mb-10">
                  <h1 className="text-white text-4xl font-bold tracking-tight mb-2">Nueva Automatizacion</h1>
                  <p className="text-slate-400">Paso 1: Configura el punto de entrada.</p>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  {TRIGGER_TYPES.map(t => {
                    const active = trigger === t.id;
                    return (
                      <button key={t.id} onClick={() => setTrigger(t.id)}
                        className={`flex items-center gap-6 p-6 text-left transition-all border-2 ${active ? 'border-primary bg-primary/5' : 'border-slate-700 hover:border-slate-500'}`}>
                        <div className={`p-3 text-white ${active ? 'bg-primary' : 'bg-slate-700'}`}>
                          <span className="material-symbols-outlined text-3xl">{t.icon}</span>
                        </div>
                        <div>
                          <h3 className="text-slate-100 font-bold text-lg">{t.label}</h3>
                          <p className="text-slate-400 text-sm">{t.desc}</p>
                        </div>
                        {active && <span className="material-symbols-outlined text-primary ml-auto">check_circle</span>}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="w-full md:w-96 bg-background-dark/50 p-10">
                <h2 className="text-slate-100 text-xl font-bold mb-8 uppercase tracking-wider border-b border-slate-700 pb-4">Detalles</h2>
                <div className="space-y-5">
                  <div>
                    <label className="block text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">Nombre <span className="text-red-400">*</span></label>
                    <input type="text" value={name} onChange={e => setName(e.target.value)}
                      placeholder="Ej: CRM Sync v2.0"
                      className="bg-slate-900 border border-slate-700 text-slate-100 text-sm w-full px-3 py-2 focus:border-primary outline-none placeholder:text-slate-600" />
                  </div>
                  <div>
                    <label className="block text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">Descripcion</label>
                    <textarea value={description} onChange={e => setDescription(e.target.value)}
                      placeholder="Que hace esta automatizacion?" rows={3}
                      className="bg-slate-900 border border-slate-700 text-slate-100 text-sm w-full px-3 py-2 focus:border-primary outline-none resize-none placeholder:text-slate-600" />
                  </div>
                  <div>
                    <label className="block text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">Proyecto <span className="text-red-400">*</span></label>
                    <select value={projectId} onChange={e => setProjectId(e.target.value)}
                      className="bg-slate-900 border border-slate-700 text-slate-100 text-sm w-full px-3 py-2 focus:border-primary outline-none">
                      <option value="">Seleccionar proyecto</option>
                      {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                  </div>
                  {trigger === 'WEBHOOK' && (
                    <div>
                      <label className="block text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">Webhook URL</label>
                      <input readOnly value="Se generara al crear"
                        className="bg-slate-900 border border-slate-700 text-slate-500 text-xs w-full px-3 py-2 italic" />
                      <p className="text-[10px] text-slate-600 mt-1 uppercase">La URL se genera automaticamente.</p>
                    </div>
                  )}
                  {trigger === 'SCHEDULE' && (
                    <div>
                      <label className="block text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">Frecuencia</label>
                      <select className="bg-slate-900 border border-slate-700 text-slate-100 text-sm w-full px-3 py-2 outline-none">
                        <option>Cada hora</option>
                        <option>Cada dia a las 9:00</option>
                        <option>Cada semana</option>
                        <option>Personalizado (cron)</option>
                      </select>
                    </div>
                  )}
                  {error && (
                    <div className="p-3 bg-red-500/10 border border-red-500/30 flex items-center gap-2">
                      <span className="material-symbols-outlined text-red-400 text-sm">error</span>
                      <p className="text-xs text-red-400">{error}</p>
                    </div>
                  )}
                  <div className="p-4 bg-primary/10 border border-primary/20 flex gap-3">
                    <span className="material-symbols-outlined text-primary text-sm">info</span>
                    <p className="text-xs text-slate-300 leading-relaxed">Completa el nombre y selecciona un proyecto para continuar.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-between gap-4">
              <button onClick={() => navigate('/automatizaciones')}
                className="px-8 py-3 text-slate-400 hover:text-white font-bold uppercase tracking-widest transition-colors">
                Atras
              </button>
              <button onClick={handleSubmit} disabled={loading}
                className="px-8 py-3 bg-gradient-to-r from-primary to-blue-700 text-white font-bold uppercase tracking-widest shadow-lg hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-2">
                {loading ? 'Creando...' : 'Crear Automatizacion'}
              </button>
            </div>
          </div>
        </main>
        <footer className="p-6 text-center border-t border-slate-800">
          <p className="text-slate-600 text-xs uppercase tracking-[0.2em]">JAV LABS 2024 Automation Engine v2.4.1</p>
        </footer>
      </div>
    </PortalLayout>
  );
}
