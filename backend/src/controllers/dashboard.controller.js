const prisma = require('../config/prisma');

const getDashboard = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const isAdmin = req.user.role === 'ADMIN';
    const whereUser = isAdmin ? {} : { userId };

    const [activeAutomations, totalProjects, recentActivities, projects] = await Promise.all([
      prisma.automation.count({ where: { status: 'ACTIVE', project: whereUser } }),
      prisma.project.count({ where: whereUser }),
      prisma.activity.findMany({
        where: { project: whereUser },
        orderBy: { createdAt: 'desc' },
        take: 10,
        include: { project: { select: { name: true } } },
      }),
      prisma.project.findMany({
        where: whereUser,
        include: { automations: true, _count: { select: { activities: true } } },
        orderBy: { updatedAt: 'desc' },
        take: 5,
      }),
    ]);

    const aggregates = await prisma.automation.aggregate({
      where: { project: whereUser },
      _sum: { tasksRun: true, timeSaved: true },
    });

    res.json({
      kpis: {
        activeAutomations,
        totalProjects,
        tasksRun: aggregates._sum.tasksRun || 0,
        timeSaved: aggregates._sum.timeSaved || 0,
      },
      recentProjects: projects,
      recentActivities,
    });
  } catch (err) { next(err); }
};

const getChartData = async (req, res, next) => {
  try {
    const isAdmin = req.user.role === 'ADMIN';
    const whereUser = isAdmin ? {} : { project: { userId: req.user.userId } };
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const activities = await prisma.activity.findMany({
      where: { ...whereUser, createdAt: { gte: thirtyDaysAgo } },
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

module.exports = { getDashboard, getChartData };
