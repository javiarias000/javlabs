const router = require('express').Router();
const webhookRouter = require('express').Router(); // Router sin autenticación para webhooks
const prisma = require('../config/prisma');
const axios = require('axios');
const { authenticate } = require('../middlewares/auth.middleware');
const { body, query, param } = require('express-validator');
const { validate } = require('../middlewares/validate.middleware');

// Cliente HTTP para comunicarse con n8n
const n8nClient = axios.create({
  baseURL: process.env.N8N_URL || 'http://localhost:5678',
  headers: { 'X-N8N-API-KEY': process.env.N8N_API_KEY }
});

// Webhook URL que n8n debe llamar para responder (configurado en n8n workflow)
const N8N_SUPPORT_WEBHOOK_URL = process.env.N8N_SUPPORT_WEBHOOK_URL || 'http://localhost:5678/webhook/support-response';

/**
 * Notifica a n8n sobre un nuevo mensaje de usuario en un ticket en modo AUTOMATED
 * Esto desencadena el flujo del agente IA
 */
async function notifyN8n(ticket, message) {
  if (ticket.status !== 'AUTOMATED') return;

  try {
    await axios.post(N8N_SUPPORT_WEBHOOK_URL, {
      ticketId: ticket.id,
      userId: ticket.userId,
      userName: ticket.user.name,
      userEmail: ticket.user.email,
      subject: ticket.subject,
      description: ticket.description,
      message: message.content,
      messageId: message.id,
      timestamp: message.createdAt
    });
    console.log(`[Support] Notificado n8n sobre mensaje en ticket ${ticket.id}`);
  } catch (err) {
    console.error('[Support] Error notificando a n8n:', err.message);
    // No lanzar error - que el mensaje se guarde igual
  }
}

// ============================================
// WEBHOOK ROUTES (sin autenticación - llamados por n8n)
// ============================================

// POST /api/support/tickets/:id/webhook-n8n - Endpoint para n8n
webhookRouter.post('/tickets/:id/webhook-n8n', [
  param('id').isUUID(),
  body('response').isString().notEmpty(),
  body('confidence').optional().isFloat({ min: 0, max: 1 }),
  body('metadata').optional().isObject()
], async (req, res, next) => {
  try {
    const { id } = req.params;
    const { response, confidence, metadata } = req.body;

    // Verificar que el ticket existe y está en modo AUTOMATED
    const ticket = await prisma.supportTicket.findUnique({
      where: { id }
    });

    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    if (ticket.status !== 'AUTOMATED') {
      return res.status(400).json({ error: 'Ticket is not in AUTOMATED mode' });
    }

    // Crear mensaje del BOT
    const message = await prisma.ticketMessage.create({
      data: {
        ticketId: id,
        senderType: 'BOT',
        senderId: null,
        content: response,
        metadata: { confidence, ...metadata }
      }
    });

    // Actualizar lastMessageAt
    await prisma.supportTicket.update({
      where: { id },
      data: { lastMessageAt: new Date() }
    });

    res.status(201).json(message);
  } catch (err) { next(err); }
});

// ============================================
// AUTHENTICATED ROUTES (requieren login)
// ============================================

router.use(authenticate);

// GET /api/support/tickets - Lista tickets del usuario o todos (admin)
router.get('/tickets', [
  query('status').optional().isIn(['AUTOMATED', 'HUMAN_TAKEOVER', 'PENDING_HUMAN', 'COMPLETED', 'CLOSED']),
  query('assignedAgentId').optional().isUUID(),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('offset').optional().isInt({ min: 0 }),
  validate
], async (req, res, next) => {
  try {
    const { status, assignedAgentId, limit = 20, offset = 0 } = req.query;

    const where = {};

    // Admin ven todos, clientes solo ven sus propios tickets
    if (req.user.role === 'CLIENT') {
      where.userId = req.user.id;
    }

    if (status) where.status = status;
    if (assignedAgentId) where.assignedAgentId = assignedAgentId;

    const [tickets, total] = await Promise.all([
      prisma.supportTicket.findMany({
        where,
        include: {
          user: { select: { id: true, name: true, email: true, company: true } },
          assignedAgent: { select: { id: true, name: true, email: true } },
          messages: {
            orderBy: { createdAt: 'asc' },
            take: 50 // Limitar mensajes para performance
          }
        },
        orderBy: { lastMessageAt: 'desc' },
        take: parseInt(limit),
        skip: parseInt(offset)
      }),
      prisma.supportTicket.count({ where })
    ]);

    res.json({
      tickets,
      pagination: {
        total,
        limit: parseInt(limit),
        offset: parseInt(offset),
        hasMore: (parseInt(offset) + parseInt(limit)) < total
      }
    });
  } catch (err) { next(err); }
});

