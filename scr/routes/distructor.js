const express=require('express')
const Auth= require('../middleware/Auth')
const DistructorController=require('../Controllers/distructor')

const router= new express.Router()
//Add distructor
router.post('/distructor/add/:Question_id',Auth.Auth,DistructorController.AddNewDistructor)

//delete distructor
router.delete('/distructor/delete/:_id',Auth.Auth,DistructorController.DeleteDistructor)

//Edit Distructor
router.patch('/distructor/edit/:_id',Auth.Auth,DistructorController.EditDistructor)

//Generate distructors



module.exports=router