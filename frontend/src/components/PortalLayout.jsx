import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const navItems = [
  { icon: 'dashboard',            label: 'Dashboard',        path: '/dashboard/overview'      },
  { icon: 'bolt',                 label: 'Automatizaciones', path: '/automatizaciones'        },
  { icon: 'analytics',            label: 'Rendimiento',      path: '/dashboard/performance'   },
  { icon: 'terminal',             label: 'Logs',             path: '/automatizaciones/logs'   },
  { icon: 'support_agent',        label: 'Soporte',          path: '/soporte/chat'            },
  { icon: 'admin_panel_settings', label: 'Admin',            path: '/dashboard'               },
];

// ─── NotificationPanel ───────────────────────────────────────────────────────
function NotificationPanel({ onClose }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading]             = useState(true);
  const ref = useRef(null);

  // Cierra al hacer click fuera
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) onClose(); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose]);

  // Carga actividad reciente como "notificaciones"
  useEffect(() => {
    api.get('/dashboard')
      .then(res => {
        const acts = res.data?.recentActivities || [];
        setNotifications(acts.slice(0, 6).map(a => ({
          id:      a.id,
          title:   a.description || a.type,
          project: a.project?.name || null,
          time:    a.createdAt,
          read:    false,
          icon:    iconForType(a.type),
          color:   colorForType(a.type),
        })));
      })
      .catch(() => setNotifications([]))
      .finally(() => setLoading(false));
  }, []);

  const iconForType  = (t) => {
    if (!t) return 'info';
    if (t.includes('error'))      return 'error';
    if (t.includes('run'))        return 'play_circle';
    if (t.includes('creat'))      return 'add_circle';
    if (t.includes('updat'))      return 'update';
    if (t.includes('project'))    return 'folder';
    return 'notifications';
  };
  const colorForType = (t) => {
    if (!t) return 'text-slate-400';
    if (t.includes('error'))   return 'text-red-400';
    if (t.includes('run'))     return 'text-emerald-400';
    if (t.includes('creat'))   return 'text-primary';
    if (t.includes('project')) return 'text-violet-400';
    return 'text-slate-400';
  };

  const timeAgo = (iso) => {
    const diff = Date.now() - new Date(iso).getTime();
    const m = Math.floor(diff / 60000);
    if (m < 1)  return 'ahora';
    if (m < 60) return `${m}m`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h`;
    return `${Math.floor(h / 24)}d`;
  };

  return (
    <div ref={ref}
      className="absolute top-12 right-0 w-80 bg-[#0f141a] border border-slate-700/60 rounded-xl shadow-2xl shadow-black/60 z-50 overflow-hidden"
      style={{ animation: 'fadeSlideDown 0.15s ease' }}>

      {/* Header */}
      <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between">
        <span className="text-white text-sm font-bold">Notificaciones</span>
        <span className="text-[10px] text-slate-500 uppercase tracking-widest">Actividad reciente</span>
      </div>

      {/* Lista */}
      <div className="max-h-80 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center py-10 gap-2 text-slate-500 text-sm">
            <span className="material-symbols-outlined animate-spin text-lg">progress_activity</span>
            Cargando...
          </div>
        ) : notifications.length === 0 ? (
          <div className="py-10 text-center text-slate-500 text-sm">
            <span className="material-symbols-outlined text-3xl block mb-2 opacity-30">notifications_off</span>
            Sin actividad reciente
          </div>
        ) : (
          notifications.map((n, i) => (
            <div key={n.id}
              className="px-4 py-3 flex gap-3 hover:bg-slate-800/40 transition-colors border-b border-slate-800/50 last:border-0 cursor-default">
              <div className={`mt-0.5 flex-shrink-0 ${n.color}`}>
                <span className="material-symbols-outlined text-lg">{n.icon}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-slate-200 font-medium leading-snug truncate">{n.title}</p>
                {n.project && (
                  <p className="text-[10px] text-slate-500 mt-0.5">{n.project}</p>
                )}
              </div>
              <span className="text-[10px] text-slate-600 flex-shrink-0 mt-0.5">{timeAgo(n.time)}</span>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="px-4 py-2.5 border-t border-slate-800 bg-slate-900/40">
        <button
          onClick={() => { onClose(); window.location.href = '/dashboard/overview'; }}
          className="text-[11px] text-primary hover:text-primary/80 transition-colors w-full text-center">
          Ver toda la actividad →
        </button>
      </div>
    </div>
  );
}

// ─── UserMenu ────────────────────────────────────────────────────────────────
function UserMenu({ user, onLogout, onClose }) {
  const navigate = useNavigate();
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) onClose(); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose]);

  const initial = user?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U';

  return (
    <div ref={ref}
      className="absolute top-12 right-0 w-64 bg-[#0f141a] border border-slate-700/60 rounded-xl shadow-2xl shadow-black/60 z-50 overflow-hidden"
      style={{ animation: 'fadeSlideDown 0.15s ease' }}>

      {/* User info */}
      <div className="px-4 py-4 border-b border-slate-800 flex items-center gap-3">
        <div className="size-10 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
          {initial}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-bold text-white truncate">{user?.name || 'Usuario'}</p>
          <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
          <span className={`inline-block mt-1 text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded ${
            user?.role === 'ADMIN'
              ? 'bg-amber-500/15 text-amber-400 border border-amber-500/20'
              : 'bg-primary/15 text-primary border border-primary/20'
          }`}>
            {user?.role === 'ADMIN' ? 'Admin' : 'Cliente'}
          </span>
        </div>
      </div>

      {/* Menu items */}
      <div className="py-1">
        {[
          { icon: 'person',    label: 'Mi perfil',      action: () => { navigate('/perfil'); onClose(); } },
          { icon: 'settings',  label: 'Configuración',  action: () => { navigate('/configuracion'); onClose(); } },
          { icon: 'help',      label: 'Ayuda',          action: () => { navigate('/soporte/chat'); onClose(); } },
        ].map(item => (
          <button key={item.label} onClick={item.action}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-slate-800/50 transition-colors text-left">
            <span className="material-symbols-outlined text-lg text-slate-500">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </div>

      {/* Logout */}
      <div className="border-t border-slate-800 py-1">
        <button onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/5 transition-colors text-left">
          <span className="material-symbols-outlined text-lg">logout</span>
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}

// ─── PortalLayout ─────────────────────────────────────────────────────────────
export default function PortalLayout({ children }) {
  const navigate             = useNavigate();
  const { pathname }         = useLocation();
  const { user, logout }     = useAuth();
  const [showNotif, setShowNotif] = useState(false);
  const [showUser,  setShowUser]  = useState(false);

  const handleLogout = async () => {
    setShowUser(false);
    await logout();
    navigate('/login');
  };

  const initial = user?.name?.[0]?.toUpperCase() || 'U';

  return (
    <>
      {/* Animación global */}
      <style>{`
        @keyframes fadeSlideDown {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className="flex min-h-screen">

        {/* ── Sidebar ── */}
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

          {/* Nav */}
          <nav className="flex-1 px-4 py-4 space-y-1 font-montserrat overflow-y-auto">
            {navItems.map(item => {
              const active = pathname === item.path || pathname.startsWith(item.path + '/');
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

          {/* Sidebar footer */}
          <div className="p-6 border-t border-slate-800 space-y-3">
            <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-700">
              <p className="text-xs text-slate-400 font-montserrat mb-1 truncate">
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

        {/* ── Content area ── */}
        <div className="flex-1 min-w-0 flex flex-col bg-background-dark">

          {/* ── Global Header ── */}
          <header className="h-16 border-b border-slate-800 bg-background-dark/80 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-30 flex-shrink-0">

            {/* Search */}
            <div className="flex items-center gap-4 w-80">
              <div className="relative w-full">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-xl">search</span>
                <input
                  className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:ring-1 focus:ring-primary focus:border-primary outline-none placeholder:text-slate-500 transition-all"
                  placeholder="Buscar automatizaciones..."
                  type="text"
                />
              </div>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-4">

              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => { setShowNotif(v => !v); setShowUser(false); }}
                  className={`relative p-2 rounded-lg transition-colors ${
                    showNotif ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                  }`}>
                  <span className="material-symbols-outlined text-xl">notifications</span>
                  {/* badge */}
                  <span className="absolute top-1.5 right-1.5 size-2 bg-red-500 rounded-full border-2 border-background-dark"></span>
                </button>
                {showNotif && (
                  <NotificationPanel onClose={() => setShowNotif(false)} />
                )}
              </div>

              <div className="h-6 w-px bg-slate-800" />

              {/* User menu */}
              <div className="relative">
                <button
                  onClick={() => { setShowUser(v => !v); setShowNotif(false); }}
                  className={`flex items-center gap-3 px-3 py-1.5 rounded-lg transition-colors ${
                    showUser ? 'bg-slate-800' : 'hover:bg-slate-800/50'
                  }`}>
                  <div className="text-right hidden sm:block">
                    <p className="text-[10px] font-montserrat text-slate-400 leading-none">Bienvenido,</p>
                    <p className="text-xs font-bold text-white leading-none mt-0.5">{user?.name || 'Usuario'}</p>
                  </div>
                  <div className="size-8 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                    {initial}
                  </div>
                  <span className={`material-symbols-outlined text-sm text-slate-500 transition-transform ${showUser ? 'rotate-180' : ''}`}>
                    expand_more
                  </span>
                </button>
                {showUser && (
                  <UserMenu user={user} onLogout={handleLogout} onClose={() => setShowUser(false)} />
                )}
              </div>

            </div>
          </header>

          {/* ── Page content ── */}
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>

        </div>
      </div>
    </>
  );
}