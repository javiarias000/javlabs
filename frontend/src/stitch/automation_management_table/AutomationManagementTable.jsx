import { Link, useNavigate } from 'react-router-dom';
import PortalLayout from '../../components/PortalLayout';
import './AutomationManagementTable.css';

export default function AutomationManagementTable() {
  const navigate = useNavigate();
  return (
    <PortalLayout>
      <header className="border-b border-slate-800 bg-background-dark/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-[1440px] mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-12">
            <div className="flex items-center gap-3">
              <div className="size-8 gradient-primary flex items-center justify-center">
                <span className="material-symbols-outlined text-white text-xl">terminal</span>
              </div>
              <h1 className="text-xl font-bold tracking-tighter text-white">JAV LABS</h1>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <button onClick={() => navigate('/automatizaciones/nueva')} className="gradient-primary px-6 py-2 text-xs font-bold tracking-widest uppercase text-white hover:opacity-90 transition-opacity flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">add</span>
              Nueva Automatización
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-[1440px] mx-auto w-full px-6 py-8">
        <div className="grid grid-cols-4 gap-px bg-slate-800 border border-slate-800 mb-8">
          <div className="bg-background-dark p-4 flex flex-col gap-1">
            <span className="text-[10px] text-slate-500 font-bold tracking-[0.2em] uppercase">Global Throughput</span>
            <div className="flex items-end justify-between">
              <span className="text-2xl font-bold text-white tracking-tighter">842.12 <span className="text-xs text-slate-500">REQ/S</span></span>
              <div className="h-6 w-16 bg-primary/10 flex items-end gap-0.5 px-1 pb-1">
                <div className="flex-1 bg-primary h-1/2"></div>
                <div className="flex-1 bg-primary h-3/4"></div>
                <div className="flex-1 bg-primary h-2/3"></div>
                <div className="flex-1 bg-primary h-full"></div>
              </div>
            </div>
          </div>
          <div className="bg-background-dark p-4 flex flex-col gap-1">
            <span className="text-[10px] text-slate-500 font-bold tracking-[0.2em] uppercase">Active Instances</span>
            <div className="flex items-end justify-between">
              <span className="text-2xl font-bold text-white tracking-tighter">12,403</span>
              <span className="text-emerald-500 text-xs font-bold">+5.2%</span>
            </div>
          </div>
          <div className="bg-background-dark p-4 flex flex-col gap-1">
            <span className="text-[10px] text-slate-500 font-bold tracking-[0.2em] uppercase">System Health</span>
            <div className="flex items-end justify-between">
              <span className="text-2xl font-bold text-white tracking-tighter">99.98<span className="text-xs text-slate-500">%</span></span>
            </div>
          </div>
          <div className="bg-background-dark p-4 flex flex-col gap-1">
            <span className="text-[10px] text-slate-500 font-bold tracking-[0.2em] uppercase">Memory Usage</span>
            <div className="flex items-end justify-between">
              <span className="text-2xl font-bold text-white tracking-tighter">4.2 <span className="text-xs text-slate-500">TB</span></span>
              <span className="text-primary text-xs font-bold">STABLE</span>
            </div>
          </div>
        </div>

        <div className="bg-background-dark border border-slate-800">
          <div className="p-4 border-b border-slate-800 flex justify-between items-center">
            <h2 className="text-xs font-bold tracking-[0.3em] uppercase text-slate-400">Active Automations Registry</h2>
            <div className="flex gap-2">
              <button className="p-1 hover:bg-slate-900 text-slate-500"><span className="material-symbols-outlined text-lg">filter_list</span></button>
              <button className="p-1 hover:bg-slate-900 text-slate-500"><span className="material-symbols-outlined text-lg">download</span></button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900/50">
                  <th className="px-6 py-4 text-[10px] font-bold tracking-widest text-slate-500 uppercase border-b border-slate-800">ID</th>
                  <th className="px-6 py-4 text-[10px] font-bold tracking-widest text-slate-500 uppercase border-b border-slate-800">Name</th>
                  <th className="px-6 py-4 text-[10px] font-bold tracking-widest text-slate-500 uppercase border-b border-slate-800">Trigger</th>
                  <th className="px-6 py-4 text-[10px] font-bold tracking-widest text-slate-500 uppercase border-b border-slate-800">Success Rate</th>
                  <th className="px-6 py-4 text-[10px] font-bold tracking-widest text-slate-500 uppercase border-b border-slate-800">Status</th>
                  <th className="px-6 py-4 text-[10px] font-bold tracking-widest text-slate-500 uppercase border-b border-slate-800">Last Run</th>
                  <th className="px-6 py-4 text-[10px] font-bold tracking-widest text-slate-500 uppercase border-b border-slate-800 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-900">
                {[
                  { id: '0x4F2A', name: 'Market Alpha Core',   trigger: 'API_REST',  rate: 98,  status: 'Active',         statusClass: 'text-emerald-500', date: '2023.10.24 14:22:01' },
                  { id: '0x91BC', name: 'Data Sync Beta',      trigger: 'WEBHOOK',   rate: 92,  status: 'Latency High',   statusClass: 'text-amber-500',   date: '2023.10.24 14:15:33' },
                  { id: '0x77DE', name: 'System Cleanup Task', trigger: 'SCHEDULE',  rate: 100, status: 'Active',         statusClass: 'text-emerald-500', date: '2023.10.24 12:00:00' },
                  { id: '0x33A1', name: 'Auth Validator Proxy',trigger: 'API_REST',  rate: 45,  status: 'Critical Error', statusClass: 'text-red-500',     date: '2023.10.24 13:50:21' },
                ].map(row => (
                  <tr key={row.id} className="group hover:bg-slate-900/30 transition-colors">
                    <td className="px-6 py-5 font-mono text-xs text-slate-500 tracking-wider">{row.id}</td>
                    <td className="px-6 py-5 font-bold text-sm tracking-tight">{row.name}</td>
                    <td className="px-6 py-5"><span className="bg-slate-800 px-2 py-1 text-[10px] font-bold text-slate-300 tracking-widest">{row.trigger}</span></td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-24 h-1 bg-slate-800"><div className="h-full bg-primary" style={{ width: `${row.rate}%` }}></div></div>
                        <span className="text-xs font-bold text-white">{row.rate}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-5"><span className={`text-[10px] font-bold uppercase tracking-widest ${row.statusClass}`}>{row.status}</span></td>
                    <td className="px-6 py-5 text-xs text-slate-400">{row.date}</td>
                    <td className="px-6 py-5 text-right">
                      <button onClick={() => navigate('/workflow/v1')} className="text-primary text-[10px] font-bold tracking-widest uppercase hover:underline">Inspect</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-4 border-t border-slate-800 flex justify-between items-center text-[10px] text-slate-500 font-bold tracking-widest uppercase">
            <span>Showing 4 of 1,280 Automations</span>
            <div className="flex gap-4">
              <button className="hover:text-white flex items-center gap-1"><span className="material-symbols-outlined text-sm">chevron_left</span> Previous</button>
              <button className="hover:text-white flex items-center gap-1">Next <span className="material-symbols-outlined text-sm">chevron_right</span></button>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-slate-800 bg-background-dark py-6 px-6">
        <div className="max-w-[1440px] mx-auto flex justify-between items-center opacity-50">
          <div className="text-[10px] tracking-[0.3em] font-bold uppercase">© 2024 JAV LABS Automation Platform</div>
          <div className="flex gap-8 text-[10px] tracking-[0.3em] font-bold uppercase">
            <Link to="/soporte/chat" className="hover:text-white">Soporte</Link>
          </div>
        </div>
      </footer>
    </PortalLayout>
  );
}
