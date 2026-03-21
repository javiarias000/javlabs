import api from './api';

/**
 * Support Service - Maneja tickets de soporte con chatbot IA + humano
 *
 * Estados de ticket:
 * - AUTOMATED: Bot de IA respondiendo
 * - HUMAN_TAKEOVER: Agente humano tomó control
 * - PENDING_HUMAN: Cliente pidió humano, esperando asignación
 * - COMPLETED: Resuelto
 * - CLOSED: Cerrado sin resolución
 */

export const supportService = {
  // ============================================
  // TICKETS
  // ============================================

  /**
   * Obtener lista de tickets
   * Admin ve todos, clientes solo ven sus propios tickets
   */
  async getTickets(params = {}) {
    const { status, assignedAgentId, limit = 20, offset = 0 } = params;
    const query = new URLSearchParams();
    if (status) query.append('status', status);
    if (assignedAgentId) query.append('assignedAgentId', assignedAgentId);
    query.append('limit', limit);
    query.append('offset', offset);

    const { data } = await api.get(`/support/tickets?${query.toString()}`);
    return data;
  },

  /**
   * Crear nuevo ticket
   * Por defecto se crea en modo AUTOMATED (bot activado)
   */
  async createTicket({ subject, message, status = 'AUTOMATED', priority = 'MEDIUM' }) {
    const { data } = await api.post('/support/tickets', {
      subject,
      message,
      status,
      priority
    });
    return data;
  },

  /**
   * Obtener ticket específico con historial completo
   */
  async getTicket(id) {
    const { data } = await api.get(`/support/tickets/${id}`);
    return data;
  },

  /**
   * Actualizar estado/prioridad del ticket
   */
  async updateTicket(id, updates) {
    const { data } = await api.patch(`/support/tickets/${id}`, updates);
    return data;
  },

  // ============================================
  // MENSAJES
  // ============================================

  /**
   * Enviar mensaje a un ticket
   * senderType: 'USER' | 'BOT' | 'AGENT'
   *
   * NOTA: Para usuarios normales, usar senderType='USER'
   * Para agentes de soporte, usar senderType='AGENT'
   */
  async sendMessage(ticketId, content, senderType = 'USER', metadata = null) {
    const { data } = await api.post(`/support/tickets/${ticketId}/messages`, {
      content,
      senderType,
      metadata
    });
    return data;
  },

  /**
   * Obtener historial de mensajes de un ticket
   * (Ya se incluye al obtener el ticket, pero puede ser útil separado)
   */
  // Nota: los mensajes vienen incluidos en getTicket()

  // ============================================
  // CONTROL BOT/HUMANO
  // ============================================

  /**
   * Cliente pide hablar con un humano
   * Cambia estado a PENDING_HUMAN
   */
  async requestHuman(ticketId) {
    const { data } = await api.post(`/support/tickets/${ticketId}/human-takeover`);
    return data;
  },

  /**
   * Agente humano toma control del ticket
   * Cambia estado a HUMAN_TAKEOVER y asigna el agente
   */
  async agentTakeover(ticketId) {
    const { data } = await api.post(`/support/tickets/${ticketId}/human-takeover`);
    return data;
  },

  /**
   * Reanudar modo automático (bot)
   * Libera el ticket para que n8n responda de nuevo
   */
  async resumeAutomated(ticketId) {
    const { data } = await api.post(`/support/tickets/${ticketId}/resume-automated`);
    return data;
  },

  // ============================================
  // WEBHOOK (para n8n)
  // ============================================

  /**
   * endpoint para n8n
   * NO usar desde frontend, solo desde n8n
   *
   * EJEMPLO PARA N8N:
   * POST /api/support/tickets/123/webhook-n8n
   * {
   *   "response": "Hola, en qué puedo ayudarte?",
   *   "confidence": 0.95,
   *   "metadata": { "sources": ["docs1", "faq"] }
   * }
   */
  async n8nWebhook(ticketId, response, confidence = null, metadata = null) {
    const { data } = await api.post(
      `/support/tickets/${ticketId}/webhook-n8n`,
      {
        response,
        confidence,
        metadata
      },
      {
        // NOTA:Este endpoint NO requiere autenticación
        // Pero como estamos en frontend con token, se envía igual
        // n8n puede llamarlo directamente sin token
      }
    );
    return data;
  },
};

export default supportService;
