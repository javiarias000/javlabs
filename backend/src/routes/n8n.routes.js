const router  = require('express').Router();
const axios   = require('axios');
const { authenticate } = require('../middlewares/auth.middleware');

router.use(authenticate);

const n8n = axios.create({
  baseURL: process.env.N8N_URL + '/api/v1',
  headers: { 'X-N8N-API-KEY': process.env.N8N_API_KEY },
});

// GET /api/n8n/workflows — listar workflows
router.get('/workflows', async (req, res, next) => {
  try {
    const { data } = await n8n.get('/workflows');
    res.json(data);
  } catch (err) { next(err); }
});

// GET /api/n8n/workflows/:id — detalle
router.get('/workflows/:id', async (req, res, next) => {
  try {
    const { data } = await n8n.get(`/workflows/${req.params.id}`);
    res.json(data);
  } catch (err) { next(err); }
});

// POST /api/n8n/workflows — crear workflow
router.post('/workflows', async (req, res, next) => {
  try {
    const { data } = await n8n.post('/workflows', req.body);
    res.status(201).json(data);
  } catch (err) { next(err); }
});

// PATCH /api/n8n/workflows/:id/activate — activar
router.patch('/workflows/:id/activate', async (req, res, next) => {
  try {
    const { data } = await n8n.post(`/workflows/${req.params.id}/activate`);
    res.json(data);
  } catch (err) { next(err); }
});

// PATCH /api/n8n/workflows/:id/deactivate — desactivar
router.patch('/workflows/:id/deactivate', async (req, res, next) => {
  try {
    const { data } = await n8n.post(`/workflows/${req.params.id}/deactivate`);
    res.json(data);
  } catch (err) { next(err); }
});

module.exports = router;
