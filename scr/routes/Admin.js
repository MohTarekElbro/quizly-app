const express=require('express')
const AdminAuth=require('../middleware/Auth')
const AdminController=require('../Controllers/admin')
const instructorController=require('../Controllers/instructor')
const Notify=require('../middleware/Notify')
const Requestcontroller=require('../Controllers/DomainRequests')

const router= new express.Router()

//create Admin once 
router.post('/Admin/signUp',AdminController.SingUp )

//Delete instructor
router.delete('/instructor/delete/:id',AdminAuth.AdminAuth,Notify.GetNumberOfNotification,AdminController.DeleteInstructorAccount)

//Login
router.post('/Login',AdminController.Login)

//Logout
router.post('/admin/logout',AdminAuth.AdminAuth,Notify.GetNumberOfNotification,AdminController.LogOut)

//Logout from All Devices 
router.post('/admin/logoutAll',AdminAuth.AdminAuth,Notify.GetNumberOfNotification,AdminController.LogOutFromAllDevices)

//edit his own profile 
router.patch('/admin/me:password',AdminAuth.AdminAuth,Notify.GetNumberOfNotification,AdminController.editAdminProfile)

// Show Sign up requests
router.get('/admin/singuprequests/:count/:verision',AdminAuth.AdminAuth,Notify.GetNumberOfNotification,AdminController.List_signUp_Requests)

//select request
router.get('/admin/singuprequests/:id',AdminAuth.AdminAuth,Notify.GetNumberOfNotification,AdminController.Select_SingUp_Request)

//add instructor or Accept SingUp Request
router.post('/admin/singuprequests/:id/accept',AdminAuth.AdminAuth,Notify.GetNumberOfNotification,AdminController.Add_instructor)

// reject instructor request
router.post('/admin/singuprequests/:id/reject',AdminAuth.AdminAuth,Notify.GetNumberOfNotification,AdminController.Reject_instructor_request)

//send mail when adding new domain (pending) -push notification service-

//edit QB(pending)

//fetch pic on web 
router.get('/admin/:id/pic',AdminController.fetcProfilePicture)

//upload image
router.post('/admin/upload/profilePicture',AdminAuth.AdminAuth,Notify.GetNumberOfNotification,instructorController.image.single('image'),AdminController.UploadProfilePicture)

//List instructors
router.get('/admin/instructors',AdminAuth.AdminAuth,Notify.GetNumberOfNotification,AdminController.List_instructors)

//delete profile pic
router.post('/admin/profilepic/delete',AdminAuth.AdminAuth,Notify.GetNumberOfNotification,AdminController.deleteProfilepic)

// select request 
router.get('/admin/domainrequests/:id',AdminAuth.AdminAuth,Requestcontroller.selectRequest)

module.exports=router
