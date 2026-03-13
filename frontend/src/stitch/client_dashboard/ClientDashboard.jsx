import PortalLayout from '../../components/PortalLayout';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import './ClientDashboard.css';

const STATUS_COLORS = {
  NEW:       { dot: 'bg-blue-500',    text: 'text-blue-400',    label: 'Nuevo' },
  CONTACTED: { dot: 'bg-amber-500',   text: 'text-amber-400',   label: 'Contactado' },
  CLOSED:    { dot: 'bg-emerald-500', text: 'text-emerald-400', label: 'Cerrado' },
};

export default function ClientDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [contacts, setContacts] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    api.get('/contact?limit=50')
      .then(({ data }) => { setContacts(data.contacts); setTotal(data.total); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      await api.patch(`/contact/${id}`, { status });
      setContacts(prev => prev.map(c => c.id === id ? { ...c, status } : c));
      if (selected?.id === id) setSelected(prev => ({ ...prev, status }));
    } catch {}
  };

  const handleLogout = async () => { await logout(); navigate('/login'); };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}

      {/* Main */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 border-b border-slate-800 bg-background-dark px-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="material-symbols-outlined text-primary">terminal</span>
            <h2 className="text-slate-100 text-lg font-technical uppercase tracking-tight">
              BIENVENIDO, {user?.name?.toUpperCase() || 'ADMIN'}
            </h2>
          </div>
          <span className="text-xs font-medium text-slate-400 uppercase tracking-widest">
            Estado: <span className="text-emerald-500">Online</span>
          </span>
        </header>

        <div className="flex-1 overflow-y-auto p-8 space-y-8">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-sidebar-dark p-6 geometric-border flex flex-col gap-2">
              <span className="text-[10px] text-primary font-bold uppercase tracking-[0.2em]">Total</span>
              <p className="text-slate-400 text-xs uppercase font-medium">Contactos recibidos</p>
              <h3 className="text-3xl font-technical text-slate-100">{total}</h3>
            </div>
            <div className="bg-sidebar-dark p-6 geometric-border flex flex-col gap-2">
              <span className="text-[10px] text-blue-400 font-bold uppercase tracking-[0.2em]">Nuevos</span>
              <p className="text-slate-400 text-xs uppercase font-medium">Sin responder</p>
              <h3 className="text-3xl font-technical text-slate-100">{contacts.filter(c => c.status === 'NEW').length}</h3>
            </div>
            <div className="bg-sidebar-dark p-6 geometric-border flex flex-col gap-2">
              <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-[0.2em]">Cerrados</span>
              <p className="text-slate-400 text-xs uppercase font-medium">Resueltos</p>
              <h3 className="text-3xl font-technical text-slate-100">{contacts.filter(c => c.status === 'CLOSED').length}</h3>
            </div>
          </div>

          {/* Tabla */}
          <div className="bg-sidebar-dark border border-slate-800">
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
              <h2 className="text-slate-100 text-sm font-technical uppercase tracking-wider">Formularios de Contacto</h2>
              <span className="text-xs text-slate-500 uppercase tracking-widest">{total} total</span>
            </div>
            {loading ? (
              <div className="p-12 text-center text-slate-500 text-sm">Cargando...</div>
            ) : contacts.length === 0 ? (
              <div className="p-12 text-center text-slate-500 text-sm">No hay contactos aún.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-black/40 text-[10px] uppercase font-bold text-slate-500 tracking-[0.1em]">
                    <tr>
                      <th className="px-6 py-4">Nombre</th>
                      <th className="px-6 py-4">Email</th>
                      <th className="px-6 py-4">Servicio</th>
                      <th className="px-6 py-4">Fecha</th>
                      <th className="px-6 py-4">Estado</th>
                      <th className="px-6 py-4">Acción</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm divide-y divide-slate-800">
                    {contacts.map(c => {
                      const s = STATUS_COLORS[c.status] || STATUS_COLORS.NEW;
                      return (
                        <tr key={c.id}
                          className="hover:bg-slate-800/40 transition-colors cursor-pointer"
                          onClick={() => setSelected(c)}>
                          <td className="px-6 py-4 text-slate-200 font-medium">
                            {c.name}
                            {c.company && <span className="block text-[10px] text-slate-500">{c.company}</span>}
                          </td>
                          <td className="px-6 py-4 text-slate-400 text-xs">{c.email}</td>
                          <td className="px-6 py-4 text-slate-400 text-xs">{c.service || '—'}</td>
                          <td className="px-6 py-4 text-slate-500 text-xs">
                            {new Date(c.createdAt).toLocaleDateString('es-ES')}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <div className={`size-2 ${s.dot}`}></div>
                              <span className={`text-xs uppercase font-bold ${s.text}`}>{s.label}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4" onClick={e => e.stopPropagation()}>
                            <select
                              value={c.status}
                              onChange={e => handleStatusChange(c.id, e.target.value)}
                              className="bg-slate-800 border border-slate-700 text-slate-300 text-xs px-2 py-1 uppercase">
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
          </div>
        </div>
      </main>

      {/* Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
          onClick={() => setSelected(null)}>
          <div className="bg-sidebar-dark border border-slate-700 w-full max-w-lg shadow-2xl"
            onClick={e => e.stopPropagation()}>
            {/* Header modal */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700">
              <h3 className="text-white font-technical uppercase tracking-wider text-sm">Detalle del Contacto</h3>
              <button onClick={() => setSelected(null)} className="text-slate-500 hover:text-white transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Body modal */}
            <div className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">Nombre</p>
                  <p className="text-white text-sm font-medium">{selected.name}</p>
                </div>
                {selected.company && (
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">Empresa</p>
                    <p className="text-white text-sm">{selected.company}</p>
                  </div>
                )}
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">Email</p>
                  <a href={`mailto:${selected.email}`} className="text-primary text-sm hover:underline">{selected.email}</a>
                </div>
                {selected.phone && (
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">Teléfono</p>
                    <p className="text-white text-sm">{selected.phone}</p>
                  </div>
                )}
                {selected.service && (
                  <div className="col-span-2">
                    <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">Servicio de interés</p>
                    <p className="text-white text-sm">{selected.service}</p>
                  </div>
                )}
              </div>

              <div>
                <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-2">Mensaje</p>
                <div className="bg-black/40 border border-slate-700 p-4 text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">
                  {selected.message}
                </div>
              </div>

              <div>
                <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-2">Cambiar estado</p>
                <div className="flex gap-3">
                  {['NEW', 'CONTACTED', 'CLOSED'].map(st => {
                    const s = STATUS_COLORS[st];
                    return (
                      <button key={st}
                        onClick={() => handleStatusChange(selected.id, st)}
                        className={`flex-1 py-2 text-xs font-bold uppercase tracking-widest border transition-all ${
                          selected.status === st
                            ? `border-current ${s.text} bg-white/5`
                            : 'border-slate-700 text-slate-500 hover:border-slate-500'
                        }`}>
                        {s.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Footer modal */}
            <div className="px-6 py-4 border-t border-slate-700 flex justify-between items-center">
              <p className="text-[10px] text-slate-600 uppercase tracking-widest">
                {new Date(selected.createdAt).toLocaleString('es-ES')}
              </p>
              <a href={`mailto:${selected.email}?subject=Re: JAV LABS - ${selected.service || 'Consulta'}`}
                className="flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-widest text-white transition-opacity hover:opacity-80"
                style={{ background: 'linear-gradient(to right, #0d7ff2, #7c3aed)' }}>
                <span className="material-symbols-outlined text-sm">reply</span>
                Responder por email
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
