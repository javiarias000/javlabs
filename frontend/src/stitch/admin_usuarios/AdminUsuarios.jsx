import { useState, useEffect } from 'react';
import PortalLayout from '../../components/PortalLayout';
import api from '../../services/api';
import './AdminUsuarios.css';

const PROJECT_OPTIONS = [
  { key: '', label: '— Sin proyecto —' },
  { key: 'dentilook', label: 'DentiLook' },
  { key: 'sama_shala', label: 'Sama Shala' },
  { key: 'facturas', label: 'Datos & Facturas' },
  { key: 'violin', label: 'Clases Violin' },
  { key: 'general', label: 'General' },
];

const ROLE_OPTIONS = [
  { value: 'ADMIN', label: 'Administrador' },
  { value: 'AGENT', label: 'Agente' },
  { value: 'CLIENT', label: 'Cliente' },
];

const SERVICE_OPTIONS = [
  { key: 'AGENTES_IA',     label: 'Agentes de IA',    icon: 'smart_toy',  color: 'text-violet-400',  bg: 'bg-violet-500/10 border-violet-500/20' },
  { key: 'AUTOMATIZACION', label: 'Automatización',    icon: 'memory',     color: 'text-primary',     bg: 'bg-primary/10 border-primary/20' },
  { key: 'INTEGRACION',    label: 'Integración',       icon: 'hub',        color: 'text-cyan-400',    bg: 'bg-cyan-500/10 border-cyan-500/20' },
  { key: 'DESARROLLO_WEB', label: 'Desarrollo Web',    icon: 'web',        color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
  { key: 'MARKETING_META', label: 'Marketing Meta',    icon: 'campaign',   color: 'text-amber-400',   bg: 'bg-amber-500/10 border-amber-500/20' },
];

export default function AdminUsuarios() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null); // editing n8nProjectKey
  const [savingProject, setSavingProject] = useState(null);
  const [savingRole, setSavingRole] = useState(null);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '', email: '', password: '', role: 'CLIENT', company: '', phone: '', n8nProjectKey: ''
  });
  const [createError, setCreateError] = useState('');

  // Role editor state
  const [editingRole, setEditingRole] = useState(null);
  const [tempRole, setTempRole] = useState(null);

  // Services editor state
  const [editingServices, setEditingServices] = useState(null); // userId
  const [tempServices, setTempServices] = useState([]);
  const [savingServices, setSavingServices] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data } = await api.get('/users');
      setUsers(data);
    } catch {
      setError('Error al cargar usuarios.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (userId, changes) => {
    setSavingProject(userId);
    try {
      const { data } = await api.patch(`/users/${userId}`, changes);
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, ...data } : u));
      setEditing(null);
    } catch (err) {
      console.error('Error actualizando usuario:', err.response?.data || err.message);
      setError(`Error al actualizar: ${err.response?.data?.error || err.message}`);
    } finally {
      setSavingProject(null);
    }
  };

  const handleToggleActive = async (user) => {
    setSavingProject(user.id);
    try {
      const { data } = await api.patch(`/users/${user.id}`, { isActive: !user.isActive });
      setUsers(prev => prev.map(u => u.id === user.id ? { ...u, ...data } : u));
    } catch (err) {
      console.error('Error toggle active:', err.response?.data || err.message);
      setError(`Error: ${err.response?.data?.error || err.message}`);
    } finally {
      setSavingProject(null);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setCreateError('');
    setCreating(true);
    try {
      const { data } = await api.post('/users', newUser);
      setUsers(prev => [data, ...prev]);
      setShowCreateModal(false);
      setNewUser({ name: '', email: '', password: '', role: 'CLIENT', company: '', phone: '', n8nProjectKey: '' });
    } catch (err) {
      setCreateError(err.response?.data?.error || 'Error al crear usuario.');
    } finally {
      setCreating(false);
    }
  };

  const handleStartEditRole = (userId, currentRole) => {
    setEditingRole(userId);
    setTempRole(currentRole);
  };

  const handleCancelEditRole = () => {
    setEditingRole(null);
    setTempRole(null);
  };

  const handleSaveRole = async (userId) => {
    setSavingRole(userId);
    try {
      console.log('[handleSaveRole] Inicio:', { userId, tempRole });
      const payload = { role: tempRole };
      console.log('[handleSaveRole] Payload a enviar:', payload);
      const { data } = await api.patch(`/users/${userId}`, payload);
      console.log('[handleSaveRole] Respuesta exitosa:', data);
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, ...data } : u));
      setEditingRole(null);
      setTempRole(null);
    } catch (err) {
      console.error('[handleSaveRole] Error completo:', err);
      console.error('[handleSaveRole] Response data:', err.response?.data);
      console.error('[handleSaveRole] Response status:', err.response?.status);

      // Extraer mensaje de error específico de validación
      let errMsg = 'Error al actualizar rol.';
      if (err.response?.data?.errors && Array.isArray(err.response.data.errors)) {
        // Validación failed - array de errores
        const messages = err.response.data.errors.map(e => `${e.param || 'campo'}: ${e.msg}`).join(' | ');
        errMsg = `Validación: ${messages}`;
      } else if (err.response?.data?.error) {
        errMsg = err.response.data.error;
      } else if (err.response?.data?.message) {
        errMsg = err.response.data.message;
      } else if (err.message) {
        errMsg = err.message;
      }

      setError(errMsg);
      setEditingRole(null);
    } finally {
      setSavingRole(null);
    }
  };

  const handleOpenServices = (user) => {
    setEditingServices(user.id);
    setTempServices(user.services || []);
  };

  const handleToggleService = (key) => {
    setTempServices(prev =>
      prev.includes(key) ? prev.filter(s => s !== key) : [...prev, key]
    );
  };

  const handleSaveServices = async (userId) => {
    setSavingServices(userId);
    try {
      const { data } = await api.patch(`/users/${userId}`, { services: tempServices });
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, ...data } : u));
      setEditingServices(null);
    } catch (err) {
      setError(`Error al guardar servicios: ${err.response?.data?.error || err.message}`);
    } finally {
      setSavingServices(null);
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
                  <th className="px-6 py-4">Servicios</th>
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
                      {editingRole === user.id ? (
                        <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                          <select
                            value={tempRole}
                            onChange={e => setTempRole(e.target.value)}
                            className="bg-slate-800 border border-primary text-slate-100 text-xs px-2 py-1.5 rounded outline-none focus:border-primary"
                          >
                            {ROLE_OPTIONS.map(r => (
                              <option key={r.value} value={r.value}>{r.value}</option>
                            ))}
                          </select>
                          <button
                            onClick={() => handleSaveRole(user.id)}
                            disabled={savingRole === user.id}
                            className="p-1 text-emerald-400 hover:text-emerald-300 disabled:opacity-50"
                            title="Guardar"
                          >
                            <span className="material-symbols-outlined text-sm">{savingRole === user.id ? 'progress_activity' : 'check'}</span>
                          </button>
                          <button
                            onClick={handleCancelEditRole}
                            disabled={savingRole === user.id}
                            className="p-1 text-slate-400 hover:text-slate-300 disabled:opacity-50"
                            title="Cancelar"
                          >
                            <span className="material-symbols-outlined text-sm">close</span>
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                            user.role === 'ADMIN'
                              ? 'bg-violet-500/10 text-violet-400 border border-violet-500/20'
                              : user.role === 'AGENT'
                                ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                                : 'bg-slate-500/10 text-slate-400 border border-slate-500/20'
                          }`}>{user.role}</span>
                          <button
                            onClick={() => handleStartEditRole(user.id, user.role)}
                            className="p-1 rounded text-slate-500 hover:text-violet-400 transition-colors"
                            title="Cambiar rol"
                          >
                            <span className="material-symbols-outlined text-sm">edit</span>
                          </button>
                        </div>
                      )}
                    </td>
                    {/* Servicios */}
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1 max-w-[180px]">
                        {(user.services || []).length === 0 ? (
                          <span className="text-slate-600 text-xs">— Sin servicios —</span>
                        ) : (
                          (user.services || []).map(svcKey => {
                            const svc = SERVICE_OPTIONS.find(s => s.key === svcKey);
                            if (!svc) return null;
                            return (
                              <span key={svcKey} className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase border ${svc.bg} ${svc.color}`}>
                                <span className="material-symbols-outlined text-[10px]">{svc.icon}</span>
                                {svc.label.split(' ')[0]}
                              </span>
                            );
                          })
                        )}
                        <button
                          onClick={() => handleOpenServices(user)}
                          className="p-0.5 text-slate-600 hover:text-primary transition-colors"
                          title="Editar servicios"
                        >
                          <span className="material-symbols-outlined text-xs">edit</span>
                        </button>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      {editing === user.id ? (
                        <select
                          defaultValue={user.n8nProjectKey || ''}
                          onChange={e => handleSave(user.id, { n8nProjectKey: e.target.value || null })}
                          className="bg-slate-800 border border-primary text-slate-100 text-xs px-2 py-1.5 rounded outline-none focus:border-primary">
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
                      <button onClick={() => handleToggleActive(user)} disabled={savingProject === user.id}
                        className={`px-2 py-1 rounded text-[10px] font-bold uppercase border transition-all ${
                          user.isActive
                            ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/20'
                            : 'bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20'
                        }`}>
                        {savingProject === user.id ? '...' : user.isActive ? 'Activo' : 'Inactivo'}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-slate-500 text-xs">
                      {new Date(user.createdAt).toLocaleDateString('es')}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => setEditing(editing === user.id ? null : user.id)}
                          className={`p-1.5 rounded transition-colors ${editing === user.id ? 'text-primary bg-primary/10' : 'text-slate-500 hover:text-primary'}`}
                          title="Editar proyecto n8n">
                          <span className="material-symbols-outlined text-sm">
                            {editing === user.id ? 'close' : 'edit'}
                          </span>
                        </button>
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

      {/* Modal Servicios */}
      {editingServices && (() => {
        const targetUser = users.find(u => u.id === editingServices);
        if (!targetUser) return null;
        return (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-md w-full">
              <div className="flex items-center justify-between p-6 border-b border-slate-800">
                <div>
                  <h2 className="text-lg font-bold text-white">Servicios contratados</h2>
                  <p className="text-slate-500 text-xs mt-0.5">{targetUser.name} · {targetUser.email}</p>
                </div>
                <button onClick={() => setEditingServices(null)} className="text-slate-400 hover:text-white">
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
              <div className="p-6 space-y-3">
                <p className="text-slate-500 text-xs uppercase tracking-widest font-bold mb-4">
                  Selecciona los servicios que tiene este cliente
                </p>
                {SERVICE_OPTIONS.map(svc => {
                  const checked = tempServices.includes(svc.key);
                  return (
                    <button
                      key={svc.key}
                      onClick={() => handleToggleService(svc.key)}
                      className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all text-left ${
                        checked
                          ? `${svc.bg} border-opacity-60`
                          : 'border-slate-700 bg-slate-800/30 hover:border-slate-600'
                      }`}
                    >
                      <div className={`size-9 rounded-lg flex items-center justify-center flex-shrink-0 ${checked ? svc.bg : 'bg-slate-800'} border ${checked ? '' : 'border-slate-700'}`}>
                        <span className={`material-symbols-outlined text-lg ${checked ? svc.color : 'text-slate-500'}`}>{svc.icon}</span>
                      </div>
                      <div className="flex-1">
                        <p className={`font-bold text-sm ${checked ? 'text-white' : 'text-slate-400'}`}>{svc.label}</p>
                      </div>
                      <div className={`size-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                        checked ? 'bg-primary border-primary' : 'border-slate-600'
                      }`}>
                        {checked && <span className="material-symbols-outlined text-white text-sm">check</span>}
                      </div>
                    </button>
                  );
                })}
              </div>
              <div className="flex gap-3 p-6 border-t border-slate-800">
                <button
                  onClick={() => setEditingServices(null)}
                  className="flex-1 px-4 py-2.5 border border-slate-700 text-slate-300 rounded-lg hover:bg-slate-800 transition-colors text-sm"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => handleSaveServices(editingServices)}
                  disabled={savingServices === editingServices}
                  className="flex-1 px-4 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/80 disabled:opacity-50 transition-colors text-sm font-bold"
                >
                  {savingServices === editingServices ? 'Guardando...' : 'Guardar servicios'}
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Modal Crear Usuario */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-slate-800">
              <h2 className="text-xl font-bold text-white">Crear Nuevo Usuario</h2>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-white">
                <span className="material-symbols-outlined text-2xl">close</span>
              </button>
            </div>
            <form onSubmit={handleCreateUser} className="p-6 space-y-4">
              {createError && (
                <div className="p-3 bg-red-500/10 border border-red-500/30 rounded text-red-400 text-sm">
                  {createError}
                </div>
              )}
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Nombre</label>
                <input
                  type="text"
                  required
                  value={newUser.name}
                  onChange={e => setNewUser({ ...newUser, name: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 text-slate-100 px-4 py-2.5 rounded outline-none focus:border-primary"
                  placeholder="Juan Pérez"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Email</label>
                <input
                  type="email"
                  required
                  value={newUser.email}
                  onChange={e => setNewUser({ ...newUser, email: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 text-slate-100 px-4 py-2.5 rounded outline-none focus:border-primary"
                  placeholder="juan@ejemplo.com"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Password</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={newUser.password}
                  onChange={e => setNewUser({ ...newUser, password: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 text-slate-100 px-4 py-2.5 rounded outline-none focus:border-primary"
                  placeholder="Mínimo 6 caracteres"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Rol</label>
                <select
                  value={newUser.role}
                  onChange={e => setNewUser({ ...newUser, role: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 text-slate-100 px-4 py-2.5 rounded outline-none focus:border-primary"
                >
                  {ROLE_OPTIONS.map(r => (
                    <option key={r.value} value={r.value}>{r.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Empresa (opcional)</label>
                <input
                  type="text"
                  value={newUser.company || ''}
                  onChange={e => setNewUser({ ...newUser, company: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 text-slate-100 px-4 py-2.5 rounded outline-none focus:border-primary"
                  placeholder="Nombre de la empresa"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Teléfono (opcional)</label>
                <input
                  type="tel"
                  value={newUser.phone || ''}
                  onChange={e => setNewUser({ ...newUser, phone: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 text-slate-100 px-4 py-2.5 rounded outline-none focus:border-primary"
                  placeholder="+34 000 000 000"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Proyecto n8n (opcional)</label>
                <select
                  value={newUser.n8nProjectKey}
                  onChange={e => setNewUser({ ...newUser, n8nProjectKey: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 text-slate-100 px-4 py-2.5 rounded outline-none focus:border-primary"
                >
                  {PROJECT_OPTIONS.map(p => (
                    <option key={p.key} value={p.key}>{p.label}</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2.5 border border-slate-700 text-slate-300 rounded hover:bg-slate-800 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="flex-1 px-4 py-2.5 bg-primary text-white rounded hover:bg-primary/80 disabled:opacity-50 transition-colors"
                >
                  {creating ? 'Creando...' : 'Crear Usuario'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </PortalLayout>
  );
}
