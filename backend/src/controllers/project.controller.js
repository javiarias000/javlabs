const prisma = require('../config/prisma');

const getProjects = async (req, res, next) => {
  try {
    const where = req.user.role === 'ADMIN' ? {} : { userId: req.user.userId };
    const projects = await prisma.project.findMany({
      where,
      include: { automations: { select: { id: true, name: true, status: true, tasksRun: true } }, _count: { select: { activities: true } } },
      orderBy: { createdAt: 'desc' },
    });
    res.json(projects);
  } catch (err) { next(err); }
};

const getProject = async (req, res, next) => {
  try {
    const project = await prisma.project.findFirst({
      where: { id: req.params.id, ...(req.user.role !== 'ADMIN' && { userId: req.user.userId }) },
      include: { automations: true, activities: { orderBy: { createdAt: 'desc' }, take: 20 }, user: { select: { name: true, email: true, company: true } } },
    });
    if (!project) return res.status(404).json({ error: 'Proyecto no encontrado.' });
    res.json(project);
  } catch (err) { next(err); }
};

const createProject = async (req, res, next) => {
  try {
    const { name, description, endDate, userId } = req.body;
    const assignedUserId = req.user.role === 'ADMIN' && userId ? userId : req.user.userId;
    const project = await prisma.project.create({
      data: { name, description, endDate: endDate ? new Date(endDate) : null, userId: assignedUserId },
    });
    await prisma.activity.create({ data: { description: `Proyecto "${name}" creado`, type: 'project_created', projectId: project.id } });
    res.status(201).json(project);
  } catch (err) { next(err); }
};

const updateProject = async (req, res, next) => {
  try {
    const { name, description, status, progress, endDate } = req.body;
    const project = await prisma.project.findFirst({
      where: { id: req.params.id, ...(req.user.role !== 'ADMIN' && { userId: req.user.userId }) },
    });
    if (!project) return res.status(404).json({ error: 'Proyecto no encontrado.' });
    const updated = await prisma.project.update({
      where: { id: req.params.id },
      data: { ...(name && { name }), ...(description !== undefined && { description }), ...(status && { status }), ...(progress !== undefined && { progress }), ...(endDate && { endDate: new Date(endDate) }) },
    });
    await prisma.activity.create({ data: { description: `Proyecto "${updated.name}" actualizado`, type: 'project_update', projectId: updated.id } });
    res.json(updated);
  } catch (err) { next(err); }
};

const deleteProject = async (req, res, next) => {
  try {
    if (req.user.role !== 'ADMIN') return res.status(403).json({ error: 'Sin permisos.' });
    await prisma.project.delete({ where: { id: req.params.id } });
    res.json({ message: 'Proyecto eliminado.' });
  } catch (err) { next(err); }
};

module.exports = { getProjects, getProject, createProject, updateProject, deleteProject };
