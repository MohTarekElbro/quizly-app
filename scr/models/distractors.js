const mongoose= require('mongoose')
const UniqueValidator = require('mongoose-unique-validator')


const DistructorSchema = new mongoose.Schema({
    distructor:{
        type:String,
        required:true,
        trim:true,
        unique:true
    },
    Question_id:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Question'

    }]
})
DistructorSchema.plugin(UniqueValidator)


const Distructor=mongoose.model('Distructor',DistructorSchema)
module.exports=Distructor