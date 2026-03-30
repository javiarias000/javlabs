import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PortalLayout from '../../components/PortalLayout';
import api from '../../services/api';
import './AdminContactos.css';

const STATUS_OPTIONS = [
  { value: 'PENDING', label: 'Pendiente', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
  { value: 'READ', label: 'Leído', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
  { value: 'REPLIED', label: 'Respondido', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
  { value: 'CLOSED', label: 'Cerrado', color: 'bg-slate-500/10 text-slate-400 border-slate-500/20' },
];

const PROJECT_OPTIONS = [
  { key: '', label: '— Sin proyecto —' },
  { key: 'dentilook', label: 'DentiLook' },
  { key: 'sama_shala', label: 'Sama Shala' },
  { key: 'facturas', label: 'Datos & Facturas' },
  { key: 'violin', label: 'Clases Violin' },
  { key: 'general', label: 'General' },
];

export default function AdminContactos() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState(''); // 'PENDING', 'READ', etc. or '' for all

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const { data } = await api.get('/contact');
      setContacts(data.contacts || []);
    } catch (err) {
      setError('Error al cargar contactos');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (contactId, newStatus) => {
    setUpdating(contactId);
    try {
      await api.patch(`/contact/${contactId}`, { status: newStatus });
      setContacts(prev => prev.map(c => c.id === contactId ? { ...c, status: newStatus } : c));
    } catch (err) {
      setError('Error al actualizar estado');
    } finally {
      setUpdating(null);
    }
  };

  const handleConvertToUser = async (contact, e) => {
    e.stopPropagation();
    if (!window.confirm(`¿Crear usuario CLIENT para ${contact.name} (${contact.email})?`)) return;

    setUpdating(contact.id);
    try {
      await api.patch(`/contact/${contact.id}`, { createUser: true });
      // Refrescar datos
      fetchContacts();
    } catch (err) {
      setError('Error al crear usuario');
      setUpdating(null);
    }
  };

  const filteredContacts = filter ? contacts.filter(c => c.status === filter) : contacts;

  return (
    <PortalLayout>
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Formularios de Contacto</h1>
            <p className="text-slate-400 text-sm mt-1">{contacts.length} mensajes recibidos</p>
          </div>
          <div className="flex gap-3">
            <select
              value={filter}
              onChange={e => setFilter(e.target.value)}
              className="bg-slate-800 border border-slate-700 text-slate-100 text-sm px-4 py-2 rounded outline-none focus:border-primary"
            >
              <option value="">Todos los estados</option>
              {STATUS_OPTIONS.map(s => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
            <button onClick={fetchContacts} className="px-4 py-2 border border-primary text-primary hover:bg-primary/10 rounded text-sm transition-colors">
              Actualizar
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded flex items-center gap-3">
            <span className="material-symbols-outlined text-red-400">error</span>
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center h-64 text-slate-500">
            <span className="material-symbols-outlined animate-spin mr-2">progress_activity</span> Cargando...
          </div>
        ) : (
          <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-slate-800/50 text-slate-400 text-xs uppercase font-montserrat">
                <tr>
                  <th className="px-6 py-4">Fecha</th>
                  <th className="px-6 py-4">Contacto</th>
                  <th className="px-6 py-4">Servicio</th>
                  <th className="px-6 py-4">Estado</th>
                  <th className="px-6 py-4">Usuario</th>
                  <th className="px-6 py-4">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filteredContacts.map(contact => {
                  const statusConfig = STATUS_OPTIONS.find(s => s.value === contact.status) || STATUS_OPTIONS[0];
                  return (
                    <tr key={contact.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="px-6 py-4 text-slate-400 text-xs">
                        {new Date(contact.createdAt).toLocaleDateString('es')}
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-white font-medium text-sm">{contact.name}</p>
                          <p className="text-slate-500 text-xs">{contact.email}</p>
                          {contact.phone && <p className="text-slate-600 text-xs">{contact.phone}</p>}
                          {contact.company && <p className="text-slate-600 text-xs">{contact.company}</p>}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-slate-300 text-sm">{contact.service || '—'}</span>
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={contact.status}
                          onChange={e => handleStatusChange(contact.id, e.target.value)}
                          disabled={updating === contact.id}
                          className={`text-[10px] font-bold uppercase px-2 py-1 rounded border ${statusConfig.color} bg-transparent cursor-pointer disabled:opacity-50`}
                        >
                          {STATUS_OPTIONS.map(s => (
                            <option key={s.value} value={s.value} className="bg-slate-800">{s.label}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-6 py-4">
                        {contact.user ? (
                          <div className="flex items-center gap-2">
                            <div className="size-8 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center text-white text-xs font-bold">
                              {contact.user.name?.[0]?.toUpperCase() || 'U'}
                            </div>
                            <div>
                              <p className="text-slate-300 text-sm">{contact.user.name}</p>
                              <p className="text-slate-500 text-xs">{contact.user.role}</p>
                            </div>
                          </div>
                        ) : (
                          <span className="text-slate-500 text-sm">Sin usuario</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {!contact.user && (
                            <button
                              onClick={(e) => handleConvertToUser(contact, e)}
                              disabled={updating === contact.id}
                              className="px-3 py-1 text-xs font-bold uppercase border border-primary/30 text-primary hover:bg-primary/10 rounded disabled:opacity-50 transition-colors"
                              title="Crear usuario CLIENT"
                            >
                              {updating === contact.id ? '...' : 'Crear Usuario'}
                            </button>
                          )}
                          {contact.user && contact.user.n8nProjectKey && (
                            <span className="text-xs text-emerald-400 flex items-center gap-1">
                              <span className="material-symbols-outlined text-sm">check_circle</span>
                              {PROJECT_OPTIONS.find(p => p.key === contact.user.n8nProjectKey)?.label}
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {filteredContacts.length === 0 && (
              <div className="text-center py-12 text-slate-500">
                <span className="material-symbols-outlined text-4xl mb-3 block">inbox</span>
                <p className="text-sm uppercase tracking-widest">No hay contactos</p>
              </div>
            )}
          </div>
        )}
      </main>
    </PortalLayout>
  );
}
