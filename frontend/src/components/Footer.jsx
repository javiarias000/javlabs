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

const socialLinks = [
  { icon: 'work', label: 'LinkedIn', href: 'https://linkedin.com/company/javlabs' },
  { icon: 'twitter', label: 'Twitter', href: 'https://twitter.com/javlabs' },
  { icon: 'github', label: 'GitHub', href: 'https://github.com/javlabs' },
  { icon: 'discord', label: 'Discord', href: 'https://discord.gg/javlabs' },
];

const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [subscribing, setSubscribing] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return;

    setSubscribing(true);
    // Simular API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSubscribed(true);
    setEmail('');
    setSubscribing(false);
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[var(--bg-navy-darker)] border-t border-[var(--border-color)] relative overflow-hidden">
      {/* Decorative gradient glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)]/5 via-transparent to-[var(--color-accent)]/5 pointer-events-none" />

      {/* Top wave decoration */}
      <svg
        className="absolute top-0 left-0 right-0 w-full h-8 text-[var(--bg-navy-darker)] fill-current"
        viewBox="0 0 1440 48"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <motion.path
          initial={{ d: 'M0,0 C480,48 960,0 1440,0 L1440,0 L0,0 Z' }}
          animate={{ d: 'M0,24 C480,0 960,48 1440,24 L1440,0 L0,0 Z' }}
          transition={{ duration: 3, repeat: Infinity, repeatType: 'reverse' }}
        />
      </svg>

      {/* Main Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">

          {/* ── Col 1: Brand (span 3) ── */}
          <div className="lg:col-span-3 space-y-6">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="relative size-12 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] rounded-xl flex items-center justify-center shadow-lg shadow-[var(--color-primary)]/20 transition-all group-hover:scale-105 group-hover:shadow-[var(--color-primary)]/30">
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

            {/* Social Links */}
            <motion.div
              className="flex items-center gap-3"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{
                visible: { transition: { staggerChildren: 0.08 } },
                hidden: {}
              }}
            >
              {socialLinks.map(({ icon, label, href }) => (
                <motion.a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Síguenos en ${label}`}
                  className="relative group"
                  variants={{
                    hidden: { opacity: 0, scale: 0.8 },
                    visible: { opacity: 1, scale: 1 }
                  }}
                  whileHover={{ y: -3 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)]/20 to-[var(--color-accent)]/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="relative size-10 bg-[var(--bg-tertiary)]/50 border border-[var(--border-color)] rounded-lg flex items-center justify-center text-[var(--text-secondary)] group-hover:text-white group-hover:border-[var(--color-primary)]/50 transition-all duration-300">
                    <span className="material-symbols-outlined text-lg">{icon}</span>
                  </div>
                </motion.a>
              ))}
            </motion.div>
          </div>

          {/* ── Col 2: Servicios (span 2) ── */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              Servicios
            </h4>
            <motion.ul
              className="space-y-3"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{
                visible: { transition: { staggerChildren: 0.05 } },
                hidden: {}
              }}
            >
              {footerLinks.servicios.map(({ label, to }) => (
                <motion.li
                  key={label}
                  variants={{
                    hidden: { opacity: 0, x: -10 },
                    visible: { opacity: 1, x: 0 }
                  }}
                >
                  <Link
                    to={to}
                    className="text-[var(--text-secondary)] text-sm hover:text-[var(--color-primary)] transition-colors inline-flex items-center gap-2 group"
                  >
                    <span className="w-0 h-0.5 bg-[var(--color-primary)] group-hover:w-4 transition-all duration-200 ease-out" />
                    {label}
                  </Link>
                </motion.li>
              ))}
            </motion.ul>
          </div>

          {/* ── Col 3: Empresa (span 2) ── */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              Empresa
            </h4>
            <motion.ul
              className="space-y-3"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{
                visible: { transition: { staggerChildren: 0.05 } },
                hidden: {}
              }}
            >
              {footerLinks.empresa.map(({ label, to }) => (
                <motion.li
                  key={label}
                  variants={{
                    hidden: { opacity: 0, x: -10 },
                    visible: { opacity: 1, x: 0 }
                  }}
                >
                  <Link
                    to={to}
                    className="text-[var(--text-secondary)] text-sm hover:text-[var(--color-accent)] transition-colors inline-flex items-center gap-2 group"
                  >
                    <span className="w-0 h-0.5 bg-[var(--color-accent)] group-hover:w-4 transition-all duration-200 ease-out" />
                    {label}
                  </Link>
                </motion.li>
              ))}
            </motion.ul>
          </div>

          {/* ── Col 4: Contacto & Newsletter (span 3) ── */}
          <div className="lg:col-span-3 space-y-6">
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              Contacto
            </h4>

            <motion.ul
              className="space-y-3"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{
                visible: { transition: { staggerChildren: 0.05 } },
                hidden: {}
              }}
            >
              <motion.li
                variants={{
                  hidden: { opacity: 0, x: -10 },
                  visible: { opacity: 1, x: 0 }
                }}
              >
                <a
                  href="mailto:hola@javlabs.com"
                  className="text-[var(--text-secondary)] text-sm hover:text-[var(--color-primary)] transition-colors flex items-center gap-3 group"
                >
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="size-8 rounded-lg bg-[var(--bg-tertiary)]/50 border border-[var(--border-color)] flex items-center justify-center group-hover:bg-[var(--color-primary)]/20 group-hover:border-[var(--color-primary)]/50 transition-all"
                  >
                    <span className="material-symbols-outlined text-base">email</span>
                  </motion.div>
                  <span>jorge.arias.amauta@gmail.com</span>
                </a>
              </motion.li>
              <motion.li
                variants={{
                  hidden: { opacity: 0, x: -10 },
                  visible: { opacity: 1, x: 0 }
                }}
              >
                <a
                  href="tel:+34600000000"
                  className="text-[var(--text-secondary)] text-sm hover:text-[var(--color-primary)] transition-colors flex items-center gap-3 group"
                >
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="size-8 rounded-lg bg-[var(--bg-tertiary)]/50 border border-[var(--border-color)] flex items-center justify-center group-hover:bg-[var(--color-primary)]/20 group-hover:border-[var(--color-primary)]/50 transition-all"
                  >
                    <span className="material-symbols-outlined text-base"></span>
                  </motion.div>
                  <span>+593 96768 5172</span>
                </a>
              </motion.li>
              <motion.li
                variants={{
                  hidden: { opacity: 0, x: -10 },
                  visible: { opacity: 1, x: 0 }
                }}
              >
                <div className="text-[var(--text-secondary)] text-sm flex items-center gap-3">
                  <div className="size-8 rounded-lg bg-[var(--bg-tertiary)]/50 border border-[var(--border-color)] flex items-center justify-center">
                    <span className="material-symbols-outlined text-base">location_on</span>
                  </div>
                  <span>Ambato, Ecuador</span>
                </div>
              </motion.li>
            </motion.ul>

            {/* Newsletter */}
            <div className="pt-4 border-t border-[var(--border-color)]">
              <p className="text-[var(--text-secondary)] text-xs mb-3">
                Suscríbete a nuestro newsletter para recibir novedades.
              </p>
              <AnimatePresence mode="wait">
                {subscribed ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-center gap-2 text-emerald-400 text-sm"
                  >
                    <span className="material-symbols-outlined">check_circle</span>
                    ¡Gracias por suscribirte!
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    onSubmit={handleSubscribe}
                    className="relative"
                  >
                    <div className="relative">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Tu email"
                        aria-label="Email para newsletter"
                        required
                        className="w-full bg-[var(--bg-tertiary)]/50 border border-[var(--border-color)] rounded-lg px-4 py-2.5 pr-20 text-sm text-white placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 focus:border-[var(--color-primary)]/60 transition-all"
                      />
                      <button
                        type="submit"
                        disabled={subscribing}
                        className="absolute right-1 top-1 bottom-1 px-3 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] rounded text-xs font-bold text-white uppercase tracking-wider hover:opacity-90 transition-opacity disabled:opacity-50"
                      >
                        {subscribing ? '...' : '→'}
                      </button>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Bar */}
      <div className="relative border-t border-[var(--border-color)] bg-[var(--bg-navy-darker)]/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">

            {/* Copyright */}
            <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4">
              <p className="text-[var(--text-muted)] text-xs text-center md:text-left">
                © {currentYear} JAV LABS. Todos los derechos reservados.
              </p>
              <div className="hidden md:flex items-center gap-2">
                <span className="w-1 h-1 bg-[var(--text-muted)]/50 rounded-full" />
                <span className="text-[var(--text-muted)]/70 text-xs">Made in Ecuador</span>
              </div>
            </div>

            {/* Legal Links */}
            <motion.div
              className="flex items-center gap-4 md:gap-6 text-xs"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{
                visible: { transition: { staggerChildren: 0.05 } },
                hidden: {}
              }}
            >
              {footerLinks.legal.map(({ label, to }) => (
                <motion.div
                  key={label}
                  variants={{
                    hidden: { opacity: 0 },
                    visible: { opacity: 1 }
                  }}
                >
                  <Link
                    to={to}
                    className="text-[var(--text-muted)] hover:text-[var(--color-primary)] transition-colors relative group"
                  >
                    <span className="relative z-10">{label}</span>
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[var(--color-primary)] group-hover:w-full transition-all duration-300" />
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
