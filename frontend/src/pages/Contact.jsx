import { useState } from 'react';
import api from '../services/api';

export default function Contact() {
  const [form, setForm] = useState({ name: '', company: '', email: '', phone: '', service: '', message: '' });
  const [status, setStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/contact', form);
      setStatus('success');
      setForm({ name: '', company: '', email: '', phone: '', service: '', message: '' });
    } catch {
      setStatus('error');
    }
  };

  return (
    <div style={{ background: '#0D1B2A', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px' }}>
      <div style={{ background: '#1E293B', padding: '40px', borderRadius: '12px', width: '100%', maxWidth: '560px' }}>
        <h2 style={{ color: '#fff', marginBottom: '24px' }}>Contáctanos</h2>
        {status === 'success' && <p style={{ color: '#22C55E', marginBottom: '16px' }}>✅ Mensaje enviado. Te contactaremos pronto.</p>}
        {status === 'error' && <p style={{ color: '#f87171', marginBottom: '16px' }}>❌ Error al enviar. Intenta nuevamente.</p>}
        <form onSubmit={handleSubmit}>
          {[
            { key: 'name', placeholder: 'Nombre *', type: 'text' },
            { key: 'company', placeholder: 'Empresa', type: 'text' },
            { key: 'email', placeholder: 'Email *', type: 'email' },
            { key: 'phone', placeholder: 'Teléfono', type: 'text' },
            { key: 'service', placeholder: 'Servicio de interés', type: 'text' },
          ].map(({ key, placeholder, type }) => (
            <input
              key={key}
              type={type}
              placeholder={placeholder}
              value={form[key]}
              onChange={(e) => setForm({ ...form, [key]: e.target.value })}
              style={{ width: '100%', padding: '12px', marginBottom: '12px', background: '#0D1B2A', border: '1px solid #334155', borderRadius: '6px', color: '#fff', boxSizing: 'border-box' }}
            />
          ))}
          <textarea
            placeholder="Mensaje * (mínimo 10 caracteres)"
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            rows={4}
            style={{ width: '100%', padding: '12px', marginBottom: '20px', background: '#0D1B2A', border: '1px solid #334155', borderRadius: '6px', color: '#fff', boxSizing: 'border-box', resize: 'vertical' }}
          />
          <button
            type="submit"
            style={{ width: '100%', padding: '12px', background: 'linear-gradient(90deg, #007BFF, #8A2BE2)', border: 'none', borderRadius: '6px', color: '#fff', fontSize: '1rem', cursor: 'pointer' }}
          >
            Enviar Mensaje
          </button>
        </form>
      </div>
    </div>
  );
}
