const express = require('express');
const router = express.Router();
const produtoBuscaController = require('../controllers/produtoBuscaController');

// Rotas para Busca de Produtos
router.get('/buscarProdutos', produtoBuscaController.buscarProdutos);

// Rotas para Listar Produtos da Loja
router.get('/produtosDaLoja', produtoBuscaController.listarProdutosDaLoja);
router.get('/produtosDaLoja/:inicio/:fim', produtoBuscaController.listarProdutosDaLojaComIntervalo);


module.exports = router;