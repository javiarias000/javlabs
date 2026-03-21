import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PortalLayout from '../../components/PortalLayout';
import { useAuth } from '../../context/AuthContext';
import supportService from '../../services/support';
import './TicketConversationView.css';

const STATUS_CONFIG = {
  AUTOMATED: {
    label: 'Bot Activo',
    dot: 'bg-primary animate-pulse',
    text: 'text-primary',
    bg: 'bg-primary/10 border-primary/20'
  },
  HUMAN_TAKEOVER: {
    label: 'Agente Asignado',
    dot: 'bg-emerald-500 animate-pulse',
    text: 'text-emerald-400',
    bg: 'bg-emerald-500/10 border-emerald-500/20'
  },
  PENDING_HUMAN: {
    label: 'Esperando Agente',
    dot: 'bg-amber-500 animate-pulse',
    text: 'text-amber-400',
    bg: 'bg-amber-500/10 border-amber-500/20'
  },
  COMPLETED: {
    label: 'Completado',
    dot: 'bg-slate-500',
    text: 'text-slate-400',
    bg: 'bg-slate-500/10 border-slate-500/20'
  },
  CLOSED: {
    label: 'Cerrado',
    dot: 'bg-slate-600',
    text: 'text-slate-500',
    bg: 'bg-slate-600/10 border-slate-600/20'
  }
};

const PRIORITY_CONFIG = {
  LOW: { label: 'Baja', color: 'bg-slate-500' },
  MEDIUM: { label: 'Media', color: 'bg-blue-500' },
  HIGH: { label: 'Alta', color: 'bg-amber-500' },
  CRITICAL: { label: 'Crítica', color: 'bg-red-500' }
};

