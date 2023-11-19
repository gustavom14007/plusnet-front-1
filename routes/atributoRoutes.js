// atributoRoutes.js

const express = require('express');
const atributoController = require('../controllers/atributoController');

const router = express.Router();

router.post('/atributos', atributoController.cadastrarAtributo);
router.get('/atributos', atributoController.listarAtributos);
router.put('/atributos/:atributoID', atributoController.atualizarAtributoPorId);
router.delete('/atributos/:atributoID', atributoController.deletarAtributoPorId);

module.exports = router;
