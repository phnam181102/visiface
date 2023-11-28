const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

router.get('/session', authController.checkAuth);

module.exports = router;
