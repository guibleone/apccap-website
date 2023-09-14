const asyncHandler = require('express-async-handler');
const Reunion = require('../models/reunionModel.js');

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

    if (!req.file) {
        res.status(400)
        throw new Error('Selecione um arquivo válido')
    
    }

    console.log(req.file)
})


module.exports = { createReunion, getReunions, finishReunion,addReunionAta }
