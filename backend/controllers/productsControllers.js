const asyncHandler = require('express-async-handler');
const Product = require('../models/productModel.js');
const fs = require('fs')
const { ref, getDownloadURL, uploadBytesResumable } = require("firebase/storage");
const {storage} = require('../db/firebase.js')


// pegar produtos
const getProducts = asyncHandler(async (req, res) => {

    const user = req.user._id

    if (!user) {
        res.status(401)
        throw new Error('Não autorizado. Sem token')
    }

    const products = await Product.find({ producer: user })

    res.json(products);
}
)

// pegar unico produto
const getSingleProduct = asyncHandler(async (req, res) => {

    const product = await Product.findById(req.params.id)

    if (!product) {
        res.status(404)
        throw new Error('Produto não encontrado')
    }

    res.status(200).json(product)
})

// adicionar produtos
const addProduct = asyncHandler(async (req, res) => {

    const { name, selo, description } = req.body

    const user = req.user._id

    const isSelo = await Product.findOne({ selo })

    if (isSelo) {
        res.status(404)
        throw new Error('Selo já cadastrado')
    }
    const product = await Product.create({
        name,
        selo,
        description,
        producer: user
    })

    if (product) {
        res.status(201).json({
            _id: product._id,
            name: product.name,
            selo: product.selo,
            description: product.description,
            producer: product.producer
        })
    } else {
        res.status(400)
        throw new Error('Dados inválidos')
    }
})

// atualizar produto
const updateProduct = asyncHandler(async (req, res) => {

    const { name, selo, description } = req.body

    const user = req.user._id

    const product = await Product.findById(req.params.id)

    if (product) {
        product.name = name
        product.selo = selo
        product.producer = user
        product.description = description

        const updatedProduct = await product.save()

        res.json({
            _id: updatedProduct._id,
            name: updatedProduct.name,
            selo: updatedProduct.selo,
            description: updatedProduct.description,
            producer: updatedProduct.producer,
            path: updatedProduct.path
        })

    } else {
        res.status(404)
        throw new Error('Produto não encontrado')
    }
})

// adicionar foto
const addPhoto = asyncHandler(async (req, res) => {

    const product = await Product.findById(req.params.id)
    const user = req.user._id

    if (product) {

        if (!req.file) {
            res.status(404)
            throw new Error('Formato de Arquivo Inválido')
        }

        const refStorage = ref(storage, `productsPhotos/${user}/${product.name}.jpg`)

        const metadata = {
            contentType: 'image/jpeg',
        }

        const snapshot = await uploadBytesResumable(refStorage, req.file.buffer, metadata);

        const url = await getDownloadURL(snapshot.ref);

        product.path = url

        const updatedProduct = await product.save()

        res.json({
            _id: updatedProduct._id,
            name: updatedProduct.name,
            selo: updatedProduct.selo,
            description: updatedProduct.description,
            producer: updatedProduct.producer,
            path: updatedProduct.path
        })

    } else {
        res.status(404)
        throw new Error('Produto não encontrado')
    }
})


// rasteeio de produto
const trackProduct = asyncHandler(async (req, res) => {
    const { selo } = req.body

    if (!selo) {
        res.status(404)
        throw new Error('Selo inválido')
    }

    const product = await Product.findOne({ selo })

    if (!product) {
        res.status(404)
        throw new Error('Produto não encontrado')
    }

    res.status(200).json(product)
})



// deletar produtos
const deleteProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id)

    if (product) {

        await product.deleteOne()

        if (product.path) {
            await unlinkAsync(product.path)
        }

        res.json({ id: product._id })
    } else {
        res.status(404)
        throw new Error('Produto não encontrado')
    }
})

module.exports = { getProducts, addProduct, deleteProduct, getSingleProduct, updateProduct, addPhoto, trackProduct }