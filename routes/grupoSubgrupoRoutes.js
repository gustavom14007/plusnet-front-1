// grupoSubgrupoRoutes.js

const express = require('express');
const grupoSubgrupoController = require('../controllers/grupoSubgrupoController');

const router = express.Router();

router.post('/grupoSubgrupo', grupoSubgrupoController.criarRelacionamentoGrupoSubgrupo);
router.get('/grupoSubgrupo', grupoSubgrupoController.listarRelacionamentosGrupoSubgrupo);
router.delete('/grupoSubgrupo/:idGrupo/:idSubgrupo', grupoSubgrupoController.deletarRelacionamentoGrupoSubgrupo);
router.put('/grupoSubgrupo/:idGrupo/:idSubgrupo', grupoSubgrupoController.atualizarRelacionamentoGrupoSubgrupo);

module.exports = router;
