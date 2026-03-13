import { Link, useNavigate, useLocation } from 'react-router-dom';

export default function PublicNavbar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const links = [
    { to: '/servicios', label: 'Servicios' },
    { to: '/nosotros',  label: 'Nosotros'  },
    { to: '/contacto',  label: 'Contacto'  },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800 bg-background-dark/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">

        <Link to="/" className="flex items-center gap-2">
          <div className="size-10 bg-gradient-to-br from-primary to-accent flex items-center justify-center rounded-lg">
            <span className="text-white font-michroma text-xl font-bold">J/V</span>
          </div>
          <h2 className="text-white text-xl font-michroma tracking-tighter ml-2">JAV LABS</h2>
        </Link>

        <nav className="hidden md:flex items-center gap-10">
          {links.map(({ to, label }) => (
            <Link key={to} to={to}
              className={`text-sm font-medium transition-colors ${pathname === to ? 'text-primary' : 'text-slate-300 hover:text-primary'}`}>
              {label}
            </Link>
          ))}
          <Link to="/precios"
            className={`text-sm font-medium transition-colors ${pathname === '/precios' ? 'text-primary' : 'text-slate-300 hover:text-primary'}`}>
            Precios
          </Link>
          <Link to="/login"
            className="text-sm font-medium text-slate-300 hover:text-primary transition-colors border-l border-slate-700 pl-10">
            Portal
          </Link>
        </nav>

        <button
          onClick={() => navigate('/contacto')}
          className="px-6 py-2 text-sm font-bold text-white uppercase tracking-widest hover:bg-white/5 transition-all"
          style={{ border: '2px solid', borderImage: 'linear-gradient(90deg, #0d7ff2, #8b5cf6) 1' }}>
          Agendar Demo
        </button>
      </div>
    </header>
  );
}
