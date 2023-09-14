const asyncHandler = require('express-async-handler');
const Reunion = require('../models/reunionModel.js');
const { ref, getDownloadURL, uploadBytesResumable, deleteObject } = require("firebase/storage");
const { storage } = require('../db/firebase.js');


// criar reunião
const createReunion = asyncHandler(async (req, res) => {
    try {
        const { title, message, date, typeReunion } = req.body

        if (typeReunion.administrativa) {
            type = 'administrativa'
        } else if (typeReunion.assembleia_ordinal) {
            type = 'assembleia_ordinal'
        } else if (typeReunion.assembleia_extraordinaria) {
            type = 'assembleia_extraordinaria'
        }

        const reunion = await Reunion.create({
            title,
            message,
            date,
            type,
            status: 'agendada'
        })

        res.status(201).json(reunion)
    }
    catch (error) {
        res.status(400)
        throw new Error('Dados inválidos')
    }
})

// listar reuniões por data
const getReunions = asyncHandler(async (req, res) => {
    try {
        const reunions = await Reunion.find({}).sort({ date: 1 });

        if (reunions.length > 0) {
            res.json(reunions);
        } else {
            res.status(404).json({ message: 'Reuniões não encontradas' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar reuniões' });
    }
});

// concluir reunião

const finishReunion = asyncHandler(async (req, res) => {
    try {
        const { id } = req.body

        const reunion = await Reunion.findById(id)

        if (reunion) {
            reunion.status = 'concluida'
            await reunion.save()
            res.json({ message: 'Reunião concluída' })
        } else {
            res.status(404)
            throw new Error('Reunião não encontrada')
        }
    } catch (error) {
        res.status(500)
        throw new Error('Erro ao concluir reunião')
    }
})

// adicionar ata

const addReunionAta = asyncHandler(async (req, res) => {

    const reunion = await Reunion.findById(req.params.id)

    if (!req.file) {
        res.status(400)
        throw new Error('Selecione um arquivo válido')

    }

    if (!reunion) {
        res.status(404)
        throw new Error('Reunião não encontrada')
    }

    const storageRef = ref(storage, `reunionsAtas/${reunion._id}/${req.file.originalname}`)
    const metadata = {
        contentType: 'application/pdf',
    }

    const snapshot = await uploadBytesResumable(storageRef, req.file.buffer, metadata);

    const url = await getDownloadURL(snapshot.ref);

    if (!url) {
        res.status(400)
        throw new Error('Algo de errado aconteceu')
    }

    reunion.ata.path = url
    reunion.ata.originalname = req.file.originalname

    await reunion.save()

    res.json('Ata adicionada com sucesso')

})

// deletar ata

const deleteReunionAta = asyncHandler(async (req, res) => {
    try {
        const { id } = req.body

        const reunion = await Reunion.findById(id)

        if (reunion.ata.path) {
            const storageRef = ref(storage, `reunionsAtas/${reunion._id}/${reunion.ata.originalname}`)
            await deleteObject(storageRef)
        }

        reunion.ata.path = ''
        reunion.ata.originalname = ''

        await reunion.save()

        res.json('Ata deletada' )

    } catch (error) {
        res.status(500)
        throw new Error('Erro ao deletar ata')
    }

})


// deletar reunião

const deleteReunion = asyncHandler(async (req, res) => {
    try {
        const id = req.params.id

        const reunion = await Reunion.findById(id)

        if (reunion.ata.path) {
            const storageRef = ref(storage, `reunionsAtas/${reunion._id}/${reunion.ata.originalname}`)
            await deleteObject(storageRef)
        }

        reunion.remove()
        await reunion.save()

        res.json({ message: 'Reunião deletada' })

    } catch (error) {
        res.status(500)
        throw new Error('Erro ao deletar reunião')
    }
})



module.exports = { 
    createReunion, getReunions, finishReunion, 
    addReunionAta, deleteReunion,deleteReunionAta 
}
