import { useNavigate } from 'react-router-dom';
import PortalLayout from '../../components/PortalLayout';
import './NewAutomationWizardStep1.css';

export default function NewAutomationWizardStep1() {
  const navigate = useNavigate();
  return (
    <PortalLayout>
      <div className="flex flex-col min-h-screen bg-background-dark">
        <main className="flex-1 flex flex-col items-center justify-start py-12 px-6">
          <div className="w-full max-w-5xl">

            <div className="mb-8 w-full">
              <div className="flex items-center justify-between mb-2">
                {[
                  { n: '1.', label: 'Trigger',  active: true  },
                  { n: '2.', label: 'Lógica',   active: false },
                  { n: '3.', label: 'Acción',   active: false },
                  { n: '4.', label: 'Test',      active: false },
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
              <div className="flex-1 p-10 border-r border-space-gray">
                <div className="mb-10">
                  <h1 className="text-white text-4xl font-bold tracking-tight mb-2">New Automation</h1>
                  <p className="text-slate-400">Step 1: Configure your automation entry point.</p>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  <button className="flex items-center gap-6 p-6 border-2 border-primary bg-primary/5 text-left transition-all">
                    <div className="p-3 bg-primary text-white">
                      <span className="material-symbols-outlined text-3xl">settings_ethernet</span>
                    </div>
                    <div>
                      <h3 className="text-slate-100 font-bold text-lg">Webhook</h3>
                      <p className="text-slate-400 text-sm">Receive real-time data via HTTP POST requests.</p>
                    </div>
                    <div className="ml-auto">
                      <span className="material-symbols-outlined text-primary">check_circle</span>
                    </div>
                  </button>
                  <button className="flex items-center gap-6 p-6 border border-space-gray hover:border-slate-500 text-left transition-all group">
                    <div className="p-3 bg-space-gray group-hover:bg-slate-700 text-slate-300 transition-colors">
                      <span className="material-symbols-outlined text-3xl">schedule</span>
                    </div>
                    <div>
                      <h3 className="text-slate-100 font-bold text-lg">Schedule</h3>
                      <p className="text-slate-400 text-sm">Run automation at specific intervals or times.</p>
                    </div>
                  </button>
                  <button className="flex items-center gap-6 p-6 border border-space-gray hover:border-slate-500 text-left transition-all group">
                    <div className="p-3 bg-space-gray group-hover:bg-slate-700 text-slate-300 transition-colors">
                      <span className="material-symbols-outlined text-3xl">widgets</span>
                    </div>
                    <div>
                      <h3 className="text-slate-100 font-bold text-lg">App Event</h3>
                      <p className="text-slate-400 text-sm">Trigger based on internal system actions.</p>
                    </div>
                  </button>
                </div>
              </div>

              <div className="w-full md:w-96 bg-background-dark/50 p-10">
                <h2 className="text-slate-100 text-xl font-bold mb-8 uppercase tracking-wider border-b border-space-gray pb-4">Detalles del Trigger</h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">Webhook URL</label>
                    <div className="flex">
                      <input className="bg-wizard-black border border-space-gray text-slate-100 text-sm w-full px-3 py-2" readOnly type="text" value="https://api.javlabs.io/wh/3829-x..." />
                      <button className="bg-space-gray hover:bg-slate-700 text-white px-3 border-y border-r border-space-gray">
                        <span className="material-symbols-outlined text-sm">content_copy</span>
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">Secret Key</label>
                    <input className="bg-wizard-black border border-space-gray text-slate-100 text-sm w-full px-3 py-2" type="password" defaultValue="••••••••••••••••" />
                    <p className="text-[10px] text-slate-500 mt-2 uppercase">Used to sign and verify incoming payloads.</p>
                  </div>
                  <div>
                    <label className="block text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">Retry Policy</label>
                    <select className="bg-wizard-black border border-space-gray text-slate-100 text-sm w-full px-3 py-2">
                      <option>Exponential Backoff</option>
                      <option>Linear Retry</option>
                      <option>No Retry</option>
                    </select>
                  </div>
                  <div className="pt-4">
                    <div className="p-4 bg-primary/10 border border-primary/20 flex gap-3">
                      <span className="material-symbols-outlined text-primary">info</span>
                      <p className="text-xs text-slate-300 leading-relaxed">Wait for a test payload to verify the connection before proceeding to Step 2.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-end gap-4">
              <button onClick={() => navigate('/automatizaciones')} className="px-8 py-3 text-slate-400 hover:text-white font-bold uppercase tracking-widest transition-colors">
                Atrás
              </button>
              <button onClick={() => navigate('/automatizaciones/logica')} className="px-8 py-3 bg-gradient-to-r from-primary to-blue-700 text-white font-bold uppercase tracking-widest shadow-lg shadow-primary/20 hover:opacity-90 transition-opacity">
                Siguiente Paso
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
