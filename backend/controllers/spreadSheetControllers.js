const expressAsyncHandler = require('express-async-handler');
const SpreadSheet = require('../models/spreadSheetModel');
const User = require('../models/userModel');
const { ref, getDownloadURL, uploadBytesResumable, deleteObject } = require("firebase/storage");
const { storage } = require('../db/firebase.js')

// adicionar planilha
const addSpreadSheet = expressAsyncHandler(async (req, res) => {

    const { title_spread, itens } = req.body

    if (!title_spread || !itens) {
        res.status(400)
        throw new Error('Informar todos os campos')
    }

    const spreadSheet = new SpreadSheet({
        title_spread,
        itens,
        user: req.user._id
    })

    const createdSpreadSheet = await spreadSheet.save()

    res.status(201).json(createdSpreadSheet)
})

// pegar todas planilhas
const getSpreadSheets = expressAsyncHandler(async (req, res) => {
    const spreadSheets = await SpreadSheet.find({})
        .limit(6)
        .sort({ createdAt: -1 })

    res.json(spreadSheets);
})

// pegar única planilha 
const getOneSpread = expressAsyncHandler(async (req, res) => {
    const spreadSheet = await SpreadSheet.findById(req.params.id)
    if (!spreadSheet) {
        res.status(404)
        throw new Error('Planilha não encontrada')
    }
    res.status(201).json(spreadSheet)
})


// editar planilha
const editSpreadSheet = expressAsyncHandler(async (req, res) => {
    const spreadSheet = await SpreadSheet.findById(req.params.id)
    if (!spreadSheet) {
        res.status(404)
        throw new Error('Planilha não encontrada')
    }
    spreadSheet.title_spread = req.body.title_spread || spreadSheet.title_spread
    spreadSheet.itens = req.body.itens || spreadSheet.itens

    const updatedSpreadSheet = await spreadSheet.save()
    res.status(201).json(updatedSpreadSheet)
})

// exclui planilha
const deleteSpreadSheet = expressAsyncHandler(async (req, res) => {
    const spreadSheet = await SpreadSheet.findById(req.params.id)
    if (!spreadSheet) {
        res.status(404)
        throw new Error('Planilha não encontrada')
    }

    await spreadSheet.deleteOne()
    res.status(200).json({ message: 'Planilha excluida' })
})

// adicionar plnailha Excel
const addExcel = expressAsyncHandler(async (req, res) => {

    if (!req.file) {
        res.status(400)
        throw new Error('Nenhum arquivo selecionado ou formato inválido')
    }

    const spread = await SpreadSheet.find({ user: req.params.id })
    const user = await User.findById(req.params.id)

    if (!user) {
        res.status(404)
        throw new Error('Usuário não encontrado')
    }

    if (spread.length > 0 && spread.map(spread => spread.title_spread).includes(req.file.originalname)) {
        res.status(400)
        throw new Error('Planilha já adicionada')
    }

    const storageRef = ref(storage, `planilha/${user.name}/${req.file.originalname}`)

    const metadata = {
        contentType: req.file.mimetype,
    }

    const snapshot = await uploadBytesResumable(storageRef, req.file.buffer, metadata);

    const url = await getDownloadURL(snapshot.ref);

    spread.pathExcel = url
    spread.title_spread = req.file.originalname
    spread.user = req.params.id

    const updatedSpread = new SpreadSheet(spread)
    updatedSpread.save()

    res.status(201).json('Planilha adicionada com sucesso')

})

// deletar planilha Excel
const deleteExcel = expressAsyncHandler(async (req, res) => {

    const spreadSheet = await SpreadSheet.findById(req.params.id)
    const user = await User.findById(spreadSheet.user)

    if (!spreadSheet) {
        res.status(404)
        throw new Error('Planilha não encontrada')
    }

    const storageRef = ref(storage, `planilha/${user.name}/${spreadSheet.title_spread}`)
    await deleteObject(storageRef)

    await spreadSheet.deleteOne()
    res.status(200).json('Planilha excluida')
})

// pegar planilhas sem login

const getSpreadsWithoutLogin = expressAsyncHandler(async (req, res) => {
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 12;
    const skip = (page - 1) * pageSize;
    const search = req.query.search || ''; 

    try {
        let query = {}; 

        if (search) {
            query = {
                $or: [
                    { title_spread: { $regex: search, $options: 'i' } }, 
                ],
            };
        }

        const totalDocuments = await SpreadSheet.countDocuments(query);
        const spreadsheets = await SpreadSheet.find(query)
            .skip(skip)
            .limit(pageSize)
            .sort({ createdAt: -1 })

        res.json({ totalDocuments, spreadsheets });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


module.exports = {
    addSpreadSheet,
    getSpreadSheets,
    getOneSpread,
    deleteSpreadSheet,
    addExcel,
    deleteExcel,
    editSpreadSheet,
    getSpreadsWithoutLogin
}