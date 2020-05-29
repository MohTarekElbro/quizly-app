const TempQuestion=require('../models/TempQuestion')
const DomainController=require('../Controllers/domain')
const instructor=require('./instructor')
var datetime = require('node-datetime');
const socketIOClient=require('socket.io-client')
// const ENDPOINT = process.env.PORT;
const ENDPOINT = 'https://quizly-app.herokuapp.com:'+process.env.PORT;
const socket = socketIOClient(ENDPOINT);


//Add New Exam
exports.Add_Questions=async(req,res)=>{
    console.log(ENDPOINT)
    try{
        const Questions= new TempQuestion({
            ...req.body,
            date:datetime.create().now()
                });
        Questions.date.setHours(Questions.date.getHours() + 2);
        await Questions.save();
        socket.emit('questionsReady')
        return res.status(201).send(Questions);
    
    }catch(e){
        console.log(e)
        res.status(500).send(e)
    }

}



// Delete Exam
exports.GetTempQuestions=async(req,res)=>{
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


exports.Delete_Questions=async(ID)=>{
    try{
        const Questions=await TempQuestion.deleteOne({owner:ID})
        if(!Questions){
            return 0
        }
        return 1

    }catch(e){
        console.log(e)
        return 0

    }

}





