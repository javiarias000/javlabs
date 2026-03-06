import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Error al iniciar sesión.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: '#0D1B2A', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#1E293B', padding: '40px', borderRadius: '12px', width: '100%', maxWidth: '400px' }}>
        <h2 style={{ color: '#fff', textAlign: 'center', marginBottom: '24px' }}>JAV LABS</h2>
        {error && <p style={{ color: '#f87171', marginBottom: '16px', textAlign: 'center' }}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            style={{ width: '100%', padding: '12px', marginBottom: '12px', background: '#0D1B2A', border: '1px solid #334155', borderRadius: '6px', color: '#fff', boxSizing: 'border-box' }}
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            style={{ width: '100%', padding: '12px', marginBottom: '20px', background: '#0D1B2A', border: '1px solid #334155', borderRadius: '6px', color: '#fff', boxSizing: 'border-box' }}
          />
          <button
            type="submit"
            disabled={loading}
            style={{ width: '100%', padding: '12px', background: 'linear-gradient(90deg, #007BFF, #8A2BE2)', border: 'none', borderRadius: '6px', color: '#fff', fontSize: '1rem', cursor: 'pointer' }}
          >
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>
      </div>
    </div>
  );
}
