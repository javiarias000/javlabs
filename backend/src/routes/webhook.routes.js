const router = require('express').Router();
const { authenticate } = require('../middlewares/auth.middleware');
const prisma = require('../config/prisma');
const crypto = require('crypto');
const { body, custom } = require('express-validator');
const { validate } = require('../middlewares/validate.middleware');

// ✅ SSRF PROTECTION - Block private IP ranges
const isPrivateIP = (url) => {
  try {
    // Extract hostname from URL (remove protocol, path, query)
    const urlObj = new URL(url);
    const host = urlObj.hostname;

    // Check if it's an IP address
    const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
    if (ipv4Regex.test(host)) {
      const parts = host.split('.').map(Number);
      // Private IP ranges: 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16, 127.0.0.0/8, 169.254.0.0/16 (link-local)
      if (
        parts[0] === 10 ||
        (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) ||
        (parts[0] === 192 && parts[1] === 168) ||
        parts[0] === 127 ||
        (parts[0] === 169 && parts[1] === 254)
      ) {
        return false; // Reject private IPs
      }
    }
    return true;
  } catch (err) {
    return false; // Invalid URL
  }
};

/**
 * @swagger
 * /webhooks/receive:
 *   post:
 *     summary: Recibir webhook endpoints
 *     description: Endpoint público para recibir eventos de automatizaciones externas (n8n, APIs, etc.). NO requiere autenticación. Actualiza contadores de automatizaciones
 *     tags: [Webhooks]
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - event
 *             properties:
 *               event:
 *                 type: string
 *                 example: automation.run
 *               projectId:
 *                 type: string
 *                 format: uuid
 *                 example: 123e4567-e89b-12d3-a456-426614174000
 *               automationId:
 *                 type: string
 *                 format: uuid
 *                 example: 987e6543-e21b-45d6-b789-123456789abc
 *               data:
 *                 type: object
 *                 properties:
 *                   automationName:
 *                     type: string
 *                     example: Lead Scoring Bot
 *                   tasksRun:
 *                     type: integer
 *                     example: 1
 *                   timeSaved:
 *                     type: number
 *                     format: float
 *                     example: 0.5
 *     responses:
 *       200:
 *         description: Webhook recibido exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 received:
 *                   type: boolean
 *                   example: true
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.post('/receive', [
  body('event').notEmpty().withMessage('Event is required'),
  body('projectId').optional().isUUID().withMessage('Invalid projectId'),
  body('automationId').optional().isUUID().withMessage('Invalid automationId'),
  body('data').optional().isObject().withMessage('Data must be object'),
  validate,
], async (req, res, next) => {
  try {
    const { event, projectId, automationId, data } = req.body;
    if (event === 'automation.run' && automationId) {
      await prisma.automation.update({
        where: { id: automationId },
        data: { tasksRun: { increment: data?.tasksRun || 1 }, timeSaved: { increment: data?.timeSaved || 0 } },
      });
      if (projectId) {
        await prisma.activity.create({ data: { description: `Automatización ejecutada: ${data?.automationName || automationId}`, type: 'automation_run', projectId } });
      }
    }
    res.json({ received: true });
  } catch (err) { next(err); }
});

// Middleware de autenticación para rutas protegidas
router.use(authenticate);

/**
 * @swagger
 * /webhooks:
 *   get:
 *     summary: Listar webhooks configurados (solo admin)
 *     description: Devuelve la lista de todos los webhooks registrados en el sistema
 *     tags: [Webhooks]
 *     security:
 *       - bearerAuth: []
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Lista de webhooks
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     format: uuid
 *                   name:
 *                     type: string
 *                   url:
 *                     type: string
 *                     format: url
 *                   events:
 *                     type: array
 *                     items:
 *                       type: string
 *                   secret:
 *                     type: string
 *                     description: Secreto para verificar webhook signatures (mostrado solo al crear)
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         description: Sin permisos de administrador
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get('/', async (req, res, next) => {
  try {
    if (req.user.role !== 'ADMIN') return res.status(403).json({ error: 'Sin permisos.' });
    const webhooks = await prisma.webhook.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(webhooks);
  } catch (err) { next(err); }
});

/**
 * @swagger
 * /webhooks:
 *   post:
 *     summary: Crear nuevo webhook (solo admin)
 *     description: Crea un nuevo webhook para recibir notificaciones de eventos externos. Genera un secreto único para verificar la autenticidad de las peticiones
 *     tags: [Webhooks]
 *     security:
 *       - bearerAuth: []
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - url
 *             properties:
 *               name:
 *                 type: string
 *                 example: n8n Webhook Leads
 *               url:
 *                 type: string
 *                 format: url
 *                 example: https://n8n.javlabs.com/webhook/leads
 *               events:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: [automation.run, ticket.created, project.completed]
 *     responses:
 *       201:
 *         description: Webhook creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   format: uuid
 *                 name:
 *                   type: string
 *                 url:
 *                   type: string
 *                   format: url
 *                 events:
 *                   type: array
 *                   items:
 *                     type: string
 *                 secret:
 *                   type: string
 *                   description: Secreto para verificar webhook signatures (guardar, no se muestra de nuevo)
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         description: Sin permisos de administrador
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.post('/', [
  body('name').notEmpty().withMessage('Webhook name is required'),
  body('url').isURL().withMessage('Invalid URL').custom(isPrivateIP).withMessage('Invalid URL or private IP range blocked'),
  body('events').optional().isArray().withMessage('Events must be array'),
  body('events.*').optional().isString().withMessage('Each event must be string'),
  validate,
], async (req, res, next) => {
  try {
    if (req.user.role !== 'ADMIN') return res.status(403).json({ error: 'Sin permisos.' });
    const { name, url, events } = req.body;
    const secret = crypto.randomBytes(32).toString('hex');
    const webhook = await prisma.webhook.create({ data: { name, url, secret, events } });
    res.status(201).json(webhook);
  } catch (err) { next(err); }
});

/**
 * @swagger
 * /webhooks/{id}:
 *   delete:
 *     summary: Eliminar webhook (solo admin)
 *     description: Elimina un webhook configurado del sistema. Solo administradores pueden acceder
 *     tags: [Webhooks]
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
 *         description: ID del webhook a eliminar
 *     responses:
 *       200:
 *         description: Webhook eliminado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Webhook eliminado.
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         description: Sin permisos de administrador
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.delete('/:id', async (req, res, next) => {
  try {
    if (req.user.role !== 'ADMIN') return res.status(403).json({ error: 'Sin permisos.' });
    await prisma.webhook.delete({ where: { id: req.params.id } });
    res.json({ message: 'Webhook eliminado.' });
  } catch (err) { next(err); }
});

module.exports = router;
