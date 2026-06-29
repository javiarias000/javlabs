const bcrypt = require('bcryptjs');
const prisma = require('../config/prisma');
const { logger } = require('../utils/logger');
const { sendContactNotification } = require('../utils/email');

const submitContact = async (req, res, next) => {
  try {
    const { name, company, email, phone, service, message } = req.body;

    // 1️⃣ Buscar si el usuario ya existe
    let user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });

    // 2️⃣ Si no existe, CREAR usuario CLIENT automáticamente
    if (!user) {
      const hashedPassword = await bcrypt.hash(Math.random().toString(36).slice(-8), 12); // password aleatorio
      user = await prisma.user.create({
        data: {
          name,
          email: email.toLowerCase(),
          password: hashedPassword,
          role: 'CLIENT',
          company,
          phone,
        },
      });
      logger.info(`Usuario CLIENT creado automáticamente desde contacto: ${email}`);
    }

    // 3️⃣ Crear el formulario de contacto vinculado al usuario
    const form = await prisma.contactForm.create({
      data: {
        name,
        company,
        email: email.toLowerCase(),
        phone,
        service,
        message,
        userId: user.id, // Vincular al usuario
        status: 'PENDING',
      },
    });

    logger.info(`Nuevo contacto de: ${email} (usuario: ${user.id})`);

    sendContactNotification({ name, company, email, phone, service, message }).catch(err => {
      logger.error(`Error enviando email de notificación de contacto: ${err.message}`);
    });

    res.status(201).json({
      message: 'Formulario enviado. Te contactaremos pronto.',
      id: form.id,
      userId: user.id,
      isNewUser: !user ? true : false
    });
  } catch (err) { next(err); }
};

const getContacts = async (req, res, next) => {
  try {
    if (req.user.role !== 'ADMIN' && req.user.role !== 'AGENT') {
      return res.status(403).json({ error: 'Sin permisos.' });
    }

    const { status, page = 1, limit = 20 } = req.query;
    const where = status ? { status } : {};

    // Si es AGENT, filtrar por tickets asignados (via contacto)
    if (req.user.role === 'AGENT') {
      // Los agentes ven los contactos que tienen tickets asignados
      const assignedTickets = await prisma.supportTicket.findMany({
        where: { assignedAgentId: req.user.userId },
        select: { userId: true }
      });
      const userIds = [...new Set(assignedTickets.map(t => t.userId))];
      if (userIds.length > 0) {
        where.userId = { in: userIds };
      } else {
        // Si no tiene tickets asignados, devolver vacío
        res.json({ contacts: [], total: 0, page: Number(page), totalPages: 0 });
        return;
      }
    }

    const [contacts, total] = await Promise.all([
      prisma.contactForm.findMany({
        where,
        include: {
          user: {
            select: { id: true, name: true, email: true, company: true, role: true, isActive: true }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit),
      }),
      prisma.contactForm.count({ where }),
    ]);

    res.json({ contacts, total, page: Number(page), totalPages: Math.ceil(total / Number(limit)) });
  } catch (err) { next(err); }
};

const updateContact = async (req, res, next) => {
  try {
    if (req.user.role !== 'ADMIN') return res.status(403).json({ error: 'Sin permisos.' });

    const { status, n8nProjectKey, createUser } = req.body;

    const contact = await prisma.contactForm.findUnique({ where: { id: req.params.id } });
    if (!contact) return res.status(404).json({ error: 'Contacto no encontrado.' });

    // Si se solicita crear usuario y el contacto no tiene userId
    let userId = contact.userId;
    if (createUser && !contact.userId) {
      const hashedPassword = await bcrypt.hash(Math.random().toString(36).slice(-8), 12);
      const user = await prisma.user.create({
        data: {
          name: contact.name,
          email: contact.email.toLowerCase(),
          password: hashedPassword,
          role: 'CLIENT',
          company: contact.company,
          phone: contact.phone,
          n8nProjectKey,
        },
      });
      userId = user.id;
      logger.info(`Usuario CLIENT creado desde contacto ${contact.id}: ${contact.email}`);
    }

    const data = {};
    if (status) data.status = status;
    if (userId !== undefined && userId !== contact.userId) data.userId = userId;

    const updated = await prisma.contactForm.update({
      where: { id: req.params.id },
      data,
      include: { user: true }
    });

    res.json(updated);
  } catch (err) { next(err); }
};

module.exports = { submitContact, getContacts, updateContact };
