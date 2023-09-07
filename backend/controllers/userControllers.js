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
        res.json({...user._doc, token: generateToken(user._id)})
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

        await user.save()

        res.json({ ...user._doc, token: generateToken(user._id) })

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
        res.json({ ...user._doc, token: generateToken(user._id) })
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

        await user.save()

        res.json({ ...user._doc, token: generateToken(user._id) })

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

        if(user.analise.analise_pedido.recurso.path){
            const storageRef = ref(storage, `conselhoRelatórios/${user._id}/recurso`)
            await deleteObject(storageRef)

            user.analise.analise_pedido.recurso.path = ''
            user.analise.analise_pedido.recurso.time = null
            user.analise.analise_pedido.recurso.status = ''
            
            await user.save()
        }

        if(user.analise.analise_pedido.path){
            const storageRef = ref(storage, `conselhoRelatórios/${user._id}/analise_pedido`)
            await deleteObject(storageRef)

            user.analise.analise_pedido.status = ''
            user.analise.analise_pedido.path = ''

            await user.save()
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

        await user.save()

        res.json({ ...user._doc, token: generateToken(user._id) })

    } catch (error) {
        res.status(400)
        throw new Error('Erro ao reiniciar aprovação')
    }
})


const handleRecurso = asyncHandler(async (req, res) => {

    try {

        if(req.file){     

                const user = await User.findById(req.params.id)
    
                if (!user) {
                    res.status(404)
                    throw new Error('Usuário não encontrado')
                }
    
                const storageRef = ref(storage, `conselhoRelatórios/${user._id}/recurso`)
    
                const metadata = {
                    contentType: req.file.mimetype,
                }
    
                const snapshot = await uploadBytesResumable(storageRef, req.file.buffer, metadata);
    
                const url = await getDownloadURL(snapshot.ref);
    
                user.analise.analise_pedido.recurso.path = url
                user.analise.analise_pedido.recurso.time = null
    
                await user.save()
    
                res.json({ ...user._doc, token: generateToken(user._id) })
        }

    }catch(error){
        res.status(400)
        throw new Error('Erro ao enviar recurso')
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
    restartAprove,
    handleRecurso
}