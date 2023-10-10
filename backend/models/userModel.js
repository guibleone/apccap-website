const mongoose = require('mongoose')
const { autoIncrementID } = require('../middlewares/counterMiddleware.js')

// schema do usuário
const userSchema = new mongoose.Schema({
    dados_pessoais: {
        type: mongoose.SchemaTypes.Mixed,
    },
    propriedade: {
        type: mongoose.SchemaTypes.Mixed,
    },
    marca: {
        type: mongoose.SchemaTypes.Mixed,
    },
    formulario_requerimento: {
        type: mongoose.SchemaTypes.Mixed,
    },
    pathFoto: {
        type: String
    },
    acessLevel: {
        type: Number
    },
    credencial: {
        type: String,
    },
    role: {
        type: String,
        default: "produtor"
    },
    oldRole: {
        type: String,
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
        startSelo: { type: String, default: '' },
        endSelo: { type: String, default: '' },
    },
    token: {
        type: String,
        default: ''
    },
    sequence_value: { type: Number },
    relatory: { type: String },
    analise: {
        analise_pedido: {
            path: { type: String, default: '' },
            status: { type: String, default: '' },
            recurso: {
                path: { type: String, default: '' },
                time: { type: Date, default: '' },
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

