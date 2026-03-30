import PortalLayout from '../../components/PortalLayout';
import { useState, useEffect } from 'react';
import api from '../../services/api';
import './AdminDashboard.css';

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await api.get('/dashboard/admin/overview');
      setData(res.data);
    } catch (err) {
      console.error('Error fetching admin overview:', err);
      setError('Error cargando dashboard administrativo');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <PortalLayout>
        <main className="flex-1 p-8">
          <div className="flex items-center justify-center h-64 text-slate-400">
            <span className="material-symbols-outlined animate-spin mr-2">progress_activity</span>
            Cargando...
          </div>
        </main>
      </PortalLayout>
    );
  }

  if (error) {
    return (
      <PortalLayout>
        <main className="flex-1 p-8">
          <div className="p-4 bg-red-500/10 border border-red-500/30 rounded text-red-400">
            {error}
          </div>
        </main>
      </PortalLayout>
    );
  }

  const { globalKPIs, clientMetrics } = data;

  return (
    <PortalLayout>
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Dashboard Administrativo</h1>
          <p className="text-slate-400 text-sm mt-1">Vista consolidada de todos los clientes y proyectos</p>
        </div>

        {/* KPIs Globales */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Clientes Activos', value: globalKPIs.totalClients, icon: 'groups' },
            { label: 'Proyectos Totales', value: globalKPIs.totalProjects, icon: 'folder' },
            { label: 'Proyectos Activos', value: globalKPIs.activeProjects, icon: 'play_circle' },
            { label: 'Automatizaciones', value: globalKPIs.totalAutomations, icon: 'bolt' },
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

        {/* Tabla de Clientes */}
        <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-800">
            <h2 className="text-white font-bold">Clientes y Proyectos</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-800/50 text-slate-400 text-xs uppercase font-montserrat">
                <tr>
                  <th className="px-6 py-4">Cliente</th>
                  <th className="px-6 py-4">Proyectos</th>
                  <th className="px-6 py-4">Autos.</th>
                  <th className="px-6 py-4">Tareas</th>
                  <th className="px-6 py-4">Tiempo</th>
                  <th className="px-6 py-4">Última Act.</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {clientMetrics.map((cm) => (
                  <tr key={cm.user.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="size-9 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                          {cm.user.name?.[0]?.toUpperCase() || 'U'}
                        </div>
                        <div>
                          <p className="text-white font-medium text-sm">{cm.user.name}</p>
                          <p className="text-slate-500 text-xs">{cm.user.email}</p>
                          {cm.user.company && <p className="text-slate-600 text-xs">{cm.user.company}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-slate-300">{cm.metrics.projectCount}</span>
                      <span className="text-slate-600 text-xs"> ({cm.metrics.activeProjects} activos)</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-slate-300">{cm.metrics.automationCount}</span>
                      <span className="text-slate-600 text-xs"> ({cm.metrics.activeAutomations} activas)</span>
                    </td>
                    <td className="px-6 py-4 text-slate-300">{cm.metrics.totalTasksRun.toLocaleString()}</td>
                    <td className="px-6 py-4 text-slate-300">{cm.metrics.totalTimeSaved.toFixed(1)}h</td>
                    <td className="px-6 py-4 text-slate-400 text-xs">
                      {cm.metrics.lastActivity
                        ? new Date(cm.metrics.lastActivity).toLocaleDateString('es')
                        : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {clientMetrics.length === 0 && (
            <div className="p-12 text-center text-slate-500">
              <span className="material-symbols-outlined text-4xl mb-3 block">group_off</span>
              <p className="text-sm uppercase tracking-widest">No hay clientes registrados</p>
            </div>
          )}
        </div>
      </main>
    </PortalLayout>
  );
}
