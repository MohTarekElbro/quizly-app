const mongoose = require('mongoose')
const Question = require('./Question')
const options = { discriminatorKey: 'kind' }


const TrueOrFalse = Question.discriminator('T/F', new mongoose.Schema({
    keyword: { type: String, required: true },
    distructor: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Distructor' }]

    , state: {
        type: Boolean,
        required: true,


    }
},
    options))

module.exports = TrueOrFalse

