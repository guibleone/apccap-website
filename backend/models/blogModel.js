const mongoose = require('mongoose')

// esquema de uma notícia

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        require: true
    },
    theme: {
        type: String,
        require: true
    },
    isDestaque: {
        type: Boolean,
        require: true,
        default: false
    },
    publication_date: {
        type: Date,
        default: Date.now.bind(Date)
    },
    thumbnail: {
        type: String,
        require: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

})


// exporta o modelo

module.exports = mongoose.model('Blog', blogSchema)