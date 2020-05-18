const mongoose = require('mongoose')
const options = {discriminatorKey: 'kind'}


const QuestionSchema = new mongoose.Schema({
    Level:{
        type:String,
        required:true,
        trim:true
    },
    Question:{
        type:String,
        required:true,
        trim:true,
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Instructor',
        required:false
    },

    time: Date,
    public:{
        type:Boolean,
        default:false,
        required:true
    },
    domain:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Domain',
    }

},options)

QuestionSchema.methods.toJSON=function(){
    const Question=this
    const QuestionObject=Question.toObject()
    
  
    delete QuestionObject.__v
//    delete QuestionObject.owner._id
     delete QuestionObject.domain._id
    
    
    return QuestionObject
}



const Question=mongoose.model('Question',QuestionSchema)
module.exports=Question







