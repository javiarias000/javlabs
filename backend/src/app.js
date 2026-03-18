const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const path = require('path');

const authRoutes       = require('./routes/auth.routes');
const userRoutes       = require('./routes/user.routes');
const projectRoutes    = require('./routes/project.routes');
const automationRoutes = require('./routes/automation.routes');
const contactRoutes    = require('./routes/contact.routes');
const dashboardRoutes  = require('./routes/dashboard.routes');
const webhookRoutes    = require('./routes/webhook.routes');
const { errorHandler } = require('./middlewares/error.middleware');

const app = express();

// 🔹 Seguridad y logging
app.use(helmet());
app.use(morgan('dev'));

// 🔹 CORS
app.use(cors({
  origin: [
    process.env.FRONTEND_URL // Dominio de frontend en producción
  ].filter(Boolean),
  credentials: true,
}));

// 🔹 Rate limit
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 10 });
app.use('/api/', limiter);
app.use('/api/auth', authLimiter);

// 🔹 Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// 🔹 Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'JAV LABS API', timestamp: new Date() });
});

// 🔹 Rutas API
app.use('/api/auth',        authRoutes);
app.use('/api/users',       userRoutes);
app.use('/api/projects',    projectRoutes);
app.use('/api/n8n',         require('./routes/n8n.routes'));
app.use('/api/automations', automationRoutes);
app.use('/api/contact',     contactRoutes);
app.use('/api/dashboard',   dashboardRoutes);
app.use('/api/webhooks',    webhookRoutes);

// 🔹 Servir frontend compilado
app.use(express.static(path.join(__dirname, '../../dist')));

// 🔹 Servir favicon
app.get('/favicon.ico', (req, res) => {
  res.sendFile(path.join(__dirname, '../../dist/favicon.ico'));
});

// 🔹 SPA fallback (todas las rutas no API)
app.get('*', (req, res) => {
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(__dirname, '../../dist/index.html'));
  }
});

// 🔹 Error 404 API
app.use((req, res) => res.status(404).json({ error: 'Ruta no encontrada' }));
app.use(errorHandler);

module.exports = app;