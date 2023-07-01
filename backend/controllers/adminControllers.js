const User = require('../models/userModel')
const Document = require('../models/userFilesModel')
const Resume = require('../models/userResumeModel')
const Products = require('../models/productModel')
const asyncHandler = require('express-async-handler')
const fs = require('fs')
const { promisify } = require('util')
const unlinkAsync = promisify(fs.unlink)
const { ref, getDownloadURL, uploadBytesResumable, deleteObject } = require("firebase/storage");
const { storage } = require('../db/firebase.js');



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

        //const token = req.user.token

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

        if (!user) {
            res.status(404)
            throw new Error('Usuário não encontrado')
        }

        if(user.pathFoto){
            const storageRef = ref(storage, `profilePhotos/${user._id}`)
            await deleteObject(storageRef)
        }

        if(documents){
            documents.map(async (document) => {
                const storageRef = ref(storage, `documents/${document.user}/${document.name}`)
                await deleteObject(storageRef)
            })
        }
            
        if(user.role === 'produtor'){
            if(products){
                products.map(async (product) => {
                    const storageRef = ref(storage, `productsPhotos/${user._id}/${product.name}.jpg`)
                    await deleteObject(storageRef)
                })
            }

            await Products.deleteMany({ producer: req.params.id })    
        }

        await User.findByIdAndDelete(req.params.id)
        await Document.deleteMany({ user: req.params.id })
        await Resume.deleteMany({ user: req.params.id })

        res.status(200).json({ id: req.params.id })

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
const aproveUser = asyncHandler(async(req,res)=>{
    try {

        const user = await User.findById(req.params.id)

        if (!user) {
            res.status(404)
            throw new Error('Usuário não encontrado')
        }

        if(user.role !== 'produtor'){
            res.status(402)
            throw new Error('Usuário não é produtor')
                       
        }

        user.status = true 

        await user.save() 

        res.status(200).json(user)

        
    } catch (error) {
        res.status(400)
        throw new Error('Erro ao aprovar usuário')
    }
})

module.exports = {
    getUsers,
    getUserData,
    getUserDocuments,
    getUserResume,
    deleteUser,
    alterRole,
    aproveUser
}