const express = require('express')
const { registerUser, loginUser, deleteUser, updateUser, addProfilePhoto, restartAprove  } = require('../controllers/userControllers.js')
const { protect, hasRole } = require('../middlewares/authMiddleware.js')
const { uploadProfilePhoto } = require('../middlewares/multer.js')

// incializa o router
const router = express.Router()

// rotas POST
router.post('/registrar', registerUser)
router.post('/entrar', loginUser)
router.post('/foto/:id', protect, uploadProfilePhoto.single("pathFoto"), addProfilePhoto)


// rotas DELETE
router.delete('/:id', deleteUser)

// rotas PUT
router.put('/:id', protect, updateUser)

// Reinicar aprovação de usuário
router.put('/reset/:id', hasRole('user'), restartAprove)


// exporta o router
module.exports = router