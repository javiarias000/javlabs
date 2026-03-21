const router = require('express').Router();
const { getProjects, getProject, createProject, updateProject, deleteProject } = require('../controllers/project.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { body } = require('express-validator');
const { validate } = require('../middlewares/validate.middleware');

router.use(authenticate);
router.get('/', getProjects);
router.get('/:id', getProject);

// ✅ VALIDATION ADDED - Create Project
router.post('/', [
  body('name').notEmpty().withMessage('Project name is required'),
  body('description').optional().isLength({ max: 2000 }).withMessage('Description too long (max 2000 chars)'),
  body('projectKey').optional().matches(/^[a-z0-9_]+$/).withMessage('Invalid project key format (a-z,0-9,_ only)'),
  validate,
], createProject);

// ✅ VALIDATION ADDED - Update Project
router.patch('/:id', [
  body('name').optional().notEmpty().withMessage('Name cannot be empty'),
  body('description').optional().isLength({ max: 2000 }).withMessage('Description too long (max 2000 chars)'),
  validate,
], updateProject);

router.delete('/:id', deleteProject);

module.exports = router;
