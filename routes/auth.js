

const express = require('express');

const authController = require('../controllers/auth');

const router = express.Router();

// /admin/add-product => GET
router.get('/login', authController.getLogin);

module.exports = router;