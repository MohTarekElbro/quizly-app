const Request= require('../models/DomainRequests')
const multer =require('multer')

exports.material=multer({
    dest: 'Materials',
    fileFilter(req, file, cb) {
        if (!file.originalname.match('pdf')) {
            return cb('please provide your material As a pdf !')

        }
        cb(undefined, true)
    }
})
exports.Send_Domain_Request=async(req,res)=>{
    try{
        let x= req.file.path
         let path='.\\'+x+'.pdf'
        
        const request=new Request({
            
            requester:req.instructor._id,
            Requested_domain:req.body.Requested_domain,
            description:req.body.description,
            material:path

        })
       
        await request.save()
        req.instructor.requests=request._id
        await req.instructor.save()
        const data= await Request.findOne({_id:request._id}).populate('requester',"Email")
        res.status(201).send(data)

    }catch(e){
        console.log(e)
        res.status(500).send(e)
    }

}

// exports.Vote_on_Request=async(req,res)=>{
//     try{
//         const requested_domain =await Request.findOne({_id:req.params.requested_domain_id})
        
//         // .populate({
//         //     path:'requester',
//         //     select:'Email'
//         // })
//         if(!requested_domain){
//            return res.status(404).send('Not found')
//         }
//         // console.log(requested_domain.requester._id)
//         // if(req.instructor._id.equals(requested_domain.requester._id)){
//         //     return res.status(400).send('you already voted As you are the requester!')

//         // }
//         // console.log('.....')

//         if(requested_domain.voters.includes(req.instructor._id)){
//             return res.status(400).send('you already voted !!')
//         }
//         requested_domain.votes++
//         console.log(requested_domain.voters)
//         requested_domain.voters.push(req.instructor._id)
//         await requested_domain.save()

//         res.send(requested_domain)


//     }catch(e){
//         console.log(e)
//         res.status(500).send(e)
//     }
// }

exports.Show_domain_Requests=async(req,res)=>{
    try{
        const requests=await Request.find({})
        
        if(requests.length===0){
            res.status(404).send('No requests')
        }

        res.status(200).send(requests)

    }catch(e){
        console.log(e)
        res.status(500).send(e)
    }
}
exports.deleteDomainRequest=async(req,res)=>{
    try{
        const request= await Request.findOne({_id:req.params.id ,requester:req.instructor._id})
        if(!request){
            return res.status(404).send('Not Found')
        }
    
         req.instructor.requests=undefined
       await req.instructor.save()
       console.log(req.instructor.requests)
        await request.remove()
        res.status(200).send('request removed')

    }catch(e){
        console.log(e)
        res.status(500).send(e)
    }
}
exports.selectRequest=async(req,res)=>{
    try{
     let id=req.params.id
        const request= await Request.findOne({_id:id})
        if(!request){
          return  res.status(404).send('no request to be selected')
        }
        res.status(200).send(request)

    }catch(e){
        console.log(e)
        res.status(500).send(e)
    }
}

