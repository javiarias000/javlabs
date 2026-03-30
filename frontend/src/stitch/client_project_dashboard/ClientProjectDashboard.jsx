import PortalLayout from '../../components/PortalLayout';
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import './ClientProjectDashboard.css';

export default function ClientProjectDashboard() {
  const { user } = useAuth();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user?.n8nProjectKey) {
      setError('No tienes un proyecto asignado');
      setLoading(false);
      return;
    }

    // Obtener proyectos n8n filtrados por el projectKey del usuario
    api.get('/n8n/projects')
      .then((res) => {
        const projects = res.data.projects || [];
        const proj = projects.length > 0 ? projects[0] : null;
        setProject(proj);
      })
      .catch((err) => {
        console.error('Error fetching project:', err);
        setError('Error cargando proyecto');
      })
      .finally(() => setLoading(false));
  }, [user]);

  if (loading) {
    return (
      <PortalLayout>
        <main className="flex-1 p-8">
          <div className="flex items-center justify-center h-64 text-slate-400">
            <span className="material-symbols-outlined animate-spin mr-2">progress_activity</span>
            Cargando proyecto...
          </div>
        </main>
      </PortalLayout>
    );
  }

  if (error) {
    return (
      <PortalLayout>
        <main className="flex-1 p-8">
          <div className="p-4 bg-red-500/10 border border-red-500/30 rounded text-red-400 mb-4">
            {error}
          </div>
          <p className="text-slate-400">
            Contacta al administrador para que te asigne un proyecto.
          </p>
        </main>
      </PortalLayout>
    );
  }

  if (!project) {
    return (
      <PortalLayout>
        <main className="flex-1 p-8">
          <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded text-amber-400">
            No se encontró un proyecto asociado a tu cuenta.
          </div>
        </main>
      </PortalLayout>
    );
  }

  return (
    <PortalLayout>
      <main className="flex-1 p-8 overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">{project.name}</h1>
            <div className="flex gap-2 mt-3">
              <span
                className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                  project.status === 'ACTIVE'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/20'
                    : 'bg-slate-500/10 text-slate-400 border border-slate-500/20'
                }`}
              >
                {project.status === 'ACTIVE' ? 'Activo' : 'Inactivo'}
              </span>
            </div>
          </div>
          <Link
            to="/dashboard/overview"
            className="px-4 py-2 bg-slate-800 text-slate-300 rounded text-sm hover:bg-slate-700 transition-colors"
          >
            Volver al Dashboard
          </Link>
        </div>

        {/* KPIs del Proyecto */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Workflows', value: project.totalWorkflows, icon: 'hub' },
            { label: 'Ejecuciones', value: project.executions, icon: 'memory' },
            { label: 'Éxito', value: `${project.successRate}%`, icon: 'verified' },
            { label: 'Errores', value: project.errors, icon: 'error' },
          ].map((kpi) => (
            <div key={kpi.label} className="bg-slate-900 border border-slate-800 p-6 rounded">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-500 text-xs uppercase tracking-widest">{kpi.label}</p>
                  <p className="text-3xl font-bold text-white mt-2">{kpi.value}</p>
                </div>
                <span className="material-symbols-outlined text-2xl text-primary">{kpi.icon}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Workflows */}
        <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-800">
            <h2 className="text-white font-bold">Workflows</h2>
            <p className="text-slate-500 text-xs mt-0.5">Automatizaciones configuradas en n8n</p>
          </div>
          {project.workflows.length === 0 ? (
            <div className="p-12 text-center text-slate-500">
              <span className="material-symbols-outlined text-4xl mb-3 block">engineering</span>
              <p className="text-sm uppercase tracking-widest">No hay workflows configurados</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-800/50 text-slate-400 text-xs uppercase font-montserrat">
                  <tr>
                    <th className="px-6 py-3">Nombre</th>
                    <th className="px-6 py-3">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {project.workflows.map((wf) => (
                    <tr key={wf.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="px-6 py-4 text-white font-medium">{wf.name}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2 py-1 rounded text-[10px] font-bold uppercase border ${
                            wf.active
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                              : 'bg-slate-500/10 text-slate-400 border-slate-500/20'
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${wf.active ? 'bg-emerald-400' : 'bg-slate-400'}`}></span>
                          {wf.active ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Estadísticas adicionales */}
        <div className="mt-8 bg-slate-900 border border-slate-800 rounded-lg p-6">
          <h3 className="text-white font-bold mb-4">Resumen de Rendimiento</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            <div>
              <p className="text-slate-500 text-xs uppercase">Total Workflows</p>
              <p className="text-2xl font-bold text-white mt-1">{project.totalWorkflows}</p>
            </div>
            <div>
              <p className="text-slate-500 text-xs uppercase">Ejecuciones</p>
              <p className="text-2xl font-bold text-white mt-1">{project.executions}</p>
            </div>
            <div>
              <p className="text-slate-500 text-xs uppercase">Tasa de Éxito</p>
              <p className={`text-2xl font-bold mt-1 ${project.successRate >= 80 ? 'text-emerald-400' : 'text-amber-400'}`}>
                {project.successRate}%
              </p>
            </div>
            <div>
              <p className="text-slate-500 text-xs uppercase">Errores</p>
              <p className="text-2xl font-bold text-red-400 mt-1">{project.errors}</p>
            </div>
            <div>
              <p className="text-slate-500 text-xs uppercase">Workflows Activos</p>
              <p className="text-2xl font-bold text-primary mt-1">{project.activeWorkflows}</p>
            </div>
          </div>
        </div>
      </main>
    </PortalLayout>
  );
}
