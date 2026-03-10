import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import './ClientDashboardOverview.css';

const STATUS_COLORS = {
  ACTIVE:      { text: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', label: 'Activo' },
  IN_PROGRESS: { text: 'text-blue-500',    bg: 'bg-blue-500/10',    border: 'border-blue-500/20',    label: 'En Progreso' },
  PAUSED:      { text: 'text-amber-500',   bg: 'bg-amber-500/10',   border: 'border-amber-500/20',   label: 'Pausado' },
  COMPLETED:   { text: 'text-slate-400',   bg: 'bg-slate-500/10',   border: 'border-slate-500/20',   label: 'Completado' },
};

export default function ClientDashboardOverview() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/dashboard')
      .then(({ data }) => setData(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = async () => { await logout(); navigate('/login'); };

  const kpis = data?.kpis || {};
  const projects = data?.recentProjects || [];
  const activities = data?.recentActivities || [];

  const activityColors = ['bg-primary', 'bg-violet-600', 'bg-emerald-500', 'bg-amber-500', 'bg-cyan-500'];

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-[240px] bg-nav-bg flex-shrink-0 flex flex-col border-r border-slate-800">
        <div className="p-8 flex items-center gap-3">
          <div className="size-10 bg-gradient-to-br from-primary to-violet-600 flex items-center justify-center rounded-lg shadow-lg shadow-primary/20">
            <span className="text-white font-michroma text-xl">JV</span>
          </div>
          <div>
            <h1 className="text-white font-michroma text-sm tracking-widest">JAV LABS</h1>
            <p className="text-slate-400 text-[10px] uppercase tracking-tighter font-montserrat">Automation Agency</p>
          </div>
        </div>
        <nav className="flex-1 px-4 py-4 space-y-2 font-montserrat">
          {[
            { icon: 'dashboard',     label: 'Dashboard',       path: '/dashboard/overview', active: true },
            { icon: 'folder_open',   label: 'Mis Proyectos',   path: '/automatizaciones' },
            { icon: 'bolt',          label: 'Automatizaciones',path: '/automatizaciones' },
            { icon: 'analytics',     label: 'Reportes',        path: '/dashboard/performance' },
            { icon: 'support_agent', label: 'Soporte',         path: '/soporte/chat' },
            { icon: 'settings',      label: 'Configuración',   path: '/dashboard' },
          ].map(item => (
            <button key={item.label} onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded text-sm font-medium transition-all border-l-4 text-left ${
                item.active
                  ? 'border-primary bg-gradient-to-r from-primary/20 to-transparent'
                  : 'border-transparent text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}>
              <span className={`material-symbols-outlined ${item.active ? 'text-primary' : ''}`}>{item.icon}</span>
              <span className={item.active ? 'bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent font-bold' : ''}>
                {item.label}
              </span>
            </button>
          ))}
        </nav>
        <div className="p-6 border-t border-slate-800 space-y-3">
          <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-700">
            <p className="text-xs text-slate-400 font-montserrat mb-2">Plan Enterprise</p>
            <div className="h-1.5 w-full bg-slate-700 rounded-full overflow-hidden">
              <div className="h-full bg-primary w-3/4"></div>
            </div>
          </div>
          <button onClick={handleLogout}
            className="w-full flex items-center gap-2 px-2 py-2 text-slate-500 hover:text-red-400 transition-colors text-xs uppercase tracking-widest">
            <span className="material-symbols-outlined text-sm">logout</span> Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-slate-800 bg-background-dark/80 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-10">
          <div className="flex items-center gap-4 w-96">
            <div className="relative w-full group">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-xl">search</span>
              <input className="w-full bg-slate-800/50 border-none rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-1 focus:ring-primary placeholder:text-slate-500"
                placeholder="Buscar automatizaciones..." type="text" />
            </div>
          </div>
          <div className="flex items-center gap-6">
            <button className="relative text-slate-400 hover:text-white transition-colors">
              <span className="material-symbols-outlined text-2xl">notifications</span>
              <span className="absolute top-0 right-0 size-2 bg-red-500 rounded-full border-2 border-background-dark"></span>
            </button>
            <div className="h-8 w-px bg-slate-800"></div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-xs font-montserrat text-slate-400">Bienvenido,</p>
                <p className="text-sm font-bold text-white">{user?.name || 'Usuario'}</p>
              </div>
              <div className="size-10 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center text-white font-bold text-sm">
                {user?.name?.[0]?.toUpperCase() || 'U'}
              </div>
            </div>
          </div>
        </header>

        <div className="p-8 space-y-8 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center h-64 text-slate-500">Cargando datos...</div>
          ) : (
            <>
              {/* KPIs */}
              <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { label: 'Automatizaciones Activas', value: kpis.activeAutomations ?? 0,   icon: 'hub',      color: 'text-primary',   trend: null },
                  { label: 'Tareas Ejecutadas',        value: (kpis.tasksRun ?? 0).toLocaleString(), icon: 'memory',   color: 'text-violet-500', trend: null },
                  { label: 'Tiempo Ahorrado',          value: `${kpis.timeSaved ?? 0}h`,     icon: 'schedule', color: 'text-cyan-400',   trend: null },
                  { label: 'Total Proyectos',          value: kpis.totalProjects ?? 0,        icon: 'folder',   color: 'text-amber-400',  trend: null },
                ].map(kpi => (
                  <div key={kpi.label} className="bg-card-bg p-6 border border-slate-700 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-3 opacity-20 group-hover:opacity-100 transition-opacity">
                      <span className={`material-symbols-outlined text-4xl ${kpi.color}`}>{kpi.icon}</span>
                    </div>
                    <p className="text-slate-400 text-xs font-montserrat uppercase tracking-wider">{kpi.label}</p>
                    <div className="flex items-end justify-between mt-2">
                      <h3 className="font-michroma text-3xl text-white">{kpi.value}</h3>
                    </div>
                  </div>
                ))}
              </section>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">

                  {/* Proyectos recientes */}
                  <div className="bg-card-bg border border-slate-700 rounded-lg overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-700 flex items-center justify-between">
                      <h4 className="text-white font-bold">Proyectos Recientes</h4>
                      <button onClick={() => navigate('/automatizaciones')} className="text-primary text-xs hover:underline">Ver todos</button>
                    </div>
                    {projects.length === 0 ? (
                      <div className="p-8 text-center text-slate-500 text-sm">No hay proyectos aún.</div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                          <thead className="bg-slate-800/50 text-slate-400 text-xs uppercase font-montserrat">
                            <tr>
                              <th className="px-6 py-4">Proyecto</th>
                              <th className="px-6 py-4">Estado</th>
                              <th className="px-6 py-4">Automatizaciones</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-800">
                            {projects.map(p => {
                              const s = STATUS_COLORS[p.status] || STATUS_COLORS.IN_PROGRESS;
                              return (
                                <tr key={p.id} className="hover:bg-slate-800/30 transition-colors cursor-pointer"
                                  onClick={() => navigate(`/workflow/v1`)}>
                                  <td className="px-6 py-4 font-medium text-white">{p.name}</td>
                                  <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${s.bg} ${s.text} border ${s.border} uppercase`}>
                                      {s.label}
                                    </span>
                                  </td>
                                  <td className="px-6 py-4 text-slate-400">{p.automations?.length ?? 0}</td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-8">
                  {/* Actividad reciente */}
                  <div className="bg-card-bg border border-slate-700 p-6 rounded-lg">
                    <h4 className="text-white font-bold mb-6">Actividad Reciente</h4>
                    {activities.length === 0 ? (
                      <p className="text-slate-500 text-sm">Sin actividad reciente.</p>
                    ) : (
                      <div className="space-y-6 relative">
                        <div className="absolute left-[11px] top-2 bottom-2 w-px bg-slate-800"></div>
                        {activities.map((act, i) => (
                          <div key={act.id} className="relative flex gap-4">
                            <div className={`size-6 rounded-full ${activityColors[i % activityColors.length]} flex-shrink-0 z-10 border-4 border-card-bg`}></div>
                            <div>
                              <p className="text-sm text-slate-100 font-medium">{act.description || act.type}</p>
                              <p className="text-xs text-slate-500">
                                {new Date(act.createdAt).toLocaleString('es-ES', { dateStyle: 'short', timeStyle: 'short' })}
                                {act.project && ` • ${act.project.name}`}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Acciones rápidas */}
                  <div className="bg-card-bg border border-slate-700 p-6 rounded-lg">
                    <h4 className="text-white font-bold mb-6">Acciones Rápidas</h4>
                    <div className="grid gap-3">
                      <button onClick={() => navigate('/soporte/chat')}
                        className="w-full p-4 flex items-center gap-3 rounded-lg border border-primary/30 bg-primary/5 hover:bg-primary/10 transition-all group">
                        <span className="material-symbols-outlined text-primary group-hover:scale-110 transition-transform">support_agent</span>
                        <span className="text-sm font-medium text-slate-200">Solicitar Soporte</span>
                      </button>
                      <button onClick={() => navigate('/dashboard/performance')}
                        className="w-full p-4 flex items-center gap-3 rounded-lg border border-slate-700 bg-slate-800/30 hover:bg-slate-800/50 transition-all group">
                        <span className="material-symbols-outlined text-violet-500 group-hover:scale-110 transition-transform">summarize</span>
                        <span className="text-sm font-medium text-slate-200">Ver Reportes</span>
                      </button>
                      <button onClick={() => navigate('/automatizaciones/nueva')}
                        className="w-full p-4 flex items-center gap-3 rounded-lg border border-slate-700 bg-slate-800/30 hover:bg-slate-800/50 transition-all group">
                        <span className="material-symbols-outlined text-cyan-400 group-hover:scale-110 transition-transform">add_link</span>
                        <span className="text-sm font-medium text-slate-200">Nueva Automatización</span>
                      </button>
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="relative overflow-hidden p-6 rounded-lg bg-gradient-to-br from-primary/80 to-violet-800">
                    <div className="relative z-10">
                      <h5 className="text-white font-bold mb-2">¿Necesitas ayuda?</h5>
                      <p className="text-white/80 text-xs mb-4 leading-relaxed">Nuestros ingenieros están disponibles 24/7.</p>
                      <button onClick={() => navigate('/contacto')}
                        className="bg-white text-primary px-4 py-2 rounded text-xs font-bold hover:bg-slate-100 transition-colors uppercase tracking-wider">
                        Contactar
                      </button>
                    </div>
                    <div className="absolute -bottom-4 -right-4 size-24 opacity-20">
                      <span className="material-symbols-outlined text-[100px] text-white">rocket_launch</span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
