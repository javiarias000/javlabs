import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import PortalLayout from '../../components/PortalLayout';
import { useAuth } from '../../context/AuthContext';
import supportService from '../../services/support';
import './TechnicalSupportChat.css';

const STATUS_CONFIG = {
  AUTOMATED: { label: 'Bot', color: 'bg-primary', text: 'text-primary' },
  HUMAN_TAKEOVER: { label: 'Agente', color: 'bg-emerald-500', text: 'text-emerald-400' },
  PENDING_HUMAN: { label: 'Pendiente', color: 'bg-amber-500', text: 'text-amber-400' },
  COMPLETED: { label: 'Completado', color: 'bg-slate-500', text: 'text-slate-500' },
  CLOSED: { label: 'Cerrado', color: 'bg-slate-600', text: 'text-slate-600' }
};

const PRIORITY_COLORS = {
  LOW: 'bg-slate-500',
  MEDIUM: 'bg-blue-500',
  HIGH: 'bg-amber-500',
  CRITICAL: 'bg-red-500'
};

export default function TechnicalSupportChat() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [messageInput, setMessageInput] = useState('');
  const [sending, setSending] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);
  const [filter, setFilter] = useState(''); // '', 'AUTOMATED', 'HUMAN_TAKEOVER', 'PENDING_HUMAN', etc.
  const [search, setSearch] = useState('');

  const isAgent = user?.role === 'ADMIN' || user?.role === 'AGENT';
  const messagesEndRef = useRef(null);
  const lastSelectedMessageCountRef = useRef(0);
  const pollingIntervalRef = useRef(null);

  useEffect(() => {
    if (!isAgent) {
      // Si no es agente, redirigir a la vista de cliente
      navigate('/soporte/ticket');
      return;
    }
    fetchTickets();
  }, [isAgent]);

  useEffect(() => {
    scrollToBottom();
  }, [selectedTicket?.messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Polling para mensajes nuevos en ticket seleccionado (solo si está en AUTOMATED)
  useEffect(() => {
    if (selectedTicket && selectedTicket.status === 'AUTOMATED') {
      pollingIntervalRef.current = setInterval(async () => {
        try {
          const data = await supportService.getTicket(selectedTicket.id);
          if (data.messages.length !== lastSelectedMessageCountRef.current) {
            lastSelectedMessageCountRef.current = data.messages.length;
            setSelectedTicket(data);
          }
        } catch (err) {
          console.error('Error polling ticket:', err);
        }
      }, 3000);
    }

    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, [selectedTicket?.id, selectedTicket?.status]);

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

  const fetchTicket = async (ticketId) => {
    try {
      const ticket = await supportService.getTicket(ticketId);
      setSelectedTicket(ticket);
    } catch (err) {
      console.error('Error fetching ticket:', err);
      alert('No se pudo cargar el ticket.');
    }
  };

  const handleSelectTicket = (ticket) => {
    if (selectedTicket?.id === ticket.id) return;
    setSelectedTicket(null);
    setTimeout(() => fetchTicket(ticket.id), 50);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageInput.trim() || !selectedTicket) return;

    try {
      setSending(true);
      await supportService.sendMessage(selectedTicket.id, messageInput.trim(), 'AGENT');
      setMessageInput('');
      await fetchTicket(selectedTicket.id);
      await fetchTickets(); // Actualizar lista para mostrar lastMessageAt
    } catch (err) {
      console.error('Error sending message:', err);
      alert('No se pudo enviar el mensaje.');
    } finally {
      setSending(false);
    }
  };

  const handleTakeover = async (ticketId) => {
    try {
      setActionLoading(ticketId);
      await supportService.agentTakeover(ticketId);
      await fetchTicket(ticketId);
      await fetchTickets();
    } catch (err) {
      console.error('Error taking over:', err);
      alert('No se pudo tomar el control.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleResumeBot = async (ticketId) => {
    try {
      setActionLoading(ticketId);
      await supportService.resumeAutomated(ticketId);
      await fetchTicket(ticketId);
      await fetchTickets();
    } catch (err) {
      console.error('Error resuming bot:', err);
      alert('No se pudo reactivar el bot.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleCloseTicket = async (ticketId) => {
    if (!window.confirm('¿Cerrar este ticket?')) return;
    try {
      setActionLoading(ticketId);
      await supportService.updateTicket(ticketId, { status: 'CLOSED' });
      await fetchTicket(ticketId);
      await fetchTickets();
    } catch (err) {
      console.error('Error closing ticket:', err);
      alert('No se pudo cerrar el ticket.');
    } finally {
      setActionLoading(null);
    }
  };

  const filteredTickets = tickets.filter(t => {
    const matchStatus = !filter || t.status === filter;
    const matchSearch = !search ||
      t.subject.toLowerCase().includes(search.toLowerCase()) ||
      t.id.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  // Tickets pendientes (que requieren atención humana)
  const pendingCount = tickets.filter(t => t.status === 'PENDING_HUMAN').length;

  if (loading) {
    return (
      <PortalLayout>
        <div className="flex items-center justify-center h-screen text-slate-500">
          <span className="material-symbols-outlined animate-spin mr-2">progress_activity</span>
          Cargando tickets...
        </div>
      </PortalLayout>
    );
  }

  if (error) {
    return (
      <PortalLayout>
        <div className="p-8">
          <div className="p-4 bg-red-500/10 border border-red-500/30 rounded flex items-center gap-3">
            <span className="material-symbols-outlined text-red-400">error</span>
            <p className="text-sm text-red-400">{error}</p>
          </div>
        </div>
      </PortalLayout>
    );
  }

  return (
    <PortalLayout>
      <div className="flex flex-col h-screen overflow-hidden bg-background-dark">
        {/* Header */}
        <header className="border-b border-slate-800 bg-navy-deep p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold uppercase tracking-tighter text-white">Soporte Técnico</h1>
              <p className="text-slate-400 text-sm mt-1">
                {pendingCount > 0 && (
                  <span className="text-amber-400 font-bold">{pendingCount} ticket{pendingCount > 1 ? 's' : ''} pendiente{pendingCount > 1 ? 's' : ''} de atención</span>
                )}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-emerald-400 text-sm">circle</span>
              <span className="text-xs text-slate-400 uppercase tracking-widest">En Línea</span>
            </div>
          </div>

          {/* Filters */}
          <div className="flex gap-3">
            <div className="relative flex-1 max-w-md">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">search</span>
              <input
                type="text"
                placeholder="Buscar ticket por ID o asunto..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 text-slate-100 pl-10 pr-4 py-2 text-sm rounded focus:border-primary outline-none"
              />
            </div>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="bg-slate-900 border border-slate-700 text-slate-100 text-sm px-4 py-2 rounded focus:border-primary outline-none"
            >
              <option value="">Todos los estados</option>
              <option value="AUTOMATED">Bot Activo</option>
              <option value="PENDING_HUMAN">Esperando Agente</option>
              <option value="HUMAN_TAKEOVER">Con Agente</option>
              <option value="COMPLETED">Completados</option>
              <option value="CLOSED">Cerrados</option>
            </select>
            <button
              onClick={fetchTickets}
              className="px-4 py-2 bg-slate-800 border border-slate-700 text-slate-300 text-sm rounded hover:bg-slate-700 transition-colors"
            >
              Actualizar
            </button>
          </div>
        </header>

        <div className="flex flex-1 overflow-hidden">
          {/* Ticket List */}
          <aside className="w-96 border-r border-slate-800 bg-navy-deep/30 overflow-y-auto">
            <div className="p-4 space-y-3">
              {filteredTickets.length === 0 ? (
                <div className="text-center py-12 text-slate-500">
                  <span className="material-symbols-outlined text-4xl block mb-2">inbox</span>
                  <p className="text-sm">No hay tickets</p>
                </div>
              ) : (
                filteredTickets.map(ticket => {
                  const stCfg = STATUS_CONFIG[ticket.status];
                  const priCfg = PRIORITY_COLORS[ticket.priority];
                  const isSelected = selectedTicket?.id === ticket.id;

                  return (
                    <div
                      key={ticket.id}
                      onClick={() => handleSelectTicket(ticket)}
                      className={`p-4 rounded border cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-slate-800 border-primary'
                          : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${stCfg.bg} ${stCfg.text}`}>
                          {stCfg.label}
                        </span>
                        <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${priCfg}`}>
                          {ticket.priority}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-200 mb-1 line-clamp-2">{ticket.subject}</h4>
                      <p className="text-xs text-slate-500 mb-2 font-mono">ID: {ticket.id.slice(0, 8)}</p>
                      {ticket.assignedAgent && (
                        <p className="text-[10px] text-emerald-400 mb-2">
                          Asignado: {ticket.assignedAgent.name}
                        </p>
                      )}
                      <div className="flex items-center justify-between text-[10px] text-slate-600">
                        <span>{ticket.messages?.length || 0} mensajes</span>
                        <span>{new Date(ticket.lastMessageAt).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </aside>

          {/* Chat Panel */}
          <main className="flex-1 flex flex-col bg-background-dark">
            {selectedTicket ? (
              <>
                {/* Chat Header */}
                <div className="border-b border-slate-800 p-4 bg-navy-deep/30">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-white font-bold">{selectedTicket.subject}</h3>
                      <div className="flex items-center gap-3 mt-1">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${STATUS_CONFIG[selectedTicket.status].bg} ${STATUS_CONFIG[selectedTicket.status].text}`}>
                          {STATUS_CONFIG[selectedTicket.status].label}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">ID: {selectedTicket.id.slice(0, 8)}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {selectedTicket.status === 'AUTOMATED' && (
                        <button
                          onClick={() => handleTakeover(selectedTicket.id)}
                          disabled={actionLoading === selectedTicket.id}
                          className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-widest hover:bg-emerald-500/20 transition-all disabled:opacity-50"
                        >
                          Tomar Control
                        </button>
                      )}
                      {selectedTicket.status === 'HUMAN_TAKEOVER' && (
                        <button
                          onClick={() => handleResumeBot(selectedTicket.id)}
                          disabled={actionLoading === selectedTicket.id}
                          className="px-4 py-2 bg-primary/10 border border-primary/30 text-primary text-xs font-bold uppercase tracking-widest hover:bg-primary/20 transition-all disabled:opacity-50"
                        >
                         Reactivar Bot
                        </button>
                      )}
                      <button
                        onClick={() => handleCloseTicket(selectedTicket.id)}
                        disabled={actionLoading === selectedTicket.id}
                        className="px-4 py-2 bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold uppercase tracking-widest hover:bg-red-500/20 transition-all disabled:opacity-50"
                      >
                        Cerrar
                      </button>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {selectedTicket.messages?.map((msg, idx) => {
                    const isUser = msg.senderType === 'USER';
                    const isBot = msg.senderType === 'BOT';
                    const isAgent = msg.senderType === 'AGENT';

                    return (
                      <div key={msg.id || idx} className={`flex ${isUser ? 'justify-start' : 'justify-end'}`}>
                        <div className={`max-w-2xl ${isUser ? 'order-2' : 'order-1'}`}>
                          <div className={`flex items-center gap-2 mb-1 ${isUser ? 'justify-start' : 'justify-end'}`}>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                              {isUser ? 'Cliente' : isBot ? 'Bot IA' : 'Agente'}
                            </span>
                            <span className="text-[10px] text-slate-600 font-mono">
                              {new Date(msg.createdAt).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <div
                            className={`p-4 text-sm leading-relaxed ${
                              isUser
                                ? 'border border-primary/40 bg-primary/5 text-slate-200'
                                : isBot
                                ? 'bg-white/5 border-r-4 border-blue-400 text-slate-200'
                                : 'bg-emerald-500/10 border-r-4 border-emerald-400 text-slate-200'
                            }`}
                          >
                            {msg.content}
                            {msg.metadata && isBot && (
                              <div className="mt-2 pt-2 border-t border-slate-700/50 text-xs text-slate-500">
                                {msg.metadata.confidence && (
                                  <span className="mr-3">Confianza: {Math.round(msg.metadata.confidence * 100)}%</span>
                                )}
                                {msg.metadata.sources && Array.isArray(msg.metadata.sources) && (
                                  <span>Fuentes: {msg.metadata.sources.join(', ')}</span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="border-t border-slate-800 p-4 bg-background-dark">
                  <form onSubmit={handleSendMessage} className="relative flex items-center bg-slate-800 border border-slate-700">
                    <textarea
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      placeholder="Escribe tu respuesta como agente..."
                      disabled={sending || selectedTicket.status === 'CLOSED'}
                      rows="1"
                      className="w-full bg-transparent border-none focus:ring-0 p-4 pr-20 text-sm text-slate-100 placeholder:text-slate-600 resize-none min-h-[50px] max-h-32 disabled:opacity-50"
                    />
                    <button
                      type="submit"
                      disabled={!messageInput.trim() || sending || selectedTicket.status === 'CLOSED'}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-primary hover:bg-primary/90 text-white rounded transition-opacity disabled:opacity-40"
                    >
                      <span className="material-symbols-outlined text-sm">send</span>
                    </button>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-slate-500">
                <div className="text-center">
                  <span className="material-symbols-outlined text-6xl mb-4 block">chat_bubble_outline</span>
                  <p className="text-sm">Selecciona un ticket para ver la conversación</p>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </PortalLayout>
  );
}
