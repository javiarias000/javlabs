const router = require('express').Router();
const axios  = require('axios');
const prisma = require('../config/prisma');
const { authenticate } = require('../middlewares/auth.middleware');
const { query, body } = require('express-validator');
const { validate } = require('../middlewares/validate.middleware');

router.use(authenticate);

const n8n = axios.create({
  baseURL: process.env.N8N_URL + '/api/v1',
  headers: { 'X-N8N-API-KEY': process.env.N8N_API_KEY },
});

// GET /api/n8n/workflows - Listar workflows de n8n
router.get('/workflows', async (req, res, next) => {
  try {
    const { data } = await n8n.get('/workflows');
    res.json(data);
  } catch (err) { next(err); }
});

// GET /api/n8n/workflows/:id - Obtener workflow específico
router.get('/workflows/:id', async (req, res, next) => {
  try {
    const { data } = await n8n.get(`/workflows/${req.params.id}`);
    res.json(data);
  } catch (err) { next(err); }
});

// POST /api/n8n/workflows - Crear workflow en n8n
router.post('/workflows', [
  body('name').optional().notEmpty().withMessage('Workflow name required'),
  body('nodes').optional().isArray().withMessage('Nodes must be array'),
  body('connections').optional().isObject().withMessage('Connections must be object'),
  validate,
], async (req, res, next) => {
  try {
    const { data } = await n8n.post('/workflows', req.body);
    res.status(201).json(data);
  } catch (err) { next(err); }
});

// PATCH /api/n8n/workflows/:id/activate - Activar workflow
router.patch('/workflows/:id/activate', async (req, res, next) => {
  try {
    const { data } = await n8n.post(`/workflows/${req.params.id}/activate`);
    res.json(data);
  } catch (err) { next(err); }
});

// PATCH /api/n8n/workflows/:id/deactivate - Desactivar workflow
router.patch('/workflows/:id/deactivate', async (req, res, next) => {
  try {
    const { data } = await n8n.post(`/workflows/${req.params.id}/deactivate`);
    res.json(data);
  } catch (err) { next(err); }
});

// GET /api/n8n/projects - Listar proyectos n8n agrupados
router.get('/projects', async (req, res, next) => {
  try {
    const [wfRes, execRes] = await Promise.all([
      n8n.get('/workflows'),
      n8n.get('/executions?limit=100&includeData=false'),
    ]);

    const workflows  = wfRes.data.data  || wfRes.data;
    const executions = execRes.data.data || execRes.data;

    const PROJECT_RULES = [
      { key: 'dentilook',  keywords: ['dentilook', 'clinica', 'dental', 'cita', 'recordatorio citas', 'rag - carga', 'carga documentos', 'buscador de leads'] },
      { key: 'sama_shala', keywords: ['sama_shala', 'sama shala'] },
      { key: 'facturas',   keywords: ['factura', 'datos_facturas'] },
      { key: 'violin',     keywords: ['violin', 'clases_magistrales'] },
    ];

    const getProjectInfo = (name) => {
      const lower = name.toLowerCase();
      for (const rule of PROJECT_RULES) {
        if (rule.keywords.some(k => lower.includes(k))) {
          return { key: rule.key, name: rule.project };
        }
      }
      if (name.includes(' — ') || name.includes(' - ')) {
        const sep   = name.includes(' — ') ? ' — ' : ' - ';
        const parts = name.split(sep);
        if (parts.length > 1) {
          const proj = parts[0].trim().replace(/\p{Emoji}/gu, '').trim();
          return { key: proj.toLowerCase().replace(/\s+/g, '_'), name: proj };
        }
      }
      if (name.includes('_')) {
        const parts = name.split('_');
        const proj  = parts[0].replace(/_/g, ' ').trim();
        return { key: proj.toLowerCase().replace(/\s+/g, '_'), name: proj };
      }
      return { key: 'general', name: 'General' };
    };

    const projectMap = {};
    for (const wf of workflows) {
      const { key: projKey, name: projName } = getProjectInfo(wf.name);
      if (!projectMap[projName]) {
        projectMap[projName] = { key: projKey, name: projName, workflows: [], executions: 0, success: 0, errors: 0, active: 0 };
      }
      projectMap[projName].workflows.push({ id: wf.id, name: wf.name, active: wf.active });
      if (wf.active) projectMap[projName].active++;
    }

    for (const exec of executions) {
      for (const proj of Object.values(projectMap)) {
        if (proj.workflows.map(w => w.id).includes(exec.workflowId)) {
          proj.executions++;
          if (exec.status === 'success') proj.success++;
          if (exec.status === 'error')   proj.errors++;
        }
      }
    }

    const projects = Object.values(projectMap).map(p => ({
      ...p,
      successRate:    p.executions > 0 ? Math.round((p.success / p.executions) * 100) : 0,
      totalWorkflows: p.workflows.length,
      status:         p.active > 0 ? 'ACTIVE' : 'INACTIVE',
    })).sort((a, b) => b.executions - a.executions);

    res.json({ projects, total: projects.length });
  } catch (err) { next(err); }
});

// GET /api/n8n/executions - Listar ejecuciones de workflows
router.get('/executions', [
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be 1-100'),
  query('status').optional().isIn(['success', 'error', 'running', 'waiting']).withMessage('Invalid status'),
  query('workflowId').optional().isUUID().withMessage('Invalid workflowId'),
], async (req, res, next) => {
  try {
    const limit      = req.query.limit      || 20;
    const status     = req.query.status     || '';
    const workflowId = req.query.workflowId || '';
    let url = `/executions?limit=${limit}&includeData=false`;
    if (status)     url += `&status=${status}`;
    if (workflowId) url += `&workflowId=${workflowId}`;
    const { data } = await n8n.get(url);
    res.json(data);
  } catch (err) { next(err); }
});

