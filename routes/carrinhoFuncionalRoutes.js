// carrinhoFuncionalRoutes.js

const express = require('express');
const carrinhoFuncionalController = require('../controllers/carrinhoFuncionalController');

const router = express.Router();

router.post('/adicionarAoCarrinho', carrinhoFuncionalController.adicionarAoCarrinho);
router.post('/criarPedido', carrinhoFuncionalController.criarPedido);
router.get('/listarPedidosUsuario', carrinhoFuncionalController.listarPedidosUsuario);
router.get('/listarPedidos', carrinhoFuncionalController.listarPedidos);



module.exports = router;
