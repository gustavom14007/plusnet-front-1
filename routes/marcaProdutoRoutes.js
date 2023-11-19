// marcaProdutoRoutes.js

const express = require('express');
const marcaProdutoController = require('../controllers/marcaProdutoController');

const router = express.Router();

router.post('/marcaProduto', marcaProdutoController.criarRelacaoMarcaProduto);
router.get('/marcaProduto', marcaProdutoController.listarRelacoesMarcaProduto);
router.delete('/marcaProduto/:idMarca/:idProduto', marcaProdutoController.deletarRelacaoMarcaProduto);
router.put('/marcaProduto/:idMarca/:idProduto', marcaProdutoController.atualizarRelacaoMarcaProduto);

module.exports = router;
