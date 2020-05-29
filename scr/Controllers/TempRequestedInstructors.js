const RequestedInstructor=require('../models/TempRequestedInstructor')
const DomainController=require('../Controllers/domain')
const instructor=require('./instructor')
var datetime = require('node-datetime');

//Add New Exam
exports.Add_Request=async(ID)=>{
    try{

        const Request=new RequestedInstructor(
           {
            owner:ID,
            date:datetime.create().now()
           }
           );
           Request.date.setHours(Request.date.getHours() + 2);
           await Request.save()
           return 1

       
    }catch(e){
        console.log(e)
        return 0
    }

}



// Delete Exam
exports.GetRequest=async(req,res)=>{
    try{
        const Request=await RequestedInstructor.findOne({owner:req.instructor._id})
        if(!Request){
            return res.status(400).send('No Such Request For That User!!')
        }
        temp=JSON.parse(JSON.stringify(Request))
       await Request.remove()
       return res.status(200).send(temp)

    }catch(e){
        console.log(e)
        return res.status(500).send(e)

    }

}
exports.DeleteRequest=async(ID)=>{
    try{

        const del=await RequestedInstructor.deleteOne({owner:ID});
        return 1
    }catch(e){
        console.log(e)
        return 0
    }

}




