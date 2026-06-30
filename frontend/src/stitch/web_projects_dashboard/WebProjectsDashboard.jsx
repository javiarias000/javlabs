import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PortalLayout from '../../components/PortalLayout';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const STATUS_MAP = {
  ACTIVE:      { label: 'En producción', dot: 'bg-emerald-500', text: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
  IN_PROGRESS: { label: 'En desarrollo', dot: 'bg-primary animate-pulse', text: 'text-primary', bg: 'bg-primary/10 border-primary/20' },
  PAUSED:      { label: 'Pausado',       dot: 'bg-amber-500',   text: 'text-amber-400',   bg: 'bg-amber-500/10 border-amber-500/20'   },
  COMPLETED:   { label: 'Completado',    dot: 'bg-slate-400',   text: 'text-slate-400',   bg: 'bg-slate-500/10 border-slate-500/20'   },
  CANCELLED:   { label: 'Cancelado',     dot: 'bg-red-500',     text: 'text-red-400',     bg: 'bg-red-500/10 border-red-500/20'       },
};

const TECH_ICONS = {
  React:      { icon: 'code',           color: 'text-cyan-400' },
  PostgreSQL: { icon: 'database',       color: 'text-blue-400' },
  Node:       { icon: 'terminal',       color: 'text-emerald-400' },
  Tailwind:   { icon: 'palette',        color: 'text-violet-400' },
  Vite:       { icon: 'bolt',           color: 'text-amber-400' },
};

export default function WebProjectsDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);
  const [selected, setSelected]   = useState(null);

  useEffect(() => {
    api.get('/projects')
      .then(({ data }) => setProjects(Array.isArray(data) ? data : (data.projects || [])))
      .catch(err => {
        console.error('Error loading projects:', err);
        setError('No se pudieron cargar los proyectos.');
      })
      .finally(() => setLoading(false));
  }, []);

  const activeCount    = projects.filter(p => p.status === 'ACTIVE').length;
  const inProgressCount = projects.filter(p => p.status === 'IN_PROGRESS').length;

  return (
    <PortalLayout>
      <div className="p-8 space-y-8">

        {/* Header */}
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-emerald-400">web</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">Proyectos Web</h1>
              <p className="text-slate-400 text-sm">Desarrollo &amp; Bases de Datos · {user?.company || 'Tu empresa'}</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/soporte')}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-bold uppercase tracking-widest hover:bg-emerald-500/20 transition-all"
          >
            <span className="material-symbols-outlined text-sm">add</span>
            Solicitar proyecto
          </button>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { label: 'Total proyectos', value: projects.length,  icon: 'folder',        color: 'text-white' },
            { label: 'En producción',   value: activeCount,      icon: 'rocket_launch', color: 'text-emerald-400' },
            { label: 'En desarrollo',   value: inProgressCount,  icon: 'construction',  color: 'text-primary' },
          ].map(kpi => (
            <div key={kpi.label} className="bg-slate-900 border border-slate-800 p-5 rounded-xl group hover:border-slate-700 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <p className="text-slate-500 text-xs uppercase tracking-widest font-bold">{kpi.label}</p>
                <span className={`material-symbols-outlined text-xl opacity-40 group-hover:opacity-100 transition-opacity ${kpi.color}`}>{kpi.icon}</span>
              </div>
              <p className={`text-3xl font-bold font-michroma ${kpi.color}`}>{kpi.value}</p>
            </div>
          ))}
        </div>

        {/* Error */}
        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-3">
            <span className="material-symbols-outlined text-red-400">error</span>
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        {/* Lista de proyectos */}
        {loading ? (
          <div className="flex items-center justify-center h-48 text-slate-500">
            <span className="material-symbols-outlined animate-spin mr-2">progress_activity</span>
            Cargando proyectos...
          </div>
        ) : projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="size-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-emerald-400 text-3xl">web</span>
            </div>
            <h3 className="text-white font-michroma text-lg mb-2">Sin proyectos aún</h3>
            <p className="text-slate-500 text-sm max-w-sm mb-6">
              Tu equipo de desarrollo comenzará a cargar el progreso aquí una vez iniciado el proyecto.
            </p>
            <button
              onClick={() => navigate('/soporte')}
              className="px-5 py-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm font-bold hover:bg-emerald-500/20 transition-all"
            >
              Consultar con soporte
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map(p => {
              const st = STATUS_MAP[p.status] || STATUS_MAP.IN_PROGRESS;
              return (
                <div
                  key={p.id}
                  onClick={() => setSelected(selected?.id === p.id ? null : p)}
                  className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-slate-700 transition-all cursor-pointer group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
                        <span className="material-symbols-outlined text-primary">web_asset</span>
                      </div>
                      <div>
                        <h3 className="text-white font-bold">{p.name}</h3>
                        {p.description && <p className="text-slate-500 text-xs mt-0.5 line-clamp-1">{p.description}</p>}
                      </div>
                    </div>
                    <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded text-[10px] font-bold uppercase border flex-shrink-0 ${st.bg} ${st.text}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />
                      {st.label}
                    </span>
                  </div>

                  {/* Progreso */}
                  {typeof p.progress === 'number' && (
                    <div className="mb-4">
                      <div className="flex justify-between text-xs mb-1.5">
                        <span className="text-slate-500">Progreso</span>
                        <span className={`font-bold ${p.progress >= 80 ? 'text-emerald-400' : 'text-primary'}`}>{p.progress}%</span>
                      </div>
                      <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${p.progress}%`,
                            background: p.progress >= 80
                              ? 'linear-gradient(to right, #10b981, #34d399)'
                              : 'linear-gradient(to right, #0d7ff2, #7c3aed)',
                          }}
                        />
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-xs text-slate-600">
                    <span>Iniciado {new Date(p.startDate || p.createdAt).toLocaleDateString('es-ES')}</span>
                    {p.endDate && <span>Entrega {new Date(p.endDate).toLocaleDateString('es-ES')}</span>}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Info banner */}
        <div className="flex items-start gap-4 p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
          <span className="material-symbols-outlined text-emerald-400 flex-shrink-0 mt-0.5">info</span>
          <div>
            <p className="text-emerald-300 text-sm font-bold mb-1">Actualizaciones de progreso</p>
            <p className="text-slate-500 text-xs">
              El equipo de desarrollo actualiza el estado y progreso de cada proyecto. Si necesitas
              solicitar cambios o tienes dudas técnicas, usa{' '}
              <button onClick={() => navigate('/soporte')} className="text-emerald-400 underline underline-offset-2">Soporte</button>.
            </p>
          </div>
        </div>

      </div>
    </PortalLayout>
  );
}
