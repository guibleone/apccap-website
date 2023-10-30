const asyncHandler = require('express-async-handler');
const Blog = require('../models/blogModel.js');
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


// criar uma nova notícia
const createPublication = asyncHandler(async (req, res) => {
    try {
        const { title, description, theme, author, isDestaque } = req.body

        if (!title || !description || !theme || !author) {
            res.status(400)
            throw new Error('Preencha todos os campos.')
        }

        const thumbnail = req.file

        if (!thumbnail) {
            res.status(400)
            throw new Error('Insira uma imagem válida.')
        }


        const storageRef = ref(storage, `blog/${thumbnail.originalname}`)
        const metadata = { contentType: thumbnail.mimetype }

        const snapshot = await uploadBytesResumable(storageRef, thumbnail.buffer, metadata)
        const url = await getDownloadURL(snapshot.ref)

        if (!url) {
            res.status(400)
            throw new Error('Não foi possível fazer upload da imagem.')
        }

        const publication = await Blog.create({
            title,
            description,
            theme,
            isDestaque: isDestaque ? isDestaque : false,
            author,
            thumbnail: url
        })

        res.status(200).json(publication)

    } catch (error) {
        res.status(400)
        throw new Error('Não foi possível criar uma nova publicação.')
    }
})


// exportar controllers

module.exports = { 
    createPublication,
    getPublications,
 }