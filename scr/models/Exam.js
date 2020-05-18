const mongoose = require('mongoose')
const validator = require('validator')

const ExamSchema= new mongoose.Schema({
    domain:{
        type:mongoose.Types.ObjectId,
        ref:'Domain',
        required:true,
        trim:true,

    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'Instructor'
    },
    Questions:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Question',
    }],
    duration:{
        type:Number,
        trim:true,
        required:true
    },
    university:{
        type:String,
        trim:true,
        required:true
    },
    faculty:{
        type:String,
        trim:true,
        required:true
    }

    

    
},{
    timestamps:true
})
ExamSchema.methods.toJSON=function(){
const examObject= this.toObject()
//delete examObject._id
delete examObject.__v
return examObject
}
const Exam=mongoose.model('Exam',ExamSchema)

module.exports=Exam
