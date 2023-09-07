const express = require('express');
const router = express.Router();
const { hasRole } = require('../middlewares/authMiddleware.js');
const { 
    getUserData, getUserDocuments, getUserResume,
    deleteUser, alterRole, getUsers, aproveUser,
    getPayment, disapproveUser, getProuducts, aproveSelos, 
    disaproveSelos, addRelatorys, deleteRelatorys, 
    approveRelatory, repproveRelatory, approveRecurso,
    repproveRecurso } = require('../controllers/adminControllers.js');

const { uploadRelatory } = require('../middlewares/multer.js');

// Pegar todos os usuários
router.get('/', hasRole(['admin', 'secretario', 'presidente', 'conselho']), getUsers);

// Pegar dados do usuário
router.get('/user/:id', hasRole(['admin', 'secretario', 'presidente', 'conselho']), getUserData);

// Pegar documentos do usuário
router.get('/documents/:id', hasRole(['admin', 'secretario', 'presidente', 'conselho']), getUserDocuments);

// Pegar resumo do usuário
router.get('/resume/:id', hasRole(['admin', 'secretario', 'presidente', 'conselho']), getUserResume)

// Deletar usário
router.delete('/user/:id', hasRole(['admin', 'secretario', 'presidente', 'conselho']), deleteUser)

// Alterar nível de acesso do usuário
router.put('/user/:id', hasRole('admin'), alterRole)

// Aprovar usuário
router.put('/user/aprove/:id', hasRole(['admin', 'presidente']), aproveUser)

// Desaprovar usuário
router.put('/user/disapprove/:id', hasRole(['admin', 'presidente']), disapproveUser)

// receber pagamento de selos
router.post('/payment', getPayment)

// PARTE DO SECRETÁRIO
router.post('/relatory-approve/:id', hasRole(['secretario', 'presidente']), approveRelatory)
router.post('/relatory-repprove/:id', hasRole(['secretario', 'presidente']), repproveRelatory)


// PARTE DO PRESIDENTE
router.get('/products/:id', hasRole('presidente'), getProuducts)
router.post('/aproveSelos/:id', hasRole('presidente'), aproveSelos)
router.post('/disaproveSelos/:id', hasRole('presidente'), disaproveSelos)

// PARTE DO CONSELHO
router.post('/add-relatorys/:id', uploadRelatory.single('path'), hasRole('conselho'), addRelatorys)
router.post('/delete-relatorys/:id', hasRole('conselho'), deleteRelatorys)
router.post('/recurso-approve/:id', hasRole('conselho'), approveRecurso)
router.post('/recurso-repprove/:id', hasRole('conselho'), repproveRecurso)

module.exports = router;