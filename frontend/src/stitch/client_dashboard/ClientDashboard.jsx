import PortalLayout from '../../components/PortalLayout';
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import './ClientDashboard.css';

const STATUS_COLORS = {
  NEW:       { dot: 'bg-blue-500',    text: 'text-blue-400',    label: 'Nuevo',      bg: 'bg-blue-500/10 border-blue-500/20'    },
  CONTACTED: { dot: 'bg-amber-500',   text: 'text-amber-400',   label: 'Contactado', bg: 'bg-amber-500/10 border-amber-500/20'  },
  CLOSED:    { dot: 'bg-emerald-500', text: 'text-emerald-400', label: 'Cerrado',    bg: 'bg-emerald-500/10 border-emerald-500/20' },
};

export default function ClientDashboard() {
  const { user }   = useAuth();
  const [contacts, setContacts] = useState([]);
  const [total,    setTotal]    = useState(0);
  const [loading,  setLoading]  = useState(true);
  const [selected, setSelected] = useState(null);
  const [search,   setSearch]   = useState('');
  const [filter,   setFilter]   = useState('');
  const [page,     setPage]     = useState(1);
  const [error,    setError]    = useState(null);
  const PER_PAGE = 10;

  useEffect(() => {
    setError(null);
    api.get('/contact?limit=200')
      .then(({ data }) => { setContacts(data.contacts); setTotal(data.total); })
      .catch((err) => {
        console.error('Error loading contacts:', err);
        setError('No se pudieron cargar los contactos. Intenta de nuevo más tarde.');
      })
      .finally(() => setLoading(false));
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      await api.patch(`/contact/${id}`, { status });
      setContacts(prev => prev.map(c => c.id === id ? { ...c, status } : c));
      if (selected?.id === id) setSelected(prev => ({ ...prev, status }));
    } catch (err) {
      console.error('Error updating contact status:', err);
      alert('No se pudo actualizar el estado del contacto. Intenta de nuevo.');
    }
  };

  const filtered = contacts.filter(c => {
    const matchSearch = !search ||
      c.name?.toLowerCase().includes(search.toLowerCase()) ||
      c.email?.toLowerCase().includes(search.toLowerCase()) ||
      c.company?.toLowerCase().includes(search.toLowerCase());
    const matchFilter = !filter || c.status === filter;
    return matchSearch && matchFilter;
  });

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated  = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const stats = {
    total:     contacts.length,
    new:       contacts.filter(c => c.status === 'NEW').length,
    contacted: contacts.filter(c => c.status === 'CONTACTED').length,
    closed:    contacts.filter(c => c.status === 'CLOSED').length,
  };

  return (
    <PortalLayout>
      <div className="p-8 space-y-8">

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

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold uppercase tracking-tight text-white">CRM / Contactos</h1>
            <p className="text-slate-400 text-sm mt-1">{stats.total} contactos recibidos</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total',      value: stats.total,     color: 'text-white',        icon: 'contacts',    bg: 'from-slate-700 to-slate-800'    },
            { label: 'Nuevos',     value: stats.new,       color: 'text-blue-400',     icon: 'mark_email_unread', bg: 'from-blue-900 to-blue-800' },
            { label: 'Contactados',value: stats.contacted, color: 'text-amber-400',    icon: 'forum',       bg: 'from-amber-900 to-amber-800'    },
            { label: 'Cerrados',   value: stats.closed,    color: 'text-emerald-400',  icon: 'check_circle', bg: 'from-emerald-900 to-emerald-800' },
          ].map(s => (
            <div key={s.label} className="bg-slate-900 border border-slate-800 p-5 flex items-center justify-between group hover:border-slate-700 transition-colors">
              <div>
                <p className="text-slate-500 text-xs uppercase tracking-widest mb-1">{s.label}</p>
                <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
              </div>
              <div className={`size-10 bg-gradient-to-br ${s.bg} flex items-center justify-center opacity-60 group-hover:opacity-100 transition-opacity`}>
                <span className="material-symbols-outlined text-white">{s.icon}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Filtros */}
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-[250px]">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">search</span>
            <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
              placeholder="Buscar por nombre, email o empresa..."
              className="w-full bg-slate-900 border border-slate-700 text-slate-100 pl-9 pr-4 py-2.5 text-sm rounded focus:border-primary outline-none placeholder:text-slate-600" />
          </div>
          <div className="flex gap-2">
            {['', 'NEW', 'CONTACTED', 'CLOSED'].map(st => (
              <button key={st} onClick={() => { setFilter(st); setPage(1); }}
                className={`px-4 py-2 text-xs font-bold uppercase tracking-widest rounded transition-all ${
                  filter === st
                    ? 'bg-primary text-white'
                    : 'border border-slate-700 text-slate-400 hover:text-white hover:border-slate-500'
                }`}>
                {st === '' ? 'Todos' : STATUS_COLORS[st]?.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tabla */}
        <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
            <h2 className="text-white text-sm font-bold uppercase tracking-wider">Formularios de Contacto</h2>
            <span className="text-xs text-slate-500 uppercase tracking-widest">{filtered.length} resultados</span>
          </div>

          {loading ? (
            <div className="p-12 text-center text-slate-500">
              <span className="material-symbols-outlined animate-spin text-4xl block mb-3">progress_activity</span>
              Cargando...
            </div>
          ) : paginated.length === 0 ? (
            <div className="p-12 text-center text-slate-500">
              <span className="material-symbols-outlined text-4xl block mb-3">inbox</span>
              <p className="text-sm uppercase tracking-widest">No hay contactos</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-800/50 text-[10px] uppercase font-bold text-slate-500 tracking-widest">
                  <tr>
                    <th className="px-6 py-4">Nombre</th>
                    <th className="px-6 py-4">Email</th>
                    <th className="px-6 py-4">Servicio</th>
                    <th className="px-6 py-4">Fecha</th>
                    <th className="px-6 py-4">Estado</th>
                    <th className="px-6 py-4">Accion</th>
                  </tr>
                </thead>
                <tbody className="text-sm divide-y divide-slate-800">
                  {paginated.map(c => {
                    const s = STATUS_COLORS[c.status] || STATUS_COLORS.NEW;
                    return (
                      <tr key={c.id} className="hover:bg-slate-800/40 transition-colors cursor-pointer"
                        onClick={() => setSelected(c)}>
                        <td className="px-6 py-4">
                          <p className="text-slate-200 font-medium">{c.name}</p>
                          {c.company && <p className="text-slate-500 text-[10px] mt-0.5">{c.company}</p>}
                        </td>
                        <td className="px-6 py-4 text-slate-400 text-xs">{c.email}</td>
                        <td className="px-6 py-4 text-slate-400 text-xs">{c.service || '—'}</td>
                        <td className="px-6 py-4 text-slate-500 text-xs">
                          {new Date(c.createdAt).toLocaleDateString('es-ES')}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded text-[10px] font-bold uppercase border ${s.bg} ${s.text}`}>
                            <span className={`w-1 h-1 rounded-full ${s.dot}`}></span>
                            {s.label}
                          </span>
                        </td>
                        <td className="px-6 py-4" onClick={e => e.stopPropagation()}>
                          <select value={c.status} onChange={e => handleStatusChange(c.id, e.target.value)}
                            className="bg-slate-800 border border-slate-700 text-slate-300 text-xs px-2 py-1 rounded outline-none focus:border-primary">
                            <option value="NEW">Nuevo</option>
                            <option value="CONTACTED">Contactado</option>
                            <option value="CLOSED">Cerrado</option>
                          </select>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Paginacion */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-slate-800 flex justify-between items-center text-slate-500 text-xs uppercase tracking-widest">
              <span>Mostrando {Math.min(page * PER_PAGE, filtered.length)} de {filtered.length}</span>
              <div className="flex items-center gap-2">
                <button onClick={() => setPage(p => p - 1)} disabled={page === 1}
                  className="p-1.5 border border-slate-700 hover:border-primary transition-colors disabled:opacity-30">
                  <span className="material-symbols-outlined text-sm">chevron_left</span>
                </button>
                {[...Array(totalPages)].map((_, i) => (
                  <button key={i} onClick={() => setPage(i + 1)}
                    className={`w-7 h-7 border text-xs font-bold transition-colors ${page === i + 1 ? 'border-primary bg-primary/20 text-white' : 'border-slate-700 hover:border-primary'}`}>
                    {i + 1}
                  </button>
                ))}
                <button onClick={() => setPage(p => p + 1)} disabled={page === totalPages}
                  className="p-1.5 border border-slate-700 hover:border-primary transition-colors disabled:opacity-30">
                  <span className="material-symbols-outlined text-sm">chevron_right</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal detalle */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={() => setSelected(null)}>
          <div className="bg-background-dark border border-slate-700 w-full max-w-lg shadow-2xl rounded-xl"
            onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700">
              <h3 className="text-white font-bold uppercase tracking-wider text-sm">Detalle del Contacto</h3>
              <button onClick={() => setSelected(null)} className="text-slate-500 hover:text-white transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Nombre',  value: selected.name,    show: true             },
                  { label: 'Empresa', value: selected.company, show: !!selected.company },
                  { label: 'Email',   value: selected.email,   show: true, link: `mailto:${selected.email}` },
                  { label: 'Telefono',value: selected.phone,   show: !!selected.phone  },
                  { label: 'Servicio',value: selected.service, show: !!selected.service, span: true },
                ].filter(f => f.show).map(f => (
                  <div key={f.label} className={f.span ? 'col-span-2' : ''}>
                    <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">{f.label}</p>
                    {f.link
                      ? <a href={f.link} className="text-primary text-sm hover:underline">{f.value}</a>
                      : <p className="text-white text-sm">{f.value}</p>
                    }
                  </div>
                ))}
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-2">Mensaje</p>
                <div className="bg-black/40 border border-slate-700 p-4 text-slate-300 text-sm leading-relaxed whitespace-pre-wrap rounded">
                  {selected.message}
                </div>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-2">Estado</p>
                <div className="flex gap-3">
                  {['NEW', 'CONTACTED', 'CLOSED'].map(st => {
                    const s = STATUS_COLORS[st];
                    return (
                      <button key={st} onClick={() => handleStatusChange(selected.id, st)}
                        className={`flex-1 py-2 text-xs font-bold uppercase tracking-widest border rounded transition-all ${
                          selected.status === st ? `border-current ${s.text} bg-white/5` : 'border-slate-700 text-slate-500 hover:border-slate-500'
                        }`}>
                        {s.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-slate-700 flex justify-between items-center">
              <p className="text-[10px] text-slate-600 uppercase tracking-widest">
                {new Date(selected.createdAt).toLocaleString('es-ES')}
              </p>
              <a href={`mailto:${selected.email}?subject=Re: JAV LABS - ${selected.service || 'Consulta'}`}
                className="flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-widest text-white rounded hover:opacity-90 transition-opacity"
                style={{ background: 'linear-gradient(to right, #0d7ff2, #7c3aed)' }}>
                <span className="material-symbols-outlined text-sm">reply</span>
                Responder
              </a>
            </div>
          </div>
        </div>
      )}
    </PortalLayout>
  );
}
