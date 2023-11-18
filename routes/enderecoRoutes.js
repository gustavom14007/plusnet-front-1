const express = require('express');
const router = express.Router();

const enderecoController = require('../controllers/enderecoController'); // Adicionado


// Rotas para Endereços
router.post('/enderecos', enderecoController.cadastrarEndereco);
router.get('/enderecos', enderecoController.listarEnderecos);
router.put('/enderecos/:enderecoID', enderecoController.atualizarEnderecoPorId);
router.delete('/enderecos/:enderecoID', enderecoController.deletarEnderecoPorId);

module.exports = router;