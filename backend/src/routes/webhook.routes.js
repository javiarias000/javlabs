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

router.post('/receive', [
  // ✅ VALIDATION ADDED - Webhook Receive
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

router.use(authenticate);

router.get('/', async (req, res, next) => {
  try {
    if (req.user.role !== 'ADMIN') return res.status(403).json({ error: 'Sin permisos.' });
    const webhooks = await prisma.webhook.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(webhooks);
  } catch (err) { next(err); }
});

// ✅ VALIDATION ADDED - Create Webhook with SSRF Protection
router.post('/', [
  body('name').notEmpty().withMessage('Webhook name is required'),
  body('url').isURL().custom(isPrivateIP).withMessage('Invalid URL or private IP range blocked'),
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

router.delete('/:id', async (req, res, next) => {
  try {
    if (req.user.role !== 'ADMIN') return res.status(403).json({ error: 'Sin permisos.' });
    await prisma.webhook.delete({ where: { id: req.params.id } });
    res.json({ message: 'Webhook eliminado.' });
  } catch (err) { next(err); }
});

module.exports = router;
