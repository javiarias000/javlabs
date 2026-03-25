const router = require('express').Router();
const { getProjects, getProject, createProject, updateProject, deleteProject } = require('../controllers/project.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { body } = require('express-validator');
const { validate } = require('../middlewares/validate.middleware');

router.use(authenticate);

/**
 * @swagger
 * /projects:
 *   get:
 *     summary: Listar proyectos del usuario
 *     description: Devuelve todos los proyectos de automatización del usuario autenticado
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Lista de proyectos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Project'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get('/', getProjects);

/**
 * @swagger
 * /projects/{id}:
 *   get:
 *     summary: Obtener proyecto específico
 *     description: Devuelve los detalles de un proyecto por su ID (solo si belongs to user)
 *     tags: [Projects]
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
 *         description: ID del proyecto
 *     responses:
 *       200:
 *         description: Detalle del proyecto
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Project'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         description: No tienes acceso a este proyecto
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get('/:id', getProject);

/**
 * @swagger
 * /projects:
 *   post:
 *     summary: Crear nuevo proyecto
 *     description: Crea un nuevo proyecto de automatización para el usuario autenticado
 *     tags: [Projects]
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
 *             properties:
 *               name:
 *                 type: string
 *                 example: Automatización Ventas
 *               description:
 *                 type: string
 *                 maxLength: 2000
 *                 example: Proceso automatizado para gestión de leads
 *               projectKey:
 *                 type: string
 *                 pattern: ^[a-z0-9_]+$
 *                 example: ventas_automation_2025
 *     responses:
 *       201:
 *         description: Proyecto creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Project'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.post('/', [
  body('name').notEmpty().withMessage('Project name is required'),
  body('description').optional().isLength({ max: 2000 }).withMessage('Description too long (max 2000 chars)'),
  body('projectKey').optional().matches(/^[a-z0-9_]+$/).withMessage('Invalid project key format (a-z,0-9,_ only)'),
  validate,
], createProject);

/**
 * @swagger
 * /projects/{id}:
 *   patch:
 *     summary: Actualizar proyecto
 *     description: Actualiza datos de un proyecto existente (solo si belongs to user)
 *     tags: [Projects]
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
 *         description: ID del proyecto a actualizar
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Nuevo Nombre de Proyecto
 *               description:
 *                 type: string
 *                 maxLength: 2000
 *                 example: Descripción actualizada del proyecto
 *     responses:
 *       200:
 *         description: Proyecto actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Project'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         description: No tienes acceso a este proyecto
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.patch('/:id', [
  body('name').optional().notEmpty().withMessage('Name cannot be empty'),
  body('description').optional().isLength({ max: 2000 }).withMessage('Description too long (max 2000 chars)'),
  validate,
], updateProject);

/**
 * @swagger
 * /projects/{id}:
 *   delete:
 *     summary: Eliminar proyecto
 *     description: Elimina un proyecto (solo si belongs to user)
 *     tags: [Projects]
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
 *         description: ID del proyecto a eliminar
 *     responses:
 *       200:
 *         description: Proyecto eliminado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Proyecto eliminado
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         description: No tienes acceso a este proyecto
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.delete('/:id', deleteProject);

module.exports = router;
