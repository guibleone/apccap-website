const express = require('express')
const { getUsers, registerUser, loginUser, deleteUser, updateUser, addProfilePhoto } = require('../controllers/userControllers.js')
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

// exporta o router
module.exports = router