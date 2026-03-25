const router = require('express').Router();
const { register, login, refresh, logout, me, googleCallback } = require('../controllers/auth.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { body } = require('express-validator');
const { validate } = require('../middlewares/validate.middleware');

// ─── Email / Password ────────────────────────────────────────────

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Registro de nuevo usuario
 *     description: Crea una nueva cuenta de usuario con email y password
 *     tags: [Auth]
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: Juan Pérez
 *               email:
 *                 type: string
 *                 format: email
 *                 example: juan@empresa.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: MiPassword123
 *                 minLength: 8
 *                 description: Mínimo 8 caracteres, al menos una mayúscula y un número
 *               company:
 *                 type: string
 *                 example: Mi Empresa S.L.
 *               phone:
 *                 type: string
 *                 example: +34600000000
 *     responses:
 *       201:
 *         description: Usuario registrado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIs...
 *                 refreshToken:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIs...
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       409:
 *         description: Email ya registrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: EMAIL_EXISTS
 *                 message:
 *                   type: string
 *                   example: El email ya está registrado
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.post('/register', [
  body('name').notEmpty().withMessage('Nombre requerido.'),
  body('email').isEmail().normalizeEmail(),
  body('password')
    .isLength({ min: 8 })
    .matches(/[A-Z]/)
    .matches(/[0-9]/),
  validate,
], register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Inicio de sesión
 *     description: Autentica un usuario con email y password, devuelve tokens JWT
 *     tags: [Auth]
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: juan@empresa.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: MiPassword123
 *     responses:
 *       200:
 *         description: Login exitoso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIs...
 *                 refreshToken:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIs...
 *       401:
 *         description: Credenciales inválidas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: INVALID_CREDENTIALS
 *                 message:
 *                   type: string
 *                   example: Email o password incorrectos
 *       404:
 *         description: Usuario no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: USER_NOT_FOUND
 *                 message:
 *                   type: string
 *                   example: Usuario no existe
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty(),
  validate,
], login);

/**
 * @swagger
 * /auth/refresh:
 *   post:
 *     summary: Refresh token
 *     description: Obtiene un nuevo access token usando un refresh token válido
 *     tags: [Auth]
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 example: eyJhbGciOiJIUzI1NiIs...
 *     responses:
 *       200:
 *         description: Token renovado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIs...
 *                 refreshToken:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIs...
 *       401:
 *         description: Refresh token inválido o expirado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: INVALID_REFRESH_TOKEN
 *                 message:
 *                   type: string
 *                   example: Refresh token inválido o expirado
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.post('/refresh', refresh);
/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Cerrar sesión
 *     description: Invalida el refresh token del usuario actual (elimina de la base de datos)
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 example: eyJhbGciOiJIUzI1NiIs...
 *     responses:
 *       200:
 *         description: Logout exitoso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Sesión cerrada correctamente
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.post('/logout', logout);
/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Obtener perfil del usuario actual
 *     description: Devuelve la información del usuario autenticado
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Perfil del usuario
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         description: Usuario no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: USER_NOT_FOUND
 *                 message:
 *                   type: string
 *                   example: Usuario no encontrado
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get('/me', authenticate, me);

// ─── Google OAuth ────────────────────────────────────────────────
// Se inicializa solo si passport está disponible
try {
  const passport = require('passport');
  require('../config/passport'); // carga la strategy

  /**
   * @swagger
   * /auth/google:
   *   get:
   *     summary: Iniciar autenticación con Google
   *     description: Redirige al usuario a Google para autenticación OAuth 2.0
   *     tags: [Auth]
   *     produces:
   *       - text/html
   *     responses:
   *       302:
   *         description: Redirección a Google OAuth
   *         content:
   *           text/html:
   *             schema:
   *               type: string
   *               example: <html><head>Redirecting to Google...</head></html>
   *       501:
   *         description: Google OAuth no configurado
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *                   example: NOT_CONFIGURED
   *                 message:
   *                   type: string
   *                   example: Google OAuth no configurado aún.
   */
  router.get('/google',
    passport.authenticate('google', { scope: ['profile', 'email'], session: false })
  );

  /**
   * @swagger
   * /auth/google/callback:
   *   get:
   *     summary: Callback de Google OAuth
   *     description: Endpoint de callback después de la autenticación con Google. Crea/actualiza usuario y devuelve tokens JWT vía redirect
   *     tags: [Auth]
   *     parameters:
   *       - in: query
   *         name: code
   *         schema:
   *           type: string
   *         description: Código de autorización de Google
   *       - in: query
   *         name: state
   *         schema:
   *           type: string
   *         description: Estado para validación CSRF (opcional)
   *     produces:
   *       - text/html
   *     responses:
   *       302:
   *         description: Redirección al frontend con tokens en URL parameters
   *         content:
   *           text/html:
   *             schema:
   *               type: string
   *               example: <html><head>Redirecting...</head></html>
   *       401:
   *         description: Error de autenticación con Google
   *       500:
   *         description: Error interno del servidor
   */
  router.get('/google/callback',
    (req, res, next) => {
      passport.authenticate('google', { session: false }, (err, user, info) => {
        if (err) {
          console.error('GOOGLE AUTH ERROR:', err);
          return res.redirect(`${process.env.FRONTEND_URL}/login?error=google`);
        }
        if (!user) {
          console.error('GOOGLE AUTH NO USER:', info);
          return res.redirect(`${process.env.FRONTEND_URL}/login?error=google`);
        }
        req.user = user;
        next();
      })(req, res, next);
    },
    googleCallback
  );

} catch (e) {
  // passport no instalado aún — rutas de Google deshabilitadas temporalmente
  /**
   * @swagger
   * /auth/google:
   *   get:
   *     summary: Iniciar autenticación con Google (deshabilitado)
   *     description: Google OAuth no está configurado en este momento
   *     tags: [Auth]
   *     responses:
   *       501:
   *         description: Google OAuth no configurado
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *                   example: NOT_CONFIGURED
   *                 message:
   *                   type: string
   *                   example: Google OAuth no configurado aún.
   */
  router.get('/google', (req, res) => {
    res.status(501).json({ error: 'Google OAuth no configurado aún.' });
  });

  /**
   * @swagger
   * /auth/google/callback:
   *   get:
   *     summary: Callback de Google OAuth (deshabilitado)
   *     description: Google OAuth no está configurado - redirige al login con error
   *     tags: [Auth]
   *     responses:
   *       302:
   *         description: Redirección al frontend con error
   */
  router.get('/google/callback', (req, res) => {
    res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/login?error=google`);
  });
}

module.exports = router;