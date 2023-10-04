const mongoose = require('mongoose');

// modelo da reunião

const reunionSchema = mongoose.Schema({
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
        message: {
            type: String,
            required: false
        },
        descricao: {
            type: String,
            required: false
        },
        votos: {
            type: Array,
            required: false
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



