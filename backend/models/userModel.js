const mongoose = require('mongoose')
const { autoIncrementID } = require('../middlewares/counterMiddleware.js')

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
        type: String,
        default: 'analise',
    },
    selos: {
        quantity: { type: Number, default: 0 },
        newQuantity: { type: Number, default: 0 },
        startSelo: { type: String },
        endSelo: { type: String },
        status: { type: String, default: '' },
        pathRelatory: { type: String },
    },
    sequence_value: { type: Number },
    relatory: { type: String },
    analise: {
        analise_pedido: { type: String, default: '' },
        vistoria: { type: String, default: '' },
        analise_laboratorial: { type: String, default: '' },
    },
}, {
    timestamps: true
})

userSchema.plugin(autoIncrementID, {
    modelName: 'User',
    field: 'sequence_value'
})


module.exports = mongoose.model('User', userSchema)

