const asyncHandler = require('express-async-handler');
const Product = require('../models/productModel.js');
const User = require('../models/userModel.js');
const Resume = require('../models/userResumeModel.js');
const { ref, getDownloadURL, uploadBytesResumable } = require("firebase/storage");
const { storage } = require('../db/firebase.js')

// pegar produtos
const getProducts = asyncHandler(async (req, res) => {

    const user = req.user._id

    if (!user) {
        res.status(401)
        throw new Error('Não autorizado. Sem token')
    }

    const products = await Product.find({ producer: user })

    res.status(200).json(products);
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
    const usuario = await User.findById(req.user._id)

    if (!name || !selo) {
        res.status(404)
        throw new Error('Insira os dados corretamente')
    }

    const user = req.user._id

    const isSelo = await Product.findOne({ selo })

    if (isSelo) {
        res.status(404)
        throw new Error('Selo já cadastrado')
    }

    usuario.selos.remove(selo)
    await usuario.save()

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
    console.log(req.body)

    if (product) {
        await product.deleteOne()

        res.json({ id: product._id })
    } else {
        res.status(404)
        throw new Error('Produto não encontrado')
    }
})

// pegar dados do usuário
const getProducer = asyncHandler(async (req, res) => {
    try {
        const producer = await User.findById(req.params.id)

        if (!producer) {
            res.status(404)
            throw new Error('Produtor não encontrado')
        }

        res.status(200).json(producer)


    } catch (error) {
        res.status(404)
        throw new Error('Produtor não encontrado')
    }
})

// pegar resumo do produtor
const getProducerResume = asyncHandler(async (req, res) => {
    try {
        const resume = await Resume.find({ user: req.params.id })

        if (!resume) {
            res.status(404)
            throw new Error('Resumo não encontrado')
        }

        res.status(200).json(resume)

    } catch (error) {
        res.status(404)
        throw new Error('Resumo não encontrado')
    }
})

// pegar selos 
const getSelos = asyncHandler(async (req, res) => {

    const user = await User.findById(req.params.id)

    if (!user) {
        res.status(404)
        throw new Error('Usuário não encontrado')
    }

    res.status(201).json(user.selos.sort())
})

// adicionar selo 
const addSelo = asyncHandler(async (req, res) => {

    const {quantity} = req.body

    const user = await User.findById(req.params.id)
    const producers = await User.find({ role: 'produtor' }).count()
    const sequence_value = user.sequence_value

    const products = await Product.find({ producer: user._id })

    let lastSelo = user.selos.sort().reverse()[0]

    if((products.length > 0 && !lastSelo) || (products.length > 0 && lastSelo < products.sort((a, b) => b.selo - a.selo)[0].selo)){
        lastSelo = products.sort((a, b) => b.selo - a.selo)[0].selo
    }

    if (user.selos.length >= producers * 1000) {
        res.status(400)
        throw new Error('Limite de selos atingido')
    }

    if(!quantity){
        res.status(400)
        throw new Error('Informe uma quantidade válida')
    }

    if (quantity) {
        const selos = generateSelos(sequence_value, quantity, lastSelo)

        selos.forEach(selo => {
            if (user.selos.includes(selo)) {
                res.status(400)
                throw new Error('Selo já cadastrado')
            }

            if(products.find(product => product.selo === selo)){
                res.status(400)
                throw new Error('Selo já cadastrado')
            }

            user.selos.push(selo)
        })

        await user.save()

        res.status(201).json(selos)
    }

})


const generateSelos = (sequence_value, quantity, lastSelo) => {

    if (!quantity) {
        res.status(400)
        throw new Error('Informe uma quantidade válida')
    }

    const selos = []

    const firstPart = (sequence_value).toString().padStart(3, "0")

    for (let i = 0; i < quantity; i++) {

        if(lastSelo){
            const selo = `${firstPart}` + `${(parseInt(lastSelo.slice(-4)) + i + 1).toString().padStart(5, "0")}`
            selos.push(selo)
            continue
        }

        const selo = `${firstPart}` + `${(i+1).toString().padStart(5, "0")}`
        selos.push(selo)
    }

    return selos
}

module.exports =
{
    getProducts,
    addProduct,
    deleteProduct,
    getSingleProduct,
    updateProduct,
    addPhoto,
    trackProduct,
    getProducer,
    getProducerResume,
    getSelos,
    addSelo,
    generateSelos
}