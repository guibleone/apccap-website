const asyncHandler = require('express-async-handler');
const Blog = require('../models/blogModel.js');
const User = require('../models/userModel.js');
const { ref, getDownloadURL, uploadBytesResumable, deleteObject } = require("firebase/storage");
const { storage } = require('../db/firebase.js')

// pegar notícias
const getPublications = asyncHandler(async (req, res) => {
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 4;
    const skip = (page - 1) * pageSize
    const theme = req.query.theme ? req.query.theme : null
    const isDestaque = req.query.isDestaque ? req.query.isDestaque : null

    try {

        let query = {}

        if (theme !== 'undefined') {
            query = { $or: [{ theme: theme }] }
        }

        if (isDestaque !== 'undefined') {
            query = { $or: [{ isDestaque: isDestaque }] }
        }

        const totalPublications = await Blog.countDocuments(query)

        const publications = await Blog
            .find(query)
            //.populate('author', 'name')
            .sort({ publication_date: -1 })
            .skip(skip)
            .limit(pageSize)

        res.status(200).json({ publications, totalPublications })

    } catch (error) {
        res.status(400)
        throw new Error('Não foi possível encontrar publicações.')
    }
})

// pegar única notícia
const getSinglePublication = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params

        const publication = await Blog
            .findById(id)
            .exec()

        if (!publication) {
            res.status(400)
            throw new Error('Não foi possível encontrar a publicação.')
        }

        res.status(200).json(publication)
    }
    catch (error) {
        res.status(400)
        throw new Error('Não foi possível encontrar a publicação.')

    }
})

// criar uma nova notícia
const createPublication = asyncHandler(async (req, res) => {

    const { values } = req.body

    try {
        const { title, description, theme, author, isDestaque } = JSON.parse(values)

        const user = await User
            .findById(author)
            .select('dados_pessoais.name role dados_pessoais.profilePhoto')
            .exec()

        if (!title || !description || !theme || !author) {
            res.status(400)
            throw new Error('Preencha todos os campos.')
        }

        const thumbnail = req.file

        if (!thumbnail) {
            res.status(400)
            throw new Error('Insira uma imagem válida.')
        }


        const publication = await Blog.create({
            title,
            description,
            theme,
            isDestaque: isDestaque ? isDestaque : false,
            author: {
                name: user.dados_pessoais.name,
                role: user.role,
                profilePhoto: user.dados_pessoais.profilePhoto
            },
        })

        if (publication) {

            const storageRef = ref(storage, `blog/${publication._id}`)
            const metadata = { contentType: thumbnail.mimetype }

            const snapshot = await uploadBytesResumable(storageRef, thumbnail.buffer, metadata)
            const url = await getDownloadURL(snapshot.ref)

            if (!url) {
                res.status(400)
                throw new Error('Não foi possível fazer upload da imagem.')
            }


            publication.thumbnail = {
                originalname: thumbnail.originalname,
                url
            }

            await publication.save()
        }

        res.status(200).json(publication)

    } catch (error) {
        res.status(400)
        throw new Error('Não foi possível criar uma nova publicação.')
    }
})


// deletar uma notícia
const deletePublication = asyncHandler(async (req, res) => {
    try {

        const { id } = req.params

        const publication = await Blog.findById(id)

        if (!publication) {
            res.status(400)
            throw new Error('Não foi possível encontrar a publicação.')
        }

        const storageRef = ref(storage, `blog/${publication._id}`)
        await deleteObject(storageRef)

        await Blog.findByIdAndDelete(id)

        res.status(200).json('Publicação deletada com sucesso.')


    } catch (error) {
        res.status(400)
        throw new Error('Não foi possível deletar a publicação.')
    }
})

// editar uma notícia
const editPublication = asyncHandler(async (req, res) => {

    const { editValues } = req.body

    try {
        const { id } = req.params

        const publication = await Blog.findById(id)

        const { title, description, theme, isDestaque } = JSON.parse(editValues)


        if (!title || !description || !theme ) {
            res.status(400)
            throw new Error('Preencha todos os campos.')
        }

        const thumbnail = req.file

        if (thumbnail) {
              
                const storageRef = ref(storage, `blog/${publication._id}`)
                const metadata = { contentType: thumbnail.mimetype }
    
                const snapshot = await uploadBytesResumable(storageRef, thumbnail.buffer, metadata)
                const url = await getDownloadURL(snapshot.ref)
    
                if (!url) {
                    res.status(400)
                    throw new Error('Não foi possível fazer upload da imagem.')
                }
    
                publication.thumbnail = {
                    originalname: thumbnail.originalname,
                    url
                }

                await publication.save()
        }

        publication.title = title
        publication.description = description
        publication.theme = theme
        publication.isDestaque = isDestaque ? isDestaque : false

        await publication.save()

        res.status(200).json(publication)

    }
    catch (error) {
        res.status(400)
        throw new Error('Não foi possível editar a publicação.')
    }
})


// exportar controllers

module.exports = {
    createPublication,
    getPublications,
    getSinglePublication,
    deletePublication,
    editPublication
}