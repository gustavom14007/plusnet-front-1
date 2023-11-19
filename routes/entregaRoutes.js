// entregaRoutes.js

const express = require('express');
const entregaController = require('../controllers/entregaController');

const router = express.Router();

router.post('/entregas', entregaController.cadastrarEntrega);
router.get('/entregas', entregaController.listarEntregas);
router.put('/entregas/:entregaID', entregaController.atualizarEntrega);
router.delete('/entregas/:entregaID', entregaController.deletarEntrega);

module.exports = router;
