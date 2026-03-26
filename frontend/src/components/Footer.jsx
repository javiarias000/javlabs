import { Link } from 'react-router-dom';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const footerLinks = {
  servicios: [
    { label: 'Automatizaciones', to: '/servicios#automatizaciones' },
    { label: 'Integraciones', to: '/servicios#integraciones' },
    { label: 'Consultoría', to: '/servicios#consultoria' },
    { label: 'Soporte 24/7', to: '/soporte' },
  ],
  empresa: [
    { label: 'Nosotros', to: '/nosotros' },
    { label: 'Equipo', to: '/nosotros#equipo' },
    { label: 'Casos de Éxito', to: '/nosotros#casos' },
    { label: 'Trabaja con Nosotros', to: '/nosotros#talento' },
  ],
  recursos: [
    { label: 'Blog', to: '/blog', external: true },
    { label: 'Documentación', to: '/docs', external: true },
    { label: 'API Reference', to: '/api', external: true },
    { label: 'Comunidad', to: '/community', external: true },
  ],
  legal: [
    { label: 'Privacidad', to: '/privacidad' },
    { label: 'Términos', to: '/terminos' },
    { label: 'Cookies', to: '/cookies' },
    { label: 'GDPR', to: '/gdpr' },
  ],
};

// ── SVG icons for social networks ──────────────────────────────────────────
const SocialIcons = {
  LinkedIn: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="size-4">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  ),
  Twitter: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="size-4">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  ),
  GitHub: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="size-4">
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  ),
  Discord: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="size-4">
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.002.022.015.043.033.055a19.76 19.76 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
    </svg>
  ),
};

const socialLinks = [
  { key: 'LinkedIn', label: 'LinkedIn', href: 'https://linkedin.com/company/javlabs', color: '#0A66C2' },
  { key: 'Twitter', label: 'X / Twitter', href: 'https://twitter.com/javlabs', color: '#000000' },
  { key: 'GitHub', label: 'GitHub', href: 'https://github.com/javlabs', color: '#333333' },
  { key: 'Discord', label: 'Discord', href: 'https://discord.gg/javlabs', color: '#5865F2' },
];

// ── Reusable animated footer link ──────────────────────────────────────────
const FooterLink = ({ to, label, accentVar = '--color-primary', external = false }) => {
  const props = external
    ? { as: 'a', href: to, target: '_blank', rel: 'noopener noreferrer' }
    : { as: Link, to };

  const Tag = props.as;
  const tagProps = external
    ? { href: to, target: '_blank', rel: 'noopener noreferrer' }
    : { to };

  return (
    <motion.li
      variants={{ hidden: { opacity: 0, x: -10 }, visible: { opacity: 1, x: 0 } }}
    >
      <Tag
        {...tagProps}
        className="text-[var(--text-secondary)] text-sm hover:text-[var(--color-primary)] transition-colors duration-200 inline-flex items-center gap-2 group"
        style={{ '--accent': `var(${accentVar})` }}
      >
        <span className="w-0 h-0.5 bg-[var(--color-primary)] group-hover:w-4 transition-all duration-200 ease-out rounded-full" />
        {label}
      </Tag>
    </motion.li>
  );
};

const staggerList = {
  visible: { transition: { staggerChildren: 0.06 } },
  hidden: {},
};

