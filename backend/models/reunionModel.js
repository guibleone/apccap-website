const mongoose = require('mongoose');

// modelo da reunião

const reunionSchema = mongoose.Schema({
    pathPdf : {
        type: String,
        required: false
    },
    convocado_por: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: false
    },
    date: {
        type: String,
        required: true
    },
    dateConvocacao: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: false
    },
    type: {
        type: String,
        required: false
    },
    membros:{
        convocados:{
            type: Array,
            required: false
        },
        presentes:{
            type: Array,
            required: false
        },
        faltantes:{
            type: Array,
            required: false
        }
    },
    pautas: [{
        title: {
            type: String,
            required: false
        },
        description: {
            type: String,
            required: false
        },
        votos: {
            favor: {
                type: Array,
                required: false
            },
            contra: {
                type: Array,
                required: false
            },
        },
    }],
    ata:{
        path: {
            type: String,
            required: false
        },
        originalname: {
            type: String,
            required: false
        },
        assinaturas: {
            type: Array,
            required: false
        },
        assinaturas_restantes: {
            type: Array,
            required: false
        },
    },
    
})

module.exports = mongoose.model('Reunion', reunionSchema)



