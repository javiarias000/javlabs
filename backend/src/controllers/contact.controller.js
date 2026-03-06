const prisma = require('../config/prisma');
const { logger } = require('../utils/logger');

const submitContact = async (req, res, next) => {
  try {
    const { name, company, email, phone, service, message } = req.body;
    const form = await prisma.contactForm.create({
      data: { name, company, email, phone, service, message },
    });
    logger.info(`Nuevo contacto de: ${email}`);
    res.status(201).json({ message: 'Formulario enviado. Te contactaremos pronto.', id: form.id });
  } catch (err) { next(err); }
};

const getContacts = async (req, res, next) => {
  try {
    if (req.user.role !== 'ADMIN') return res.status(403).json({ error: 'Sin permisos.' });
    const { status, page = 1, limit = 20 } = req.query;
    const where = status ? { status } : {};
    const [contacts, total] = await Promise.all([
      prisma.contactForm.findMany({ where, orderBy: { createdAt: 'desc' }, skip: (page - 1) * limit, take: Number(limit) }),
      prisma.contactForm.count({ where }),
    ]);
    res.json({ contacts, total, page: Number(page), totalPages: Math.ceil(total / limit) });
  } catch (err) { next(err); }
};

const updateContact = async (req, res, next) => {
  try {
    if (req.user.role !== 'ADMIN') return res.status(403).json({ error: 'Sin permisos.' });
    const updated = await prisma.contactForm.update({ where: { id: req.params.id }, data: { status: req.body.status } });
    res.json(updated);
  } catch (err) { next(err); }
};

module.exports = { submitContact, getContacts, updateContact };
