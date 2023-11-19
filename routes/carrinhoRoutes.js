// carrinhoRoutes.js

const express = require('express');
const carrinhoController = require('../controllers/carrinhoController');

const router = express.Router();

router.post('/carrinhos', carrinhoController.cadastrarCarrinho);
router.get('/carrinhos', carrinhoController.listarCarrinhos);
router.put('/carrinhos/:carrinhoID', carrinhoController.atualizarCarrinhoPorId);
router.delete('/carrinhos/:carrinhoID', carrinhoController.deletarCarrinhoPorId);

module.exports = router;
