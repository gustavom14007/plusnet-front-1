// authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');



// Rota para criar uma conta
router.post('/registrar', authController.registrar);

// Rota para autenticação/login
router.post('/login', authController.login);






module.exports = router;
