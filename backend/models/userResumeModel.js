const mongoose = require('mongoose');

// modelo do currículo
const userResumeSchema = mongoose.Schema({
    body: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    }
},{
    timestamps: true
})

module.exports = mongoose.model('UserResume', userResumeSchema)

