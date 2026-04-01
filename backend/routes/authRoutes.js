const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');
const { protect, ownerOnly } = require('../middleware/auth');

router.post('/register', protect, ownerOnly, register);
router.post('/login', login);

module.exports = router;
