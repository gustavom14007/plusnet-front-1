// carrinhoProdutoVarianteRoutes.js

const express = require('express');
const carrinhoProdutoVarianteController = require('../controllers/carrinhoProdutoVarianteController');

const router = express.Router();

router.post('/carrinhoProdutoVariante', carrinhoProdutoVarianteController.adicionarProdutoVarianteAoCarrinho);
router.get('/carrinhoProdutoVariante/:idCarrinho', carrinhoProdutoVarianteController.listarProdutosVariantesNoCarrinho);
router.put('/carrinhoProdutoVariante/:idProduto/:idCarrinho', carrinhoProdutoVarianteController.atualizarProdutoVarianteNoCarrinho);
router.delete('/carrinhoProdutoVariante/:idProduto/:idCarrinho', carrinhoProdutoVarianteController.deletarProdutoVarianteDoCarrinho);

module.exports = router;