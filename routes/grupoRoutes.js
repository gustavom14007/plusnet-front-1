// grupoRoutes.js

const express = require('express');
const grupoController = require('../controllers/grupoController');

const router = express.Router();

router.post('/grupos', grupoController.cadastrarGrupo);
router.get('/grupos', grupoController.listarGrupos);
router.put('/grupos/:grupoID', grupoController.atualizarGrupoPorId);
router.delete('/grupos/:grupoID', grupoController.deletarGrupoPorId);

module.exports = router;
