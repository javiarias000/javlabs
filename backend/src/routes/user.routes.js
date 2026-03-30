const router  = require('express').Router();
const prisma  = require('../config/prisma');
const bcrypt  = require('bcryptjs');
const { authenticate } = require('../middlewares/auth.middleware');
const { body } = require('express-validator');
const { validate } = require('../middlewares/validate.middleware');

router.use(authenticate);

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Listar todos los usuarios (solo admin)
 *     description: Devuelve una lista de todos los usuarios registrados. Solo administradores pueden acceder
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Lista de usuarios
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
 *                   email:
 *                     type: string
 *                     format: email
 *                   role:
 *                     type: string
 *                     enum: [ADMIN, AGENT, CLIENT]
 *                   company:
 *                     type: string
 *                   isActive:
 *                     type: boolean
 *                   n8nProjectKey:
 *                     type: string
 *                   createdAt:
 *                     type: string
 *                     format: date-time
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
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get('/', async (req, res, next) => {
  try {
    if (req.user.role !== 'ADMIN') return res.status(403).json({ error: 'Sin permisos.' });
    const users = await prisma.user.findMany({
      select: {
        id: true, name: true, email: true, role: true,
        company: true, isActive: true, createdAt: true,
        n8nProjectKey: true, phone: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json(users);
  } catch (err) { next(err); }
});

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Crear usuario (solo admin)
 *     description: Crea un nuevo usuario en el sistema. Solo administradores pueden acceder
 *     tags: [Users]
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
 *             required: [name, email, password, role]
 *             properties:
 *               name:
 *                 type: string
 *                 maxLength: 100
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 minLength: 6
 *               role:
 *                 type: string
 *                 enum: [ADMIN, AGENT, CLIENT]
 *               company:
 *                 type: string
 *                 maxLength: 100
 *               phone:
 *                 type: string
 *               n8nProjectKey:
 *                 type: string
 *                 pattern: ^[a-z0-9_]+$
 *     responses:
 *       201:
 *         description: Usuario creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 email:
 *                   type: string
 *                 role:
 *                   type: string
 *                 company:
 *                   type: string
 *                 isActive:
 *                   type: boolean
 *                 n8nProjectKey:
 *                   type: string
 *       400:
 *         description: Validación fallida o email existente
 *       403:
 *         description: Sin permisos de administrador
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.post('/', [
  body('name').notEmpty().isLength({ max: 100 }).withMessage('Name max 100 characters'),
  body('email').isEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 6 }).withMessage('Password min 6 characters'),
  body('role').isIn(['ADMIN', 'AGENT', 'CLIENT']).withMessage('Invalid role'),
  body('company').optional().isLength({ max: 100 }).withMessage('Company max 100 characters'),
  body('phone').optional(),
  body('n8nProjectKey').optional().matches(/^[a-z0-9_]+$/).withMessage('Invalid n8nProjectKey format'),
  validate,
], async (req, res, next) => {
  try {
    if (req.user.role !== 'ADMIN') return res.status(403).json({ error: 'Sin permisos.' });

    const { name, email, password, role, company, phone, n8nProjectKey } = req.body;

    // Verificar si el email ya existe
    const existing = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (existing) {
      return res.status(400).json({ error: 'El email ya está registrado.' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        role,
        company,
        phone,
        n8nProjectKey,
      },
      select: {
        id: true, name: true, email: true, role: true,
        company: true, isActive: true, n8nProjectKey: true, phone: true, createdAt: true,
      },
    });

    logger.info(`Usuario creado por admin: ${email} (${role})`);

    res.status(201).json(user);
  } catch (err) { next(err); }
});

/**
 * @swagger
 * /users/{id}:
 *   patch:
 *     summary: Actualizar usuario (solo admin)
 *     description: Actualiza los datos de un usuario específico. Campo 'role' solo permite ADMIN o USER (AGENT no permitido). Solo administradores pueden acceder
 *     tags: [Users]
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
 *         description: ID del usuario a actualizar
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 maxLength: 100
 *                 example: Juan Pérez Actualizado
 *               role:
 *                 type: string
 *                 enum: [ADMIN, USER]
 *                 example: ADMIN
 *               isActive:
 *                 type: boolean
 *                 example: true
 *               n8nProjectKey:
 *                 type: string
 *                 pattern: ^[a-z0-9_]+$
 *                 example: my_project_key_123
 *               company:
 *                 type: string
 *                 maxLength: 100
 *                 example: Nueva Empresa S.L.
 *     responses:
 *       200:
 *         description: Usuario actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 email:
 *                   type: string
 *                 role:
 *                   type: string
 *                 company:
 *                   type: string
 *                 isActive:
 *                   type: boolean
 *                 n8nProjectKey:
 *                   type: string
 *       400:
 *         description: Validación fallida o auto-eliminación
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: VALIDATION_ERROR
 *                 message:
 *                   type: string
 *                 details:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       field:
 *                         type: string
 *                       message:
 *                         type: string
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
 *         description: Usuario no encontrado
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
 *                   example: Usuario no encontrado
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.patch('/:id', [
  body('name').optional().notEmpty().isLength({ max: 100 }).withMessage('Name max 100 characters'),
  body('role').optional().isIn(['ADMIN', 'AGENT', 'CLIENT']).withMessage('Invalid role. Must be ADMIN, AGENT or CLIENT'),
  body('isActive').optional().isBoolean().withMessage('isActive must be boolean'),
  body('n8nProjectKey').optional().matches(/^[a-z0-9_]+$/).withMessage('Invalid n8nProjectKey format'),
  body('company').optional().isLength({ max: 100 }).withMessage('Company max 100 characters'),
  validate,
], async (req, res, next) => {
  try {
    if (req.user.role !== 'ADMIN') return res.status(403).json({ error: 'Sin permisos.' });
    if (req.params.id === req.user.userId) return res.status(400).json({ error: 'No puedes modificarte a ti mismo.' });

    // Log para debugging
    console.log('[PATCH /users/:id]', {
      userId: req.params.id,
      userRole: req.user.role,
      body: req.body
    });

    const { name, role, isActive, n8nProjectKey, company } = req.body;
    const user = await prisma.user.update({
      where: { id: req.params.id },
      data: {
        ...(name          !== undefined && { name }),
        ...(role          !== undefined && { role }),
        ...(isActive      !== undefined && { isActive }),
        ...(n8nProjectKey !== undefined && { n8nProjectKey }),
        ...(company       !== undefined && { company }),
      },
      select: {
        id: true, name: true, email: true, role: true,
        company: true, isActive: true, n8nProjectKey: true,
      },
    });
    res.json(user);
  } catch (err) { next(err); }
});

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Eliminar usuario (solo admin)
 *     description: Elimina un usuario del sistema. No permite auto-eliminación. Solo administradores pueden acceder
 *     tags: [Users]
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
 *         description: ID del usuario a eliminar
 *     responses:
 *       200:
 *         description: Usuario eliminado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Usuario eliminado
 *       400:
 *         description: Intento de auto-eliminación
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: SELF_DELETE
 *                 message:
 *                   type: string
 *                   example: No puedes eliminarte a ti mismo.
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
 *         description: Usuario no encontrado
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
 *                   example: Usuario no encontrado
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.delete('/:id', async (req, res, next) => {
  try {
    if (req.user.role !== 'ADMIN') return res.status(403).json({ error: 'Sin permisos.' });
    if (req.params.id === req.user.userId) return res.status(400).json({ error: 'No puedes eliminarte a ti mismo.' });
    await prisma.user.delete({ where: { id: req.params.id } });
    res.json({ message: 'Usuario eliminado.' });
  } catch (err) { next(err); }
});

module.exports = router;
