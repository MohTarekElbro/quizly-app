const mongoose= require('mongoose')
const Question=require('./Question')

const options = {discriminatorKey: 'kind'}

const MCQ = Question.discriminator('MCQ',new mongoose.Schema({
    keyword: { type: String, required: true },
    distructor: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Distructor' }]

},options))




  module.exports= MCQ
