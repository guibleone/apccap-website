const express = require('express');
const { hasRole } = require('../middlewares/authMiddleware');
const { getProducts, addProduct, deleteProduct, getSingleProduct, updateProduct, addPhoto, trackProduct } = require('../controllers/productsControllers');
const { uploadProduct } = require('../middlewares/multer');


const router = express.Router();

// pegar produtos
router.get('/', hasRole('produtor'), getProducts) 

// pegar único produto
router.get('/:id', hasRole('produtor'), getSingleProduct)

// adcionar produtos
router.post('/', hasRole('produtor'), addProduct)

// deletar produtos
router.delete('/:id', hasRole('produtor'), deleteProduct)

// atualizar produtos
router.put('/:id', hasRole('produtor'), updateProduct)

// adicionar foto
router.post('/foto/:id', hasRole('produtor'), uploadProduct.single("path"), addPhoto)

// rastrear produto
router.post('/rastrear', trackProduct)


module.exports = router;