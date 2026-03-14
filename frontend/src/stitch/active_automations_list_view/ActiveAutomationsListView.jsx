import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PortalLayout from '../../components/PortalLayout';
import api from '../../services/api';
import './ActiveAutomationsListView.css';

const STATUS_CONFIG = {
  ACTIVE:   { label: 'Activo',   dot: 'bg-primary animate-pulse',     text: 'text-primary',   icons: ['database', 'hub', 'cloud_sync'] },
  PAUSED:   { label: 'Pausado',  dot: 'bg-slate-500',                  text: 'text-slate-500', icons: ['database', 'hub', 'cloud_sync'] },
  ERROR:    { label: 'Alerta',   dot: 'bg-red-500 animate-pulse',      text: 'text-red-500',   icons: ['database', 'warning', 'cloud_sync'] },
  INACTIVE: { label: 'Inactivo', dot: 'bg-slate-600',                  text: 'text-slate-600', icons: ['database', 'hub', 'cloud_sync'] },
};

export default function ActiveAutomationsListView() {
  const navigate = useNavigate();
  const [automations, setAutomations] = useState([]);
  const [loading, setLoading]         = useState(true);
  const [search, setSearch]           = useState('');
  const [updating, setUpdating]       = useState(null);
  const [page, setPage]               = useState(1);
  const PER_PAGE = 6;

  useEffect(() => {
    fetchAutomations();
  }, []);

  const fetchAutomations = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/automations');
      setAutomations(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (automation) => {
    const newStatus = automation.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE';
    setUpdating(automation.id);
    try {
      await api.patch(`/automations/${automation.id}`, { status: newStatus });
      setAutomations(prev =>
        prev.map(a => a.id === automation.id ? { ...a, status: newStatus } : a)
      );
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(null);
    }
  };

  const filtered = automations.filter(a =>
    a.name.toLowerCase().includes(search.toLowerCase()) ||
    a.id.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated  = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const activeCount = automations.filter(a => a.status === 'ACTIVE').length;

  return (
    <PortalLayout>
      <main className="flex-1 p-8 overflow-y-auto">

        {/* Header */}
        <header className="flex justify-between items-end mb-10">
          <div>
            <h1 className="text-4xl font-bold uppercase tracking-tighter text-white leading-none">Automatizaciones</h1>
            {loading ? (
              <p className="text-slate-400 mt-2">Cargando...</p>
            ) : (
              <p className="text-slate-400 mt-2">
                Hay <span className="text-primary font-bold">{activeCount} flujos activos</span> de {automations.length} en total.
              </p>
            )}
          </div>
          <button onClick={() => navigate('/automatizaciones/nueva')}
            className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded flex items-center gap-2 text-sm font-bold uppercase tracking-widest transition-all">
            <span className="material-symbols-outlined text-[18px]">add</span>
            Nueva Automatización
          </button>
        </header>

        {/* Search */}
        <div className="bg-slate-800/50 p-2 rounded-lg mb-8 flex flex-wrap gap-2 items-center">
          <div className="flex-1 min-w-[300px] relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
            <input
              className="w-full bg-slate-900 border-none rounded py-2.5 pl-10 pr-4 text-sm focus:ring-1 focus:ring-primary text-slate-200 placeholder:text-slate-500"
              placeholder="Buscar por nombre o ID..."
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
            />
          </div>
          {search && (
            <button onClick={() => setSearch('')}
              className="text-slate-400 hover:text-white text-xs uppercase tracking-widest px-3 py-2 border border-slate-700 rounded transition-colors">
              Limpiar
            </button>
          )}
        </div>

        {/* List */}
        <section className="flex flex-col gap-4">
          {loading ? (
            [...Array(3)].map((_, i) => (
              <div key={i} className="bg-slate-800/40 p-6 rounded border border-slate-800 animate-pulse h-24" />
            ))
          ) : paginated.length === 0 ? (
            <div className="text-center py-20 text-slate-500">
              <span className="material-symbols-outlined text-5xl mb-4 block">inbox</span>
              <p className="text-sm uppercase tracking-widest">
                {search ? 'No se encontraron resultados' : 'No hay automatizaciones aún'}
              </p>
              {!search && (
                <button onClick={() => navigate('/automatizaciones/nueva')}
                  className="mt-4 text-primary text-xs uppercase tracking-widest hover:underline">
                  Crear la primera automatización
                </button>
              )}
            </div>
          ) : (
            paginated.map(item => {
              const cfg      = STATUS_CONFIG[item.status] || STATUS_CONFIG.INACTIVE;
              const isPaused = item.status === 'PAUSED';
              const isAlert  = item.status === 'ERROR';
              const isBusy   = updating === item.id;

              return (
                <div key={item.id} className="bg-slate-800/40 p-6 rounded border border-slate-800 hover:border-slate-700 transition-all">
                  <div className="flex items-center justify-between gap-6">

                    {/* Name + status */}
                    <div className="w-1/4">
                      <h3 className="text-xl font-bold uppercase tracking-tight text-white">{item.name}</h3>
                      {item.project?.name && (
                        <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-widest">{item.project.name}</p>
                      )}
                      <div className="flex items-center gap-2 mt-2">
                        <span className={`w-2 h-2 rounded-full block ${cfg.dot}`}></span>
                        <span className={`text-xs font-bold uppercase tracking-widest ${cfg.text}`}>{cfg.label}</span>
                      </div>
                    </div>

                    {/* Flow icons */}
                    <div className={`flex-1 flex items-center justify-center ${isPaused ? 'opacity-40 grayscale' : ''}`}>
                      <div className="flex items-center gap-4">
                        {cfg.icons.map((icon, i) => (
                          <div key={i} className="flex items-center gap-4">
                            <div className={`w-8 h-8 rounded flex items-center justify-center ${isAlert && i === 1 ? 'bg-red-500/10' : 'bg-slate-900'}`}>
                              <span className={`material-symbols-outlined text-[18px] ${isAlert && i === 1 ? 'text-red-500' : 'text-primary'}`}>{icon}</span>
                            </div>
                            {i < cfg.icons.length - 1 && (
                              <div className={`w-16 h-[1px] ${isAlert ? 'bg-red-500/50' : 'bg-gradient-to-r from-primary to-primary/20'}`}></div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Metrics */}
                    <div className="w-1/3 grid grid-cols-2 gap-4 border-l border-slate-700 pl-6">
                      <div className="flex flex-col">
                        <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Tipo</span>
                        <span className="text-sm font-medium text-slate-200">{item.type || '—'}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Creado</span>
                        <span className="text-sm font-medium text-slate-200">
                          {new Date(item.createdAt).toLocaleDateString('es', { day: '2-digit', month: 'short' })}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-4 ml-4">
                      <button
                        onClick={() => toggleStatus(item)}
                        disabled={isBusy}
                        className={`text-xs font-bold uppercase tracking-widest transition-colors border px-3 py-1.5 rounded ${
                          isBusy ? 'opacity-50 cursor-not-allowed border-slate-700 text-slate-500' :
                          isPaused ? 'border-primary text-primary hover:bg-primary/10' :
                          'border-slate-700 text-slate-400 hover:text-white'
                        }`}>
                        {isBusy ? '...' : isPaused ? 'Reanudar' : 'Pausar'}
                      </button>
                      <Link to="/automatizaciones/logs"
                        className="text-xs font-bold uppercase tracking-widest text-primary hover:underline">
                        Ver Logs
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </section>

        {/* Pagination */}
        {!loading && filtered.length > PER_PAGE && (
          <footer className="mt-8 flex justify-between items-center text-slate-500 text-xs uppercase tracking-widest">
            <div>Mostrando {Math.min(page * PER_PAGE, filtered.length)} de {filtered.length} automatizaciones</div>
            <div className="flex gap-4 items-center">
              <button onClick={() => setPage(p => p - 1)} disabled={page === 1}
                className="flex items-center gap-1 hover:text-primary transition-colors disabled:opacity-30">
                <span className="material-symbols-outlined text-[16px]">chevron_left</span> Anterior
              </button>
              <div className="flex gap-2">
                {[...Array(totalPages)].map((_, i) => (
                  <button key={i} onClick={() => setPage(i + 1)}
                    className={`px-2 ${page === i + 1 ? 'text-primary font-bold' : 'hover:text-primary'}`}>
                    {i + 1}
                  </button>
                ))}
              </div>
              <button onClick={() => setPage(p => p + 1)} disabled={page === totalPages}
                className="flex items-center gap-1 hover:text-primary transition-colors disabled:opacity-30">
                Siguiente <span className="material-symbols-outlined text-[16px]">chevron_right</span>
              </button>
            </div>
          </footer>
        )}
      </main>
    </PortalLayout>
  );
}
