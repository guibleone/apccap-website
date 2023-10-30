const Relatory = require('../models/relatoryModel');
const asyncHandler = require('express-async-handler')
const { ref, getDownloadURL, uploadBytesResumable, deleteObject } = require("firebase/storage");
const { storage } = require('../db/firebase.js');

// pegar relatórios
const getRelatorys = asyncHandler(async (req, res) => {
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 12;
    const skip = (page - 1) * pageSize;
    const search = req.query.search || ''; 

    try {
        let query = {}; 

        if (search) {
            query = {
                $or: [
                    { title: { $regex: search, $options: 'i' } }, 
                ],
            };
        }

        const totalDocuments = await Relatory.countDocuments(query);
        const relatorys = await Relatory.find(query)
            .skip(skip)
            .limit(pageSize)
            .sort({ createdAt: -1 });

        res.json({ totalDocuments, relatorys });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Erro ao buscar atas' });
    }
});


// adicionar relatório

const addRelatory = asyncHandler(async (req, res) => {
    try {
        if (!req.file) {
            res.status(400)
            throw new Error('Arquivo não encontrado')
        }

        const storageRef = ref(storage, `relatorys/${req.file.originalname}`)

        const metadata = {
            contentType: 'application/pdf',
        };

        const snapshot = await uploadBytesResumable(storageRef, req.file.buffer, metadata);

        const url = await getDownloadURL(snapshot.ref);

        if (!url) {
            return res.status(400).json({ error: 'Algo de errado aconteceu' });
        }

        const relatory = await Relatory.create({
            path: url,
            title: req.file.originalname
        })

        await relatory.save()

        res.status(201).json('Relatório adicionado com sucesso')

    } catch (error) {
        res.status(400)
        throw new Error(error)
    }
})


// deletar relatório

const deleteRelatory = asyncHandler(async (req, res) => {
    try {

        const relatory = await Relatory.findById(req.params.id)

        if (!relatory) {
            res.status(404)
            throw new Error('Relatório não encontrado')
        }

        const storageRef = ref(storage, `relatorys/${relatory.title}`)
        await deleteObject(storageRef)

        await relatory.deleteOne()
        res.status(200).json('Relatório excluido')


    } catch (error) {
        res.status(400)
        throw new Error(error)
    }

})

module.exports = { addRelatory, deleteRelatory, getRelatorys }