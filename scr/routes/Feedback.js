const express= require('express')
const router=new express.Router()
const FeedbackController= require('../Controllers/Feedback')
const Auth=require('../middleware/Auth')


//Write(send) feedback
router.post('/feedback/write',Auth.Auth,FeedbackController.write_feedback)
//receive feedback
router.post('/set/feedbacks/:count/:verision',Auth.Auth,FeedbackController.List_Feedbacks)

router.post('/admin/set/feedbacks/:count/:verision',Auth.AdminAuth,FeedbackController.List_Feedbacks)

//delete Feedback
router.delete('/delete/feedback/:id',Auth.Auth,FeedbackController.DeleteMyfeeback)

module.exports=router