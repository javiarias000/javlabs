const express = require('express');
const cors    = require('cors');
const helmet  = require('helmet');
const morgan  = require('morgan');
const rateLimit = require('express-rate-limit');
const path    = require('path');

// Passport — se carga solo si está instalado
let passport;
try { passport = require('./config/passport'); } catch (e) { /* no instalado aún */ }

// Swagger documentation
const { swaggerSpec, swaggerUi } = require('../docs/swagger');

const authRoutes       = require('./routes/auth.routes');
const userRoutes       = require('./routes/user.routes');
const projectRoutes    = require('./routes/project.routes');
const automationRoutes = require('./routes/automation.routes');
const contactRoutes    = require('./routes/contact.routes');
const dashboardRoutes  = require('./routes/dashboard.routes');
const webhookRoutes    = require('./routes/webhook.routes');
const supportRoutes    = require('./routes/support.routes');
const { errorHandler } = require('./middlewares/error.middleware');

const app = express();

// Trust proxy para que funcione correctamente detrás de EasyPanel/Nginx
// Esto permite que express-rate-limit use X-Forwarded-For correctamente
app.set('trust proxy', 1);

// 🔹 Seguridad y logging
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc:  ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      styleSrc:   ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://fonts.gstatic.com"],
      imgSrc:     ["'self'", "data:", "https:", "http:"],
      connectSrc: ["'self'", "https:", "http:"],
      fontSrc:    ["'self'", "https://fonts.googleapis.com", "https://fonts.gstatic.com"],
      workerSrc:  ["'self'", "blob:"],
    },
  },
  crossOriginEmbedderPolicy: false,
}));
app.use(morgan('dev'));

// 🔹 CORS — ✅ FIX: incluye localhost para desarrollo y n8n para webhooks
const allowedOrigins = [
  process.env.FRONTEND_URL,
  process.env.N8N_URL, // Permitir requests desde n8n (server-to-server)
  'http://localhost:5173',
  'http://localhost:5174', // Puerto actual del frontend en desarrollo
  'http://localhost:5175', // Puerto anterior
  'http://localhost:3000',
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // permite requests sin origin (Postman, mobile, etc.)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS bloqueado: ${origin}`));
    }
  },
  credentials: true,
}));

// Passport (sin sesión — usamos JWT)
if (passport) app.use(passport.initialize());

// 🔹 Rate limit - excluir endpoints públicos
const limiter     = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 20 });

// Aplicar rate limit a todo /api/ excepto endpoints públicos de soporte
app.use('/api/', (req, res, next) => {
  // Excluir endpoints públicos que no requieren autenticación
  const publicEndpoints = [
    '/api/support/tickets/', // /public y /webhook-n8n
  ];

  // Verificar si es un endpoint público
  const isPublicEndpoint = publicEndpoints.some(endpoint =>
    req.path.startsWith(endpoint) && (req.path.includes('/public') || req.path.includes('/webhook-n8n'))
  );

  if (isPublicEndpoint) {
    return next();
  }

  // Aplicar rate limiting al resto
  return limiter(req, res, next);
});

app.use('/api/auth', authLimiter);

// 🔹 Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// 🔹 Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'JAV LABS API', timestamp: new Date() });
});

// 🔹 Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get('/api-docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// 🔹 Rutas API
app.use('/api/auth',        authRoutes);
app.use('/api/users',       userRoutes);
app.use('/api/projects',    projectRoutes);
app.use('/api/n8n',         require('./routes/n8n.routes'));
app.use('/api/automations', automationRoutes);
app.use('/api/contact',     contactRoutes);
app.use('/api/dashboard',   dashboardRoutes);
app.use('/api/support',     supportRoutes.webhook); // Webhook sin autenticación
app.use('/api/support',     supportRoutes); // Rutas autenticadas
app.use('/api/webhooks',    webhookRoutes);

// 🔹 Servir frontend compilado
app.use(express.static(path.join(__dirname, '../../dist')));
app.get('/favicon.ico', (req, res) => {
  res.sendFile(path.join(__dirname, '../../dist/favicon.ico'));
});

// 🔹 SPA fallback
app.get('*', (req, res) => {
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(__dirname, '../../dist/index.html'));
  }
});

// 🔹 Errores
app.use((req, res) => res.status(404).json({ error: 'Ruta no encontrada' }));
app.use(errorHandler);

module.exports = app;