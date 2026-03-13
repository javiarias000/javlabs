import { Link, useNavigate } from 'react-router-dom';
import PortalLayout from '../../components/PortalLayout';
import './AutomationLogsErrorTracking.css';

export default function AutomationLogsErrorTracking() {
  const navigate = useNavigate();
  return (
    <PortalLayout>
      <div className="flex flex-col h-screen overflow-hidden">

        <header className="h-16 flex items-center justify-between px-8 border-b border-primary/20 bg-background-dark/80 backdrop-blur-md z-30">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3 text-primary">
              <span className="material-symbols-outlined text-3xl">settings_input_component</span>
              <h1 className="font-michroma text-sm tracking-wider text-slate-100 uppercase">Registro de Automatizaciones</h1>
            </div>
            <div className="h-6 w-[1px] bg-primary/20"></div>
            <nav className="flex gap-6">
              <Link to="/automatizaciones/logs" className="text-xs uppercase tracking-widest text-primary font-bold">Logs</Link>
              <Link to="/dashboard" className="text-xs uppercase tracking-widest text-slate-400 hover:text-white transition-colors">Dashboard</Link>
              <Link to="/dashboard/overview" className="text-xs uppercase tracking-widest text-slate-400 hover:text-white transition-colors">Configuración</Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative w-72">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">search</span>
              <input className="w-full bg-slate-900/50 border border-slate-700 text-[10px] py-2 pl-10 pr-4 focus:ring-1 focus:ring-primary focus:border-primary outline-none uppercase tracking-tighter" placeholder="BUSCAR POR ID O FLUJO..." type="text" />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 border border-slate-700 bg-slate-900/50 hover:bg-slate-800 transition-colors">
              <span className="material-symbols-outlined text-sm">account_circle</span>
              <span className="text-[10px] font-bold uppercase tracking-widest">JAV_ADMIN</span>
            </button>
          </div>
        </header>

        <div className="flex flex-1 overflow-hidden">
          <main className="flex-1 flex flex-col overflow-hidden">
            <div className="h-14 border-b border-primary/10 flex items-center px-8 gap-4 bg-background-dark/20">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Estado:</span>
                <button className="flex items-center gap-2 px-3 py-1 border border-slate-700 text-[10px] uppercase tracking-tighter hover:border-primary transition-colors">
                  Todos <span className="material-symbols-outlined text-xs">expand_more</span>
                </button>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Flujo:</span>
                <button className="flex items-center gap-2 px-3 py-1 border border-slate-700 text-[10px] uppercase tracking-tighter hover:border-primary transition-colors">
                  Todos <span className="material-symbols-outlined text-xs">expand_more</span>
                </button>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Rango de Fechas:</span>
                <button className="flex items-center gap-2 px-3 py-1 border border-slate-700 text-[10px] uppercase tracking-tighter hover:border-primary transition-colors">
                  Últimas 24 Horas <span className="material-symbols-outlined text-xs">calendar_today</span>
                </button>
              </div>
              <div className="ml-auto flex gap-2">
                <button className="px-4 py-1 border border-slate-700 text-[10px] uppercase tracking-widest text-slate-400 hover:text-white transition-all">Limpiar Filtros</button>
                <button className="px-6 py-1 bg-primary text-white text-[10px] uppercase font-bold tracking-widest hover:brightness-110 transition-all">Actualizar</button>
              </div>
            </div>

            <div className="flex-1 overflow-auto custom-scrollbar p-8">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="text-left border-b border-slate-700">
                    <th className="pb-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest px-4">ID de Ejecución</th>
                    <th className="pb-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest px-4">Flujo</th>
                    <th className="pb-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest px-4">Inicio</th>
                    <th className="pb-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest px-4">Duración</th>
                    <th className="pb-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest px-4">Estado</th>
                    <th className="pb-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest px-4">Acciones</th>
                  </tr>
                </thead>
                <tbody className="text-sm font-medium">
                  {[
                    { id: '#JV-99281', flow: 'Shopify Inventory Sync',      date: '24 Oct 2023 - 14:20:05', dur: '1.2s',    ok: true  },
                    { id: '#JV-99280', flow: 'Stripe Webhook Handler',       date: '24 Oct 2023 - 14:18:12', dur: '0.8s',    ok: false },
                    { id: '#JV-99279', flow: 'Daily Sales Report Generator', date: '24 Oct 2023 - 09:00:00', dur: '45.5s',   ok: true  },
                    { id: '#JV-99278', flow: 'CRM Contact Push',             date: '24 Oct 2023 - 08:45:30', dur: '2.1s',    ok: false },
                    { id: '#JV-99277', flow: 'AWS S3 Media Backup',          date: '24 Oct 2023 - 04:00:01', dur: '15m 12s', ok: true  },
                  ].map(row => (
                    <tr key={row.id} className="border-b border-slate-800 hover:bg-white/5 transition-colors cursor-pointer group">
                      <td className={`py-4 px-4 font-mono text-xs ${row.ok ? 'text-primary' : 'text-red-400'}`}>{row.id}</td>
                      <td className="py-4 px-4">{row.flow}</td>
                      <td className="py-4 px-4 text-slate-400">{row.date}</td>
                      <td className="py-4 px-4 text-slate-400">{row.dur}</td>
                      <td className="py-4 px-4">
                        <span className={`flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest ${row.ok ? 'text-green-500' : 'text-red-500'}`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${row.ok ? 'bg-green-500' : 'bg-red-500'}`}></span>
                          {row.ok ? 'Éxito' : 'Error'}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`material-symbols-outlined ${row.ok ? 'text-slate-600 group-hover:text-primary' : 'text-red-600'} transition-colors`}>
                          {row.ok ? 'terminal' : 'error_outline'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="mt-8 flex justify-center">
                <nav className="flex items-center gap-2">
                  <button className="p-2 border border-slate-700 hover:border-primary transition-colors"><span className="material-symbols-outlined text-sm">chevron_left</span></button>
                  <button className="w-8 h-8 border border-primary bg-primary/20 text-xs font-bold">1</button>
                  <button className="w-8 h-8 border border-slate-700 hover:border-primary text-xs font-bold transition-colors">2</button>
                  <button className="w-8 h-8 border border-slate-700 hover:border-primary text-xs font-bold transition-colors">3</button>
                  <button className="p-2 border border-slate-700 hover:border-primary transition-colors"><span className="material-symbols-outlined text-sm">chevron_right</span></button>
                </nav>
              </div>
            </div>
          </main>
        </div>
      </div>
    </PortalLayout>
  );
}
