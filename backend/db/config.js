const mongoose = require('mongoose')

// conecta ao mongo db a partir da url do cluster
const connect = async()=>{
    try {
            mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true })
            console.log('Conecatado ao banco de dados')
    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}

module.exports = connect