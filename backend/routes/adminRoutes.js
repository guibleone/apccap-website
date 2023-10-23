const express = require('express');
const router = express.Router();
const { hasRole } = require('../middlewares/authMiddleware.js');
const { 
    getUserData, getUserDocuments, getUserResume,
    deleteUser, alterRole, aproveUser,
    getPayment, disapproveUser, getProuducts, aproveSelos, 
    disaproveSelos, addRelatorys, deleteRelatorys, 
    approveRelatory, repproveRelatory, approveRecurso,
    repproveRecurso, getMembros, getProducers, getUsersData } = require('../controllers/adminControllers.js');

const { uploadRelatory } = require('../middlewares/multer.js');

// pegar produtores 
router.get('/produtores', getProducers)

// pegar usuários

router.get('/users', getUsersData)

// pegar membros da associação
router.get('/membros', getMembros)

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



// PARTE DO PRESIDENTE
router.get('/products/:id', hasRole(['presidente','conselho']), getProuducts)
router.post('/aproveSelos/:id', hasRole('presidente'), aproveSelos)
router.post('/disaproveSelos/:id', hasRole('presidente'), disaproveSelos)

// PARTE DO CONSELHO
router.post('/add-relatorys/:id', uploadRelatory.single('path'), hasRole('conselho'), addRelatorys)
router.post('/delete-relatorys/:id', hasRole('conselho'), deleteRelatorys)
router.post('/recurso-approve/:id', hasRole('conselho'), approveRecurso)
router.post('/recurso-repprove/:id', hasRole('conselho'), repproveRecurso)
router.post('/relatory-approve/:id', hasRole(['conselho', 'presidente']), approveRelatory)
router.post('/relatory-repprove/:id', hasRole(['conselho', 'presidente']), repproveRelatory)


module.exports = router;