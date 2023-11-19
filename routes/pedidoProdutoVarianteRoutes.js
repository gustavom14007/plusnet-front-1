// pedidoProdutoVarianteRoutes.js

const express = require('express');
const pedidoProdutoVarianteController = require('../controllers/pedidoProdutoVarianteController');

const router = express.Router();

router.post('/pedidoProdutoVariante', pedidoProdutoVarianteController.relacionarProdutoVariantePedido);
router.get('/pedidoProdutoVariante', pedidoProdutoVarianteController.listarRelacoesProdutoVariantePedido);
router.put('/pedidoProdutoVariante/:idPedido/:idVariante', pedidoProdutoVarianteController.atualizarRelacaoProdutoVariantePedido);
router.delete('/pedidoProdutoVariante/:idPedido/:idVariante', pedidoProdutoVarianteController.deletarRelacaoProdutoVariantePedido);

module.exports = router;
