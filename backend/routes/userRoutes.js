const express = require('express')
const { registerUser, loginUser, deleteUser, 
    updateUser, addProfilePhoto, restartAprove, 
    handleRecurso, becomeProducer, associateProducer  } = require('../controllers/userControllers.js')
const { protect, hasRole } = require('../middlewares/authMiddleware.js')
const { uploadProfilePhoto, uploadRelatory } = require('../middlewares/multer.js')

// incializa o router
const router = express.Router()

// rotas POST
router.post('/registrar', registerUser)
router.post('/entrar', loginUser)
router.post('/foto/:id', protect, uploadProfilePhoto.single("pathFoto"), addProfilePhoto)
router.post('/recurso/:id', protect, uploadRelatory.single("path"), handleRecurso)
router.post('/become-producer', hasRole('user'), becomeProducer)

// associação ter accesso de produtor
router.post('/associate-producer', hasRole(['produtor','presidente', 'secretario', 'conselho','tesoureiro']), associateProducer)

// rotas DELETE
router.delete('/:id', deleteUser)

// rotas PUT
router.put('/:id', protect, updateUser)

// Reinicar aprovação de usuário
router.put('/reset/:id', hasRole(['user','produtor']), restartAprove)


// exporta o router
module.exports = router