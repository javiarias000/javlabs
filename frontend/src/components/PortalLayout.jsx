import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { icon: 'dashboard',             label: 'Dashboard',        path: '/dashboard/overview' },
  { icon: 'bolt',                  label: 'Automatizaciones', path: '/automatizaciones'   },
  { icon: 'analytics',             label: 'Rendimiento',      path: '/dashboard/performance' },
  { icon: 'terminal',              label: 'Logs',             path: '/automatizaciones/logs' },
  { icon: 'support_agent',         label: 'Soporte',          path: '/soporte/chat'       },
  { icon: 'admin_panel_settings',  label: 'Admin',            path: '/dashboard'          },
];

export default function PortalLayout({ children }) {
  const navigate   = useNavigate();
  const { pathname } = useLocation();
  const { user, logout } = useAuth();

  const handleLogout = async () => { await logout(); navigate('/login'); };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-[240px] bg-nav-bg flex-shrink-0 flex flex-col border-r border-slate-800 sticky top-0 h-screen">

        {/* Logo */}
        <div className="p-8 flex items-center gap-3">
          <div className="size-10 bg-gradient-to-br from-primary to-violet-600 flex items-center justify-center rounded-lg shadow-lg shadow-primary/20">
            <span className="text-white font-michroma text-xl">JV</span>
          </div>
          <div>
            <h1 className="text-white font-michroma text-sm tracking-widest">JAV LABS</h1>
            <p className="text-slate-400 text-[10px] uppercase tracking-tighter font-montserrat">Automation Agency</p>
          </div>
        </div>

        {/* Nav items */}
        <nav className="flex-1 px-4 py-4 space-y-1 font-montserrat overflow-y-auto">
          {navItems.map(item => {
            const active = pathname === item.path;
            return (
              <button key={item.path} onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded text-sm font-medium transition-all border-l-4 text-left ${
                  active
                    ? 'border-primary bg-gradient-to-r from-primary/20 to-transparent'
                    : 'border-transparent text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}>
                <span className={`material-symbols-outlined text-xl ${active ? 'text-primary' : ''}`}>
                  {item.icon}
                </span>
                <span className={active ? 'bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent font-bold' : ''}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-6 border-t border-slate-800 space-y-3">
          <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-700">
            <p className="text-xs text-slate-400 font-montserrat mb-1">
              {user?.name || user?.email || 'Usuario'}
            </p>
            <p className="text-[10px] text-slate-600 font-montserrat uppercase tracking-widest">Plan Enterprise</p>
            <div className="h-1.5 w-full bg-slate-700 rounded-full overflow-hidden mt-2">
              <div className="h-full bg-primary w-3/4" />
            </div>
          </div>
          <button onClick={handleLogout}
            className="w-full flex items-center gap-2 px-2 py-2 text-slate-500 hover:text-red-400 transition-colors text-xs uppercase tracking-widest font-montserrat">
            <span className="material-symbols-outlined text-sm">logout</span>
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 min-w-0 bg-background-dark overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