// POST /api/support/tickets - Crear nuevo ticket o continuar conversación
router.post('/tickets', [
  body('subject').optional().notEmpty().withMessage('Subject is required'),
  body('message').optional().isString().withMessage('Message must be text'),
  body('status').optional().isIn(['AUTOMATED', 'HUMAN_TAKEOVER', 'PENDING_HUMAN', 'COMPLETED', 'CLOSED']),
  body('priority').optional().isIn(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
  validate
], async (req, res, next) => {
  try {
    const { subject, message, status = 'AUTOMATED', priority = 'MEDIUM' } = req.body;
    const userId = req.user.id;

    // Crear ticket nuevo
    const ticket = await prisma.supportTicket.create({
      data: {
        userId,
        subject: subject || 'Soporte',
        description: message || '',
        status,
        priority,
        lastMessageAt: new Date(),
        messages: message ? {
          create: {
            senderType: 'USER',
            senderId: userId,
            content: message
          }
        } : undefined
      },
      include: {
        user: true,
        messages: true
      }
    });

    // Si hay mensaje y el ticket está en modo AUTOMATED, notificar a n8n
    if (message && ticket.status === 'AUTOMATED' && ticket.messages.length > 0) {
      await notifyN8n(ticket, ticket.messages[0]);
    }

    res.status(201).json(ticket);
  } catch (err) { next(err); }
});

// GET /api/support/tickets/:id - Obtener ticket específico con historial completo
router.get('/tickets/:id', [
  param('id').isUUID()
], async (req, res, next) => {
  try {
    const { id } = req.params;

    const ticket = await prisma.supportTicket.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, name: true, email: true, company: true } },
        assignedAgent: { select: { id: true, name: true, email: true } },
        messages: {
          orderBy: { createdAt: 'asc' }
        }
      }
    });

    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    // Verificar acceso: admin ven todo, clientes solo ven sus tickets
    if (req.user.role === 'CLIENT' && ticket.userId !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    res.json(ticket);
  } catch (err) { next(err); }
});

// POST /api/support/tickets/:id/messages - Añadir mensaje a ticket existente
router.post('/tickets/:id/messages', [
  param('id').isUUID(),
  body('content').isString().notEmpty().withMessage('Message content required'),
  body('senderType').isIn(['USER', 'BOT', 'AGENT']).withMessage('Invalid sender type')
], async (req, res, next) => {
  try {
    const { id } = req.params;
    const { content, senderType, metadata } = req.body;

    const ticket = await prisma.supportTicket.findUnique({
      where: { id }
    });

    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    // Verificar acceso
    if (req.user.role === 'CLIENT' && ticket.userId !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    // Si es AGENT, verificar que esté asignado (excepto admin)
    if (senderType === 'AGENT' && req.user.role !== 'ADMIN') {
      if (ticket.assignedAgentId !== req.user.id) {
        return res.status(403).json({ error: 'Agent not assigned to this ticket' });
      }
    }

    const message = await prisma.ticketMessage.create({
      data: {
        ticketId: id,
        senderType,
        senderId: senderType === 'USER' ? ticket.userId : (senderType === 'AGENT' ? req.user.id : null),
        content,
        metadata: metadata || null
      }
    });

    // Actualizar lastMessageAt del ticket
    await prisma.supportTicket.update({
      where: { id },
      data: { lastMessageAt: new Date() }
    });

    // Si el mensaje es del usuario y el ticket está en modo AUTOMATED, notificar a n8n para que genere respuesta IA
    if (senderType === 'USER' && ticket.status === 'AUTOMATED') {
      await notifyN8n(ticket, message);
    }

    res.status(201).json(message);
  } catch (err) { next(err); }
});

// POST /api/support/tickets/:id/human-takeover - Agente humano toma control
router.post('/tickets/:id/human-takeover', [
  param('id').isUUID()
], async (req, res, next) => {
  try {
    const { id } = req.params;
    const agentId = req.user.id;

    const ticket = await prisma.supportTicket.findUnique({
      where: { id }
    });

    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    // Solo agentes pueden tomar tickets
    if (req.user.role !== 'ADMIN' && req.user.role !== 'AGENT') {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const updated = await prisma.supportTicket.update({
      where: { id },
      data: {
        status: 'HUMAN_TAKEOVER',
        assignedAgentId: agentId
      },
      include: {
        assignedAgent: true
      }
    });

    res.json(updated);
  } catch (err) { next(err); }
});

// POST /api/support/tickets/:id/resume-automated - Reanudar bot
router.post('/tickets/:id/resume-automated', [
  param('id').isUUID()
], async (req, res, next) => {
  try {
    const { id } = req.params;

    const ticket = await prisma.supportTicket.findUnique({
      where: { id }
    });

    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    // Solo admin o agente asignado pueden reanudar bot
    if (req.user.role !== 'ADMIN') {
      if (!ticket.assignedAgentId || ticket.assignedAgentId !== req.user.id) {
        return res.status(403).json({ error: 'Not authorized' });
      }
    }

    const updated = await prisma.supportTicket.update({
      where: { id },
      data: {
        status: 'AUTOMATED',
        assignedAgentId: null
      }
    });

    res.json(updated);
  } catch (err) { next(err); }
});

// PATCH /api/support/tickets/:id - Actualizar estado/prioridad
router.patch('/tickets/:id', [
  param('id').isUUID(),
  body('status').optional().isIn(['AUTOMATED', 'HUMAN_TAKEOVER', 'PENDING_HUMAN', 'COMPLETED', 'CLOSED']),
  body('priority').optional().isIn(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'])
], async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, priority } = req.body;

    const updateData = {};
    if (status) updateData.status = status;
    if (priority) updateData.priority = priority;

    const ticket = await prisma.supportTicket.update({
      where: { id },
      data: updateData,
      include: {
        assignedAgent: true
      }
    });

    res.json(ticket);
  } catch (err) { next(err); }
});

// Exportar ambos routers: principal (autenticado) y webhook (público)
module.exports = router;
module.exports.webhook = webhookRouter;

