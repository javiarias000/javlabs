const router = require('express').Router();
const { getProjects, getProject, createProject, updateProject, deleteProject } = require('../controllers/project.controller');
const { authenticate } = require('../middlewares/auth.middleware');

router.use(authenticate);
router.get('/', getProjects);
router.get('/:id', getProject);
router.post('/', createProject);
router.patch('/:id', updateProject);
router.delete('/:id', deleteProject);

module.exports = router;
