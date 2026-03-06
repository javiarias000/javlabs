const router = require('express').Router();
const { authenticate } = require('../middlewares/auth.middleware');
const prisma = require('../config/prisma');
const crypto = require('crypto');

router.post('/receive', async (req, res, next) => {
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

router.use(authenticate);

router.get('/', async (req, res, next) => {
  try {
    if (req.user.role !== 'ADMIN') return res.status(403).json({ error: 'Sin permisos.' });
    const webhooks = await prisma.webhook.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(webhooks);
  } catch (err) { next(err); }
});

router.post('/', async (req, res, next) => {
  try {
    if (req.user.role !== 'ADMIN') return res.status(403).json({ error: 'Sin permisos.' });
    const { name, url, events } = req.body;
    const secret = crypto.randomBytes(32).toString('hex');
    const webhook = await prisma.webhook.create({ data: { name, url, secret, events } });
    res.status(201).json(webhook);
  } catch (err) { next(err); }
});

router.delete('/:id', async (req, res, next) => {
  try {
    if (req.user.role !== 'ADMIN') return res.status(403).json({ error: 'Sin permisos.' });
    await prisma.webhook.delete({ where: { id: req.params.id } });
    res.json({ message: 'Webhook eliminado.' });
  } catch (err) { next(err); }
});

module.exports = router;
