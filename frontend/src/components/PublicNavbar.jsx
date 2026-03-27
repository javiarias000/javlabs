import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

export default function PublicNavbar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const links = [
    { to: '/servicios', label: 'Servicios' },
    { to: '/nosotros', label: 'Nosotros' },
    { to: '/precios', label: 'Precios' },
    { to: '/contacto', label: 'Contacto'},
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border-color/80 bg-background-dark/80 backdrop-blur-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 sm:gap-4" onClick={() => setMobileMenuOpen(false)}>
          <img
            src="/Logo3.png"
            alt="JAV LABS - Agencia de Automatización con IA"
            width={160}
            height={80}
            className="h-16 sm:h-24 w-auto object-contain"
            loading="eager"
          />
          <h2 className="text-white text-sm sm:text-lg font-michroma tracking-wider">JAV LABS</h2>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 lg:gap-10" aria-label="Menú principal">
          {links.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              aria-current={pathname === to ? 'page' : undefined}
              className={`text-sm font-medium transition-colors focus:outline focus:outline-2 focus:outline-blue-500 focus:outline-offset-2 rounded-sm ${pathname === to ? 'text-color-primary' : 'text-text-secondary hover:text-color-primary'}`}
            >
              {label}
            </Link>
          ))}
          <Link
            to="/login"
            aria-current={pathname === '/login' ? 'page' : undefined}
            className="text-sm font-medium text-text-secondary hover:text-color-primary transition-colors border-l border-border-color pl-8 lg:pl-10 focus:outline focus:outline-2 focus:outline-blue-500 focus:outline-offset-2 rounded-sm"
          >
            Login
          </Link>
        </nav>

        {/* Desktop CTA */}
        <button
          onClick={() => navigate('/contacto')}
          aria-label="Agendar demostración - Ir a página de contacto"
          className="hidden md:block px-6 py-2 text-sm font-bold text-white uppercase tracking-widest hover:bg-white/5 transition-all border-2 border-transparent focus:outline focus:outline-2 focus:outline-blue-500 focus:outline-offset-2"
          style={{ borderImage: 'var(--gradient-primary) 1' }}
        >
          Agendar Demo
        </button>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-text-secondary hover:text-white transition-colors focus:outline focus:outline-2 focus:outline-blue-500 focus:outline-offset-2 rounded-sm"
          aria-label={mobileMenuOpen ? "Cerrar menú de navegación" : "Abrir menú de navegación"}
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-menu"
        >
          <AnimatePresence mode="wait">
            {mobileMenuOpen ? (
              <motion.span
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="material-symbols-outlined text-3xl"
                aria-hidden="true"
              >
                close
              </motion.span>
            ) : (
              <motion.span
                key="menu"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="material-symbols-outlined text-3xl"
                aria-hidden="true"
              >
                menu
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            id="mobile-menu"
            role="navigation"
            aria-label="Menú de navegación móvil"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="md:hidden overflow-hidden bg-background-dark/95 backdrop-blur-lg border-b border-border-color"
          >
            <div className="px-4 py-4 space-y-2">
              {links.map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setMobileMenuOpen(false)}
                  aria-current={pathname === to ? 'page' : undefined}
                  className={`block py-3 px-4 rounded-lg text-base font-medium transition-all focus:outline focus:outline-2 focus:outline-blue-500 focus:outline-offset-2 ${
                    pathname === to
                      ? 'bg-color-primary/20 text-color-primary'
                      : 'text-text-secondary hover:bg-slate-800/50 hover:text-white'
                  }`}
                >
                  {label}
                </Link>
              ))}
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                aria-current={pathname === '/login' ? 'page' : undefined}
                className="block py-3 px-4 rounded-lg text-base font-medium text-text-secondary hover:bg-slate-800/50 hover:text-white transition-all focus:outline focus:outline-2 focus:outline-blue-500 focus:outline-offset-2"
              >
                Login
              </Link>
              <div className="pt-2">
                <button
                  onClick={() => { setMobileMenuOpen(false); navigate('/contacto'); }}
                  aria-label="Agendar demostración - Ir a página de contacto"
                  className="w-full py-3 px-4 text-sm font-bold text-white uppercase tracking-widest hover:bg-white/5 transition-all border-2 border-transparent focus:outline focus:outline-2 focus:outline-blue-500 focus:outline-offset-2"
                  style={{ borderImage: 'var(--gradient-primary) 1' }}>
                  Agendar Demo
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
