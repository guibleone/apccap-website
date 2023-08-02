const express = require('express');
const router = express.Router();
const { hasRole } = require('../middlewares/authMiddleware.js');
const { getUserData, getUserDocuments, getUserResume, deleteUser, alterRole, getUsers, aproveUser, getPayment, createPayment } = require('../controllers/adminControllers.js');


// Pegar todos os usuários
router.get('/', hasRole('admin'), getUsers);

// Pegar dados do usuário
router.get('/user/:id', hasRole('admin'), getUserData);

// Pegar documentos do usuário
router.get('/documents/:id', hasRole('admin'), getUserDocuments);

// Pegar resumo do usuário
router.get('/resume/:id', hasRole('admin'), getUserResume)

// Deletar usário
router.delete('/user/:id', hasRole('admin'), deleteUser)

// Alterar nível de acesso do usuário
router.put('/user/:id', hasRole('admin'), alterRole)

// Aprovar usuário
router.put('/user/aprove/:id', hasRole('admin'), aproveUser)

// receber pagamento de selos
router.post('/payment', getPayment)

module.exports = router;