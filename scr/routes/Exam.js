const express = require('express')
const Auth= require('../middleware/Auth')
const ExamContoller=require('../Controllers/Exam')

const router=new express.Router()

//Add New Exam -Create-
router.post('/exam/create',Auth.Auth,ExamContoller.Add_New_Exam)
//Delete Exam by id
router.delete('/exam/delete/:id',Auth.Auth,ExamContoller.Delete_Exam)
//veiw past exams -List-
router.post('/exam/view/:count/:verision',Auth.Auth,ExamContoller.View_Past_Exams)
//selete exam by id
router.get('/exam/view/:id',Auth.Auth,ExamContoller.Select_Exam)
//select questions from past exams
router.get('/select/pastexam/:_id',Auth.Auth,ExamContoller.Select_Question_from_Exam)


module.exports=router