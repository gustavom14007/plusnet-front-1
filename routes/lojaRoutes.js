// routes/lojasRoutes.js
const express = require('express');
const router = express.Router();
const lojasController = require('../controllers/lojaController');


// Rotas RESTful para lojas
router.post('/lojas', lojasController.cadastrarLoja);
router.get('/lojas', lojasController.listarLojas);
router.get('/lojas/listarLojaPorId/:lojaID', lojasController.listarLojaPorId)
router.put('/lojas/:lojaID', lojasController.atualizarLoja);
router.delete('/lojas/:lojaID', lojasController.deletarLoja);

module.exports = router;