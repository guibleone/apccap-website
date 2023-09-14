const express = require('express')
const router = express.Router()
const { hasRole } = require('../middlewares/authMiddleware.js')
const { createReunion, getReunions, finishReunion, addReunionAta } = require('../controllers/reunionControllers.js')
const { uploadRelatory } = require('../middlewares/multer.js');

// criar reunião
router.route('/').post(hasRole('presidente'), createReunion)

// listar reuniões por data
router.route('/').get(hasRole(['presidente','secretario']), getReunions)

// concluir reunião
router.route('/finish').post(hasRole('presidente'), finishReunion)

// adidionar ata de reunião
router.route('/add-ata/:id').post(hasRole('secretario'), uploadRelatory.single('ata'), addReunionAta)



module.exports = router