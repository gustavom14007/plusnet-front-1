// routes/lojasRoutes.js
const express = require('express');
const router = express.Router();
const lojasController = require('../controllers/lojaController');
const verifyJWT = require('../middleware/authMiddleware');

// Rotas RESTful para lojas
router.post('/lojas', verifyJWT, lojasController.cadastrarLoja);
router.get('/lojas', lojasController.listarLojas);
router.get('/lojas/listarLojaPorId/:lojaID', lojasController.listarLojaPorId)
router.put('/lojas/:lojaID', verifyJWT, lojasController.atualizarLoja);
router.delete('/lojas/:lojaID', verifyJWT, lojasController.deletarLoja);

module.exports = router;