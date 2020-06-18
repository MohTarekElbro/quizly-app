const mongoose = require('mongoose')
const UniqueValidator = require('mongoose-unique-validator')
const jwt= require('jsonwebtoken')
const bcrypt=require('bcryptjs')
const TempQuestionschema = new mongoose.Schema({
    Questions:{
        required:true,
        type:JSON,
        trim:true,
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Instructor',
        required:true
    },
    date:{
        type:Date,
        required:true
    },
    domain:{
        type:String,
        required:false
    },
    kind:{
        type:String,
        required:true
    }
    
})


const TempQuestion=mongoose.model('TemQuestion',TempQuestionschema)
module.exports=TempQuestion