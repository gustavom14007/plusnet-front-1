// enderecoClienteRoutes.js

const express = require('express');
const enderecoClienteController = require('../controllers/enderecoClienteController');

const router = express.Router();

router.post('/enderecoCliente', enderecoClienteController.relacionarClienteEndereco);
router.get('/enderecoCliente', enderecoClienteController.listarRelacoesClienteEndereco);
router.delete('/enderecoCliente/:idEndereco/:idCliente', enderecoClienteController.deletarRelacaoClienteEndereco);

module.exports = router;
