// grupoProdutoRoutes.js

const express = require('express');
const grupoProdutoController = require('../controllers/grupoProdutoController');

const router = express.Router();

router.post('/grupoProduto', grupoProdutoController.criarRelacaoGrupoProduto);
router.get('/grupoProduto', grupoProdutoController.listarRelacoesGrupoProduto);
router.delete('/grupoProduto/:idGrupo/:idProduto', grupoProdutoController.deletarRelacaoGrupoProduto);
router.put('/grupoProduto/:idGrupo/:idProduto', grupoProdutoController.atualizarRelacaoGrupoProduto);

module.exports = router;
