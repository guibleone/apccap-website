const mongoose = require('mongoose');

// modelo de relatório

const relatorySchema = new mongoose.Schema({
    path: {
        type: String,
        required: false
    },
    title: {
        type: String,
        required: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }

})



module.exports = mongoose.model('Relatory', relatorySchema)