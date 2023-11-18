const express = require('express');
const router = express.Router();

const clienteController = require('../controllers/clienteController'); // Adicionado

// Rotas para Clientes
router.post('/clientes', clienteController.cadastrarCliente);
router.get('/clientes', clienteController.listarClientes);
router.put('/clientes/:clienteID', clienteController.atualizarClientePorId);
router.delete('/clientes/:clienteID', clienteController.deletarClientePorId);

module.exports = router;