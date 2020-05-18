const Admin = require('../models/AdminAccount')
const Instructor=require('../models/instructorAccount')
const {SendWelcomMessage,Send_Rejection_mail}=require('../mails/sendMails')
const bcrypt=require('bcrypt')
const Notification = require('./Notifications')

exports.getAdminEmail= async()=>{
    try{
        const admin= await Admin.find({})
        if(!admin){
            throw new Error('No Admin')
        }
        return admin.email

    }catch(e){
        console.log(e)
    }

}

exports.SingUp=async(req,res)=>{
    try{
        const isAdmin = await Admin.findOne({})
        console.log(isAdmin)
        if(isAdmin!==null){
            return res.status(400).send('cannot create new admin')
        }
        const admin= new Admin(req.body)
        const token=await admin.GenerateTokens()
        await admin.save()
        res.status(201).send({admin,token}) 
    }catch(e){
        res.status(400).send(e)
     }
}

exports.DeleteInstructorAccount=async(req,res)=>{
    try{
        const instructor= await Instructor.findOne({_id:req.params.id})
        if(! instructor){
           return res.status(404).send('no such an instructor')
        }
        x=await Notification.DeleteAdminNotification("Sender_email",instructor.Email)
        await Notification.DeleteAdminNotification("Reciver_Email",instructor.Email)
        if(x ===0 ){
           return res.status(401).send('Can not Delete Notification')
        }
        instructor.remove()
        res.send('successfully removed')
       
    }catch(e){
        res.send(e)
    }

}

exports.Login=async(req,res)=>{
    try{
        const admin = await Admin.findByEmailAndPass(req.body.email,req.body.password)
        const token= await admin.GenerateTokens()
        Notification.updateTokens(req.body.email,token)
        res.send({admin,token})
    }catch(e){
        res.send(e)
    }
}
exports.LogOut=async(req,res)=>{
    try{
        req.admin.tokens=req.admin.tokens.filter((t)=>{
           return t.token!==req.token
        })
        await req.admin.save()
        res.status(200).send('Logged Out successfully')

    }catch(e){
        res.status(403).send(e)

    }

}

exports.LogOutFromAllDevices=async(req,res)=>{
    try{
        req.admin.tokens=[]
        await req.admin.save()
        res.status(200).send('Logged out from all devicess successfully')

    }catch(e){
        res.send(403).send(e)

    }
}

exports.editAdminProfile=async(req,res)=>
{
    const isMatch=await bcrypt.compare(req.params.password,req.admin.password)
    if(!isMatch){
      return  res.status(401).send('please enter your password correctly')
    }

    const allowed=['email','password']
    const updates=Object.keys(req.body)
    const IsValidUpdate=updates.every((update)=>allowed.includes(update))
    console.log(IsValidUpdate)
    if(!IsValidUpdate){
        res.status(400).send({error:'Not exisited properity'})
    }try{
        updates.forEach((update)=> req.admin[update]=req.body[update])
         await req.admin.save()
         const admin=req.admin
         res.send(admin)

    }catch(e){
        res.status(400).send(e)

    }
}  
exports.List_signUp_Requests=async(req,res)=>{
    try{
        const instructors= await Instructor.find({accepted:'false'})
        if(instructors.length===0){
           return res.status(404).send('No requests')
        }
        let inst = []
        if(req.params.verision==='all' || req.params.count === 'all'){
            return res.status(200).send(instructors.sort((a,b)=> new Date(b.RequestDate) - new Date(a.RequestDate)))
        }
        const Count = Number(req.params.count)
        const verision =Number(req.params.verision)
        if ((verision+1) * Count > instructors.length) {
            for (var i = verision * Count; i < instructors.length; i++) {
                inst.push(instructors[i])
            }
        }
        else {
            for (var i = verision * Count; i < (verision+1)*Count; i++) {
                inst.push(instructors[i])
            }
        }
        res.status(200).send(inst.sort((a,b)=> new Date(a.RequestDate) - new Date(b.RequestDate)))

    }catch(e){
        res.status(500).send(e)
    }

}

exports.Select_SingUp_Request=async(req,res)=>{
    try{
        const instructor= await Instructor.findOne({_id:req.params.id,accepted:false })
        if(!instructor){
           return res.status(404).send('not found ...')

        }
        res.status(200).send(instructor)


    }catch(Error){
        console.log(Error)
        res.status(404).send(Error)

    }
}


 exports.Add_instructor=async(req,res)=>{
     try{
         
        const admin = await Admin.findOne({})
        const instructor= await Instructor.findOne({_id:req.params.id,accepted:false })
        if(!instructor){
           return res.status(404).send('not found ...')

        }
        if(instructor.accepted===false){
          
         const pass= instructor.Password= randomString(7)
         console.log(pass)
          
        SendWelcomMessage(admin.email,instructor.Email,instructor.Frist_Name,pass)
        instructor.accepted='true'
        x=await Notification.DeleteAdminNotification("filterNotify",req.params.id)
        if(x ===0 ){
            throw new Error('Can not Delete Notification')
        }
        instructor.save()

        return res.status(201).send('added successfuly')
        }
        res.status(400).send('already added')


     }catch(e){
        console.log(e)
        res.status(500).send(e)

     }


 }
 function randomString(length) {
    return Math.round((Math.pow(36, length + 1) - Math.random() * Math.pow(36, length))).toString(36).slice(1);
}
exports.Reject_instructor_request=async(req,res)=>{
    try{
        const admin = await Admin.findOne({})
        const instructor= await Instructor.findOne({_id:req.params.id,accepted:false })
        if(!instructor){
           return res.status(404).send('not found ...')

        }
        
            x=await Notification.DeleteAdminNotification("Sender_email",instructor.Email)
            if(x ===0 ){
                throw new Error('Can not Delete Notification')
            }
            await instructor.remove()
            Send_Rejection_mail(admin.email,instructor.Email , instructor.Frist_Name)

            res.send('rejection mail is sent')
            
        


    }catch(e){
        console.log(e)
        res.status(500).send(e)


    }
}


exports.UploadProfilePicture=async(req,res)=>{
    req.admin.pic=req.file.buffer
    await req.admin.save()
    res.send('image uploaded successfuly')
}
exports.fetcProfilePicture=async (req,res)=>{
    try{
    const admin= await Admin.findById(req.params.id)
    if(!admin || !admin.pic){
        throw new Error()
    }
    res.set('Content-Type','image/jpg')
    res.send(admin.pic)}
    catch(e){
        res.status(404).send()
    }
}
exports.List_instructors= async(req,res)=>{
    try{
        const instructors= await Instructor.find({accepted:true})
        if(instructors.length===0){
           return res.status(404).send('No instructors to show')
        }
        res.status(200).send(instructors)

    }catch(e){
        console.log(e)
        res.status(500).send(e)
    }
}
// Delete profile pic 
exports.deleteProfilepic=async(req,res)=>{
    try{
        console.log(req.admin)
        if(!req.admin.pic){
            throw new Error()
        }
        req.admin.pic.delete()
       await req.admin.save()
       res.status(200).send('your profile picture is deleted')

        

    }catch(e){
        console.log(e)
        res.status(500).send(e)
    }
}
