// marcaRoutes.js

const express = require('express');
const marcaController = require('../controllers/marcaController');

const router = express.Router();

router.post('/marcas', marcaController.cadastrarMarca);
router.get('/marcas', marcaController.listarMarcas);
router.put('/marcas/:marcaID', marcaController.atualizarMarcaPorId);
router.delete('/marcas/:marcaID', marcaController.deletarMarcaPorId);

module.exports = router;
