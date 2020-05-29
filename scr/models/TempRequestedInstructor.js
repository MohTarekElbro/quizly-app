const mongoose = require('mongoose')
const UniqueValidator = require('mongoose-unique-validator')
const jwt= require('jsonwebtoken')
const bcrypt=require('bcryptjs')
const TempRequestedInstructorschema = new mongoose.Schema({
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Instructor',
        required:true
    },
    date:{
        type:Date,
        required:true
    }
    
})


const TempRequestedInstructor=mongoose.model('TempRequest',TempRequestedInstructorschema)
module.exports=TempRequestedInstructor