import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState(null);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    api.get('/dashboard').then(({ data }) => setData(data)).catch(console.error);
  }, [user, navigate]);

  const handleLogout = async () => { await logout(); navigate('/login'); };

  if (!data) return <div style={{ background: '#0D1B2A', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>Cargando...</div>;

  return (
    <div style={{ background: '#0D1B2A', minHeight: '100vh', color: '#fff', padding: '32px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <h1 style={{ background: 'linear-gradient(90deg, #007BFF, #8A2BE2)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          JAV LABS Dashboard
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ color: '#ccc' }}>Hola, {user?.name}</span>
          <button onClick={handleLogout} style={{ padding: '8px 16px', background: 'transparent', border: '1px solid #8A2BE2', borderRadius: '6px', color: '#8A2BE2', cursor: 'pointer' }}>
            Salir
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '32px' }}>
        {[
          { label: 'Automatizaciones Activas', value: data.kpis.activeAutomations, color: '#007BFF' },
          { label: 'Proyectos Totales', value: data.kpis.totalProjects, color: '#8A2BE2' },
          { label: 'Tareas Ejecutadas', value: data.kpis.tasksRun, color: '#007BFF' },
          { label: 'Horas Ahorradas', value: `${data.kpis.timeSaved}h`, color: '#8A2BE2' },
        ].map((kpi) => (
          <div key={kpi.label} style={{ background: '#1E293B', padding: '24px', borderRadius: '12px', borderLeft: `4px solid ${kpi.color}` }}>
            <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '8px' }}>{kpi.label}</p>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', color: kpi.color }}>{kpi.value}</p>
          </div>
        ))}
      </div>

      {/* Proyectos recientes */}
      <div style={{ background: '#1E293B', borderRadius: '12px', padding: '24px' }}>
        <h2 style={{ marginBottom: '16px', color: '#fff' }}>Proyectos Recientes</h2>
        {data.recentProjects.length === 0 ? (
          <p style={{ color: '#94a3b8' }}>No hay proyectos aún.</p>
        ) : (
          data.recentProjects.map((p) => (
            <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #334155' }}>
              <span>{p.name}</span>
              <span style={{ color: p.status === 'ACTIVE' ? '#22C55E' : '#007BFF' }}>{p.status}</span>
              <span style={{ color: '#94a3b8' }}>{p.progress}%</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
