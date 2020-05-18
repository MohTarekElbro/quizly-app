const mongoose=require('mongoose')
const validator = require('validator')

const FeedbackSchema= new mongoose.Schema({
    feedback:{
        type:String,
        required:true,
        trim:true
    },
    creator:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'Instructor'
    },
    date:{
        type:Date,
        required:true
    }
})
FeedbackSchema.methods.toJSON=function(){
    const FeedbackObject=this.toObject()
   // delete FeedbackObject._id
   // delete FeedbackObject.creator._id
    delete FeedbackObject.__v
    
    return FeedbackObject
}

const Feedback=mongoose.model('Feedback',FeedbackSchema)
module.exports=Feedback