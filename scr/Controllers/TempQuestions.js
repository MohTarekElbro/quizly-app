const TempQuestion=require('../models/TempQuestion')
const DomainController=require('../Controllers/domain')
const instructor=require('./instructor')
var datetime = require('node-datetime');

//Add New Exam
exports.Add_Questions=async(req,res)=>{
    try{
        const Questions= new TempQuestion({
            ...req.body,
            date:datetime.create().now()
                });
        Questions.date.setHours(Questions.date.getHours() + 2);
        await Questions.save();
        return res.status(201).send(Questions);
    
    }catch(e){
        console.log(e)
        res.status(500).send(e)
    }

}



// Delete Exam
exports.GetAndDelete_Questions=async(req,res)=>{
    try{
        const Questions=await TempQuestion.findOne({owner:req.instructor._id})
        if(!Questions){
            return res.status(404).send('There is no such an Questions!!')
        }
        temp=JSON.parse(JSON.stringify(Questions))
       await Questions.remove()
       return res.status(200).send(temp)

    }catch(e){
        console.log(e)
        return res.status(500).send(e)

    }

}




