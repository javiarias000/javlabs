import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PublicNavbar from '../../components/PublicNavbar';
import api from '../../services/api';
import './ContactPageVariant1.css';

export default function ContactPageVariant1() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', company: '', email: '', phone: '', service: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.post('/contact', {
        name: form.name,
        email: form.email,
        message: form.message,
        service: form.service,
        phone: form.phone,
        company: form.company
      });
      setSuccess(true);
    } catch (err) {
      setError('Hubo un error al enviar. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="relative flex min-h-screen flex-col overflow-x-hidden">
        <PublicNavbar />

        <main className="flex-grow">
          <section className="contact-hero border-b border-border-color">
            <div className="max-w-7xl mx-auto text-center">
              <h1 className="mb-6">¿LISTO PARA AUTOMATIZAR?</h1>
              <p className="text-text-secondary text-lg md:text-xl max-w-2xl mx-auto font-light">
                Agenda una consulta gratis y descubre cuántas horas ahorrarías cada semana
              </p>
            </div>
          </section>

          <section className="max-w-7xl mx-auto px-6 py-20">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
              <div className="lg:col-span-7">

                {success ? (
                  <div className="success-message">
                    <span className="material-symbols-outlined success-icon text-6xl">check_circle</span>
                    <h2 className="success-title">¡Mensaje enviado!</h2>
                    <p className="success-text">Te responderemos en menos de 24 horas.</p>
                    <button
                      onClick={() => { setSuccess(false); setForm({ name: '', company: '', email: '', phone: '', service: '', message: '' }); }}
                      className="retry-button"
                    >
                      Enviar otro mensaje
                    </button>
                  </div>
                ) : (
                  <form className="contact-form" onSubmit={handleSubmit}>
                    <div className="form-row">
                      <div className="form-group">
                        <label className="form-label">Nombre</label>
                        <input name="name" value={form.name} onChange={handleChange} required
                          className="form-input"
                          placeholder="Tu nombre" type="text" />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Empresa</label>
                        <input name="company" value={form.company} onChange={handleChange}
                          className="form-input"
                          placeholder="Tu empresa" type="text" />
                      </div>
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label className="form-label">Email</label>
                        <input name="email" value={form.email} onChange={handleChange} required
                          className="form-input"
                          placeholder="tu@email.com" type="email" />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Teléfono</label>
                        <input name="phone" value={form.phone} onChange={handleChange}
                          className="form-input"
                          placeholder="+34 000 000 000" type="tel" />
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Tipo de servicio</label>
                      <select name="service" value={form.service} onChange={handleChange}
                        className="form-select">
                        <option value="">Selecciona un servicio</option>
                        <option>Automatización de Procesos</option>
                        <option>IA &amp; Machine Learning</option>
                        <option>Consultoría IT</option>
                        <option>Desarrollo a Medida</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Mensaje</label>
                      <textarea name="message" value={form.message} onChange={handleChange} required
                        className="form-textarea"
                        placeholder="Cuéntanos sobre tu proyecto..." rows="5"></textarea>
                    </div>

                    {error && <p className="error-message">{error}</p>}

                    <button
                      className="submit-button"
                      type="submit"
                      disabled={loading}
                    >
                      {loading ? 'Enviando...' : 'Enviar Mensaje'}
                    </button>
                  </form>
                )}
              </div>

              <div className="lg:col-span-5 contact-info-section">
                <div>
                  <h3 className="font-heading text-xl text-white uppercase mb-8">Información de contacto</h3>
                  <div className="space-y-6">
                    <div className="contact-info-item">
                      <span className="material-symbols-outlined contact-info-icon">mail</span>
                      <div>
                        <p className="contact-info-label">Email</p>
                        <p className="contact-info-value">jorge.arias.amauta@gmail.com</p>
                      </div>
                    </div>
                    <div className="contact-info-item">
                      <span className="material-symbols-outlined contact-info-icon">call</span>
                      <div>
                        <p className="contact-info-label">Teléfono</p>
                        <p className="contact-info-value">+593967685172</p>
                      </div>
                    </div>
                    <div className="contact-info-item">
                      <span className="material-symbols-outlined contact-info-icon">location_on</span>
                      <div>
                        <p className="contact-info-label">Ubicación</p>
                        <p className="contact-info-value">Ambato, Ecuador</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>

        {/* Footer unificado con CTA doble */}
        <footer className="bg-card-dark px-10 py-12 border-t border-border-color">
          <div className="footer-grid">
            <div className="footer-brand">
              <div className="flex items-center gap-3 text-white mb-6">
                <span className="material-symbols-outlined text-2xl text-color-primary">settings_input_component</span>
                <h2 className="text-lg font-michroma tracking-widest">JAV LABS</h2>
              </div>
              <p className="footer-text">
                Automatizamos tus procesos para que recuperes 20+ horas cada semana. Sistemas completos, sin que toques código.
              </p>
              <div className="mt-6">
                <p className="text-white text-sm font-montserrat font-bold mb-3">Contáctanos</p>
                <div className="space-y-3 text-text-secondary text-sm font-montserrat">
                  <p><span className="material-symbols-outlined text-color-primary text-sm align-middle mr-2">mail</span>jorge.arias.amauta@gmail.com</p>
                  <p><span className="material-symbols-outlined text-color-primary text-sm align-middle mr-2">call</span>+593 967 685 172</p>
                  <p><span className="material-symbols-outlined text-color-primary text-sm align-middle mr-2">location_on</span>Ambato, Ecuador</p>
                </div>
              </div>
            </div>
            <div>
              <h4 className="footer-heading text-white">Empresa</h4>
              <div className="footer-links">
                {['Nosotros', 'Servicios', 'Precios', 'Casos de Éxito'].map((item) => (
                  <a key={item} className="footer-link" href="/">{item}</a>
                ))}
              </div>
            </div>
            <div>
              <h4 className="footer-heading text-white">Soporte</h4>
              <div className="footer-links">
                {['Contacto', 'Portal de Clientes', 'FAQ', 'Documentación'].map((item) => (
                  <a key={item} className="footer-link" href="/">{item}</a>
                ))}
              </div>
            </div>
            <div>
              <h4 className="footer-heading text-white">¿Listo para automatizar?</h4>
              <p className="footer-text mb-4">Agenda una consulta gratis y descubre cuántas horas ahorrarías.</p>
              <div className="space-y-3">
                <button
                  onClick={() => window.scrollTo(0, document.body.scrollHeight)}
                  className="w-full text-white font-bold py-3 px-6 text-xs uppercase tracking-widest hover:opacity-90 transition-all"
                  style={{ background: 'var(--gradient-primary)' }}>
                  Consulta Gratis →
                </button>
                <a
                  href="https://calendly.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-center border border-color-primary text-color-primary py-3 px-6 text-xs font-bold uppercase tracking-widest hover:bg-color-primary hover:text-white transition-all font-montserrat rounded">
                  Agendar en Calendly
                </a>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p className="footer-copyright">© {new Date().getFullYear()} JAV LABS. Todos los derechos reservados.</p>
            <div className="flex gap-8 text-text-muted text-xs">
              {['Privacidad', 'Términos', 'Cookies'].map((item) => (
                <a key={item} href="/" className="footer-link">{item}</a>
              ))}
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
