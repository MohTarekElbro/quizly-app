const mongoose = require('mongoose')
const UniqueValidator = require('mongoose-unique-validator')
const jwt= require('jsonwebtoken')
const bcrypt=require('bcrypt')
const AdminSchema = new mongoose.Schema({
    email:{
        required:true,
        type:String,
        trim:true,
        unique:true
    },
    password:{
        required:true,
        type:String,
        trim:true,

    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }],
    
    
    pic:Buffer
})

AdminSchema.plugin(UniqueValidator)

/*helper method for generating tokens for Admin*/
AdminSchema.methods.GenerateTokens= async function(){
    const admin=this
    const token=jwt.sign({_id:admin._id.toString()},process.env.JWTSEC)
    admin.tokens=admin.tokens.concat({token})
    await admin.save()
    return token


}
//middleware for Hassing Password
AdminSchema.pre('save',async function (next){
    if(this.isModified('password')){
        this.password=await bcrypt.hash(this.password,8)
    }
    next()
    
})

AdminSchema.statics.findByEmailAndPass=async function(email,password){
    const admin=await Admin.findOne({email})
    if(!admin){
        throw new Error({error:'unable to login'})}
        const isMatch=await bcrypt.compare(password,admin.password)
        if(!isMatch){
            throw new Error({error:'unable to login'})
        }
        return admin


}

const Admin=mongoose.model('Admin',AdminSchema)
module.exports=Admin