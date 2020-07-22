const express=require('express')
const AdminAuth=require('../middleware/Auth')
const DomainController=require('../Controllers/domain')



const router=new express.Router()

//Add new domain
router.post('/admin/domainrequests/:id/add',AdminAuth.AdminAuth,DomainController.AddDomain)

router.post('/admin/domains/add',AdminAuth.AdminAuth,DomainController.AddNewDomain)

//Remove domain
router.delete('/domain/:id',AdminAuth.AdminAuth,DomainController.RemoveDomain)

//edit domain
router.patch('/domain/edit/:id',AdminAuth.AdminAuth, DomainController.EditDomain)
//list domains
router.get('/domain',DomainController.ListDomains)

//select domain
router.get('/domain/select',AdminAuth.Auth,DomainController.SelectDomain)


module.exports=router