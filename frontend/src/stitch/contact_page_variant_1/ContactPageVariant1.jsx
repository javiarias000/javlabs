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
          <section className="bg-navy-deep py-20 px-6 border-b border-slate-800">
            <div className="max-w-7xl mx-auto text-center">
              <h1 className="font-heading text-4xl md:text-6xl text-white mb-6 uppercase tracking-tighter">CONTÁCTANOS</h1>
              <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto font-light">
                Cuéntanos tu proyecto y te respondemos en menos de 24 horas
              </p>
            </div>
          </section>

          <section className="max-w-7xl mx-auto px-6 py-20">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
              <div className="lg:col-span-7">

                {success ? (
                  <div className="flex flex-col items-center justify-center h-full gap-6 py-20 text-center">
                    <span className="material-symbols-outlined text-6xl text-primary">check_circle</span>
                    <h2 className="font-heading text-2xl text-white uppercase">¡Mensaje enviado!</h2>
                    <p className="text-slate-400">Te responderemos en menos de 24 horas.</p>
                    <button
                      onClick={() => { setSuccess(false); setForm({ name: '', company: '', email: '', phone: '', service: '', message: '' }); }}
                      className="border border-primary text-primary px-8 py-3 text-xs font-bold uppercase tracking-widest hover:bg-primary hover:text-white transition-all"
                    >
                      Enviar otro mensaje
                    </button>
                  </div>
                ) : (
                  <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Nombre</label>
                        <input name="name" value={form.name} onChange={handleChange} required
                          className="bg-input-bg border border-slate-700 p-4 text-white focus-gradient transition-all placeholder:text-slate-600"
                          placeholder="Tu nombre" type="text" />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Empresa</label>
                        <input name="company" value={form.company} onChange={handleChange}
                          className="bg-input-bg border border-slate-700 p-4 text-white focus-gradient transition-all placeholder:text-slate-600"
                          placeholder="Tu empresa" type="text" />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Email</label>
                        <input name="email" value={form.email} onChange={handleChange} required
                          className="bg-input-bg border border-slate-700 p-4 text-white focus-gradient transition-all placeholder:text-slate-600"
                          placeholder="tu@email.com" type="email" />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Teléfono</label>
                        <input name="phone" value={form.phone} onChange={handleChange}
                          className="bg-input-bg border border-slate-700 p-4 text-white focus-gradient transition-all placeholder:text-slate-600"
                          placeholder="+34 000 000 000" type="tel" />
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Tipo de servicio</label>
                      <select name="service" value={form.service} onChange={handleChange}
                        className="bg-input-bg border border-slate-700 p-4 text-white focus-gradient transition-all appearance-none cursor-pointer">
                        <option value="">Selecciona un servicio</option>
                        <option>Automatización de Procesos</option>
                        <option>IA &amp; Machine Learning</option>
                        <option>Consultoría IT</option>
                        <option>Desarrollo a Medida</option>
                      </select>
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Mensaje</label>
                      <textarea name="message" value={form.message} onChange={handleChange} required
                        className="bg-input-bg border border-slate-700 p-4 text-white focus-gradient transition-all placeholder:text-slate-600 resize-none"
                        placeholder="Cuéntanos sobre tu proyecto..." rows="5"></textarea>
                    </div>

                    {error && <p className="text-red-400 text-xs font-montserrat">{error}</p>}

                    <button
                      className="w-full text-white font-bold py-5 uppercase tracking-[0.2em] hover:opacity-90 transition-opacity disabled:opacity-50"
                      style={{ background: 'linear-gradient(to right, #0d7ff2, #7c3aed)' }}
                      type="submit"
                      disabled={loading}
                    >
                      {loading ? 'Enviando...' : 'Enviar Mensaje'}
                    </button>
                  </form>
                )}
              </div>

              <div className="lg:col-span-5 flex flex-col gap-12">
                <div className="space-y-8">
                  <h3 className="font-heading text-xl text-white uppercase">Información de contacto</h3>
                  <div className="space-y-6">
                    <div className="flex items-start gap-5">
                      <span className="material-symbols-outlined text-primary">mail</span>
                      <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-1">Email</p>
                        <p className="text-white hover:text-primary transition-colors cursor-pointer">hello@javlabs.tech</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-5">
                      <span className="material-symbols-outlined text-primary">call</span>
                      <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-1">Teléfono</p>
                        <p className="text-white hover:text-primary transition-colors cursor-pointer">+34 910 000 000</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-5">
                      <span className="material-symbols-outlined text-primary">location_on</span>
                      <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-1">Ubicación</p>
                        <p className="text-white">Paseo de la Castellana, 259, Madrid, España</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>

        <footer className="w-full border-t border-slate-800 bg-background-dark py-8 px-6">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <span className="material-symbols-outlined text-primary">schedule</span>
              <p className="text-sm font-medium tracking-wide">¿Prefieres una llamada rápida?</p>
            </div>
            <button className="gradient-border-btn text-white px-8 py-3 text-xs font-bold uppercase tracking-widest hover:opacity-80 transition-opacity">
              Agendar llamada en Calendly
            </button>
          </div>
        </footer>

        <div className="w-full bg-black py-4 px-6">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-[10px] font-bold uppercase tracking-widest text-slate-600">
            <p>© 2024 JAV LABS. Todos los derechos reservados.</p>
            <div className="flex gap-8">
              <a className="hover:text-primary" href="/nosotros">Legal</a>
              <a className="hover:text-primary" href="/nosotros">Privacidad</a>
              <a className="hover:text-primary" href="/nosotros">Cookies</a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
