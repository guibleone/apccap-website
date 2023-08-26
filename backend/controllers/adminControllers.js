const User = require('../models/userModel')
const Document = require('../models/userFilesModel')
const Resume = require('../models/userResumeModel')
const Products = require('../models/productModel')
const SpreadSheet = require('../models/spreadSheetModel')
const asyncHandler = require('express-async-handler')
const fs = require('fs')
const { promisify } = require('util')
const unlinkAsync = promisify(fs.unlink)
const { ref, getDownloadURL, uploadBytesResumable, deleteObject } = require("firebase/storage");
const { storage } = require('../db/firebase.js');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
const jwt = require('jsonwebtoken')


// pegar usuário
const getUsers = asyncHandler(async (req, res) => {
    try {
        const users = await User.find({}).select('-password')
        // const token = req.user.token

        if (users) {
            res.status(200).json(users)
        } else {
            res.status(404)
            throw new Error('Usuários não encontrados')
        }
    } catch (error) {
        res.status(400)
        throw new Error('Erro ao carrgegar usuários')
    }
})

// pegar dados do usuário
const getUserData = asyncHandler(async (req, res) => {
    try {

        const user = await User.findById(req.params.id).select('-password')

        if (user) {
            res.status(200).json(user)
        } else {
            res.status(404)
            throw new Error('Usuário não encontrado')
        }
    } catch (error) {
        res.status(400)
        throw new Error('Erro ao carrgegar usuário')
    }
})


// pegar documentos do usuário
const getUserDocuments = asyncHandler(async (req, res) => {
    try {
        const documents = await Document.find({ user: req.params.id })
        // const token = req.user.token

        if (documents) {
            res.status(200).json(documents)
        } else {
            res.status(404)
            throw new Error('Documentos não encontrados')
        }
    } catch (error) {
        res.status(400)
        throw new Error('Erro ao carrgegar documentos')
    }
})

// pegar resumo do usuário
const getUserResume = asyncHandler(async (req, res) => {
    try {
        const resume = await Resume.find({ user: req.params.id })

        if (resume) {
            res.status(200).json(resume)
        } else {
            res.status(404)
            throw new Error('Resumo não encontrado')
        }

    } catch (error) {
        res.status(400)
        throw new Error('Erro ao carregar o resumo')

    }
})


// deletar usuário
const deleteUser = asyncHandler(async (req, res) => {
    try {

        const user = await User.findById(req.params.id)
        const documents = await Document.find({ user: req.params.id })
        const products = await Products.find({ producer: req.params.id })
        const spreadSheets = await SpreadSheet.find({ user: req.params.id })

        if (!user) {
            res.status(404)
            throw new Error('Usuário não encontrado')
        }

        if (user.pathFoto) {
            const storageRef = ref(storage, `profilePhotos/${user._id}`)
            await deleteObject(storageRef)
        }

        if (documents) {
            documents.map(async (document) => {
                const storageRef = ref(storage, `documents/${document.user}/${document.name}`)
                await deleteObject(storageRef)
            })
        }

        if (spreadSheets) {
            spreadSheets.map(async (spreadSheet) => {
                const storageRef = ref(storage, `planilha/${user.name}/${spreadSheet.title_spread}`)
                await deleteObject(storageRef)
            })
        }

        if (products) {
            products.map(async (product) => {
                if (product.path) {
                    const storageRef = ref(storage, `productsPhotos/${product.producer}/${product.name}.jpg`)
                    await deleteObject(storageRef)
                }
            })
        }

        await User.findByIdAndDelete(req.params.id)
        await Document.deleteMany({ user: req.params.id })
        await Resume.deleteMany({ user: req.params.id })
        await SpreadSheet.deleteMany({ user: req.params.id })
        await Products.deleteMany({ producer: req.params.id })

        res.status(200).json('Usuário deletado com sucesso')

    } catch (error) {
        res.status(400)
        throw new Error('Erro ao deletar usuário')
    }
})

// altera nivel de acesso do usuário
const alterRole = asyncHandler(async (req, res) => {
    try {

        const user = await User.findById(req.params.id)

        if (!user) {
            res.status(404)
            throw new Error('Usuário não encontrado')
        }

        if (!req.body.role) {
            res.status(400)
            throw new Error('Informe o nível de acesso')
        }

        user.role = req.body.role

        await user.save()

        res.status(200).json(user)


    } catch (error) {
        res.status(400)
        throw new Error('Erro ao alterar o nível de acesso')
    }
})

// aprovar usuário
const aproveUser = asyncHandler(async (req, res) => {
    try {

        const user = await User.findById(req.params.id)

        if (!user) {
            res.status(404)
            throw new Error('Usuário não encontrado')
        }

        if (user.status === 'aprovado') {
            res.status(400)
            throw new Error('Usuário já aprovado')
        }

        user.status = 'aprovado'
        user.role = 'produtor'

        await user.save()

        res.status(200).json(user)


    } catch (error) {
        res.status(400)
        throw new Error('Erro ao aprovar usuário')
    }
})

// desaprovar usuário
const disapproveUser = asyncHandler(async (req, res) => {
    try {

        const user = await User.findById(req.params.id)

        if (!user) {
            res.status(404)
            throw new Error('Usuário não encontrado')
        }

        if (user.status === 'reprovado') {
            res.status(400)
            throw new Error('Usuário já reprovado')
        }

        user.status = 'reprovado'
        await user.save()

        res.status(200).json(user)

    } catch (error) {
        res.status(400)
        throw new Error('Erro ao desaprovar usuário')
    }
})


const getPayment = asyncHandler(async (req, res) => {
    let { amount, id } = req.body

    try {
        const payment = await stripe.paymentIntents.create({
            amount,
            currency: 'BRL',
            description: 'Compra de selos',
            payment_method: id,
            confirm: true
        })

        console.log("Pagamento", payment)
        res.status(200).json({
            message: "Pagamento efetuado com sucesso!",
            confirm: 'success'
        })

    } catch (error) {
        res.status(400).json({
            message: "Pagamento não efetuado!",
            confirm: 'error'
        })
    }
})

// PARTE DO SECRETÁRIO

const sendRelatory = asyncHandler(async (req, res) => {

    const { relatory } = req.body

    const user = await User.findById(req.params.id)

    if (!relatory) {
        res.status(400)
        throw new Error('Insira um relatório válido')
    }

    if (!user) {
        res.status(404)
        throw new Error('Usuário não encontrado')
    }

    user.relatory = relatory
    await user.save()

    res.status(200).send(user)
})



module.exports = {
    getUsers,
    getUserData,
    getUserDocuments,
    getUserResume,
    deleteUser,
    alterRole,
    aproveUser,
    getPayment,
    sendRelatory,
    disapproveUser,
}