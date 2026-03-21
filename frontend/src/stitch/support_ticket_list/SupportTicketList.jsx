import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PortalLayout from '../../components/PortalLayout';
import { useAuth } from '../../context/AuthContext';
import supportService from '../../services/support';
import './SupportTicketList.css';

const STATUS_CONFIG = {
  AUTOMATED: { label: 'Bot Activo', dot: 'bg-primary animate-pulse', text: 'text-primary', bg: 'bg-primary/10 border-primary/20' },
  HUMAN_TAKEOVER: { label: 'Con Agente', dot: 'bg-emerald-500 animate-pulse', text: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
  PENDING_HUMAN: { label: 'Esperando Agente', dot: 'bg-amber-500 animate-pulse', text: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
  COMPLETED: { label: 'Completado', dot: 'bg-slate-500', text: 'text-slate-400', bg: 'bg-slate-500/10 border-slate-500/20' },
  CLOSED: { label: 'Cerrado', dot: 'bg-slate-600', text: 'text-slate-600', bg: 'bg-slate-600/10 border-slate-600/20' }
};

const PRIORITY_CONFIG = {
  LOW: { label: 'Baja', color: 'bg-slate-500' },
  MEDIUM: { label: 'Media', color: 'bg-blue-500' },
  HIGH: { label: 'Alta', color: 'bg-amber-500' },
  CRITICAL: { label: 'Crítica', color: 'bg-red-500' }
};

export default function SupportTicketList() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showNewForm, setShowNewForm] = useState(false);
  const [newSubject, setNewSubject] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState('');

  const isAgent = user?.role === 'ADMIN' || user?.role === 'AGENT';

  // Agentes redirigen al panel de soporte
  useEffect(() => {
    if (isAgent) {
      navigate('/soporte/chat');
    }
  }, [isAgent, navigate]);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const data = await supportService.getTickets({ limit: 50 });
      setTickets(data.tickets);
      setError(null);
    } catch (err) {
      console.error('Error fetching tickets:', err);
      setError('No se pudieron cargar los tickets.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTicket = async (e) => {
    e.preventDefault();
    if (!newSubject.trim() || !newMessage.trim()) {
      setCreateError('El asunto y mensaje son obligatorios.');
      return;
    }

    try {
      setCreating(true);
      setCreateError('');
      const ticket = await supportService.createTicket({
        subject: newSubject.trim(),
        message: newMessage.trim(),
        status: 'AUTOMATED',
        priority: 'MEDIUM'
      });
      setShowNewForm(false);
      setNewSubject('');
      setNewMessage('');
      // Redirigir al ticket recién creado
      navigate(`/soporte/ticket/${ticket.id}`);
    } catch (err) {
      console.error('Error creating ticket:', err);
      setCreateError(err.response?.data?.error || 'No se pudo crear el ticket.');
    } finally {
      setCreating(false);
    }
  };

  const handleOpenTicket = (ticketId) => {
    navigate(`/soporte/ticket/${ticketId}`);
  };

  if (isAgent) {
    // Los agentes ven el panel de soporte técnico completo
    navigate('/soporte/chat');
    return null;
  }

  return (
    <PortalLayout>
      <div className="p-8 space-y-8 max-w-6xl mx-auto">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold uppercase tracking-tighter text-white">Soporte Técnico</h1>
            <p className="text-slate-400 text-sm mt-1">
              Envía un mensaje y nuestro equipo te asistirá. El chatbot está disponible 24/7.
            </p>
          </div>
          <button
            onClick={() => setShowNewForm(!showNewForm)}
            className="flex items-center gap-2 px-6 py-2 bg-primary hover:bg-primary/90 text-white rounded text-sm font-bold uppercase tracking-widest transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            Nuevo Ticket
          </button>
        </div>

        {/* Formulario nuevo ticket */}
        {showNewForm && (
          <div className="bg-card-bg border border-slate-700 rounded-lg p-6">
            <h3 className="text-white font-bold mb-4">Nuevo Ticket de Soporte</h3>
            <form onSubmit={handleCreateTicket} className="space-y-4">
              <div>
                <label className="block text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">Asunto *</label>
                <input
                  type="text"
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  placeholder="Describe brevemente tu problema..."
                  className="w-full bg-slate-900 border border-slate-700 text-slate-100 px-4 py-2 rounded focus:border-primary outline-none text-sm"
                />
              </div>
              <div>
                <label className="block text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">Mensaje *</label>
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Describe tu problema en detalle. Incluye pasos para reproducir, errores vistos, etc."
                  rows="5"
                  className="w-full bg-slate-900 border border-slate-700 text-slate-100 px-4 py-2 rounded focus:border-primary outline-none text-sm resize-none"
                />
              </div>
              {createError && (
                <div className="p-3 bg-red-500/10 border border-red-500/30 rounded flex items-center gap-2">
                  <span className="material-symbols-outlined text-red-400 text-sm">error</span>
                  <p className="text-xs text-red-400">{createError}</p>
                </div>
              )}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowNewForm(false)}
                  className="px-4 py-2 border border-slate-700 text-slate-400 hover:text-white rounded text-sm font-bold uppercase tracking-widest transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded text-sm font-bold uppercase tracking-widest transition-all disabled:opacity-50"
                >
                  {creating ? 'Creando...' : 'Crear Ticket'}
                </button>
              </div>
            </form>
          </div>
        )}

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

        {/* Lista de tickets */}
        <div className="bg-card-bg border border-slate-700 rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-700">
            <h3 className="text-white font-bold">Tus Tickets</h3>
            <p className="text-slate-500 text-xs mt-0.5">Historial de conversaciones de soporte</p>
          </div>

          {loading ? (
            <div className="p-12 text-center text-slate-500">
              <span className="material-symbols-outlined animate-spin text-4xl block mb-3">progress_activity</span>
              Cargando tickets...
            </div>
          ) : tickets.length === 0 ? (
            <div className="p-12 text-center text-slate-500">
              <span className="material-symbols-outlined text-4xl block mb-3">inbox</span>
              <p className="text-sm uppercase tracking-widest">No tienes tickets aún</p>
              <button onClick={() => setShowNewForm(true)} className="mt-4 text-primary text-xs uppercase tracking-widest hover:underline">
                Crear tu primer ticket
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-800/50 text-[10px] uppercase font-bold text-slate-500 tracking-widest">
                  <tr>
                    <th className="px-6 py-4">Estado</th>
                    <th className="px-6 py-4">Asunto</th>
                    <th className="px-6 py-4">Prioridad</th>
                    <th className="px-6 py-4">Mensajes</th>
                    <th className="px-6 py-4">Última Actividad</th>
                    <th className="px-6 py-4">Acción</th>
                  </tr>
                </thead>
                <tbody className="text-sm divide-y divide-slate-800">
                  {tickets.map(ticket => {
                    const stCfg = STATUS_CONFIG[ticket.status];
                    const priCfg = PRIORITY_CONFIG[ticket.priority];

                    return (
                      <tr key={ticket.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded text-[10px] font-bold border ${stCfg.bg} ${stCfg.text}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${stCfg.dot}`}></span>
                            {stCfg.label}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-slate-200 font-medium">{ticket.subject}</p>
                          <p className="text-[10px] text-slate-500 font-mono mt-0.5">ID: {ticket.id.slice(0, 8)}</p>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded text-[10px] font-bold ${priCfg.color} bg-white/5`}>
                            {priCfg.label}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-slate-400">
                          {ticket.messages?.length || 0}
                        </td>
                        <td className="px-6 py-4 text-slate-500 text-xs">
                          {new Date(ticket.lastMessageAt).toLocaleString('es-ES', {
                            dateStyle: 'short',
                            timeStyle: 'short'
                          })}
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => handleOpenTicket(ticket.id)}
                            className="text-primary text-xs font-bold uppercase tracking-widest hover:underline"
                          >
                            Ver Conversación
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="bg-card-bg border border-slate-700 p-6 rounded-lg">
          <h4 className="text-white font-bold mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-sm">info</span>
            ¿Cómo funciona?
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            <div>
              <h5 className="text-primary font-bold mb-2">🤖 Asistente IA</h5>
              <p className="text-slate-400 leading-relaxed">
                Nuestro chatbot está disponible 24/7 para responder preguntas frecuentes y guiarte en la resolución de problemas.
              </p>
            </div>
            <div>
              <h5 className="text-emerald-400 font-bold mb-2">👤 Agente Humano</h5>
              <p className="text-slate-400 leading-relaxed">
                Si el bot no puede ayudarte, puedes solicitar un agente humano. Un técnico se conectará para asistirte personalmente.
              </p>
            </div>
            <div>
              <h5 className="text-amber-400 font-bold mb-2">⚡ Respuesta Rápida</h5>
              <p className="text-slate-400 leading-relaxed">
                Los tickets urgentes se atienden con prioridad. Recibirás notificaciones de cada respuesta en esta misma conversación.
              </p>
            </div>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
}
