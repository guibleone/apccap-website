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
        default: '',
        //analise, aprovado, reprovado
    },
    productsQuantity: {
        type: Number,
        default: 0
    },
    selos: {
        quantity: { type: Number, default: 0 },
        newQuantity: { type: Number, default: 0 },
        startSelo: { type: String },
        endSelo: { type: String },
        status: { type: String, default: '' },
        relatorys:{ type: [String], default:[] },
    },
    sequence_value: { type: Number },
    relatory: { type: String },
    analise: {
        analise_pedido: {
            path: { type: String, default: '' },
            status: { type: String, default: '' },
            recurso: {
                path: { type: String, default: '' },
                time: {type: Date, default: ''},
                status: { type: String, default: '' },
            }
        },
       vistoria: {
            path: { type: String, default: '' },
            status: { type: String, default: '' },
       },
       analise_laboratorial: {
            path: { type: String, default: '' },
            status: { type: String, default: '' },
       },
    },
}, {
    timestamps: true
})

userSchema.plugin(autoIncrementID, {
    modelName: 'User',
    field: 'sequence_value'
})


module.exports = mongoose.model('User', userSchema)

