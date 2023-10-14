const express = require('express')
const router = express.Router()
const { hasRole } = require('../middlewares/authMiddleware.js')
const { createReunion, getReunions, finishReunion, addReunionAta, deleteReunion, deleteReunionAta, signAta, presenceList, getOneReunion, handleVotos, getReunionAtas } = require('../controllers/reunionControllers.js')
const { uploadRelatory } = require('../middlewares/multer.js');

//pegar atas de reuniões
router.get('/atas', getReunionAtas)

// criar reunião
router.route('/').post(hasRole('presidente'), uploadRelatory.single('pdfInstance'), createReunion)

// listar reuniões por data
router.route('/').get(hasRole(['presidente', 'secretario', 'tesoureiro', 'conselho']), getReunions)

// concluir reunião
router.route('/finish').post(hasRole('presidente'), finishReunion)

// adidionar ata de reunião
router.route('/add-ata/:id').post(hasRole('secretario'), uploadRelatory.single('ata'), addReunionAta)

// deletar ata de reunião
router.route('/delete-ata/:id').post(hasRole('secretario'), deleteReunionAta)

// assinar ata
router.post('/sign-ata', signAta)

// deletar reunião
router.route('/:id').delete(hasRole('presidente'), deleteReunion)

// lista de presença
router.post('/presence/:id', presenceList)

//pegar única reunião
router.get('/single/:id', hasRole(['presidente', 'secretario', 'tesoureiro', 'conselho', 'produtor_associado', 'produtor']), getOneReunion)

// sistema de votação
router.post('/votos/:id', hasRole(['presidente', 'secretario', 'tesoureiro', 'conselho', 'produtor_associado', 'produtor']), handleVotos)

module.exports = router