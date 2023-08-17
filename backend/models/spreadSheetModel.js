const mongoose = require('mongoose');

// esquema da planilha

const spreadSheetSchema = new mongoose.Schema({
    title_spread: {
        type: String,
        required: true
    },
    itens: {
        type: Array,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    pathExcel: {
        type: String,
        required: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('SpreadSheet', spreadSheetSchema);

