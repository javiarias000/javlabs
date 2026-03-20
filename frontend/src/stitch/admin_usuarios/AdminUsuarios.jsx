import { useState, useEffect } from 'react';
import PortalLayout from '../../components/PortalLayout';
import api from '../../services/api';

const PROJECT_OPTIONS = [
  { key: '',           label: '— Sin proyecto —' },
  { key: 'dentilook',  label: 'DentiLook'        },
  { key: 'sama_shala', label: 'Sama Shala'       },
  { key: 'facturas',   label: 'Datos & Facturas' },
  { key: 'violin',     label: 'Clases Violin'    },
  { key: 'general',    label: 'General'          },
];

export default function AdminUsuarios() {
  const [users,    setUsers]    = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [editing,  setEditing]  = useState(null);
  const [saving,   setSaving]   = useState(null);
  const [error,    setError]    = useState('');
  const [search,   setSearch]   = useState('');

  useEffect(() => {
    api.get('/users')
      .then(({ data }) => setUsers(data))
      .catch(() => setError('Error al cargar usuarios.'))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (userId, changes) => {
    setSaving(userId);
    try {
      const { data } = await api.patch(`/users/${userId}`, changes);
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, ...data } : u));
      setEditing(null);
    } catch {
      setError('Error al actualizar usuario.');
    } finally {
      setSaving(null);
    }
  };

  const handleToggleActive = async (user) => {
    setSaving(user.id);
    try {
      const { data } = await api.patch(`/users/${user.id}`, { isActive: !user.isActive });
      setUsers(prev => prev.map(u => u.id === user.id ? { ...u, ...data } : u));
    } catch {
      setError('Error al actualizar usuario.');
    } finally {
      setSaving(null);
    }
  };

  const filtered = users.filter(u =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase()) ||
    u.company?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <PortalLayout>
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold uppercase tracking-tight text-white">Gestión de Usuarios</h1>
            <p className="text-slate-400 text-sm mt-1">{users.length} usuarios registrados</p>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded flex items-center gap-3">
            <span className="material-symbols-outlined text-red-400">error</span>
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        <div className="mb-6">
          <div className="relative max-w-md">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Buscar por nombre, email o empresa..."
              className="w-full bg-slate-900 border border-slate-700 text-slate-100 pl-10 pr-4 py-2.5 rounded text-sm focus:border-primary outline-none placeholder:text-slate-600" />
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64 text-slate-500">
            <span className="material-symbols-outlined animate-spin mr-2">progress_activity</span> Cargando...
          </div>
        ) : (
          <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-slate-800/50 text-slate-400 text-xs uppercase font-montserrat">
                <tr>
                  <th className="px-6 py-4">Usuario</th>
                  <th className="px-6 py-4">Rol</th>
                  <th className="px-6 py-4">Proyecto n8n</th>
                  <th className="px-6 py-4">Estado</th>
                  <th className="px-6 py-4">Creado</th>
                  <th className="px-6 py-4">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filtered.map(user => (
                  <tr key={user.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="size-9 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                          {user.name?.[0]?.toUpperCase() || 'U'}
                        </div>
                        <div>
                          <p className="text-white font-medium text-sm">{user.name}</p>
                          <p className="text-slate-500 text-xs">{user.email}</p>
                          {user.company && <p className="text-slate-600 text-xs">{user.company}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                        user.role === 'ADMIN'
                          ? 'bg-violet-500/10 text-violet-400 border border-violet-500/20'
                          : 'bg-slate-500/10 text-slate-400 border border-slate-500/20'
                      }`}>{user.role}</span>
                    </td>
                    <td className="px-6 py-4">
                      {editing === user.id ? (
                        <select
                          defaultValue={user.n8nProjectKey || ''}
                          onChange={e => handleSave(user.id, { n8nProjectKey: e.target.value || null })}
                          className="bg-slate-800 border border-slate-700 text-slate-100 text-xs px-2 py-1.5 rounded outline-none focus:border-primary">
                          {PROJECT_OPTIONS.map(p => (
                            <option key={p.key} value={p.key}>{p.label}</option>
                          ))}
                        </select>
                      ) : (
                        <span className={`text-sm ${user.n8nProjectKey ? 'text-primary font-medium' : 'text-slate-600'}`}>
                          {PROJECT_OPTIONS.find(p => p.key === user.n8nProjectKey)?.label || '— Sin asignar —'}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <button onClick={() => handleToggleActive(user)} disabled={saving === user.id}
                        className={`px-2 py-1 rounded text-[10px] font-bold uppercase border transition-all ${
                          user.isActive
                            ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/20'
                            : 'bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20'
                        }`}>
                        {saving === user.id ? '...' : user.isActive ? 'Activo' : 'Inactivo'}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-slate-500 text-xs">
                      {new Date(user.createdAt).toLocaleDateString('es')}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => setEditing(editing === user.id ? null : user.id)}
                          className={`p-1.5 rounded transition-colors ${editing === user.id ? 'text-primary bg-primary/10' : 'text-slate-500 hover:text-primary'}`}>
                          <span className="material-symbols-outlined text-sm">
                            {editing === user.id ? 'close' : 'edit'}
                          </span>
                        </button>
                        {user.role !== 'ADMIN' && (
                          <button onClick={() => handleSave(user.id, { role: user.role === 'ADMIN' ? 'CLIENT' : 'ADMIN' })}
                            className="p-1.5 rounded text-slate-500 hover:text-violet-400 transition-colors"
                            title="Cambiar rol">
                            <span className="material-symbols-outlined text-sm">manage_accounts</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="text-center py-12 text-slate-500">
                <span className="material-symbols-outlined text-4xl mb-3 block">group_off</span>
                <p className="text-sm uppercase tracking-widest">No se encontraron usuarios</p>
              </div>
            )}
          </div>
        )}
      </main>
    </PortalLayout>
  );
}
