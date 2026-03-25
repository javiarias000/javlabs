const router = require('express').Router();
const { getDashboard, getChartData } = require('../controllers/dashboard.controller');
const { authenticate } = require('../middlewares/auth.middleware');

/**
 * @swagger
 * /dashboard:
 *   get:
 *     summary: Obtener estadísticas del dashboard
 *     description: Devuelve métricas clave para el dashboard del usuario - proyectos, automatizaciones, tickets, etc.
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Estadísticas del dashboard
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalProjects:
 *                   type: integer
 *                   example: 12
 *                 activeProjects:
 *                   type: integer
 *                   example: 8
 *                 totalAutomations:
 *                   type: integer
 *                   example: 25
 *                 activeAutomations:
 *                   type: integer
 *                   example: 20
 *                 openTickets:
 *                   type: integer
 *                   example: 3
 *                 criticalTickets:
 *                   type: integer
 *                   example: 1
 *                 recentActivities:
 *                   type: array
 *                   items:
 *                     type: object
 *                   example: []
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         description: Sin acceso al dashboard
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get('/', authenticate, getDashboard);

/**
 * @swagger
 * /dashboard/chart:
 *   get:
 *     summary: Obtener datos para gráficos
 *     description: Devuelve datos agregados para gráficos - automatizaciones por tipo, tickets por mes
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Datos para gráficos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 automationsByType:
 *                   type: object
 *                   additionalProperties:
 *                     type: integer
 *                   example: {"CHATBOT": 5, "WORKFLOW": 10, "API_INTEGRATION": 3}
 *                 ticketsByStatus:
 *                   type: object
 *                   additionalProperties:
 *                     type: integer
 *                   example: {"OPEN": 3, "CLOSED": 15, "PENDING_HUMAN": 2}
 *                 projectsByMonth:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       month:
 *                         type: string
 *                       count:
 *                         type: integer
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         description: Sin acceso al dashboard
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get('/chart', authenticate, getChartData);

module.exports = router;
