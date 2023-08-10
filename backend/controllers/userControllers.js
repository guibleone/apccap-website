// ** funções de controle para as rotas dos usuários ** 
const User = require('../models/userModel.js')
const Document = require('../models/userFilesModel.js')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')
const { ref, getDownloadURL, uploadBytesResumable, deleteObject } = require("firebase/storage");
const { storage } = require('../db/firebase.js')

// registrar usuário
const registerUser = asyncHandler(async (req, res) => {
    const { name, cpf, password, email, acessLevel, pathFoto, address } = req.body

    if (!name || !cpf || !password || !email) {
        res.status(400)
        throw new Error('Preencha todos os campos')
    }

    // verificar se o cpf já existe
    const cpfExists = await User.findOne({ cpf })
    if (cpfExists) {
        res.status(400)
        throw new Error('CPF já cadastrado')
    }

    // verificar se o email já existe
    const isEmail = await User.findOne({ email })
    if (isEmail) {
        res.status(400)
        throw new Error('Email já cadastrado')
    }

    const salt = await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(password, salt)

    const user = await User.create({
        name,
        cpf,
        password: hashPassword,
        email,
        pathFoto,
        acessLevel,
        address
    })

    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            cpf: user.cpf,
            email: user.email,
            pathFoto: user.pathFoto,
            acessLevel: user.acessLevel,
            address: user.address,
            role: user.role,
            status: user.status,
            selos: user.selos,
            sequence_value: user.sequence_value,
            relatory: user.relatory,
            token: generateToken(user._id)
        })
    } else {
        res.status(400)
        throw new Error('Dados inválidos')
    }

})

// adicionar foto de perfil
const addProfilePhoto = asyncHandler(async (req, res) => {

    if (!req.file) {
        res.status(400)
        throw new Error('Selecione uma imagem válida')
    }

    const user = await User.findById(req.params.id)

    if (user) {

        const storageRef = ref(storage, `profilePhotos/${user._id}`)

        const metadata = {
            contentType: req.file.mimetype,
        }

        const snapshot = await uploadBytesResumable(storageRef, req.file.buffer, metadata);

        const url = await getDownloadURL(snapshot.ref);

        user.pathFoto = url

        const updatedUser = await user.save()

        res.status(201).json({
            _id: updatedUser._id,
            name: updatedUser.name,
            cpf: updatedUser.cpf,
            email: updatedUser.email,
            pathFoto: updatedUser.pathFoto,
            acessLevel: updatedUser.acessLevel,
            address: updatedUser.address,
            role: updatedUser.role,
            status: user.status,
            selos: user.selos,
            sequence_value: user.sequence_value,
            relatory: user.relatory,
            token: generateToken(updatedUser._id)
        })

    } else {
        res.status(404)
        throw new Error('Usuário não encontrado')
    }

})

// login de usuário
const loginUser = asyncHandler(async (req, res) => {
    const { cpf, password } = req.body

    if (!cpf || !password) {
        res.status(400)
        throw new Error('Preencha todos os campos')
    }

    const user = await User.findOne({ cpf })

    if (user && (await bcrypt.compare(password, user.password))) {
        res.json({
            _id: user._id,
            name: user.name,
            cpf: user.cpf,
            email: user.email,
            pathFoto: user.pathFoto,
            acessLevel: user.acessLevel,
            address: user.address,
            role: user.role,
            status: user.status,
            selos: user.selos,
            sequence_value: user.sequence_value,
            relatory: user.relatory,
            token: generateToken(user._id)
        })
    } else {
        res.status(401)
        throw new Error('CPF ou senha inválidos')
    }

})

// deletar usuário
const deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id)

    if (user) {
        await user.deleteOne()
        res.json({ id: req.params.id, message: 'Usuário removido' })
    } else {
        res.status(404)
        throw new Error('Usuário não encontrado')
    }
})

// atualizar usuário 
const updateUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id)

    const emailExists = await User.findOne({ email: req.body.email })
    const cpfExists = await User.findOne({ cpf: req.body.cpf })

    //verificar se email já existe
    if (emailExists) {
        if (emailExists._id != req.params.id) {
            res.status(400)
            throw new Error('Email já cadastrado.Tente outro')
        }
    }

    //verificar se cpf já existe
    if (cpfExists) {
        if (cpfExists._id != req.params.id) {
            res.status(400)
            throw new Error('CPF já cadastrado.Tente outro')
        }
    }

    // verificar se o usuário existe
    if (user) {
        user.name = req.body.name || user.name
        user.cpf = req.body.cpf || user.cpf
        user.password = req.body.password || user.password
        user.email = req.body.email || user.email
        user.pathFoto = req.body.pathFoto || user.pathFoto
        user.acessLevel = req.body.acessLevel || user.acessLevel
        user.address = req.body.address || user.address

        const updatedUser = await user.save()

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            cpf: updatedUser.cpf,
            email: updatedUser.email,
            pathFoto: updatedUser.pathFoto,
            acessLevel: updatedUser.acessLevel,
            address: updatedUser.address,
            role: updatedUser.role,
            status: user.status,
            selos: user.selos,
            sequence_value: user.sequence_value,
            relatory: user.relatory,
            token: generateToken(updatedUser._id)
        })
    } else {
        res.status(404)
        throw new Error('Usuário não encontrado')
    }

})

// reiniciar aprovação

const restartAprove = asyncHandler(async (req, res) => {
    try {

        const user = await User.findById(req.params.id)
        const documents = await Document.find({ user: req.params.id })

        if (!user) {
            res.status(404)
            throw new Error('Usuário não encontrado')
        }

        if (user.status === 'analise') {
            res.status(400)
            throw new Error('Usuário já está em análise')
        }

        user.status = 'analise'
        user.relatory = ''

        if (documents) {
            documents.map(async (document) => {
                const storageRef = ref(storage, `documents/${document.user}/${document.name}`)
                await deleteObject(storageRef)
            })
        }

        await Document.deleteMany({ user: req.params.id })

        const updatedUser = await user.save()

        res.status(200).json({
            _id: updatedUser._id,
            name: updatedUser.name,
            cpf: updatedUser.cpf,
            email: updatedUser.email,
            pathFoto: updatedUser.pathFoto,
            acessLevel: updatedUser.acessLevel,
            address: updatedUser.address,
            role: updatedUser.role,
            status: user.status,
            selos: user.selos,
            sequence_value: user.sequence_value,
            relatory: user.relatory,
            token: generateToken(updatedUser._id)
        })

    } catch (error) {
        res.status(400)
        throw new Error('Erro ao reiniciar aprovação')
    }
})

// gerar token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    })
}

// exportar funções
module.exports = {
    registerUser,
    loginUser,
    deleteUser,
    updateUser,
    addProfilePhoto,
    restartAprove
}