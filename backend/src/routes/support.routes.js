const router = require('express').Router();
const webhookRouter = require('express').Router(); // Router sin autenticación para webhooks
const prisma = require('../config/prisma');
const axios = require('axios');
const { authenticate } = require('../middlewares/auth.middleware');
const { body, query, param } = require('express-validator');
const { validate } = require('../middlewares/validate.middleware');

// Cliente HTTP para comunicarse con n8n
const getN8nBaseURL = () => {
  const n8nUrl = process.env.N8N_URL || 'http://localhost:5678';
  // Si ya tiene protocolo, usarlo tal cual; si no, agregar https://
  return n8nUrl.startsWith('http') ? n8nUrl : `https://${n8nUrl}`;
};

const n8nClient = axios.create({
  baseURL: getN8nBaseURL(),
  headers: { 'X-N8N-API-KEY': process.env.N8N_API_KEY }
});

// Webhook URL que n8n debe llamar para responder (configurado en n8n workflow)
const N8N_SUPPORT_WEBHOOK_URL = process.env.N8N_SUPPORT_WEBHOOK_URL || (() => {
  const base = process.env.N8N_URL || 'http://localhost:5678';
  const cleanBase = base.replace(/\/$/, '');
  return `${cleanBase}/webhook/support-response`;
})();

/**
 * Notifica a n8n sobre un nuevo mensaje de usuario en un ticket en modo AUTOMATED
 * Esto desencadena el flujo del agente IA
 */
