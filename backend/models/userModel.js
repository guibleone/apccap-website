const mongoose = require('mongoose')

// schema do usuário
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Insira o nome"]
    },
    cpf: {
        type: String,
        required: [true, "Insira o CPF"],
        unique: true
    },
    password: {
        type: String,
        required: [true, "Insira sua senha"]
    },
    email: {
        type: String,
        required: [true, "Insira o email"],
        unique: true
    },
    pathFoto: {
        type: String
    },
    acessLevel: {
        type: Number
    },
    address: {
        type: mongoose.SchemaTypes.Mixed,
    },
    role: {
        type: String,
        default: "user"
    },
    status: {
        type: Boolean,
        default: false,
    },
    selos: {
        type: Array,
    },
}, {
    timestamps: true
})

module.exports = mongoose.model('User', userSchema)