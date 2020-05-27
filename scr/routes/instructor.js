const express = require('express')
const Auth=require('../middleware/Auth')
const instructorController=require('../Controllers/instructor')
const router = new express.Router()
const Notify=require('../middleware/Notify')
const multer=require('multer')
const QuestionController = require('../Controllers/Question')
const TempQuestions=require('../Controllers/TempQuestions')
// send Account request 
router.post('/instructor/signup', instructorController.idPic.single('idPic'),instructorController.Send_SingnUp_Request)

//Login 
router.post('/instructor/login',instructorController.Login)  
router.get('/instructor/test',instructorController.test) 

//upload resources
router.post('/upload/resources',Auth.Auth,Notify.GetNumberOfNotification,instructorController.resource.single('resource'),instructorController.enterResources)


//upload image
router.post('/upload/profilePicture',Auth.Auth,Notify.GetNumberOfNotification,instructorController.image.single('image'),instructorController.UploadProfilePicture)

// read his profile
router.get('/instructor/me',Auth.Auth,Notify.GetNumberOfNotification,instructorController.ReadProfile)

// Delete  his own account 
 router.delete('/instructor/delete',Auth.Auth,Notify.GetNumberOfNotification,instructorController.deleteAccount)

 //send feedback to Admin -done look at feedback route-

 //logout 
 router.post('/instructor/logout',Auth.Auth,Notify.GetNumberOfNotification,instructorController.Logout)

 //logout from all devices
  router.post('/instructor/logoutfromall',Auth.Auth,Notify.GetNumberOfNotification,instructorController.logoutFromAllDevices)

  //fetch pic on web 
router.get('/instructor/:id/pic',instructorController.fetcProfilePicture)

  //fetch Id picture on web 
router.get('/instructor/:id/picId',instructorController.fetchIdPicture)


router.patch('/instructor/editme:password',Auth.Auth,Notify.GetNumberOfNotification,instructorController.editInstructorProfile)

//get Instructor Questions 

router.post('/instructor/getmyQuestions/:count/:verision',Auth.Auth,instructorController.getMyQuestions)

//Add Questions
router.post('/instructor/AddQuestion',Auth.Auth,QuestionController.Add_Questions)

// add temp questions
router.post('/instructor/AddTempQuestion',TempQuestions.Add_Questions)

//get Temp Questions
router.get('/instructor/GetTempQuestions',Auth.Auth,TempQuestions.GetAndDelete_Questions)




module.exports=router