export default function TicketConversationView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [messageText, setMessageText] = useState('');
  const [sending, setSending] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const isAgent = user?.role === 'ADMIN' || user?.role === 'AGENT';
  const messagesEndRef = useRef(null);
  const lastMessageCountRef = useRef(0);
  const pollingIntervalRef = useRef(null);

  const isOwner = ticket?.userId === user?.id;

  // Scroll al fondo cuando hay nuevos mensajes
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [ticket?.messages]);

  // Polling para nuevos mensajes (solo en modo AUTOMATED o PENDING_HUMAN)
  useEffect(() => {
    if (ticket && (ticket.status === 'AUTOMATED' || ticket.status === 'PENDING_HUMAN')) {
      pollingIntervalRef.current = setInterval(async () => {
        try {
          const data = await supportService.getTicket(id);
          // Si hay nuevos mensajes, actualizar
          if (data.messages.length !== lastMessageCountRef.current) {
            lastMessageCountRef.current = data.messages.length;
            setTicket(data);
          }
        } catch (err) {
          console.error('Error polling ticket:', err);
        }
      }, 3000); // Cada 3 segundos
    }

    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, [ticket?.status, id]);

  useEffect(() => {
    if (!id) return;
    fetchTicket();
  }, [id]);

  const fetchTicket = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await supportService.getTicket(id);
      setTicket(data);
      lastMessageCountRef.current = data.messages?.length || 0;
    } catch (err) {
      console.error('Error fetching ticket:', err);
      setError('No se pudo cargar el ticket. Intenta de nuevo más tarde.');
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageText.trim()) return;

    try {
      setSending(true);
      const senderType = isAgent ? 'AGENT' : 'USER';
      await supportService.sendMessage(id, messageText.trim(), senderType);
      setMessageText('');
      // Recargar ticket para ver el nuevo mensaje
      await fetchTicket();
    } catch (err) {
      console.error('Error sending message:', err);
      alert('No se pudo enviar el mensaje. Intenta de nuevo.');
    } finally {
      setSending(false);
    }
  };

  const handleRequestHuman = async () => {
    if (!window.confirm('¿Solicitar asistencia de un agente humano? El bot dejará de responder automáticamente.')) return;
    try {
      setActionLoading(true);
      await supportService.requestHuman(id);
      await fetchTicket();
    } catch (err) {
      console.error('Error requesting human:', err);
      alert('No se pudo solicitar el humano. Intenta de nuevo.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleAgentTakeover = async () => {
    if (!window.confirm('¿Tomar control del ticket? A partir de ahora responderás directamente.')) return;
    try {
      setActionLoading(true);
      await supportService.agentTakeover(id);
      await fetchTicket();
    } catch (err) {
      console.error('Error taking over ticket:', err);
      alert('No se pudo tomar el control del ticket.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleResumeAutomated = async () => {
    if (!window.confirm('¿Reactivar el bot de IA? El chatbot automático retomará las respuestas.')) return;
    try {
      setActionLoading(true);
      await supportService.resumeAutomated(id);
      await fetchTicket();
    } catch (err) {
      console.error('Error resuming bot:', err);
      alert('No se pudo reactivar el bot.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCloseTicket = async () => {
    if (!window.confirm('¿Cerrar este ticket? No se podrán enviar más mensajes.')) return;
    try {
      setActionLoading(true);
      await supportService.updateTicket(id, { status: 'CLOSED' });
      await fetchTicket();
    } catch (err) {
      console.error('Error closing ticket:', err);
      alert('No se pudo cerrar el ticket.');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <PortalLayout>
        <div className="flex items-center justify-center h-screen text-slate-500">
          <span className="material-symbols-outlined animate-spin mr-2">progress_activity</span>
          Cargando ticket...
        </div>
      </PortalLayout>
    );
  }

  if (error || !ticket) {
    return (
      <PortalLayout>
        <div className="p-8">
          <div className="p-4 bg-red-500/10 border border-red-500/30 rounded flex items-center gap-3 mb-4">
            <span className="material-symbols-outlined text-red-400">error</span>
            <p className="text-sm text-red-400">{error || 'Ticket no encontrado'}</p>
          </div>
          <button onClick={() => navigate('/soporte/chat')} className="text-primary hover:underline text-sm">
            ← Volver al soporte
          </button>
        </div>
      </PortalLayout>
    );
  }

  const statusConf = STATUS_CONFIG[ticket.status] || STATUS_CONFIG.COMPLETED;
  const assignedAgent = ticket.assignedAgent;

  return (
    <PortalLayout>
      <div className="flex flex-col h-screen overflow-hidden circuit-bg">

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar - Metadata */}
          <aside className="w-80 bg-navy-deep border-r border-white/5 flex flex-col p-6 gap-6 overflow-y-auto">
            <section>
              <h3 className="text-[10px] font-bold tracking-[0.2em] text-slate-500 uppercase mb-4">Información del Ticket</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <span className={`material-symbols-outlined text-sm ${statusConf.text}`}>confirmation_num</span>
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase tracking-tighter">ID</p>
                    <p className="text-sm font-mono text-slate-200">{ticket.id.slice(0, 8)}...</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className={`material-symbols-outlined text-sm ${statusConf.text}`}>badge</span>
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase tracking-tighter">Estado</p>
                    <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded text-[10px] font-bold border ${statusConf.bg} ${statusConf.text}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${statusConf.dot}`}></span>
                      {statusConf.label}
                    </span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-sm text-slate-400">flag</span>
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase tracking-tighter">Prioridad</p>
                    <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded text-[10px] font-bold ${PRIORITY_CONFIG[ticket.priority]?.color || 'bg-slate-500'}`}>
                      {PRIORITY_CONFIG[ticket.priority]?.label || ticket.priority}
                    </span>
                  </div>
                </div>
                {assignedAgent && (
                  <div className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-sm text-emerald-400">person</span>
                    <div>
                      <p className="text-[10px] text-slate-500 uppercase tracking-tighter">Agente Asignado</p>
                      <p className="text-sm font-medium text-slate-200">{assignedAgent.name}</p>
                      <p className="text-xs text-slate-500">{assignedAgent.email}</p>
                    </div>
                  </div>
                )}
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-sm text-slate-400">calendar_today</span>
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase tracking-tighter">Creado</p>
                    <p className="text-sm font-medium text-slate-200">
                      {new Date(ticket.createdAt).toLocaleString('es-ES', { dateStyle: 'short', timeStyle: 'short' })}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-black/40 border border-white/5 p-4">
              <h3 className="text-[10px] font-bold tracking-[0.2em] text-primary uppercase mb-3">Asunto</h3>
              <p className="text-sm text-slate-200 leading-relaxed">{ticket.subject}</p>
              {ticket.description && (
                <p className="text-xs text-slate-400 mt-2 italic">{ticket.description}</p>
              )}
            </section>

            {/* Acciones */}
            <section className="space-y-2 mt-auto">
              {ticket.status === 'AUTOMATED' && isAgent && (
                <button
                  onClick={handleAgentTakeover}
                  disabled={actionLoading}
                  className="w-full p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-widest hover:bg-emerald-500/20 transition-all disabled:opacity-50"
                >
                  Tomar Control (Humano)
                </button>
              )}
              {ticket.status === 'HUMAN_TAKEOVER' && isAgent && (
                <button
                  onClick={handleResumeAutomated}
                  disabled={actionLoading}
                  className="w-full p-3 bg-primary/10 border border-primary/30 text-primary text-xs font-bold uppercase tracking-widest hover:bg-primary/20 transition-all disabled:opacity-50"
                >
                  Reactivar Bot IA
                </button>
              )}
              {ticket.status === 'AUTOMATED' && isOwner && (
                <button
                  onClick={handleRequestHuman}
                  disabled={actionLoading}
                  className="w-full p-3 bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-widest hover:bg-amber-500/20 transition-all disabled:opacity-50"
                >
                  Hablar con Humano
                </button>
              )}
              {(isAgent || isOwner) && (
                <button
                  onClick={handleCloseTicket}
                  disabled={actionLoading}
                  className="w-full p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold uppercase tracking-widest hover:bg-red-500/20 transition-all disabled:opacity-50"
                >
                  Cerrar Ticket
                </button>
              )}
              <button
                onClick={() => navigate('/soporte/chat')}
                className="w-full p-3 border border-slate-700 text-slate-400 text-xs font-bold uppercase tracking-widest hover:bg-slate-800 transition-all"
              >
                Volver a Soporte
              </button>
            </section>
          </aside>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col bg-background-dark relative">
            <div className="flex-1 overflow-y-auto p-8 space-y-6 scroll-smooth">
              {ticket.messages.map((msg, idx) => {
                const isUser = msg.senderType === 'USER';
                const isBot = msg.senderType === 'BOT';
                const isAgentMsg = msg.senderType === 'AGENT';

                return (
                  <div key={msg.id || idx} className={`flex flex-col ${isUser ? 'items-start' : 'items-end'}`}>
                    <div className={`flex items-center gap-2 mb-1 ${isUser ? 'justify-start' : 'justify-end'}`}>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                        {isUser ? 'Cliente' : isBot ? 'Asistente IA' : 'Agente'}
                      </span>
                      <span className="text-[10px] text-slate-600 font-mono">
                        {new Date(msg.createdAt).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <div
                      className={`max-w-2xl p-4 text-sm leading-relaxed ${
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
                );
              })}
            </div>

            <div className="p-6 border-t border-white/10 bg-background-dark">
              <div className="max-w-4xl mx-auto">
                <form onSubmit={handleSendMessage} className="relative flex items-center bg-slate-800 border border-slate-700 shadow-lg">
                  <textarea
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    placeholder={ticket.status === 'CLOSED' ? "Ticket cerrado" : "Escribe tu mensaje..."}
                    disabled={ticket.status === 'CLOSED' || sending}
                    rows="1"
                    className="w-full bg-transparent border-none focus:ring-0 p-4 pr-20 text-sm font-medium text-slate-100 placeholder:text-slate-600 resize-none min-h-[50px] max-h-32 disabled:opacity-50"
                  />
                  <button
                    type="submit"
                    disabled={!messageText.trim() || ticket.status === 'CLOSED' || sending}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-primary hover:bg-primary/90 text-white rounded transition-opacity disabled:opacity-40"
                  >
                    <span className="material-symbols-outlined text-sm">send</span>
                  </button>
                </form>
                <div className="flex justify-between items-center mt-2 px-1">
                  <div className="flex items-center gap-2 text-[10px] text-slate-500">
                    <span className="flex items-center gap-1">
                      <span className={`w-1.5 h-1.5 rounded-full ${ticket.status === 'AUTOMATED' ? 'bg-primary animate-pulse' : 'bg-slate-500'}`}></span>
                      {ticket.status === 'AUTOMATED' ? 'Bot activo' : 'Modo humano'}
                    </span>
                  </div>
                  <span className="text-[9px] text-slate-600 uppercase tracking-widest">
                    {ticket.messages.length} mensajes
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <footer className="h-8 bg-black border-t border-white/5 px-6 flex items-center justify-between flex-shrink-0">
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <div className="size-1.5 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-[9px] text-slate-500 uppercase tracking-widest">Soporte en Línea</span>
            </div>
            <span className="text-[9px] text-slate-500 uppercase tracking-widest">
              Ticket: {ticket.id.slice(0, 8)}
            </span>
          </div>
          <div className="text-[9px] text-slate-600 uppercase tracking-widest">
            © 2024 JAV LABS - Soporte Técnico
          </div>
        </footer>
      </div>
    </PortalLayout>
  );
}
