const Domain=require('../models/domain')
const Notification = require('./Notifications')
const Request= require('../models/DomainRequests')
exports.ListDomains=async(req,res)=>{
    try{
        const domains=await Domain.find()
        if(domains.length===0){
            return res.status(404).send('No domains yet')
        }res.send(domains)


    }catch(e){

        res.send(e)
    }
}

exports.AddDomain=async(req,res)=>{
    try{
        let id= req.params.id
        domainRequest= await Request.findOne({_id:id})
        if(!domainRequest){
            res.status(404).send('there is no such a request to be added')
        }
        const domain= new Domain({
            domain_name:domainRequest.Requested_domain,
            description:domainRequest.description
        })
        await domain.save()
        await domainRequest.remove()
        let name= req.body.domain_name
        let idd= domain._id
        await Notification.addAdminNotifications(name+' Have Been Added',idd)
        res.status(201).send(domain)

    }catch(e){
        res.send(e)

    }
}

exports.RemoveDomain=async(req,res)=>{
    try{
        const domain=await Domain.findByIdAndDelete({_id:req.params.id})
        if(!domain){
            return res.status(404).send('there is no such a domain')
        }
        await Notification.DeleteAdminNotification('filterNotify',req.params.id)
        res.send(domain)

    }catch(e){
        res.send(e)

    }

}

exports.EditDomain=async(req,res)=>{
    const _id=req.params.id
    const updates=Object.keys(req.body)
    const allowed=['domain_name','description']
    const isValidUpdate= updates.every((update)=>allowed.includes(update))
    if(!isValidUpdate){
        res.status(400).send({error:'Not exisited properity'})

    }
    try{
        const domain=await Domain.findOne({_id})
        if(!domain){
            return res.status(404).send('there is no such a domain to be updated')
        }
        updates.forEach((update)=>domain[update]=req.body[update])
        domain.save()
        res.send(domain)


    }catch(e){
        res.send(e)

    }

}

exports.SelectDomain=async(req,res)=>{
    try{
        const domain= req.body.domain
        const isFound= await Domain.findOne({domain_name:domain})
        if(!isFound){
            return res.status(404).send('No Domain ')
        }
        const id= isFound._id
        res.send(id.toString())

    }catch(e){
        res.send(e)
    }
}

exports.Selectdomain=async(domain_name)=>{
    
        const domain = await Domain.findOne({domain_name})
        if(!domain){
            throw new Error('no such a domain')

        }
        return domain._id.toString()
}
