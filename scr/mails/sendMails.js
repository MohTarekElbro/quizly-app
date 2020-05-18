
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'quizli8@gmail.com',
    pass: 'nodejs123456789'
  }
});

const SendWelcomMessage=(sender,receiver,Frist_Name,password)=>{

    var mailOptions = {
        from: sender,
        to: receiver,
        subject: 'Quizili Account',
        text: `congratulations ${Frist_Name} ,Login to your new account by using Email:${receiver} and pass:${password}`
      }
      
      transporter.sendMail(mailOptions,(error)=>{
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent');
        }
})
}

 const Send_Rejection_mail=(sender,recevier , Frist_Name)=>{
  var mailOptions = {
    from: sender,
    to: recevier,
    subject: 'Quizili Account',
    text: `Sorry ${Frist_Name}, Quizili is concerned with instructors only and your data  does not prove that you are a real one `
  }
  
  transporter.sendMail(mailOptions,(error)=>{
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent');
    }
})
  
    }
    
const CancelationMail=( recevier ,Frist_Name)=>{
  var mailOptions = {
   
    to: recevier,
    subject: 'Quizili Account',
    text: `Hey ${Frist_Name}, why you did that .. give us your feedback to upgrade Quizili `
  }
  
  transporter.sendMail(mailOptions,(error)=>{
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent');
    }
})

}
module.exports={
SendWelcomMessage,
CancelationMail,

Send_Rejection_mail
}