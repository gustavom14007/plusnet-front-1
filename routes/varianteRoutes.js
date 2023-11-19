// varianteRoutes.js

const express = require('express');
const varianteController = require('../controllers/varianteController');

const router = express.Router();

router.post('/variantes', varianteController.cadastrarVariante);
router.get('/variantes', varianteController.listarVariantes);
router.put('/variantes/:varianteID', varianteController.atualizarVariantePorId);
router.delete('/variantes/:varianteID', varianteController.deletarVariantePorId);

module.exports = router;
