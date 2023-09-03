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

// gerar selos

const generateSelos = ({ params }) => {

    const { sequence_value, quantity, startSelo, endSelo } = params

    const firstPart = (sequence_value).toString().padStart(3, "0")

    for (let i = 0; i < quantity; i++) {

        if (lastSelo) {
            const selo = `${firstPart}` + `${(parseInt(lastSelo.slice(-4)) + i + 1).toString().padStart(5, "0")}`
            selos.push(selo)
            continue
        }

        const selo = `${firstPart}` + `${(i + 1).toString().padStart(5, "0")}`
    }


    return selos
}

// adicionar produtos
const addProduct = asyncHandler(async (req, res) => {

    const { name, quantity, description } = req.body
    const user = await User.findById(req.user._id)


    if (user.selos.newQuantity < quantity) {
        res.status(400)
        throw new Error('Quantidade de selos insuficiente')
    }

    if (user.selos.status === 'analise' && user.selos.newQuantity < 1) {
        res.status(400)
        throw new Error('Seus selos estão em análise')
    }

    if (user.selos.status === 'pendente' && user.selos.newQuantity < 1) {
        res.status(400)
        throw new Error('Seus selos estão pendentes')
    }

    if (!name || !quantity || !description) {
        res.status(404)
        throw new Error('Insira os dados corretamente')
    }

    const product = await Product.create({
        name,
        description,
        startSelo: !user.selos.endSelo ? `${user.sequence_value.toString().padStart(3, "0")}` + `${(1).toString().padStart(5, "0")}` :
            `${user.selos.endSelo.slice(0, 3)}` + `${(parseInt(user.selos.endSelo.slice(-5)) + 1).toString().padStart(5, "0")}`,
        endSelo: !user.selos.endSelo ? `${user.sequence_value.toString().padStart(3, "0")}` + `${(quantity).toString().padStart(5, "0")}` :
            `${user.selos.endSelo.slice(0, 3)}` + `${(parseInt(user.selos.endSelo.slice(-5)) + parseInt(quantity)).toString().padStart(5, "0")}`,
        producer: user._id
    })

    if (product) {
        user.selos.newQuantity -= quantity
        user.selos.startSelo = product.startSelo
        user.selos.endSelo = product.endSelo
        await user.save()

        res.status(201).json(product)
    }

    else {
        res.status(400)
        throw new Error('Dados inválidos')
    }
})

// atualizar produto
const updateProduct = asyncHandler(async (req, res) => {

    const { name, description } = req.body

    const user = await User.findById(req.user._id)

    const product = await Product.findById(req.params.id)

    if (product) {
        product.name = name
        product.producer = user._id
        product.description = description

        const updatedProduct = await product.save()

        res.json(updatedProduct)

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

        res.json(updatedProduct)

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

    if (selo.slice(0, 3) === '000') {
        res.status(404)
        throw new Error('Selo inválido')
    }

    if (selo.slice(0, 8) > 99999999) {
        res.status(404)
        throw new Error('Selo inválido')
    }

    if (selo.length !== 8) {
        res.status(404)
        throw new Error('Selo inválido')
    }

    const firtsPart = selo.slice(0, 3)

    const user = await User.findOne({ sequence_value: firtsPart })

    if (!user) {
        res.status(404)
        throw new Error('Selo inválido')
    }

    const products = await Product.find({ producer: user._id })

    if (!products) {
        res.status(404)
        throw new Error('Selo inválido')
    }

    const product = products.find((product) => {
        if (product.startSelo <= selo && product.endSelo >= selo) {
            return product
        }
    })

    if (!product) {
        res.status(404)
        throw new Error('Selo inválido')
    }

    res.status(200).json(product)

})


// deletar produtos
const deleteProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id)

    if (product) {
        await product.deleteOne()

        res.json('Produto deletado com sucesso')
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

    res.status(201).json(user.selos)
})

// adicionar selo 
const addSelo = asyncHandler(async (req, res) => {

    const { quantity } = req.body

    const pathRelatory = req.file

    const user = await User.findById(req.params.id)

    if (!user) {
        res.status(404)
        throw new Error('Usuário não encontrado')
    }

    if (!quantity) {
        res.status(404)
        throw new Error('Insira a quantidade de selos')
    }

    if (!pathRelatory) {
        res.status(404)
        throw new Error('Insira o relatório')
    }

    if (user.selos.status === 'analise') {
        res.status(404)
        throw new Error('Aguarde a análise do seus selos')

    }

    if (user.selos.status === 'aprovado') {
        res.status(404)
        user.selos.status = 'analise'
    }

    if (user.selos.status === 'reprovado') {
        res.status(404)
        user.selos.status = 'analise'
    }

    if (user.selos.status === 'pendente') {
        res.status(404)
        throw new Error('Seus selos estão pendentes')
    }

    const refStorage = ref(storage, `realatóriosSelos/${user._id}/${pathRelatory.originalname}`)

    const metadata = {
        contentType: 'application/pdf'
    }

    const snapshot = await uploadBytesResumable(refStorage, req.file.buffer, metadata);

    const url = await getDownloadURL(snapshot.ref);

    user.selos.pathRelatory = url
    user.selos.status = 'analise'
    user.selos.quantity = quantity

    await user.save()

    res.status(201).json(`${quantity} selos enviados para análise`)

})

// adicionar selos pagos

const addSelosPayed = asyncHandler(async (req, res) => {
  try{

    const { quantity, id } = req.body

    const user = await User.findById(id)

    if (!user) return res.status(404).json({ error: 'Usuário não encontrado' })

    user.selos.status = 'aprovado'
    user.selos.newQuantity += quantity
    user.selos.quantity = 0

    await user.save()

    res.status(200).json({ message: 'Selos adicionados com sucesso' })
  }catch(error){
    res.status(404)
    throw new Error('Usuário não encontrado')
  }

})


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
        generateSelos,
        addSelosPayed
    }