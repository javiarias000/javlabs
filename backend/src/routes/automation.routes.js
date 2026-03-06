const router = require('express').Router();
const prisma = require('../config/prisma');
const { authenticate } = require('../middlewares/auth.middleware');

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

router.post('/', async (req, res, next) => {
  try {
    const { name, description, type, projectId, webhookUrl } = req.body;
    const automation = await prisma.automation.create({ data: { name, description, type, projectId, webhookUrl } });
    await prisma.activity.create({ data: { description: `Automatización "${name}" creada`, type: 'automation_created', projectId } });
    res.status(201).json(automation);
  } catch (err) { next(err); }
});

router.patch('/:id', async (req, res, next) => {
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
