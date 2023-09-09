const mongoose = require('mongoose');

// esquema do produto
const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    selo: {
        startSelo: {
            type: String,
        },
        endSelo: {
            type: String,
        },
        quantity: {
            type: Number,
        },
    },
    relatorys: [{
        name: {
            type: String,
        },
        path: {
            type: String,
        },
    }],
    analise: {
        analise_pedido: {
            path: { type: String, default: '' },
            status: { type: String, default: 'pendente' },
        },
        vistoria: {
            path: { type: String, default: '' },
            status: { type: String, default: 'pendente' },
        },
        analise_laboratorial: {
            path: { type: String, default: '' },
            status: { type: String, default: 'pendente' },
        },
    },
    status: {
        type: String,
        default: 'pendente',
    },
    description: {
        type: String,
        required: true
    },
    path: {
        type: String,
    },
    producer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

})

// exportar o modelo
module.exports = mongoose.model('Product', productSchema);