async function notifyN8n(ticketId, message) {
  try {
    // Obtener ticket completo con usuario
    const ticket = await prisma.supportTicket.findUnique({
      where: { id: ticketId },
      include: { user: true }
    });

    if (!ticket || ticket.status !== 'AUTOMATED') return;

    await axios.post(N8N_SUPPORT_WEBHOOK_URL, {
      ticketId: ticket.id,
      userId: ticket.userId,
      name: ticket.user?.name || 'Usuario',  // Campo 'name' para compatibility
      userName: ticket.user?.name || 'Usuario',
      userEmail: ticket.user?.email || '',
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

/**
 * @swagger
 * /support/tickets/{id}/webhook-n8n:
 *   post:
 *     summary: Webhook para respuestas de n8n (endpoint público)
 *     description: Endpoint público llamado por n8n para añadir respuestas del bot a tickets en modo AUTOMATED. NO requiere autenticación
 *     tags: [Support]
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID del ticket
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - response
 *             properties:
 *               response:
 *                 type: string
 *                 example: Gracias por contactarnos. Un agente le responderá pronto.
 *               confidence:
 *                 type: number
 *                 format: float
 *                 minimum: 0
 *                 maximum: 1
 *                 example: 0.95
 *               metadata:
 *                 type: object
 *                 additionalProperties: true
 *                 example: { sources: ['doc1', 'doc2'], intent: 'greeting' }
 *     responses:
 *       201:
 *         description: Respuesta del bot añadida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 ticketId:
 *                   type: string
 *                 senderType:
 *                   type: string
 *                   enum: [USER, BOT, AGENT]
 *                 content:
 *                   type: string
 *                 metadata:
 *                   type: object
 *                   nullable: true
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: Ticket no está en modo AUTOMATED
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: NOT_AUTOMATED
 *                 message:
 *                   type: string
 *                   example: Ticket is not in AUTOMATED mode
 *       404:
 *         description: Ticket no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: NOT_FOUND
 *                 message:
 *                   type: string
 *                   example: Ticket not found
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
webhookRouter.post('/tickets/:id/webhook-n8n', [
  param('id').isUUID(),
  body('response').isString().notEmpty(),
  body('confidence').optional().isFloat({ min: 0, max: 1 }),
  body('metadata').optional().isObject(),
  validate
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

/**
 * @swagger
 * /support/tickets:
 *   get:
 *     summary: Listar tickets de soporte
 *     description: Devuelve tickets según el rol - admin ve todos, clientes solo ven sus propios tickets. Soporta filtros por status y assignedAgentId, y paginación
 *     tags: [Support]
 *     security:
 *       - bearerAuth: []
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [AUTOMATED, HUMAN_TAKEOVER, PENDING_HUMAN, COMPLETED, CLOSED]
 *         description: Filtrar por estado
 *       - in: query
 *         name: assignedAgentId
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filtrar por agente asignado
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 20
 *         description: Número máximo de resultados
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           minimum: 0
 *           default: 0
 *         description: Desplazamiento para paginación
 *     responses:
 *       200:
 *         description: Lista de tickets con paginación
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 tickets:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       subject:
 *                         type: string
 *                       description:
 *                         type: string
 *                       status:
 *                         type: string
 *                       priority:
 *                         type: string
 *                       assignedAgentId:
 *                         type: string
 *                         nullable: true
 *                       lastMessageAt:
 *                         type: string
 *                         format: date-time
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                       user:
 *                         type: object
 *                       assignedAgent:
 *                         type: object
 *                       messages:
 *                         type: array
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     offset:
 *                       type: integer
 *                     hasMore:
 *                       type: boolean
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
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

/**
 * @swagger
 * /support/tickets:
 *   post:
 *     summary: Crear nuevo ticket de soporte
 *     description: Crea un nuevo ticket de soporte. Si se incluye un mensaje inicial, se crea automáticamente y se notifica a n8n si el ticket está en modo AUTOMATED
 *     tags: [Support]
 *     security:
 *       - bearerAuth: []
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               subject:
 *                 type: string
 *                 example: Problema con integración de Zapier
 *               message:
 *                 type: string
 *                 example: No puedo conectar mi cuenta de Zapier...
 *               status:
 *                 type: string
 *                 enum: [AUTOMATED, HUMAN_TAKEOVER, PENDING_HUMAN, COMPLETED, CLOSED]
 *                 default: AUTOMATED
 *               priority:
 *                 type: string
 *                 enum: [LOW, MEDIUM, HIGH, CRITICAL]
 *                 default: MEDIUM
 *     responses:
 *       201:
 *         description: Ticket creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 subject:
 *                   type: string
 *                 description:
 *                   type: string
 *                 status:
 *                   type: string
 *                 priority:
 *                   type: string
 *                 userId:
 *                   type: string
 *                 assignedAgentId:
 *                   type: string
 *                   nullable: true
 *                 lastMessageAt:
 *                   type: string
 *                   format: date-time
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                 messages:
 *                   type: array
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
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
      await notifyN8n(ticket.id, ticket.messages[0]);
    }

    res.status(201).json(ticket);
  } catch (err) { next(err); }
});

/**
 * @swagger
 * /support/tickets/{id}:
 *   get:
 *     summary: Obtener ticket específico con historial completo
 *     description: Devuelve un ticket por ID con todos sus mensajes. Admin ven cualquier ticket, clientes solo ven los propios
 *     tags: [Support]
 *     security:
 *       - bearerAuth: []
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID del ticket
 *     responses:
 *       200:
 *         description: Ticket completo con historial de mensajes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 subject:
 *                   type: string
 *                 description:
 *                   type: string
 *                 status:
 *                   type: string
 *                 priority:
 *                   type: string
 *                 userId:
 *                   type: string
 *                 assignedAgentId:
 *                   type: string
 *                   nullable: true
 *                 lastMessageAt:
 *                   type: string
 *                   format: date-time
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                 user:
 *                   type: object
 *                 assignedAgent:
 *                   type: object
 *                   nullable: true
 *                 messages:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       senderType:
 *                         type: string
 *                         enum: [USER, BOT, AGENT]
 *                       senderId:
 *                         type: string
 *                         nullable: true
 *                       content:
 *                         type: string
 *                       metadata:
 *                         type: object
 *                         nullable: true
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         description: No autorizado para ver este ticket
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
// GET /api/support/tickets/:id - Obtener ticket específico con historial completo
router.get('/tickets/:id', [
  param('id').isUUID(),
  validate
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

/**
 * @swagger
 * /support/tickets/{id}/messages:
 *   post:
 *     summary: Añadir mensaje a ticket existente
 *     description: Crea un nuevo mensaje en el historial del ticket. El senderType verifica permisos - USER solo para dueños, AGENT solo para agentes asignados (excepto admin)
 *     tags: [Support]
 *     security:
 *       - bearerAuth: []
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID del ticket
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *               - senderType
 *             properties:
 *               content:
 *                 type: string
 *                 example: Necesito ayuda adicional con este tema
 *               senderType:
 *                 type: string
 *                 enum: [USER, BOT, AGENT]
 *                 example: USER
 *               metadata:
 *                 type: object
 *                 additionalProperties: true
 *                 example: { confidence: 0.98, sources: ['doc1.pdf'] }
 *     responses:
 *       201:
 *         description: Mensaje creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 ticketId:
 *                   type: string
 *                 senderType:
 *                   type: string
 *                 senderId:
 *                   type: string
 *                   nullable: true
 *                 content:
 *                   type: string
 *                 metadata:
 *                   type: object
 *                   nullable: true
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         description: No autorizado para añadir mensaje (no es dueño o agente asignado)
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
// POST /api/support/tickets/:id/messages - Añadir mensaje a ticket existente
router.post('/tickets/:id/messages', [
  param('id').isUUID(),
  body('content').isString().notEmpty().withMessage('Message content required'),
  body('senderType').isIn(['USER', 'BOT', 'AGENT']).withMessage('Invalid sender type'),
  validate
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
      await notifyN8n(ticket.id, message);
    }

    res.status(201).json(message);
  } catch (err) { next(err); }
});

/**
 * @swagger
 * /support/tickets/{id}/human-takeover:
 *   post:
 *     summary: Agente humano toma control del ticket
 *     description: Transfiere el ticket a modo humano (HUMAN_TAKEOVER) y asigna el agente que llama como responsable. Solo ADMIN o AGENT pueden usar este endpoint
 *     tags: [Support]
 *     security:
 *       - bearerAuth: []
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID del ticket
 *     responses:
 *       200:
 *         description: Ticket transferido a agente humano exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 status:
 *                   type: string
 *                   enum: [HUMAN_TAKEOVER]
 *                 assignedAgentId:
 *                   type: string
 *                   format: uuid
 *                 assignedAgent:
 *                   type: object
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         description: Solo ADMIN o AGENT pueden tomar tickets
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
// POST /api/support/tickets/:id/human-takeover - Agente humano toma control
router.post('/tickets/:id/human-takeover', [
  param('id').isUUID(),
  validate
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

/**
 * @swagger
 * /support/tickets/{id}/resume-automated:
 *   post:
 *     summary: Reanudar modo automático en ticket
 *     description: Vuelve a activar el modo AUTOMATED en un ticket y desasigna el agente. Solo ADMIN o el agente asignado pueden usar este endpoint
 *     tags: [Support]
 *     security:
 *       - bearerAuth: []
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID del ticket
 *     responses:
 *       200:
 *         description: Ticket reanudado a modo automático
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 status:
 *                   type: string
 *                   enum: [AUTOMATED]
 *                 assignedAgentId:
 *                   type: string
 *                   format: uuid
 *                   nullable: true
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         description: Solo ADMIN o agente asignado pueden reanudar bot
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
// POST /api/support/tickets/:id/resume-automated - Reanudar bot
router.post('/tickets/:id/resume-automated', [
  param('id').isUUID(),
  validate
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

/**
 * @swagger
 * /support/tickets/{id}:
 *   patch:
 *     summary: Actualizar estado y/o prioridad de ticket
 *     description: Permite actualizar el estado (status) y prioridad de un ticket. Cualquier usuario autenticado puede actualizar sus propios tickets, admin puede actualizar cualquier ticket
 *     tags: [Support]
 *     security:
 *       - bearerAuth: []
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID del ticket
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [AUTOMATED, HUMAN_TAKEOVER, PENDING_HUMAN, COMPLETED, CLOSED]
 *                 example: COMPLETED
 *               priority:
 *                 type: string
 *                 enum: [LOW, MEDIUM, HIGH, CRITICAL]
 *                 example: HIGH
 *     responses:
 *       200:
 *         description: Ticket actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SupportTicket'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         description: No autorizado para actualizar este ticket
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
// PATCH /api/support/tickets/:id - Actualizar estado/prioridad
router.patch('/tickets/:id', [
  param('id').isUUID(),
  body('status').optional().isIn(['AUTOMATED', 'HUMAN_TAKEOVER', 'PENDING_HUMAN', 'COMPLETED', 'CLOSED']),
  body('priority').optional().isIn(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
  validate
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

/**
 * @swagger
 * /support/tickets/{id}/public:
 *   get:
 *     summary: Obtener ticket público (endpoint para n8n)
 *     description: Endpoint público que devuelve información completa de un ticket incluyendo historial de mensajes. Usado por n8n para recuperar contexto. NO requiere autenticación
 *     tags: [Support]
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID del ticket
 *     responses:
 *       200:
 *         description: Ticket completo con mensajes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   format: uuid
 *                 userId:
 *                   type: string
 *                 subject:
 *                   type: string
 *                 description:
 *                   type: string
 *                 status:
 *                   type: string
 *                   enum: [AUTOMATED, HUMAN_TAKEOVER, PENDING_HUMAN, COMPLETED, CLOSED]
 *                 priority:
 *                   type: string
 *                   enum: [LOW, MEDIUM, HIGH, CRITICAL]
 *                 assignedAgentId:
 *                   type: string
 *                   format: uuid
 *                   nullable: true
 *                 lastMessageAt:
 *                   type: string
 *                   format: date-time
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                 user:
 *                   type: object
 *                   nullable: true
 *                   properties:
 *                     id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *                     company:
 *                       type: string
 *                 messages:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       ticketId:
 *                         type: string
 *                       senderType:
 *                         type: string
 *                         enum: [USER, BOT, AGENT]
 *                       senderId:
 *                         type: string
 *                         nullable: true
 *                       content:
 *                         type: string
 *                       metadata:
 *                         type: object
 *                         nullable: true
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *       404:
 *         description: Ticket no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: NOT_FOUND
 *                 message:
 *                   type: string
 *                   example: Ticket not found
 *       500:
 *         description: Error interno del servidor
 */
webhookRouter.get('/tickets/:id/public', [
  param('id').isUUID()
], async (req, res) => {
  try {
    const { id } = req.params;

    // OBTENER TICKET SIN RELACIONES FIRST
    const ticket = await prisma.supportTicket.findUnique({
      where: { id }
    });

    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    // OBTENER MENSAJES SEPARADAMENTE (manejo de error más controlado)
    const messages = await prisma.ticketMessage.findMany({
      where: { ticketId: id },
      orderBy: { createdAt: 'asc' },
      take: 50
    });

    // OBTENER USUARIO (si existe) - puede ser null si usuario eliminado
    const user = ticket.userId ? await prisma.user.findUnique({
      where: { id: ticket.userId },
      select: { id: true, name: true, email: true, company: true }
    }).catch(() => null) : null;

    // Responder con datos seguros y estructurados
    res.json({
      id: ticket.id,
      userId: ticket.userId,
      subject: ticket.subject,
      description: ticket.description,
      status: ticket.status,
      priority: ticket.priority,
      assignedAgentId: ticket.assignedAgentId,
      lastMessageAt: ticket.lastMessageAt,
      createdAt: ticket.createdAt,
      updatedAt: ticket.updatedAt,
      user: user,
      messages: messages.map(msg => ({
        id: msg.id,
        ticketId: msg.ticketId,
        senderType: msg.senderType,
        senderId: msg.senderId,
        content: msg.content,
        metadata: msg.metadata,
        createdAt: msg.createdAt
      }))
    });

  } catch (err) {
    console.error('Error fetching public ticket:', err);
    // NO exponer detalles internos al cliente (n8n)
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Exportar ambos routers: principal (autenticado) y webhook (público)
module.exports = router;
module.exports.webhook = webhookRouter;

