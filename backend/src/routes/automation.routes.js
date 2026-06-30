const router = require('express').Router();
const prisma = require('../config/prisma');
const { authenticate } = require('../middlewares/auth.middleware');
const { body } = require('express-validator');
const { validate } = require('../middlewares/validate.middleware');

router.use(authenticate);

/**
 * @swagger
 * /automations:
 *   get:
 *     summary: Listar automatizaciones
 *     description: Devuelve todas las automatizaciones. Admin ve todas, usuarios solo las de sus proyectos
 *     tags: [Automations]
 *     security:
 *       - bearerAuth: []
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Lista de automatizaciones
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
 *                   description:
 *                     type: string
 *                   type:
 *                     type: string
 *                     enum: [PROCESS, API_INTEGRATION, CHATBOT, CRM, REPORT, WORKFLOW]
 *                   status:
 *                     type: string
 *                     enum: [ACTIVE, PAUSED, ERROR, PENDING]
 *                   tasksRun:
 *                     type: integer
 *                   timeSaved:
 *                     type: number
 *                     format: float
 *                   webhookUrl:
 *                     type: string
 *                     format: url
 *                     nullable: true
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *                   project:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       userId:
 *                         type: string
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get('/', async (req, res, next) => {
  try {
    const isAdmin = req.user.role === 'ADMIN';
    const automations = await prisma.automation.findMany({
      where: isAdmin ? {} : { project: { userId: req.user.userId } },
      include: { project: { select: { name: true, userId: true } } },
      orderBy: { createdAt: 'desc' },
    });
    res.json(automations);
  } catch (err) { next(err); }
});

/**
 * @swagger
 * /automations:
 *   post:
 *     summary: Crear automatización
 *     description: Crea una nueva automatización vinculada a un proyecto
 *     tags: [Automations]
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
 *               - type
 *               - projectId
 *             properties:
 *               name:
 *                 type: string
 *                 example: Lead Scoring Automation
 *               description:
 *                 type: string
 *                 maxLength: 1000
 *                 example: Automatización para puntuar leads según interacciones
 *               type:
 *                 type: string
 *                 enum: [PROCESS, API_INTEGRATION, CHATBOT, CRM, REPORT, WORKFLOW]
 *                 example: CHATBOT
 *               projectId:
 *                 type: string
 *                 format: uuid
 *                 example: 123e4567-e89b-12d3-a456-426614174000
 *               webhookUrl:
 *                 type: string
 *                 format: url
 *                 example: https://n8n.javlabs.com/webhook/lead-scoring
 *                 nullable: true
 *     responses:
 *       201:
 *         description: Automatización creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Automation'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         description: Proyecto no pertenece al usuario
 *       404:
 *         description: Proyecto no encontrado
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.post('/', [
  body('name').notEmpty().withMessage('Automation name is required'),
  body('description').optional().isLength({ max: 1000 }).withMessage('Description too long (max 1000 chars)'),
  body('type').isIn(['webhook', 'schedule', 'api']).withMessage('Invalid automation type'),
  body('projectId').notEmpty().withMessage('Project ID is required'),
  body('webhookUrl').optional().isURL().withMessage('Invalid webhook URL'),
  validate,
], async (req, res, next) => {
  try {
    const { name, description, type, projectId, webhookUrl } = req.body;
    const automation = await prisma.automation.create({ data: { name, description, type, projectId, webhookUrl } });
    await prisma.activity.create({ data: { description: `Automatización "${name}" creada`, type: 'automation_created', projectId } });
    res.status(201).json(automation);
  } catch (err) { next(err); }
});

/**
 * @swagger
 * /automations/{id}:
 *   get:
 *     summary: Obtener automatización específica
 *     description: Devuelve detalles de una automatización por ID (solo si belongs to user's project)
 *     tags: [Automations]
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
 *         description: ID de la automatización
 *     responses:
 *       200:
 *         description: Detalle de automatización
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 description:
 *                   type: string
 *                 type:
 *                   type: string
 *                   enum: [PROCESS, API_INTEGRATION, CHATBOT, CRM, REPORT, WORKFLOW]
 *                 status:
 *                   type: string
 *                   enum: [ACTIVE, PAUSED, ERROR, PENDING]
 *                 tasksRun:
 *                   type: integer
 *                 timeSaved:
 *                   type: number
 *                   format: float
 *                 webhookUrl:
 *                   type: string
 *                   format: url
 *                   nullable: true
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                 project:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     name:
 *                       type: string
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         description: No tienes acceso a esta automatización
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get('/:id', async (req, res, next) => {
  try {
    const where = req.user.role === 'ADMIN'
      ? { id: req.params.id }
      : { id: req.params.id, project: { userId: req.user.userId } };
    const automation = await prisma.automation.findFirst({
      where,
      include: { project: { select: { id: true, name: true } } },
    });
    if (!automation) return res.status(404).json({ error: 'No encontrado.' });
    res.json(automation);
  } catch (err) { next(err); }
});

/**
 * @swagger
 * /automations/{id}:
 *   patch:
 *     summary: Actualizar automatización
 *     description: Actualiza campos de una automatización existente (solo si belongs to user's project)
 *     tags: [Automations]
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
 *         description: ID de la automatización a actualizar
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [active, inactive, paused]
 *                 example: active
 *               name:
 *                 type: string
 *                 example: Updated Automation Name
 *               description:
 *                 type: string
 *                 maxLength: 1000
 *                 example: Descripción actualizada
 *               webhookUrl:
 *                 type: string
 *                 format: url
 *                 example: https://n8n.javlabs.com/webhook/updated
 *     responses:
 *       200:
 *         description: Automatización actualizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Automation'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         description: No tienes acceso a esta automatización
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.patch('/:id', [
  body('status').optional().isIn(['active', 'inactive', 'paused']).withMessage('Invalid status'),
  body('name').optional().notEmpty().withMessage('Name cannot be empty'),
  body('description').optional().isLength({ max: 1000 }).withMessage('Description too long (max 1000 chars)'),
  body('webhookUrl').optional().isURL().withMessage('Invalid webhook URL'),
  validate,
], async (req, res, next) => {
  try {
    const { status, name, description, webhookUrl } = req.body;
    const where = req.user.role === 'ADMIN'
      ? { id: req.params.id }
      : { id: req.params.id, project: { userId: req.user.userId } };
    const existing = await prisma.automation.findFirst({ where });
    if (!existing) return res.status(404).json({ error: 'No encontrado.' });
    const updated = await prisma.automation.update({
      where: { id: req.params.id },
      data: { ...(status && { status }), ...(name && { name }), ...(description && { description }), ...(webhookUrl && { webhookUrl }) },
    });
    res.json(updated);
  } catch (err) { next(err); }
});

/**
 * @swagger
 * /automations/{id}:
 *   delete:
 *     summary: Eliminar automatización (solo admin)
 *     description: Elimina una automatización del sistema. Solo administradores pueden acceder
 *     tags: [Automations]
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
 *         description: ID de la automatización a eliminar
 *     responses:
 *       200:
 *         description: Automatización eliminada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Automatización eliminada.
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         description: Sin permisos de administrador
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: FORBIDDEN
 *                 message:
 *                   type: string
 *                   example: Sin permisos.
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.delete('/:id', async (req, res, next) => {
  try {
    if (req.user.role !== 'ADMIN') return res.status(403).json({ error: 'Sin permisos.' });
    await prisma.automation.delete({ where: { id: req.params.id } });
    res.json({ message: 'Automatización eliminada.' });
  } catch (err) { next(err); }
});

module.exports = router;
