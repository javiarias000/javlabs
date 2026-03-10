import { Link, useNavigate } from 'react-router-dom';
import './ActiveAutomationsListView.css';

export default function ActiveAutomationsListView() {
  const navigate = useNavigate();
  return (
    <div className="flex h-screen bg-background-dark">
      <aside className="w-64 border-r border-slate-800 flex flex-col h-screen sticky top-0 bg-background-dark">
        <div className="p-6 flex flex-col gap-8 h-full">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded bg-primary flex items-center justify-center text-white">
              <span className="material-symbols-outlined">biotech</span>
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-tight uppercase text-white">JAV LABS</h2>
              <p className="text-xs text-slate-400">Portal de Cliente</p>
            </div>
          </div>
          <nav className="flex flex-col gap-2">
            <button onClick={() => navigate('/dashboard/overview')} className="flex items-center gap-3 px-3 py-2 rounded text-slate-400 hover:bg-slate-800 hover:text-white transition-colors text-left">
              <span className="material-symbols-outlined text-[20px]">dashboard</span>
              <span className="text-sm font-medium">Dashboard</span>
            </button>
            <button className="flex items-center gap-3 px-3 py-2 rounded bg-primary/10 text-primary transition-colors text-left">
              <span className="material-symbols-outlined text-[20px]">settings_input_component</span>
              <span className="text-sm font-medium">Automatizaciones</span>
            </button>
            <button onClick={() => navigate('/automatizaciones/logs')} className="flex items-center gap-3 px-3 py-2 rounded text-slate-400 hover:bg-slate-800 hover:text-white transition-colors text-left">
              <span className="material-symbols-outlined text-[20px]">terminal</span>
              <span className="text-sm font-medium">Logs de Ejecución</span>
            </button>
            <button onClick={() => navigate('/automatizaciones/tabla')} className="flex items-center gap-3 px-3 py-2 rounded text-slate-400 hover:bg-slate-800 hover:text-white transition-colors text-left">
              <span className="material-symbols-outlined text-[20px]">corporate_fare</span>
              <span className="text-sm font-medium">Tabla</span>
            </button>
          </nav>
          <div className="mt-auto pt-6 border-t border-slate-800 flex flex-col gap-2">
            <button onClick={() => navigate('/soporte/chat')} className="flex items-center gap-3 px-3 py-2 rounded text-slate-400 hover:bg-slate-800 hover:text-white transition-colors text-left">
              <span className="material-symbols-outlined text-[20px]">help_center</span>
              <span className="text-sm font-medium">Soporte</span>
            </button>
            <button onClick={() => navigate('/dashboard')} className="flex items-center gap-3 px-3 py-2 rounded text-slate-400 hover:bg-slate-800 hover:text-white transition-colors text-left">
              <span className="material-symbols-outlined text-[20px]">settings</span>
              <span className="text-sm font-medium">Configuración</span>
            </button>
          </div>
        </div>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto">
        <header className="flex justify-between items-end mb-10">
          <div>
            <h1 className="text-4xl font-bold uppercase tracking-tighter text-white leading-none">Automatizaciones Activas</h1>
            <p className="text-slate-400 mt-2">Actualmente hay <span className="text-primary font-bold">12 flujos</span> en ejecución continua.</p>
          </div>
          <button onClick={() => navigate('/automatizaciones/nueva')}
            className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded flex items-center gap-2 text-sm font-bold uppercase tracking-widest transition-all">
            <span className="material-symbols-outlined text-[18px]">add</span>
            Nueva Automatización
          </button>
        </header>

        <div className="bg-slate-800/50 p-2 rounded-lg mb-8 flex flex-wrap gap-2 items-center">
          <div className="flex-1 min-w-[300px] relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
            <input className="w-full bg-slate-900 border-none rounded py-2.5 pl-10 pr-4 text-sm focus:ring-1 focus:ring-primary text-slate-200 placeholder:text-slate-500"
              placeholder="Buscar automatización por nombre o ID..." type="text" />
          </div>
        </div>

        <section className="flex flex-col gap-4">
          {[
            { name: 'CRM Sync v2.0',    status: 'active',  uptime: '99.9%', lastRun: '2 min ago', tasks: '1.2k',  icons: ['database','hub','cloud_sync'] },
            { name: 'RRHH Onboarding',  status: 'paused',  uptime: '95.0%', lastRun: '1h ago',    tasks: '450',   icons: ['person_add','mail','badge'] },
            { name: 'Finanzas Ledger',  status: 'alert',   uptime: '88.2%', lastRun: '5 min ago', tasks: '890',   icons: ['account_balance','warning','summarize'] },
            { name: 'API Gateway X',    status: 'active',  uptime: '100%',  lastRun: '10s ago',   tasks: '15.4k', icons: ['api','security','output'] },
          ].map(item => {
            const isActive = item.status === 'active';
            const isPaused = item.status === 'paused';
            const isAlert  = item.status === 'alert';
            return (
              <div key={item.name} className="bg-slate-800/40 p-6 rounded border border-slate-800 transition-all cursor-default hover:border-slate-700">
                <div className="flex items-center justify-between gap-6">
                  <div className="w-1/4">
                    <h3 className="text-xl font-bold uppercase tracking-tight text-white">{item.name}</h3>
                    <div className="flex items-center gap-2 mt-2">
                      <span className={`w-2 h-2 rounded-full block ${isActive ? 'bg-primary animate-pulse' : isAlert ? 'bg-red-500 animate-pulse' : 'bg-slate-500'}`}></span>
                      <span className={`text-xs font-bold uppercase tracking-widest ${isActive ? 'text-primary' : isAlert ? 'text-red-500' : 'text-slate-500'}`}>
                        {isActive ? 'Activo' : isAlert ? 'Alerta' : 'Pausado'}
                      </span>
                    </div>
                  </div>
                  <div className={`flex-1 flex items-center justify-center ${isPaused ? 'opacity-40 grayscale' : ''}`}>
                    <div className="flex items-center gap-4">
                      {item.icons.map((icon, i) => (
                        <div key={i} className="flex items-center gap-4">
                          <div className={`w-8 h-8 rounded flex items-center justify-center ${isAlert && i === 1 ? 'bg-red-500/10' : 'bg-slate-900'}`}>
                            <span className={`material-symbols-outlined text-[18px] ${isAlert && i === 1 ? 'text-red-500' : 'text-primary'}`}>{icon}</span>
                          </div>
                          {i < item.icons.length - 1 && (
                            <div className={`w-16 h-[1px] ${isAlert ? 'bg-red-500/50' : 'bg-gradient-to-r from-primary to-primary/20'}`}></div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="w-1/3 grid grid-cols-3 gap-4 border-l border-slate-700 pl-6">
                    {[['Uptime', item.uptime], ['Last Run', item.lastRun], ['Tasks', item.tasks]].map(([label, val]) => (
                      <div key={label} className="flex flex-col">
                        <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">{label}</span>
                        <span className="text-sm font-medium text-slate-200">{val}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-4 ml-4">
                    <button className="text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-white transition-colors border border-slate-700 px-3 py-1.5 rounded">
                      {isPaused ? 'Reanudar' : 'Pausar'}
                    </button>
                    <Link to="/automatizaciones/logs" className="text-xs font-bold uppercase tracking-widest text-primary hover:underline">Ver Logs</Link>
                  </div>
                </div>
              </div>
            );
          })}
        </section>

        <footer className="mt-8 flex justify-between items-center text-slate-500 text-xs uppercase tracking-widest">
          <div>Mostrando 4 de 12 automatizaciones</div>
          <div className="flex gap-4">
            <button className="flex items-center gap-1 hover:text-primary transition-colors opacity-30" disabled>
              <span className="material-symbols-outlined text-[16px]">chevron_left</span> Anterior
            </button>
            <div className="flex gap-2">
              <span className="text-primary font-bold">1</span>
              <span className="hover:text-primary cursor-pointer">2</span>
              <span className="hover:text-primary cursor-pointer">3</span>
            </div>
            <button className="flex items-center gap-1 hover:text-primary transition-colors">
              Siguiente <span className="material-symbols-outlined text-[16px]">chevron_right</span>
            </button>
          </div>
        </footer>
      </main>
    </div>
  );
}
