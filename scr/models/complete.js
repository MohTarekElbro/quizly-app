const mongoose= require('mongoose')
const Question= require('./Question')
const options = {discriminatorKey: 'kind'}

const Complete =Question.discriminator('Complete',new mongoose.Schema({
    keyword: { 
        type: String,
        required:true,
        trim:true
     },
},options))

module.exports=Complete