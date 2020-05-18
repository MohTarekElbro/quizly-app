require('./scr/db-con/mongoose')
require('dotenv').config({ path: './configurations/dev.env' })
const path = require("path");


const express = require('express')
const app = express()
app.use((req, res, next) => {
    res.append('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH');
    res.append('Access-Control-Allow-Headers', 'Content-Type');
    res.append('Access-Control-Allow-Headers', 'Authorization');
    next();
});
var http = require('http').createServer(app);
const io = require('socket.io')(http);


const AdminRoutes = require('./scr/routes/Admin')
const DomainRouts = require('./scr/routes/domain')
const ExamRoutes = require('./scr/routes/Exam')
const distructorRoutes = require('./scr/routes/distructor')
const QuestionRoutes = require('./scr/routes/Question')
const FeedbackRoutes = require('./scr/routes/Feedback')
const RequestRoutes = require('./scr/routes/DomainRequests')
const Not = require('./scr/routes/Notification')

const port = process.env.PORT
const InstructorRoutes = require('./scr/routes/instructor')

app.use(express.static(path.join(__dirname, "JavaScript")));
app.use(express.json())

app.use(Not)
app.use(InstructorRoutes)
app.use(AdminRoutes)
app.use(DomainRouts)
app.use(ExamRoutes)
app.use(distructorRoutes)
app.use(QuestionRoutes)
app.use(FeedbackRoutes)
app.use(RequestRoutes)



// const DistructorController= require('./scr/Controllers/distructor')
// const fun=async()=>{
//     const new_id =await DistructorController.Edit_distructor('5e72aa0e8ce61a310810181d','un')
//     console.log(new_id)

// }
// fun()

// const ExamController=require('./scr/Controllers/Exam')
// const fun=async()=>{
//     const Questions= await ExamController.Add_Questions_of_exam_to_QB(['5e84cf35d682c333248a179d'])

//     console.log(Questions)
// }


// fun()

// const instructorcontroller= require('./scr/Controllers/instructor')
// const fun=async()=>{
//     const instructor=await instructorcontroller.x('5e95bbb90df34042e8541250')
//     return instructor

// }
// fun()
// const funn=async()=>{
//     const Question=await questioncontroller.Select_Questions(['5e8492e760f56f13b027eb0b','5e8492b260f56f13b027eb09'])

//     const ids= await questioncontroller.Select_Question(Question)
//     console.log(ids)
// }
// funn()






// Subscribe Route




http.listen(port, function () {
    console.log("Listening on ", port);
});



io.on('connection',function(socket) {
    socket.on('AddRequest', () => {
        io.emit('Send');
        io.emit('GetNumberOfNotification')
     });
  });







