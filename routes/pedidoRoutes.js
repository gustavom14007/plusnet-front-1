// pedidoRoutes.js

const express = require('express');
const pedidoController = require('../controllers/pedidoController');

const router = express.Router();

router.post('/pedidos', pedidoController.criarPedido);
router.get('/pedidos', pedidoController.listarPedidos);
router.put('/pedidos/:pedidoID', pedidoController.atualizarPedido);
router.delete('/pedidos/:pedidoID', pedidoController.deletarPedido);

module.exports = router;
