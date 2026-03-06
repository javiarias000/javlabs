const router = require('express').Router();
const prisma = require('../config/prisma');
const { authenticate, requireAdmin } = require('../middlewares/auth.middleware');
const bcrypt = require('bcryptjs');

router.use(authenticate);

router.get('/', requireAdmin, async (req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true, company: true, isActive: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json(users);
  } catch (err) { next(err); }
});

router.patch('/:id', async (req, res, next) => {
  try {
    const isOwner = req.user.userId === req.params.id;
    const isAdmin = req.user.role === 'ADMIN';
    if (!isOwner && !isAdmin) return res.status(403).json({ error: 'Sin permisos.' });
    const { name, company, phone, password } = req.body;
    const data = { ...(name && { name }), ...(company && { company }), ...(phone && { phone }) };
    if (password) data.password = await bcrypt.hash(password, 12);
    const updated = await prisma.user.update({ where: { id: req.params.id }, data, select: { id: true, name: true, email: true, company: true } });
    res.json(updated);
  } catch (err) { next(err); }
});

module.exports = router;
