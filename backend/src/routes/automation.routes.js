const router = require('express').Router();
const prisma = require('../config/prisma');
const { authenticate } = require('../middlewares/auth.middleware');
const { body } = require('express-validator');
const { validate } = require('../middlewares/validate.middleware');

router.use(authenticate);

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

// ✅ VALIDATION ADDED - Create Automation
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

router.get('/:id', async (req, res, next) => {
  try {
    const automation = await prisma.automation.findUnique({
      where: { id: req.params.id },
      include: { project: { select: { id: true, name: true } } },
    });
    if (!automation) return res.status(404).json({ error: 'No encontrado.' });
    res.json(automation);
  } catch (err) { next(err); }
});

// ✅ VALIDATION ADDED - Update Automation
router.patch('/:id', [
  body('status').optional().isIn(['active', 'inactive', 'paused']).withMessage('Invalid status'),
  body('name').optional().notEmpty().withMessage('Name cannot be empty'),
  body('description').optional().isLength({ max: 1000 }).withMessage('Description too long (max 1000 chars)'),
  body('webhookUrl').optional().isURL().withMessage('Invalid webhook URL'),
  validate,
], async (req, res, next) => {
  try {
    const { status, name, description, webhookUrl } = req.body;
    const updated = await prisma.automation.update({
      where: { id: req.params.id },
      data: { ...(status && { status }), ...(name && { name }), ...(description && { description }), ...(webhookUrl && { webhookUrl }) },
    });
    res.json(updated);
  } catch (err) { next(err); }
});

router.delete('/:id', async (req, res, next) => {
  try {
    if (req.user.role !== 'ADMIN') return res.status(403).json({ error: 'Sin permisos.' });
    await prisma.automation.delete({ where: { id: req.params.id } });
    res.json({ message: 'Automatización eliminada.' });
  } catch (err) { next(err); }
});

module.exports = router;
