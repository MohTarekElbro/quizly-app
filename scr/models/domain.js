const mongoose = require('mongoose')
const UniqueValidator = require('mongoose-unique-validator')


const DomainSchema = new mongoose.Schema({
 
       domain_name:{
          type:String,
          required:true,
          unique:true,
          trim:true
       },description:{
           type:String,
           required:true
       }
   

})


DomainSchema.plugin(UniqueValidator)




const Domain =mongoose.model('Domain',DomainSchema)
module.exports=Domain

