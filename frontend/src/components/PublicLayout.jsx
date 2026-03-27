import { Outlet } from 'react-router-dom';
import PublicNavbar from './PublicNavbar';
import Footer from './Footer';
import { useEffect } from 'react';

/**
 * Skip Link Component - para navegación por teclado (WCAG 2.1)
 * Permite saltar directamente al contenido principal
 */
function SkipLink() {
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Tecla Tab o Enter/Escape para mostrar skip link
      if (e.key === 'Tab' || e.key === 'Enter' || e.key === 'Escape') {
        const skipLink = document.getElementById('skip-to-main');
        if (skipLink) {
          skipLink.style.top = '0';
        }
      }
    };

    const handleFocus = () => {
      const skipLink = document.getElementById('skip-to-main');
      if (skipLink) {
        skipLink.style.top = '0';
      }
    };

    const handleBlur = () => {
      const skipLink = document.getElementById('skip-to-main');
      if (skipLink) {
        skipLink.style.top = '-40px';
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <a
      id="skip-to-main"
      href="#main-content"
      className="skip-link"
      style={{
        position: 'absolute',
        top: '-40px',
        left: 0,
        zIndex: 9999,
        padding: '12px 24px',
        background: '#0d7ff2',
        color: 'white',
        fontWeight: 'bold',
        textDecoration: 'none',
        borderRadius: '0 0 8px 0',
        transition: 'top 0.3s ease-in-out',
        fontFamily: 'var(--font-body)',
      }}
      onFocus={(e) => e.target.style.top = '0'}
      onBlur={(e) => e.target.style.top = '-40px'}
    >
      ← Saltar al contenido principal
    </a>
  );
}

export default function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-primary)]">
      {/* Skip Link para accesibilidad */}
      <SkipLink />

      <PublicNavbar />

      <main id="main-content" className="flex-1" tabIndex="-1" aria-label="Contenido principal">
        {/* Asegura que el foco del teclado se maneje correctamente */}
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
