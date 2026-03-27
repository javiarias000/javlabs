import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import SEO from '../../components/SEO';
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
      <SEO
        title="Contacto - Consulta Gratis | JAV LABS Ecuador"
        description="¿Listo para automatizar? Agenda una consulta gratis con JAV LABS. Te contactamos en menos de 24h. Sin compromiso. Automatización con IA, n8n, WhatsApp Business API."
        ogTitle="Contacto - Consulta Gratis | JAV LABS"
        ogDescription="Agenda una consulta gratuita y descubre cuántas horas podrías ahorrar. Respondemos en menos de 24 horas. Automatización para empresas en Ecuador y LATAM."
        ogImage="/Logo2.png"
        canonicalUrl="/contacto"
        breadcrumbItems={[
          { name: 'Inicio', url: '/' },
          { name: 'Contacto', url: '/contacto' }
        ]}
      />
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
    </>
  );
}
