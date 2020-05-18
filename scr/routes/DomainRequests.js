const express=require('express')
const Auth= require('../middleware/Auth')
const router=new express.Router()
const RequestController= require('../Controllers/DomainRequests')

// send a domain request
router.post('/domain/request',Auth.Auth,RequestController.material.single('material'),RequestController.Send_Domain_Request )

//vote on a request
// router.post('/domain/vote/:requested_domain_id',Auth.Auth,RequestController.Vote_on_Request)

//show all Requests 
router.get('/domain/requests/list',Auth.Auth,RequestController.Show_domain_Requests)

//show all Requests -admin-
router.get('/admin/domain/requests',Auth.AdminAuth,RequestController.Show_domain_Requests)

//Delete Request
router.delete('/domain/request/delete:id',Auth.Auth,RequestController.deleteDomainRequest)


module.exports=router