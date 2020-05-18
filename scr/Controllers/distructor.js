const Distructor= require('../models/distractors')

exports.AddNewDistructor=async(req,res)=>{
    try{
        const distructor=new Distructor({
            ...req.body,
            Question_id:req.params.Question_id
            
        })
        await distructor.save()
        res.status(201).send(distructor)

    }catch(e){
        res.send(e)
    }
}

exports.DeleteDistructor=async(req,res)=>{
    try{
        const distructor= await Distructor.findByIdAndDelete(req.params._id)
        if(!distructor){
            return res.status(404).send('No such a distructor')
        }
        distructor.save()
        res.status(200).send('deleted')

    }catch(e){
        res.status(500).send(e)

    }
}


exports.EditDistructor=async(req,res)=>{
    const updates=Object.keys(req.body)
    const allowed=['distructor']
    const isValidUpdate= updates.every((update)=>allowed.includes(update))
    if(!isValidUpdate){
        res.status(400).send({error:'Not exisited properity'})
    }
    try{
        const distructor = await Distructor.findOne({_id:req.params._id})
        if(!distructor){
            res.status(404).send('No such a distructor to edit')
        }
        updates.forEach((update)=>distructor[update]=req.body[update])
      await distructor.save()
        res.send(distructor)

    }catch(e){
        res.status(500).send(e)

    }
}

//Add Distructor
exports.addDistructor=async(distructorKeyword)=>{
    
    var distructor = await Distructor.findOne({distructor:distructorKeyword})
     if(!distructor){
      distructor= await Distructor({distructor:distructorKeyword})
      await distructor.save()
    }
    
    return distructor._id.toString()

}

//Link Distructor To Question
exports.LinkDistructorToQuestion=async(distructorid,Question_id)=>{
    const distructor= await Distructor.findOne({_id:distructorid})
    if (!distructor){
        throw new Error('there is no such a distructor')
    }
    x=distructor.Question_id.find((e)=>e.toString()===Question_id.toString())
    if(!x){
    distructor.Question_id.push(Question_id)
   await distructor.save()
    }
    else{
        console.log('in')
    }
}
//remove question from distructor
exports.removeFromDistructor=async(question_id ,distructor_id)=>{
    try{
    const distructor =await Distructor.findOne({_id:distructor_id})
    if(!distructor){
        throw new Error('there is no such a distructor')
    }
    distructor.Question_id.remove(question_id)
    await distructor.save()
    if(distructor.Question_id.length===0){
        await distructor.remove()
    }
}catch(e){
    console.log(e)
}
    
}
//Edit distructor
exports.Edit_distructor=async(_id,new_distructor )=>{
    const dis= await Distructor.findById({_id})
    if(!dis){
        throw new Error('there is no such a distructor')

    }
    dis.distructor=new_distructor
     await dis.save()
     return dis._id
}

//Generate distructors
