const router = require('express').Router();
const { getDashboard, getChartData } = require('../controllers/dashboard.controller');
const { authenticate } = require('../middlewares/auth.middleware');

router.get('/', authenticate, getDashboard);
router.get('/chart', authenticate, getChartData);

module.exports = router;
