// pedidoClienteRoutes.js

const express = require('express');
const pedidoClienteController = require('../controllers/pedidoClienteController');

const router = express.Router();

router.post('/pedidosCliente', pedidoClienteController.relacionarClienteAoPedido);
router.get('/pedidosCliente', pedidoClienteController.listarRegistrosPedidosCliente);
router.delete('/pedidosCliente/:idPedido/:idCliente', pedidoClienteController.deletarRegistroPedidosCliente);

module.exports = router;