// ── Component ───────────────────────────────────────────────────────────────
const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [subscribing, setSubscribing] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return;
    setSubscribing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSubscribed(true);
    setEmail('');
    setSubscribing(false);
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[var(--bg-navy-darker)] border-t border-[var(--border-color)] relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)]/5 via-transparent to-[var(--color-accent)]/5 pointer-events-none" />
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[var(--color-primary)]/4 rounded-full blur-3xl pointer-events-none" />

      {/* Main content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">

          {/* ── Brand ──────────────────────────────────────────── */}
          <div className="lg:col-span-3 space-y-6">
            <Link to="/" className="flex items-center gap-3 group w-fit">
              <div className="relative size-12 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] rounded-xl flex items-center justify-center shadow-lg shadow-[var(--color-primary)]/20 transition-all duration-300 group-hover:scale-105 group-hover:shadow-[var(--color-primary)]/40">
                <span className="text-white font-michroma text-xl">JV</span>
              </div>
              <div>
                <h3 className="text-white font-michroma text-lg tracking-wider">JAV LABS</h3>
                <p className="text-[var(--text-muted)] text-[10px] uppercase tracking-widest font-montserrat">Automation Agency</p>
              </div>
            </Link>

            <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
              Transformamos negocios con soluciones de automatización innovadoras. Más de 500 proyectos entregados en 15 países.
            </p>

            {/* ── Social icons (SVG-based, fix principal) ── */}
            <motion.div
              className="flex items-center gap-2"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerList}
            >
              {socialLinks.map(({ key, label, href, color }) => (
                <motion.a
                  key={key}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Síguenos en ${label}`}
                  title={label}
                  className="relative group"
                  variants={{ hidden: { opacity: 0, scale: 0.7 }, visible: { opacity: 1, scale: 1 } }}
                  whileHover={{ y: -4, scale: 1.08 }}
                  whileTap={{ scale: 0.94 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 22 }}
                >
                  {/* Glow on hover */}
                  <div
                    className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"
                    style={{ background: color, filter: 'blur(6px)' }}
                  />
                  <div className="relative size-10 bg-[var(--bg-tertiary)]/60 border border-[var(--border-color)] rounded-xl flex items-center justify-center text-[var(--text-secondary)] group-hover:text-white group-hover:border-white/20 group-hover:bg-[var(--bg-tertiary)] transition-all duration-300">
                    {SocialIcons[key]}
                  </div>
                </motion.a>
              ))}
            </motion.div>
          </div>

          {/* ── Servicios ──────────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-white font-semibold text-xs uppercase tracking-[0.15em] mb-5 flex items-center gap-2">
              <span className="w-3 h-px bg-[var(--color-primary)]" />
              Servicios
            </h4>
            <motion.ul
              className="space-y-3"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerList}
            >
              {footerLinks.servicios.map(({ label, to }) => (
                <FooterLink key={label} to={to} label={label} />
              ))}
            </motion.ul>
          </div>

          {/* ── Empresa ────────────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-white font-semibold text-xs uppercase tracking-[0.15em] mb-5 flex items-center gap-2">
              <span className="w-3 h-px bg-[var(--color-accent)]" />
              Empresa
            </h4>
            <motion.ul
              className="space-y-3"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerList}
            >
              {footerLinks.empresa.map(({ label, to }) => (
                <FooterLink key={label} to={to} label={label} accentVar="--color-accent" />
              ))}
            </motion.ul>
          </div>

          {/* ── Contacto + Newsletter ──────────────────────────── */}
          <div className="lg:col-span-3 space-y-6">
            <h4 className="text-white font-semibold text-xs uppercase tracking-[0.15em] mb-5 flex items-center gap-2">
              <span className="w-3 h-px bg-[var(--color-primary)]" />
              Contacto
            </h4>

            <motion.ul
              className="space-y-3"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerList}
            >
              {[
                { href: 'mailto:jorge.arias.amauta@gmail.com', icon: 'email', label: 'jorge.arias.amauta@gmail.com' },
                { href: 'tel:+593967685172', icon: 'phone', label: '+593 96768 5172' },
              ].map(({ href, icon, label }) => (
                <motion.li
                  key={label}
                  variants={{ hidden: { opacity: 0, x: -10 }, visible: { opacity: 1, x: 0 } }}
                >
                  <a
                    href={href}
                    className="text-[var(--text-secondary)] text-sm hover:text-[var(--color-primary)] transition-colors duration-200 flex items-center gap-3 group"
                  >
                    <div className="size-8 rounded-lg bg-[var(--bg-tertiary)]/50 border border-[var(--border-color)] flex items-center justify-center group-hover:bg-[var(--color-primary)]/15 group-hover:border-[var(--color-primary)]/40 transition-all duration-200 shrink-0">
                      <span className="material-symbols-outlined text-base">{icon}</span>
                    </div>
                    <span className="truncate">{label}</span>
                  </a>
                </motion.li>
              ))}

              <motion.li
                variants={{ hidden: { opacity: 0, x: -10 }, visible: { opacity: 1, x: 0 } }}
                className="text-[var(--text-secondary)] text-sm flex items-center gap-3"
              >
                <div className="size-8 rounded-lg bg-[var(--bg-tertiary)]/50 border border-[var(--border-color)] flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-base">location_on</span>
                </div>
                <span>Ambato, Ecuador</span>
              </motion.li>
            </motion.ul>

            {/* Newsletter */}
            <div className="pt-5 border-t border-[var(--border-color)]/60">
              <p className="text-[var(--text-muted)] text-xs mb-3 leading-relaxed">
                Recibe novedades y recursos de automatización en tu inbox.
              </p>
              <AnimatePresence mode="wait">
                {subscribed ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, y: 8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="flex items-center gap-2 text-emerald-400 text-sm py-2"
                  >
                    <span className="material-symbols-outlined text-lg">check_circle</span>
                    ¡Gracias por suscribirte!
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    onSubmit={handleSubscribe}
                  >
                    <div className="relative flex items-center">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="tu@email.com"
                        aria-label="Email para newsletter"
                        required
                        className="w-full bg-[var(--bg-tertiary)]/50 border border-[var(--border-color)] rounded-lg px-4 py-2.5 pr-24 text-sm text-white placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/40 focus:border-[var(--color-primary)]/50 transition-all duration-200"
                      />
                      <button
                        type="submit"
                        disabled={subscribing}
                        className="absolute right-1.5 px-3 py-1.5 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] rounded-md text-[11px] font-bold text-white uppercase tracking-wider hover:opacity-90 active:scale-95 transition-all duration-150 disabled:opacity-50 whitespace-nowrap"
                      >
                        {subscribing ? (
                          <span className="flex items-center gap-1">
                            <svg className="animate-spin size-3" viewBox="0 0 24 24" fill="none">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                            </svg>
                          </span>
                        ) : 'Unirse →'}
                      </button>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </div>

        </div>
      </div>

      {/* ── Bottom bar ─────────────────────────────────────────────────────── */}
      <div className="relative border-t border-[var(--border-color)]/60 bg-black/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">

            <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4">
              <p className="text-[var(--text-muted)] text-xs text-center md:text-left">
                © {currentYear} JAV LABS. Todos los derechos reservados.
              </p>
              <div className="hidden md:flex items-center gap-2 text-[var(--text-muted)]/50">
                <span className="w-px h-3 bg-current" />
                <span className="text-xs">🇪🇨 Made in Ecuador</span>
              </div>
            </div>

            <motion.div
              className="flex items-center gap-4 md:gap-6"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerList}
            >
              {footerLinks.legal.map(({ label, to }) => (
                <motion.div
                  key={label}
                  variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
                >
                  <Link
                    to={to}
                    className="text-[var(--text-muted)] text-xs hover:text-[var(--color-primary)] transition-colors duration-200 relative group"
                  >
                    {label}
                    <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-[var(--color-primary)] group-hover:w-full transition-all duration-300" />
                  </Link>
                </motion.div>
              ))}
            </motion.div>

          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;