const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const authRoutes      = require('./routes/auth.routes');
const userRoutes      = require('./routes/user.routes');
const projectRoutes   = require('./routes/project.routes');
const automationRoutes = require('./routes/automation.routes');
const contactRoutes   = require('./routes/contact.routes');
const dashboardRoutes = require('./routes/dashboard.routes');
const webhookRoutes   = require('./routes/webhook.routes');
const { errorHandler } = require('./middlewares/error.middleware');

const app = express();

app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 10 });
app.use('/api/', limiter);
app.use('/api/auth', authLimiter);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'JAV LABS API', timestamp: new Date() });
});

app.use('/api/auth',        authRoutes);
app.use('/api/users',       userRoutes);
app.use('/api/projects',    projectRoutes);
app.use('/api/automations', automationRoutes);
app.use('/api/contact',     contactRoutes);
app.use('/api/dashboard',   dashboardRoutes);
app.use('/api/webhooks',    webhookRoutes);

app.use((req, res) => res.status(404).json({ error: 'Ruta no encontrada' }));
app.use(errorHandler);

module.exports = app;
