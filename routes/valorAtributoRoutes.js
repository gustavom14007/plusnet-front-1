// valorAtributoRoutes.js

const express = require('express');
const valorAtributoController = require('../controllers/valorAtributoController');

const router = express.Router();

router.post('/valorAtributo', valorAtributoController.cadastrarValorAtributo);
router.get('/valorAtributo', valorAtributoController.listarValoresAtributo);
router.put('/valorAtributo/:valorAtributoID', valorAtributoController.atualizarValorAtributoPorId);
router.delete('/valorAtributo/:valorAtributoID', valorAtributoController.deletarValorAtributoPorId);

module.exports = router;
