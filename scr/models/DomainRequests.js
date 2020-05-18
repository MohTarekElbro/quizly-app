const mongoose= require('mongoose')
const UniqueValidator = require('mongoose-unique-validator')


const RequestSchema=new mongoose.Schema({
    Requested_domain:{
        type:String,
        unique:true,
        required:true,
        trim:true
    },
   requester:{
       type:mongoose.Schema.Types.ObjectId,
       required:true,
       trim:true,
       ref:'Instructor'
   },description:{
       type:String,
       required:true
   },material:{
       type:String
   }

},{timestamps:true})
RequestSchema.plugin(UniqueValidator)

RequestSchema.methods.toJSON=function(){
    const RequestObject= this.toObject()
    // delete RequestObject._id
    delete RequestObject.__v
    delete RequestObject.requester._id
    return RequestObject
}

const Request= mongoose.model('Request',RequestSchema)
module.exports=Request
