const express = require('express');
const router = express.Router();
const { hasRole } = require('../middlewares/authMiddleware.js');
const { getUserData, getUserDocuments, getUserResume, deleteUser, alterRole, getUsers, aproveUser, getPayment, sendRelatory } = require('../controllers/adminControllers.js');

// Pegar todos os usuários
router.get('/', hasRole(['admin','secretario']), getUsers);

// Pegar dados do usuário
router.get('/user/:id', hasRole(['admin','secretario']), getUserData);

// Pegar documentos do usuário
router.get('/documents/:id', hasRole(['admin','secretario']), getUserDocuments);

// Pegar resumo do usuário
router.get('/resume/:id', hasRole(['admin','secretario']), getUserResume)

// Deletar usário
router.delete('/user/:id', hasRole(['admin','secretario']), deleteUser)

// Alterar nível de acesso do usuário
router.put('/user/:id', hasRole('admin'), alterRole)

// Aprovar usuário
router.put('/user/aprove/:id', hasRole(['admin','secretario']), aproveUser)

// receber pagamento de selos
router.post('/payment', getPayment)

// PARTE DO SECRETÁRIO
router.post('/relatory/:id', hasRole('secretario'), sendRelatory)

module.exports = router;