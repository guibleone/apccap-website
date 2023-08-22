const mongoose = require('mongoose');

// esquema do produto
const productSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    startSelo:{
        type: String,
    },
    endSelo:{
        type: String,
    },
    description:{
        type:String,
        required: true      
    },
    path:{
        type: String,
    },
    producer:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
   
})

// exportar o modelo
module.exports = mongoose.model('Product', productSchema);
