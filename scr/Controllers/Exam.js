const Exam=require('../models/Exam')
const DomainController=require('../Controllers/domain')
const QuestionController=require('../Controllers/Question')
const Question=require('../models/Question')
const Complete = require('../models/complete')
const TrueOrFalse = require('../models/TrueOrFalse')
const MCQ = require('../models/mcq')
const instructor=require('./instructor')

//Add New Exam
exports.Add_New_Exam=async(req,res)=>{
    try{
        //select domain
        const domain=await DomainController.Selectdomain(req.body.domain_name)
        
        // select Questions
        check=await this.checkexistExams({id:req.instructor._id,questions:req.body.Questions})
        //exam object
        if(check.flag){
        const exam= new Exam({
            ...req.body,
            owner: req.instructor._id,
            domain,
                })

        await exam.save()
        Myexam=await this.GetExamsQuestions(exam.Questions)
        Myexam={Myexam}
        Myexam._id=exam._id
        return res.status(201).send(Myexam)
    }
    res.status(300).send({"massage":"you already have the same Exam"})

    }catch(e){
        console.log(e)
        res.status(500).send(e)
    }

}
//get Exams Questions
exports.GetExamsQuestions= async(Q)=>{
    let myq=[]
    for(var i=0;i<Q.length;i++){
       x= await Question.findById(Q[i])
       x=JSON.parse(JSON.stringify(x))
       if(x.hasOwnProperty('distructor')){
        if(x.kind ==='T/F'){
            y=await TrueOrFalse.findById(Q[i]).populate({
                path: 'domain',
                select: 'domain_name'
            }).populate({
                path: 'owner',
                select: 'Email'
            }).populate({
                path: 'distructor',
                select: 'distructor'
            }) 
            y=JSON.parse(JSON.stringify(y))
            myq.push({'Question':y.Question,'Level':y.Level,'state':y.state,'keyword':y.keyword,'distructor':y.distructor,'kind':y.kind})
        }
        else{
            y= await MCQ.findById(Q[i]).populate({
                path: 'domain',
                select: 'domain_name'
            }).populate({
                path: 'owner',
                select: 'Email'
            }).populate({
                path: 'distructor',
                select: 'distructor'
            })
            y=JSON.parse(JSON.stringify(y))
            myq.push({'Question':y.Question,'Level':y.Level,'keyword':y.keyword,'distructor':y.distructor,'kind':y.kind})
        
        }
       }
       else if (x.hasOwnProperty('Question')){
        y=await Complete.findById(Q[i])
        myq.push({'Question':y.Question,'Level':y.Level,'keyword':y.keyword,'kind':y.kind})
       }
    }
    return myq
}

//compare the Exam
exports.checkexistExams = async (Q)=>{
    myexams=await Exam.find({owner:Q.id})
    let check ={exam:'',flag:true}
    if(myexams.length >0){
        myexams.forEach(element => {
            var c = 0
            if(element.Questions.length === Q.questions.length){
            for(var i=0;i<element.Questions.length;i++){
                for(var n =0;n<Q.questions.length;n++){
                    if(element.Questions[i] == Q.questions[n]){
                        c=c+1
                        break
                    }
                }
                if(c === Q.questions.length){
                    check.flag= false
                    check.exam=JSON.parse(JSON.stringify(element))
                    break
                }
            }
        }
        });
        return check
    }
    return check
}