// GET /api/n8n/stats - Estadísticas de n8n
router.get('/stats', async (req, res, next) => {
  try {
    const [execs, workflows] = await Promise.all([
      n8n.get('/executions?limit=100&includeData=false'),
      n8n.get('/workflows'),
    ]);
    const execData = execs.data.data     || execs.data;
    const wfData   = workflows.data.data || workflows.data;
    const total   = execData.length;
    const success = execData.filter(e => e.status === 'success').length;
    const errors  = execData.filter(e => e.status === 'error').length;
    const active  = wfData.filter(w => w.active).length;
    res.json({
      totalExecutions: total,
      successCount:    success,
      errorCount:      errors,
      successRate:     total > 0 ? Math.round((success / total) * 100) : 0,
      activeWorkflows: active,
      totalWorkflows:  wfData.length,
      recentExecutions: execData.slice(0, 10),
      workflows: wfData.map(w => ({ id: w.id, name: w.name, active: w.active })),
    });
  } catch (err) { next(err); }
});

// GET /api/n8n/projects/:key - Obtener detalles de proyecto n8n
router.get('/projects/:key', async (req, res, next) => {
  try {
    const key = req.params.key;
    const [wfRes, execRes, customName] = await Promise.all([
      n8n.get('/workflows'),
      n8n.get('/executions?limit=200&includeData=false'),
      prisma.n8nProject.findUnique({ where: { key } }).catch(() => null),
    ]);

    const workflows  = wfRes.data.data  || wfRes.data;
    const executions = execRes.data.data || execRes.data;

    const PROJECT_RULES = [
      { key: 'dentilook', keywords: ['dentilook', 'clinica', 'dental', 'cita', 'recordatorio citas', 'rag - carga', 'carga documentos', 'buscador de leads'] },
      { key: 'sama_shala', keywords: ['sama_shala', 'sama shala'] },
      { key: 'facturas',   keywords: ['factura', 'datos_facturas'] },
      { key: 'violin',     keywords: ['violin', 'clases_magistrales'] },
    ];

    const getKey = (name) => {
      const lower = name.toLowerCase();
      for (const rule of PROJECT_RULES) {
        if (rule.keywords.some(k => lower.includes(k))) return rule.key;
      }
      if (name.includes(' — ') || name.includes(' - ')) {
        const sep = name.includes(' — ') ? ' — ' : ' - ';
        const parts = name.split(sep);
        return parts[0].trim().toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
      }
      if (name.includes('_')) return name.split('_')[0].toLowerCase();
      return 'general';
    };

    const projectWorkflows = workflows.filter(w => getKey(w.name) === key);
    const wfIds = projectWorkflows.map(w => w.id);
    const projectExecs = executions.filter(e => wfIds.includes(e.workflowId));

    const total   = projectExecs.length;
    const success = projectExecs.filter(e => e.status === 'success').length;
    const errors  = projectExecs.filter(e => e.status === 'error').length;
    const running = projectExecs.filter(e => e.status === 'running').length;
    const active  = projectWorkflows.filter(w => w.active).length;

    const withTime = projectExecs.filter(e => e.startedAt && e.stoppedAt);
    const avgTime  = withTime.length > 0
      ? Math.round(withTime.reduce((s, e) => s + (new Date(e.stoppedAt) - new Date(e.startedAt)), 0) / withTime.length / 1000)
      : 0;

    const recentExecs = projectExecs.slice(0, 20).map(e => ({
      id:           e.id,
      status:       e.status,
      startedAt:    e.startedAt,
      stoppedAt:    e.stoppedAt,
      workflowId:   e.workflowId,
      workflowName: projectWorkflows.find(w => w.id === e.workflowId)?.name || e.workflowId,
    }));

    res.json({
      key,
      name:            customName?.name || key.replace(/_/g, ' '),
      description:     customName?.description || null,
      color:           customName?.color || null,
      workflows:       projectWorkflows.map(w => ({ id: w.id, name: w.name, active: w.active })),
      totalWorkflows:  projectWorkflows.length,
      activeWorkflows: active,
      stats: { total, success, errors, running, successRate: total > 0 ? Math.round((success / total) * 100) : 0, avgTimeSeconds: avgTime },
      recentExecutions: recentExecs,
    });
  } catch (err) { next(err); }
});

// PATCH /api/n8n/projects/:key - Actualizar configuración de proyecto n8n
router.patch('/projects/:key', [
  body('name').optional().notEmpty().isLength({ max: 200 }).withMessage('Name max 200 chars'),
  body('description').optional().isLength({ max: 1000 }).withMessage('Description max 1000 chars'),
  body('color').optional().matches(/^#[0-9A-Fa-f]{6}$/).withMessage('Color must be hex format #RRGGBB'),
  validate,
], async (req, res, next) => {
  try {
    const { name, description, color } = req.body;
    const project = await prisma.n8nProject.upsert({
      where:  { key: req.params.key },
      update: { ...(name && { name }), ...(description !== undefined && { description }), ...(color && { color }) },
      create: { key: req.params.key, name: name || req.params.key, description, color },
    });
    res.json(project);
  } catch (err) { next(err); }
});

module.exports = router;
