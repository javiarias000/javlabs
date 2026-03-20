const router  = require('express').Router();
const prisma  = require('../config/prisma');
const bcrypt  = require('bcryptjs');
const { authenticate } = require('../middlewares/auth.middleware');

router.use(authenticate);

// GET /api/users — listar todos (solo admin)
router.get('/', async (req, res, next) => {
  try {
    if (req.user.role !== 'ADMIN') return res.status(403).json({ error: 'Sin permisos.' });
    const users = await prisma.user.findMany({
      select: {
        id: true, name: true, email: true, role: true,
        company: true, isActive: true, createdAt: true,
        n8nProjectKey: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json(users);
  } catch (err) { next(err); }
});

// PATCH /api/users/:id — actualizar usuario (solo admin)
router.patch('/:id', async (req, res, next) => {
  try {
    if (req.user.role !== 'ADMIN') return res.status(403).json({ error: 'Sin permisos.' });
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

// DELETE /api/users/:id — eliminar usuario (solo admin)
router.delete('/:id', async (req, res, next) => {
  try {
    if (req.user.role !== 'ADMIN') return res.status(403).json({ error: 'Sin permisos.' });
    if (req.params.id === req.user.userId) return res.status(400).json({ error: 'No puedes eliminarte a ti mismo.' });
    await prisma.user.delete({ where: { id: req.params.id } });
    res.json({ message: 'Usuario eliminado.' });
  } catch (err) { next(err); }
});

module.exports = router;
