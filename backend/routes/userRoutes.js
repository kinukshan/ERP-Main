const express = require('express');
const router = express.Router();
const { getUsers } = require('../controllers/userController');
const { protect, ownerOnly } = require('../middleware/auth');

router.route('/')
    .get(protect, ownerOnly, getUsers);

module.exports = router;
