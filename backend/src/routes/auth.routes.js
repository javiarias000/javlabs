const router = require('express').Router();
const { register, login, refresh, logout, me } = require('../controllers/auth.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { body } = require('express-validator');
const { validate } = require('../middlewares/validate.middleware');

router.post('/register', [body('name').notEmpty(), body('email').isEmail(), body('password').isLength({ min: 8 }), validate], register);
router.post('/login', [body('email').isEmail(), body('password').notEmpty(), validate], login);
router.post('/refresh', refresh);
router.post('/logout', logout);
router.get('/me', authenticate, me);

module.exports = router;
