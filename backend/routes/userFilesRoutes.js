const express = require('express')
const { protect, hasRole } = require('../middlewares/authMiddleware.js');
const { uploadDoc, uploadRelatorys } = require('../middlewares/multer.js')
const { getDocuments, addDocument, downloadDocument, deleteDocument, getDocumentsAdmin } = require('../controllers/userFIlesController.js')

// incializa o router
const router = express.Router()

// rotas ADMIN
router.get('/admin', [protect, hasRole(['admin'])], getDocumentsAdmin)

// rotas GET
router.get('/', protect, getDocuments)
router.get('/baixar/:id', downloadDocument)

// rotas POST
router.post('/adicionar', hasRole('produtor_associado'), uploadRelatorys.array("files",4), addDocument)


// rotas DELETE
router.delete('/deletar/:id', deleteDocument)

// exporta o router
module.exports = router
