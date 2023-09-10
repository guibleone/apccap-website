const express = require('express');
const { hasRole } = require('../middlewares/authMiddleware');
const { getProducts, addProduct, deleteProduct, getSingleProduct, updateProduct, addPhoto, 
    trackProduct, getProducer, getProducerResume, 
    getSelos, addSelo, generateSelos, addSelosPayed, 
    addRelatorysProducts, deleteRelatorysProducts,
    approveProductRelatory} = require('../controllers/productsControllers');
const { uploadProduct, uploadSelo, uploadRelatorys, uploadRelatory, } = require('../middlewares/multer');


const router = express.Router();

// pegar produtor 
router.get('/produtor/:id', getProducer)
router.get('/produtor/resume/:id', getProducerResume)

// rotas selos
router.get('/selo/:id',hasRole('produtor'), getSelos)
router.post('/selo/:id', uploadSelo.single("pathRelatory"),  hasRole('produtor'), addSelo)

// pegar produtos
router.get('/', hasRole(['produtor','conselho']), getProducts) 

// pegar único produto
router.get('/:id', hasRole(['produtor','conselho']), getSingleProduct)

// adicionar produtos
router.post('/', uploadRelatorys.array('files'), hasRole('produtor'), addProduct)

// deletar produtos
router.delete('/:id', hasRole('produtor'), deleteProduct)

// atualizar produtos
router.put('/:id', hasRole('produtor'), updateProduct)

// adicionar foto
router.post('/foto/:id', hasRole('produtor'), uploadProduct.single("path"), addPhoto)

// rastrear produto
router.post('/rastrear', trackProduct)

// gerar selos
router.post('/selo-generate', generateSelos)

// adicionar selos pagos
router.post('/selo-pago', addSelosPayed)

router.post('/add-product-relatorys/:id', uploadRelatory.single('path'), hasRole('conselho'), addRelatorysProducts)
router.post('/delete-product-relatorys/:id', hasRole('conselho'), deleteRelatorysProducts)
router.post('/approve-product-relatorys/:id', hasRole('conselho'), approveProductRelatory)


module.exports = router;