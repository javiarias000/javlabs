const router = require('express').Router();
const { submitContact, getContacts, updateContact } = require('../controllers/contact.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { body } = require('express-validator');
const { validate } = require('../middlewares/validate.middleware');

/**
 * @swagger
 * /contact:
 *   post:
 *     summary: Enviar formulario de contacto
 *     description: Endpoint público para enviar consultas desde el formulario de contacto. No requiere autenticación
 *     tags: [Contact]
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
 *               - email
 *               - message
 *             properties:
 *               name:
 *                 type: string
 *                 example: Carlos Ruiz
 *               company:
 *                 type: string
 *                 example: TechCorp S.L.
 *               email:
 *                 type: string
 *                 format: email
 *                 example: carlos@techcorp.com
 *               phone:
 *                 type: string
 *                 example: +34600000000
 *               service:
 *                 type: string
 *                 example: Automatización de Procesos
 *               message:
 *                 type: string
 *                 minLength: 10
 *                 example: Me interesa conocer más sobre sus servicios de automatización...
 *     responses:
 *       201:
 *         description: Mensaje de contacto recibido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ContactForm'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.post('/', [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('message').isLength({ min: 10 }).withMessage('Message must be at least 10 characters'),
  validate,
], submitContact);

/**
 * @swagger
 * /contact:
 *   get:
 *     summary: Listar mensajes de contacto (solo admin/agent)
 *     description: Devuelve todos los mensajes del formulario de contacto. Solo administradores y agentes pueden acceder
 *     tags: [Contact]
 *     security:
 *       - bearerAuth: []
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Lista de mensajes de contacto
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ContactForm'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         description: Sin permisos (solo ADMIN/AGENT)
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get('/', authenticate, getContacts);

/**
 * @swagger
 * /contact/{id}:
 *   patch:
 *     summary: Actualizar mensaje de contacto (solo admin/agent)
 *     description: Actualiza el estado, crea usuario desde contacto, asigna proyecto n8n. Solo administradores y agentes pueden acceder
 *     tags: [Contact]
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
 *         description: ID del mensaje de contacto
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [PENDING, READ, REPLIED, CLOSED]
 *                 example: READ
 *               createUser:
 *                 type: boolean
 *                 description: Si true y el contacto no tiene usuario, crea un CLIENT automáticamente
 *               n8nProjectKey:
 *                 type: string
 *                 pattern: ^[a-z0-9_]+$
 *                 example: dentilook
 *     responses:
 *       200:
 *         description: Contacto actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ContactForm'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         description: Sin permisos (solo ADMIN/AGENT)
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.patch('/:id', authenticate, [
  body('status').optional().isIn(['PENDING', 'READ', 'REPLIED', 'CLOSED']).withMessage('Invalid status'),
  body('n8nProjectKey').optional().matches(/^[a-z0-9_]+$/).withMessage('Invalid n8nProjectKey format'),
  body('createUser').optional().isBoolean().withMessage('createUser must be boolean'),
  validate,
], updateContact);

module.exports = router;

module.exports = router;
