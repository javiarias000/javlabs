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

const TYPE_MAP = {
  WEBHOOK:   'API_INTEGRATION',
  SCHEDULE:  'PROCESS',
  APP_EVENT: 'PROCESS',
};

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

  // Cargar proyectos al montar
  useState(() => {
    setLoadingProj(true);
    api.get('/projects')
      .then(({ data }) => setProjects(data?.projects || data || []))
      .catch(() => {})
      .finally(() => setLoadingProj(false));
  }, []);

  const handleSubmit = async () => {
    setError('');
    if (!name.trim())      return setError('El nombre es obligatorio.');
    if (!projectId)        return setError('Selecciona un proyecto.');

    setLoading(true);
    try {
      const { data } = await api.post('/automations', {
        name:        name.trim(),
        description: description.trim(),
        type:        TYPE_MAP[trigger],
        projectId,
        webhookUrl:  trigger === 'WEBHOOK' ? `https://api.javlabs.io/wh/${crypto.randomUUID().slice(0,8)}` : null,
      });
      navigate('/automatizaciones', { state: { created: data.name } });
    } catch (err) {
      setError(err.response?.data?.error || 'Error al crear la automatización.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PortalLayout>
      <div className="flex flex-col min-h-screen bg-background-dark">
        <main className="flex-1 flex flex-col items-center justify-start py-12 px-6">
          <div className="w-full max-w-5xl">

            {/* Steps */}
            <div className="mb-8 w-full">
              <div className="flex items-center justify-between mb-2">
                {[
                  { n: '1.', label: 'Trigger', active: true  },
                  { n: '2.', label: 'Lógica',  active: false },
                  { n: '3.', label: 'Acción',  active: false },
                  { n: '4.', label: 'Test',    active: false },
                ].map(s => (
                  <div key={s.label} className="flex items-center gap-2">
                    <span className={s.active ? 'text-primary font-bold' : 'text-slate-500'}>{s.n}</span>
                    <span className={`uppercase tracking-widest text-sm ${s.active ? 'text-slate-100 font-bold' : 'text-slate-500'}`}>{s.label}</span>
                  </div>
                ))}
              </div>
              <div className="h-1 w-full bg-space-gray step-gradient"></div>
            </div>

            <div className="bg-wizard-black border border-space-gray shadow-2xl flex flex-col md:flex-row min-h-[600px]">

              {/* Left — trigger selector */}
              <div className="flex-1 p-10 border-r border-space-gray">
                <div className="mb-10">
                  <h1 className="text-white text-4xl font-bold tracking-tight mb-2">Nueva Automatización</h1>
                  <p className="text-slate-400">Paso 1: Configura el punto de entrada.</p>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  {TRIGGER_TYPES.map(t => {
                    const active = trigger === t.id;
                    return (
                      <button key={t.id} onClick={() => setTrigger(t.id)}
                        className={`flex items-center gap-6 p-6 text-left transition-all border-2 ${active ? 'border-primary bg-primary/5' : 'border-space-gray hover:border-slate-500'}`}>
                        <div className={`p-3 text-white ${active ? 'bg-primary' : 'bg-space-gray'}`}>
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

              {/* Right — form */}
              <div className="w-full md:w-96 bg-background-dark/50 p-10">
                <h2 className="text-slate-100 text-xl font-bold mb-8 uppercase tracking-wider border-b border-space-gray pb-4">
                  Detalles
                </h2>
                <div className="space-y-5">

                  {/* Nombre */}
                  <div>
                    <label className="block text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">
                      Nombre <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="Ej: CRM Sync v2.0"
                      className="bg-wizard-black border border-space-gray text-slate-100 text-sm w-full px-3 py-2 focus:border-primary focus:ring-1 focus:ring-primary outline-none placeholder:text-slate-600"
                    />
                  </div>

                  {/* Descripción */}
                  <div>
                    <label className="block text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">Descripción</label>
                    <textarea
                      value={description}
                      onChange={e => setDescription(e.target.value)}
                      placeholder="¿Qué hace esta automatización?"
                      rows={3}
                      className="bg-wizard-black border border-space-gray text-slate-100 text-sm w-full px-3 py-2 focus:border-primary focus:ring-1 focus:ring-primary outline-none resize-none placeholder:text-slate-600"
                    />
                  </div>

                  {/* Proyecto */}
                  <div>
                    <label className="block text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">
                      Proyecto <span className="text-red-400">*</span>
                    </label>
                    <select
                      value={projectId}
                      onChange={e => setProjectId(e.target.value)}
                      className="bg-wizard-black border border-space-gray text-slate-100 text-sm w-full px-3 py-2 focus:border-primary outline-none">
                      <option value="">— Seleccionar proyecto —</option>
                      {loadingProj ? (
                        <option disabled>Cargando...</option>
                      ) : (
                        projects.map(p => (
                          <option key={p.id} value={p.id}>{p.name}</option>
                        ))
                      )}
                    </select>
                  </div>

                  {/* Webhook URL (solo si trigger = WEBHOOK) */}
                  {trigger === 'WEBHOOK' && (
                    <div>
                      <label className="block text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">Webhook URL</label>
                      <div className="flex">
                        <input
                          readOnly
                          type="text"
                          value="Se generará al crear"
                          className="bg-wizard-black border border-space-gray text-slate-500 text-xs w-full px-3 py-2 italic"
                        />
                      </div>
                      <p className="text-[10px] text-slate-600 mt-1 uppercase">La URL se genera automáticamente.</p>
                    </div>
                  )}

                  {/* Schedule (solo si trigger = SCHEDULE) */}
                  {trigger === 'SCHEDULE' && (
                    <div>
                      <label className="block text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">Frecuencia</label>
                      <select className="bg-wizard-black border border-space-gray text-slate-100 text-sm w-full px-3 py-2 focus:border-primary outline-none">
                        <option>Cada hora</option>
                        <option>Cada día a las 9:00</option>
                        <option>Cada semana</option>
                        <option>Personalizado (cron)</option>
                      </select>
                    </div>
                  )}

                  {/* Error */}
                  {error && (
                    <div className="p-3 bg-red-500/10 border border-red-500/30 flex items-center gap-2">
                      <span className="material-symbols-outlined text-red-400 text-sm">error</span>
                      <p className="text-xs text-red-400">{error}</p>
                    </div>
                  )}

                  {/* Info */}
                  <div className="p-4 bg-primary/10 border border-primary/20 flex gap-3">
                    <span className="material-symbols-outlined text-primary text-sm">info</span>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Completa el nombre y selecciona un proyecto para continuar.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="mt-8 flex justify-between gap-4">
              <button onClick={() => navigate('/automatizaciones')}
                className="px-8 py-3 text-slate-400 hover:text-white font-bold uppercase tracking-widest transition-colors">
                Atrás
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="px-8 py-3 bg-gradient-to-r from-primary to-blue-700 text-white font-bold uppercase tracking-widest shadow-lg shadow-primary/20 hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-2">
                {loading && <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>}
                {loading ? 'Creando...' : 'Crear Automatización'}
              </button>
            </div>
          </div>
        </main>

        <footer className="p-6 text-center border-t border-space-gray">
          <p className="text-slate-600 text-xs uppercase tracking-[0.2em]">JAV LABS © 2024 • Automation Engine v2.4.1</p>
        </footer>
      </div>
    </PortalLayout>
  );
}
