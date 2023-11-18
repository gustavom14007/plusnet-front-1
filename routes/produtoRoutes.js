// routes/authRoutes.js

const express = require('express');
const router = express.Router();
const produtoController = require('../controllers/produtoController');
<<<<<<< HEAD
=======

>>>>>>> 5ce56d2f5560747810f8b7f9162084e17a54b9f2

// Rotas para Produtos
router.post('/produtos', produtoController.cadastrarProduto);
router.get('/produtos', produtoController.listarProdutos);
router.get('/produtos/:produtoID', produtoController.obterProdutoPorId);
router.put('/produtos/:produtoID', produtoController.atualizarProdutoPorId);
router.delete('/produtos/:produtoID', produtoController.deletarProdutoPorId);

module.exports = router;
