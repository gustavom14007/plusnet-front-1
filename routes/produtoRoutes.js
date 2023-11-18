// routes/authRoutes.js

const express = require('express');
const router = express.Router();
const produtoController = require('../controllers/produtoController');
const verifyJWT = require('../middleware/authMiddleware');

// Rotas para Produtos
router.post('/produtos', verifyJWT, produtoController.cadastrarProduto);
router.get('/produtos', produtoController.listarProdutos);
router.get('/produtos/:produtoID', produtoController.obterProdutoPorId);
router.put('/produtos/:produtoID', verifyJWT, produtoController.atualizarProdutoPorId);
router.delete('/produtos/:produtoID', verifyJWT, produtoController.deletarProdutoPorId);

module.exports = router;
