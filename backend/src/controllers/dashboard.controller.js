const prisma = require('../config/prisma');
const axios  = require('axios');

const n8n = axios.create({
  baseURL: process.env.N8N_URL + '/api/v1',
  headers: { 'X-N8N-API-KEY': process.env.N8N_API_KEY },
  timeout: 8000,
});

const getDashboard = async (req, res, next) => {
  try {
    const userId  = req.user.userId;
    const isAdmin = req.user.role === 'ADMIN';
    const whereUser = isAdmin ? {} : { userId };

    // DB queries
    const [activeAutomations, totalProjects, recentActivities, projects, aggregates] = await Promise.all([
      prisma.automation.count({ where: { status: 'ACTIVE', project: whereUser } }),
      prisma.project.count({ where: whereUser }),
      prisma.activity.findMany({
        where:   { project: whereUser },
        orderBy: { createdAt: 'desc' },
        take:    10,
        include: { project: { select: { name: true } } },
      }),
      prisma.project.findMany({
        where:   whereUser,
        include: { automations: true, _count: { select: { activities: true } } },
        orderBy: { updatedAt: 'desc' },
        take:    5,
      }),
      prisma.automation.aggregate({
        where: { project: whereUser },
        _sum:  { tasksRun: true, timeSaved: true },
      }),
    ]);

    // n8n data — no fallar si n8n no responde
    let n8nStats = null;
    try {
      const [execRes, wfRes] = await Promise.all([
        n8n.get('/executions?limit=100&includeData=false'),
        n8n.get('/workflows'),
      ]);
      const execs = execRes.data.data || execRes.data;
      const wfs   = wfRes.data.data   || wfRes.data;

      // Si es CLIENT filtrar por su proyecto
      let filteredExecs = execs;
      let filteredWfs   = wfs;
      if (!isAdmin && req.user.n8nProjectKey) {
        const PROJECT_RULES = [
          { key: 'dentilook',  keywords: ['dentilook', 'clinica', 'dental', 'cita', 'rag - carga', 'carga documentos', 'buscador de leads'] },
          { key: 'sama_shala', keywords: ['sama_shala', 'sama shala'] },
          { key: 'facturas',   keywords: ['factura', 'datos_facturas'] },
          { key: 'violin',     keywords: ['violin', 'clases_magistrales'] },
        ];
        const getKey = (name) => {
          const lower = name.toLowerCase();
          for (const rule of PROJECT_RULES) {
            if (rule.keywords.some(k => lower.includes(k))) return rule.key;
          }
          if (name.includes('_')) return name.split('_')[0].toLowerCase();
          return 'general';
        };
        filteredWfs   = wfs.filter(w => getKey(w.name) === req.user.n8nProjectKey);
        const wfIds   = filteredWfs.map(w => w.id);
        filteredExecs = execs.filter(e => wfIds.includes(e.workflowId));
      }

      const total   = filteredExecs.length;
      const success = filteredExecs.filter(e => e.status === 'success').length;
      const errors  = filteredExecs.filter(e => e.status === 'error').length;
      const active  = filteredWfs.filter(w => w.active).length;

      // Actividad por dia (ultimos 7 dias)
      const last7 = {};
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        last7[d.toISOString().split('T')[0]] = 0;
      }
      filteredExecs.forEach(e => {
        if (e.startedAt) {
          const d = e.startedAt.split('T')[0];
          if (last7[d] !== undefined) last7[d]++;
        }
      });

      n8nStats = {
        totalExecutions: total,
        successCount:    success,
        errorCount:      errors,
        activeWorkflows: active,
        totalWorkflows:  filteredWfs.length,
        successRate:     total > 0 ? Math.round((success / total) * 100) : 0,
        dailyActivity:   Object.entries(last7).map(([date, count]) => ({ date, count })),
        recentErrors:    filteredExecs.filter(e => e.status === 'error').slice(0, 5).map(e => ({
          id:           e.id,
          workflowId:   e.workflowId,
          workflowName: filteredWfs.find(w => w.id === e.workflowId)?.name || e.workflowId,
          startedAt:    e.startedAt,
        })),
      };
    } catch (n8nErr) {
      console.warn('n8n no disponible:', n8nErr.message);
    }

    res.json({
      kpis: {
        activeAutomations,
        totalProjects,
        tasksRun:  aggregates._sum.tasksRun  || 0,
        timeSaved: aggregates._sum.timeSaved || 0,
      },
      n8nStats,
      recentProjects:    projects,
      recentActivities,
    });
  } catch (err) { next(err); }
};

const getChartData = async (req, res, next) => {
  try {
    const isAdmin   = req.user.role === 'ADMIN';
    const whereUser = isAdmin ? {} : { project: { userId: req.user.userId } };
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const activities = await prisma.activity.findMany({
      where:   { ...whereUser, createdAt: { gte: thirtyDaysAgo } },
      orderBy: { createdAt: 'asc' },
    });

    const grouped = activities.reduce((acc, act) => {
      const date = act.createdAt.toISOString().split('T')[0];
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});

    res.json(Object.entries(grouped).map(([date, count]) => ({ date, count })));
  } catch (err) { next(err); }
};

const getAdminOverview = async (req, res, next) => {
  try {
    // Obtener todos los usuarios CLIENT activos con sus proyectos
    const clients = await prisma.user.findMany({
      where: { role: 'CLIENT', isActive: true },
      include: {
        projects: {
          include: {
            automations: true,
            _count: { select: { activities: true } }
          }
        }
      },
      orderBy: { createdAt: 'desc' },
    });

    // Calcular métricas por cliente
    const clientMetrics = clients.map(client => ({
      user: {
        id: client.id,
        name: client.name,
        email: client.email,
        company: client.company,
        n8nProjectKey: client.n8nProjectKey,
      },
      metrics: {
        projectCount: client.projects.length,
        activeProjects: client.projects.filter(p => ['ACTIVE','IN_PROGRESS'].includes(p.status)).length,
        automationCount: client.projects.reduce((sum, p) => sum + p.automations.length, 0),
        activeAutomations: client.projects.reduce((sum, p) => sum + p.automations.filter(a => a.status === 'ACTIVE').length, 0),
        totalTasksRun: client.projects.reduce((sum, p) => sum + p.automations.reduce((s, a) => s + (a.tasksRun || 0), 0), 0),
        totalTimeSaved: client.projects.reduce((sum, p) => sum + p.automations.reduce((s, a) => s + (a.timeSaved || 0), 0), 0),
        lastActivity: client.projects.length > 0
          ? new Date(Math.max(...client.projects.map(p => new Date(p.updatedAt)))).toISOString()
          : null,
      }
    }));

    // KPIs globales del sistema
    const globalKPIs = {
      totalClients: clients.length,
      totalProjects: clientMetrics.reduce((sum, cm) => sum + cm.metrics.projectCount, 0),
      activeProjects: clientMetrics.reduce((sum, cm) => sum + cm.metrics.activeProjects, 0),
      totalAutomations: clientMetrics.reduce((sum, cm) => sum + cm.metrics.automationCount, 0),
      activeAutomations: clientMetrics.reduce((sum, cm) => sum + cm.metrics.activeAutomations, 0),
    };

    res.json({ globalKPIs, clientMetrics });
  } catch (err) { next(err); }
};

module.exports = { getDashboard, getChartData, getAdminOverview };
