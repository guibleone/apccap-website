const express = require('express');
const { hasRole } = require('../middlewares/authMiddleware');
const { getProducts, addProduct, deleteProduct, getSingleProduct, updateProduct, addPhoto, 
    trackProduct, getProducer, getProducerResume, 
    getSelos, addSelo, addSelosPayed, 
    addRelatorysProducts, deleteRelatorysProducts,
    approveProductRelatory, repproveProductRelatory} = require('../controllers/productsControllers');
const { uploadProduct, uploadSelo, uploadRelatorys, uploadRelatory, } = require('../middlewares/multer');


const router = express.Router();

// pegar produtor 
router.get('/produtor/:id', getProducer)
router.get('/produtor/resume/:id', getProducerResume)

// rotas selos
router.get('/selo/:id',hasRole(['produtor','produtor_associado']), getSelos)
router.post('/selo/:id', uploadSelo.single("pathRelatory"),  hasRole(['produtor','produtor_associado']), addSelo)

// pegar produtos
router.get('/', hasRole(['produtor','produtor_associado','conselho']), getProducts) 

// pegar único produto
router.get('/:id', hasRole(['produtor','produtor_associado','conselho']), getSingleProduct)

// adicionar produtos
router.post('/', uploadRelatorys.array('files', 10), hasRole(['produtor','produtor_associado']), addProduct)

// deletar produtos
router.delete('/:id', hasRole(['produtor','produtor_associado']), deleteProduct)

// atualizar produtos
router.put('/:id', hasRole(['produtor','produtor_associado']), updateProduct)

// adicionar foto
router.post('/foto/:id', hasRole(['produtor','produtor_associado']), uploadProduct.single("path"), addPhoto)

// rastrear produto
router.post('/rastrear', trackProduct)

// adicionar selos pagos
router.post('/selo-pago', addSelosPayed)

router.post('/add-product-relatorys/:id', uploadRelatory.single('path'), hasRole('conselho'), addRelatorysProducts)
router.post('/delete-product-relatorys/:id', hasRole('conselho'), deleteRelatorysProducts)
router.post('/approve-product-relatorys/:id', hasRole('conselho'), approveProductRelatory)
router.post('/repprove-product-relatorys/:id', hasRole('conselho'), repproveProductRelatory)


module.exports = router;