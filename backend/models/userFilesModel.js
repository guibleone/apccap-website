const mongoose = require('mongoose')

const fileSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    path: {
        type: String,
        required: true,
        unique: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    }
},{
    timestamps: true
})

module.exports = mongoose.model('UserFile', fileSchema)