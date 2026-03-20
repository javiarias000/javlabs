const router = require('express').Router();
const { register, login, refresh, logout, me, googleCallback } = require('../controllers/auth.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { body } = require('express-validator');
const { validate } = require('../middlewares/validate.middleware');

// ─── Email / Password ────────────────────────────────────────────
router.post('/register', [
  body('name').notEmpty().withMessage('Nombre requerido.'),
  body('email').isEmail().normalizeEmail(),
  body('password')
    .isLength({ min: 8 })
    .matches(/[A-Z]/)
    .matches(/[0-9]/),
  validate,
], register);

router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty(),
  validate,
], login);

router.post('/refresh', refresh);
router.post('/logout', logout);
router.get('/me', authenticate, me);

// ─── Google OAuth ────────────────────────────────────────────────
// Se inicializa solo si passport está disponible
try {
  const passport = require('passport');
  require('../config/passport'); // carga la strategy

  router.get('/google',
    passport.authenticate('google', { scope: ['profile', 'email'], session: false })
  );

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
  router.get('/google', (req, res) => {
    res.status(501).json({ error: 'Google OAuth no configurado aún.' });
  });
  router.get('/google/callback', (req, res) => {
    res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/login?error=google`);
  });
}

module.exports = router;