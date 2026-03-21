import { useState, useEffect } from 'react';
import PortalLayout from '../../components/PortalLayout';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import './ClientDashboardOverview.css';

export default function ClientDashboardOverview() {
  const { user, accessToken, loading: authLoading } = useAuth(); // ✅ FIX
  const navigate = useNavigate();
  const [n8nData, setN8nData] = useState(null);
  const [dbData, setDbData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [projName, setProjName] = useState('');
  const [projDesc, setProjDesc] = useState('');
  const [projLoading, setProjLoading] = useState(false);
  const [projError, setProjError] = useState('');
  const [error, setError] = useState(null);

  const fetchAll = async () => {
    if (!accessToken) return; // ✅ FIX

    setError(null);
    setLoading(true);
    try {
      const [n8n, db] = await Promise.all([
        api.get('/n8n/projects'),
        api.get('/dashboard'),
      ]);
      setN8nData(n8n.data);
      setDbData(db.data);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('No se pudieron cargar los datos del dashboard. Intenta de nuevo más tarde.');
    } finally {
      setLoading(false);
    }
  };

  // ✅ FIX: evitar llamadas sin auth
  useEffect(() => {
    if (authLoading) return;
    if (!accessToken) return;

    fetchAll();
  }, [authLoading, accessToken]);

  const handleCreateProject = async () => {
    if (!projName.trim()) return setProjError('El nombre es obligatorio.');
    setProjLoading(true);
    setProjError('');
    try {
      await api.post(
        '/projects',
        { name: projName.trim(), description: projDesc.trim(), status: 'ACTIVE' }
      );
      setShowModal(false);
      setProjName('');
      setProjDesc('');
      fetchAll();
    } catch (err) {
      console.error('Error creating project:', err);
      setProjError(err.response?.data?.error || 'Error al crear el proyecto.');
    } finally {
      setProjLoading(false);
    }
  };

  const projects = n8nData?.projects || [];
  const activities = dbData?.recentActivities || [];

  const totalExecutions = projects.reduce((s, p) => s + p.executions, 0);
  const totalErrors = projects.reduce((s, p) => s + p.errors, 0);
  const activeWorkflows = projects.reduce((s, p) => s + p.active, 0);
  const successRate = totalExecutions > 0
    ? Math.round(((totalExecutions - totalErrors) / totalExecutions) * 100)
    : 0;

  const recentErrors   = dbData?.n8nStats?.recentErrors || [];
  const activityColors = ['bg-primary', 'bg-violet-600', 'bg-emerald-500', 'bg-amber-500', 'bg-cyan-500'];

  return (
    <PortalLayout>
      <main className="flex-1 flex flex-col min-w-0">
    
        <div className="p-8 space-y-8 overflow-y-auto">
          {/* Error banner */}
          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/30 rounded flex items-center gap-3">
              <span className="material-symbols-outlined text-red-400">error</span>
              <p className="text-sm text-red-400">{error}</p>
              <button onClick={() => setError(null)} className="ml-auto text-red-400 hover:text-red-300">
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>
          )}

          {(loading || authLoading) ? ( // ✅ FIX
            <div className="flex items-center justify-center h-64 text-slate-500">
              <span className="material-symbols-outlined animate-spin mr-2">progress_activity</span> Cargando datos...
            </div>
          ) : (
            <>
              {/* KPIs */}
              <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { label: 'Workflows Activos', value: activeWorkflows, icon: 'hub', color: 'text-primary' },
                  { label: 'Total Ejecuciones', value: totalExecutions.toLocaleString(), icon: 'memory', color: 'text-violet-500' },
                  { label: 'Tasa de Exito', value: `${successRate}%`, icon: 'verified', color: 'text-emerald-400' },
                  { label: 'Errores Recientes', value: totalErrors, icon: 'error', color: 'text-red-400' },
                ].map(kpi => (
                  <div key={kpi.label} className="bg-card-bg p-6 border border-slate-700 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-3 opacity-20 group-hover:opacity-100 transition-opacity">
                      <span className={`material-symbols-outlined text-4xl ${kpi.color}`}>{kpi.icon}</span>
                    </div>
                    <p className="text-slate-400 text-xs font-montserrat uppercase tracking-wider">{kpi.label}</p>
                    <h3 className="font-michroma text-3xl text-white mt-2">{kpi.value}</h3>
                  </div>
                ))}
              </section>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">

                  {/* Proyectos desde n8n */}
                  <div className="bg-card-bg border border-slate-700 rounded-lg overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-700 flex items-center justify-between">
                      <div>
                        <h4 className="text-white font-bold">Proyectos n8n</h4>
                        <p className="text-slate-500 text-xs mt-0.5">Agrupados por cliente desde n8n</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <button onClick={() => navigate('/automatizaciones/logica')}
                          className="text-primary text-xs hover:underline">Ver workflows</button>
                        <button onClick={() => setShowModal(true)}
                          className="flex items-center gap-1 px-3 py-1.5 bg-primary/10 border border-primary/30 text-primary text-xs font-bold uppercase tracking-widest hover:bg-primary/20 transition-all rounded">
                          <span className="material-symbols-outlined text-sm">add</span>
                          Nuevo
                        </button>
                      </div>
                    </div>
                    {projects.length === 0 ? (
                      <div className="p-8 text-center text-slate-500 text-sm">No hay proyectos en n8n.</div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                          <thead className="bg-slate-800/50 text-slate-400 text-xs uppercase font-montserrat">
                            <tr>
                              <th className="px-6 py-3">Proyecto</th>
                              <th className="px-6 py-3">Estado</th>
                              <th className="px-6 py-3">Workflows</th>
                              <th className="px-6 py-3">Ejecuciones</th>
                              <th className="px-6 py-3">Exito</th>
                              <th className="px-6 py-3">Errores</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-800">
                            {projects.map(p => (
                              <tr key={p.name} className="hover:bg-slate-800/30 transition-colors cursor-pointer"
                                onClick={() => navigate('/automatizaciones/logica')}>
                                <td className="px-6 py-4 font-medium text-white">{p.name}</td>
                                <td className="px-6 py-4">
                                  <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${p.status === 'ACTIVE'
                                      ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                                      : 'bg-slate-500/10 text-slate-500 border border-slate-500/20'
                                    }`}>
                                    {p.status === 'ACTIVE' ? 'Activo' : 'Inactivo'}
                                  </span>
                                </td>
                                <td className="px-6 py-4 text-slate-400">{p.totalWorkflows}</td>
                                <td className="px-6 py-4 text-slate-400">{p.executions}</td>
                                <td className="px-6 py-4">
                                  <span className={`text-xs font-bold ${p.successRate >= 80 ? 'text-emerald-400' : 'text-amber-400'}`}>
                                    {p.successRate}%
                                  </span>
                                </td>
                                <td className="px-6 py-4">
                                  <span className={`text-xs font-bold ${p.errors > 0 ? 'text-red-400' : 'text-slate-500'}`}>
                                    {p.errors}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-8">
                  {/* Actividad reciente */}
                  <div className="bg-card-bg border border-slate-700 p-6 rounded-lg">
                    <h4 className="text-white font-bold mb-6">Actividad Reciente</h4>
                    {activities.length === 0 ? (
                      <p className="text-slate-500 text-sm">Sin actividad reciente.</p>
                    ) : (
                      <div className="space-y-6 relative">
                        <div className="absolute left-[11px] top-2 bottom-2 w-px bg-slate-800"></div>
                        {activities.map((act, i) => (
                          <div key={act.id} className="relative flex gap-4">
                            <div className={`size-6 rounded-full ${activityColors[i % activityColors.length]} flex-shrink-0 z-10 border-4 border-card-bg`}></div>
                            <div>
                              <p className="text-sm text-slate-100 font-medium">{act.description || act.type}</p>
                              <p className="text-xs text-slate-500">
                                {new Date(act.createdAt).toLocaleString('es-ES', { dateStyle: 'short', timeStyle: 'short' })}
                                {act.project && ` • ${act.project.name}`}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>


                  {/* Errores recientes de n8n */}
                  {recentErrors.length > 0 && (
                    <div className="bg-card-bg border border-red-500/20 p-6 rounded-lg">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-white font-bold flex items-center gap-2">
                          <span className="material-symbols-outlined text-red-400 text-sm">error</span>
                          Errores Recientes
                        </h4>
                        <span className="text-[10px] text-red-400 font-bold uppercase tracking-widest">{recentErrors.length} errores</span>
                      </div>
                      <div className="space-y-3">
                        {recentErrors.map(e => (
                          <div key={e.id} className="flex items-start gap-3 p-3 bg-red-500/5 border border-red-500/10 rounded">
                            <span className="material-symbols-outlined text-red-400 text-sm mt-0.5">error_outline</span>
                            <div className="min-w-0">
                              <p className="text-slate-300 text-xs font-medium truncate">{e.workflowName}</p>
                              <p className="text-slate-600 text-[10px] mt-0.5">
                                #{e.id} • {e.startedAt ? new Date(e.startedAt).toLocaleString('es', { dateStyle: 'short', timeStyle: 'short' }) : '—'}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {/* Acciones rapidas */}
                  <div className="bg-card-bg border border-slate-700 p-6 rounded-lg">
                    <h4 className="text-white font-bold mb-6">Acciones Rapidas</h4>
                    <div className="grid gap-3">
                      <button onClick={() => navigate('/automatizaciones/nueva')}
                        className="w-full p-4 flex items-center gap-3 rounded-lg border border-primary/30 bg-primary/5 hover:bg-primary/10 transition-all group">
                        <span className="material-symbols-outlined text-primary group-hover:scale-110 transition-transform">add_link</span>
                        <span className="text-sm font-medium text-slate-200">Nueva Automatizacion</span>
                      </button>
                      <button onClick={() => navigate('/automatizaciones/logica')}
                        className="w-full p-4 flex items-center gap-3 rounded-lg border border-slate-700 bg-slate-800/30 hover:bg-slate-800/50 transition-all group">
                        <span className="material-symbols-outlined text-violet-500 group-hover:scale-110 transition-transform">account_tree</span>
                        <span className="text-sm font-medium text-slate-200">Ver Workflows n8n</span>
                      </button>
                      <button onClick={() => navigate('/automatizaciones/logs')}
                        className="w-full p-4 flex items-center gap-3 rounded-lg border border-slate-700 bg-slate-800/30 hover:bg-slate-800/50 transition-all group">
                        <span className="material-symbols-outlined text-cyan-400 group-hover:scale-110 transition-transform">terminal</span>
                        <span className="text-sm font-medium text-slate-200">Ver Logs</span>
                      </button>
                      <button onClick={() => navigate('/soporte/chat')}
                        className="w-full p-4 flex items-center gap-3 rounded-lg border border-slate-700 bg-slate-800/30 hover:bg-slate-800/50 transition-all group">
                        <span className="material-symbols-outlined text-amber-400 group-hover:scale-110 transition-transform">support_agent</span>
                        <span className="text-sm font-medium text-slate-200">Solicitar Soporte</span>
                      </button>
                    </div>
                  </div>

                  <div className="relative overflow-hidden p-6 rounded-lg bg-gradient-to-br from-primary/80 to-violet-800">
                    <div className="relative z-10">
                      <h5 className="text-white font-bold mb-2">Necesitas ayuda?</h5>
                      <p className="text-white/80 text-xs mb-4 leading-relaxed">Nuestros ingenieros estan disponibles 24/7.</p>
                      <button onClick={() => navigate('/contacto')}
                        className="bg-white text-primary px-4 py-2 rounded text-xs font-bold hover:bg-slate-100 transition-colors uppercase tracking-wider">
                        Contactar
                      </button>
                    </div>
                    <div className="absolute -bottom-4 -right-4 size-24 opacity-20">
                      <span className="material-symbols-outlined text-[100px] text-white">rocket_launch</span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </main>

      {/* Modal crear proyecto */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center px-4">
          <div className="bg-background-dark border border-slate-700 rounded-xl p-8 w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-white font-bold text-lg uppercase tracking-widest">Nuevo Proyecto</h3>
              <button onClick={() => { setShowModal(false); setProjError(''); setProjName(''); setProjDesc(''); }}
                className="text-slate-500 hover:text-white transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">Nombre *</label>
                <input type="text" value={projName} onChange={e => setProjName(e.target.value)}
                  placeholder="Ej: DentiLook"
                  className="bg-slate-900 border border-slate-700 text-slate-100 text-sm w-full px-3 py-2 rounded focus:border-primary outline-none placeholder:text-slate-600" />
              </div>
              <div>
                <label className="block text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">Descripcion</label>
                <textarea value={projDesc} onChange={e => setProjDesc(e.target.value)}
                  placeholder="Descripcion del proyecto..." rows={3}
                  className="bg-slate-900 border border-slate-700 text-slate-100 text-sm w-full px-3 py-2 rounded focus:border-primary outline-none resize-none placeholder:text-slate-600" />
              </div>
              {projError && (
                <div className="p-3 bg-red-500/10 border border-red-500/30 rounded flex items-center gap-2">
                  <span className="material-symbols-outlined text-red-400 text-sm">error</span>
                  <p className="text-xs text-red-400">{projError}</p>
                </div>
              )}
              <div className="flex gap-3 pt-2">
                <button onClick={() => { setShowModal(false); setProjError(''); setProjName(''); setProjDesc(''); }}
                  className="flex-1 px-4 py-2 border border-slate-700 text-slate-400 hover:text-white rounded text-sm font-bold uppercase tracking-widest transition-all">
                  Cancelar
                </button>
                <button onClick={handleCreateProject} disabled={projLoading}
                  className="flex-1 px-4 py-2 bg-primary text-white rounded text-sm font-bold uppercase tracking-widest hover:opacity-90 transition-all disabled:opacity-50">
                  {projLoading ? 'Creando...' : 'Crear'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </PortalLayout>
  );
}
