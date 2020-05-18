
const Instructor=require('../models/instructorAccount')
const Notification = require('../models/Notification')
const Admin = require('../models/AdminAccount')
const jwt =require('jsonwebtoken')


exports.GetNumberOfNotification= async(req,res,next)=>{
    try{
        const token= req.header('Authorization').replace('Bearer ','')
        const decoded= jwt.verify(token,process.env.JWTSEC)
        const instructor = await Instructor.findOne({_id:decoded._id,'tokens.token':token})
        dum = 0 
        if(!instructor){
            const admin = await Admin.findOne({_id:decoded._id,'tokens.token':token})
            if(!admin){
                console.log('im not')
                throw new Error('Server Cannot connect now ')
            }
            dum = await Notification.find({Reciver_Email:admin.email})
            console.log(admin.email)
        }
        else{
            dum = await Notification.find({Reciver_Email:instructor.Email})
        }
        process.env.countNotification=dum.length
        next()

    }catch(e){
        res.status(401).send(e)


    }
}
