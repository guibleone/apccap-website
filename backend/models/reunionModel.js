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
    ata:{
        type: String,
        required: false
    },
    
})

module.exports = mongoose.model('Reunion', reunionSchema)