//veiw past exams
exports.View_Past_Exams=async (req,res)=>{
    try{
        await req.instructor.populate('Exams').execPopulate()
        Allex=JSON.parse(JSON.stringify(req.instructor.Exams))
        let exam=[]
        let FilterExam=[]
        const Count = Number(req.params.count)
        const verision = Number(req.params.verision)
        if(req.body.hasOwnProperty('Domain_Name') && req.body.Domain_Name!=''){
            for(var i=0;i<Allex.length;i++){
                domain=await DomainController.Selectdomain(req.body.Domain_Name)
                domain=JSON.parse(JSON.stringify(domain))
                if(domain == Allex[i].domain){
                    exam.push(Allex[i])
                }
            }
            if(exam.length ===0){
                return res.status(300).send({"massage":"no Exams Found On That Domain"})
            }
        }
        else{
            exam=Allex
        }

        if(req.body.hasOwnProperty('Search') && req.body.Search!=''){
            if(req.body.Search.hasOwnProperty('StartQuestion') && req.body.Search.StartQuestion!=''){
                FilterExam=exam.filter((e)=>{
                    if(e.Questions.length >= Number(req.body.Search.StartQuestion) && e.Questions.length <=Number(req.body.Search.EndQuestion)){
                        return e
                    }
                })
                if(FilterExam.length === 0){
                    return res.status(300).send({"massage":"The Questions Is Out Of Range"})
                }
            }
            else{
                FilterExam=exam
            }
            if(req.body.Search.hasOwnProperty('StartDate') && req.body.Search.StartDate!=''){
                FilterExam=FilterExam.filter((e)=>{
                    if(new Date(e.createdAt) >=new Date(req.body.Search.StartDate) && new Date(e.createdAt) <= new Date(req.body.Search.EndDate)){
                        console.log('e')
                        return e
                    }
                    console.log(FilterExam)
                })
                if(FilterExam.length === 0){
                    return res.status(300).send({"massage":"The Date Is Out Of Range"})
                }
            }
            if(req.body.Search.hasOwnProperty('StartDuration') && req.body.Search.StartDate!='' && req.body.Search.hasOwnProperty('EndDuration') && req.body.Search.EndDate!=''){
                FilterExam=FilterExam.filter((e)=>{
                    if(e.duration >=Number(req.body.Search.StartDuration) && e.duration <= Number(req.body.Search.EndDuration)){
                        return e
                    }
                    console.log(FilterExam)
                })
                if(FilterExam.length === 0){
                    return res.status(300).send({"massage":"The Duration Is Out Of Range"})
                }
            }
            if(req.body.Search.hasOwnProperty('university') && req.body.Search.university!=''){
                FilterExam=FilterExam.filter((e)=>{
                    if(e.university === req.body.Search.university){
                        return e
                    }
                    console.log(FilterExam)
                })
                if(FilterExam.length === 0){
                    return res.status(300).send({"massage":"The University Is Out Of Range"})
                }
            }
            if(req.body.Search.hasOwnProperty('faculty') && req.body.Search.faculty!=''){
                FilterExam=FilterExam.filter((e)=>{
                    if(e.faculty === req.body.Search.faculty){
                        return e
                    }
                    console.log(FilterExam)
                })
                if(FilterExam.length === 0){
                    return res.status(300).send({"massage":"The faculty Is Out Of Range"})
                }
            }
                FilterExam=instructor.listSpecificItems(Count, verision, FilterExam)
            let Final=[]
            for(var i =0;i<FilterExam.length;i++){
                Myexam=await this.GetExamsQuestions(FilterExam[i].Questions)
                Final.push({_id:FilterExam[i]._id,duration:FilterExam[i].duration,university:FilterExam[i].university,faculty:FilterExam[i].faculty,Myexam})
            }
            return res.status(200).send(Final)
        }
        let Final=[]
        FilterExam=instructor.listSpecificItems(Count, verision, exam)
        for(var i =0;i<FilterExam.length;i++){
            Myexam=await this.GetExamsQuestions(FilterExam[i].Questions)
            Final.push({_id:FilterExam[i]._id,duration:FilterExam[i].duration,university:FilterExam[i].university,faculty:FilterExam[i].faculty,Myexam})
        }
        res.status(200).send(Final)
    }catch(e){
        console.log(e)
        res.status(500).send(e)
    }
    
}
//selete exam
exports.Select_Exam=async(req,res)=>{
    try{
        const exam = await Exam.findOne({_id:req.params.id}).populate({
            path:'owner',
            select:'Email'
        }).populate({
            path:'domain',
            select:'domain_name'
            
        }).populate({
            path:'Questions',
            select:'Question'
        })
        if(!exam){
            return res.status(404).send('No Such an Exam')

        }
        res.status(200).send(exam)

    }catch(e){
        console.log(e)
        res.status(500).send(e)
    }
}

// Delete Exam
exports.Delete_Exam=async(req,res)=>{
    try{
        const exam=await Exam.findOne({_id:req.params.id})
        if(!exam){
            res.status(404).send('There is no such an exam!!')
        }
       await exam.remove()
       res.status(200).send(exam)

    }catch(e){
        console.log(e)
        res.status(500).send(e)

    }

}
//get all questions of exam
exports.Search_exam=async(_id)=>{
    const Array_of_Questions=[]
    const exam = await Exam.findOne({_id}).populate('Questions','Question')
    console.log(exam.Questions)
    
    for (let i = 0; i<exam.Questions.length ;i++) {
         Array_of_Questions[i]=exam.Questions[i].Question
       
        
    }
    
return Array_of_Questions    
    
    

}
//select Question from exam
// exports.Select_Question_from_Exam=async(question_id)=>{
//     const q
// }
// exports.Search_Question=async()


//select questions from past exams
exports.Select_Question_from_Exam=async(req,res)=>{
    try{
        const exam= await this.Search_exam(req.params.id)
       return exam.Questions
        


    }catch(e){
        console.log(e)
        res.status(500).send(e)

    }

    

}

//Edit Exam 
//print exam
//generate exam
//add questions of exam to Question bank






