const express = require('express');
const { listarLeads, distribuirLeads, listarLeadsPorEscritorio } = require('../controllers/leadController');
const router = express.Router();

// Rota para listar todos os LEADS
router.get('/', listarLeads);

// Rota para distribuir LEADS em lotes conforme regra negocial
router.post('/distribuir', distribuirLeads);

// Rota para listar LEADS por escritório
router.get('/office/:office', listarLeadsPorEscritorio);

module.exports = router;
