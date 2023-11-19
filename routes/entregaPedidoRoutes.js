// entregaPedidoRoutes.js

const express = require('express');
const entregaPedidoController = require('../controllers/entregaPedidoController');

const router = express.Router();

router.post('/entregaPedido', entregaPedidoController.criarRelacaoEntregaPedido);
router.get('/entregaPedido', entregaPedidoController.listarRelacoesEntregaPedido);
router.put('/entregaPedido/:idEntrega/:idPedido', entregaPedidoController.atualizarRelacaoEntregaPedido);
router.delete('/entregaPedido/:idEntrega/:idPedido', entregaPedidoController.deletarRelacaoEntregaPedido);

module.exports = router;
