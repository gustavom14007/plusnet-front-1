// routes/authRoutes.js

const express = require('express');
const router = express.Router();
const produtoController = require('../controllers/produtoController');


// Rotas para Produtos
router.post('/produtos', produtoController.cadastrarProduto);
router.get('/produtos', produtoController.listarProdutos);
router.get('/produtos/:produtoID', produtoController.obterProdutoPorId);
router.put('/produtos/:produtoID', produtoController.atualizarProdutoPorId);
router.delete('/produtos/:produtoID', produtoController.deletarProdutoPorId);

module.exports = router;
