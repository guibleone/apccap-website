const Resume = require('../models/userResumeModel');
const User = require('../models/userModel.js')
const asyncHandler = require('express-async-handler')

// pegar o currículo
const getResume = asyncHandler(async (req, res) => {
    try {
        const user = req.user._id
        const resume = await Resume.findOne({ user })

        if (!resume) {
            res.status(404)
            throw new Error('Resumo não encontrado')
        }

        res.status(200).json(resume)
    } catch (error) {
        res.status(400)
        //throw new Error('Erro ao carrgegar currículo')
    }
})

// criar currículo
const createResume = asyncHandler(async (req, res) => {
    const { body } = req.body
    const user = req.user._id

    const isResume = await Resume.findOne({ user })

    if (isResume) {
        res.status(400)
        throw new Error('Currículo já existe')
    }

    if (!body) {
        res.status(400)
        throw new Error('Erro ao criar currículo')
    }

    const resume = await Resume.create({
        body,
        user
    })

    if (resume) {
        res.status(201).json({
            _id: resume._id,
            body: resume.body,
            user: resume.user
        })
    }

})

// atualizar currículo
const updateResume = asyncHandler(async (req, res) => {
    const { body } = req.body
    const user = req.user._id

    if (!body) {
        res.status(400)
        throw new Error('Erro ao atualizar currículo')
    }

    const resume = await Resume.findById(req.params.id)

    if (resume) {
        resume.body = body
        resume.user = user

        const updatedResume = await resume.save()

        res.json({
            _id: updatedResume._id,
            body: updatedResume.body,

        })
    } else {
        res.status(404)
        throw new Error('Currículo não encontrado')
    }
})

// deletar currículo
const deleteResume = asyncHandler(async (req, res) => {
    const resume = await Resume.findById(req.params.id)

    if (resume) {
        await Resume.findByIdAndDelete(req.params.id)
        res.json({ message: 'Currículo removido com sucesso' })
    } else {
        res.status(404)
        throw new Error('Currículo não encontrado')
    }
})

module.exports = {
    getResume,
    createResume,
    updateResume,
    deleteResume
}