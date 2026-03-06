const router = require('express').Router();
const { submitContact, getContacts, updateContact } = require('../controllers/contact.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { body } = require('express-validator');
const { validate } = require('../middlewares/validate.middleware');

router.post('/', [body('name').notEmpty(), body('email').isEmail(), body('message').isLength({ min: 10 }), validate], submitContact);
router.get('/', authenticate, getContacts);
router.patch('/:id', authenticate, updateContact);

module.exports = router;
