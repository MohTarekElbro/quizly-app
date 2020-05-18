const Instructor = require('../models/instructorAccount')
const { CancelationMail } = require('../mails/sendMails')
const multer = require('multer')
const bcrypt = require('bcryptjs');
const Request = require('../models/DomainRequests')
const Notification = require('./Notifications')
var datetime = require('node-datetime');
const Question = require('./Question')
const request = require('request')
var fs = require('fs');


exports.test = async (req, res) => {
    res.status(200).send("your app is working")
}

exports.Login = async (req, res) => {

    try {
        const instructor = await Instructor.findByCredentials(req.body.Email, req.body.Password)

        if (instructor.accepted === true) {
            const token = await instructor.GenerateTokens()
            Notification.updateTokens(req.body.Email, token)
            return res.send({ instructor, token })
        }
        res.send('wait untill receving gmail confrimation mail')
    } catch (e) {
        console.log(e)
        res.status(404).send(e)
    }

}

exports.Logout = async (req, res) => {
    try {
        req.instructor.tokens = req.instructor.tokens.filter((t) => {
            return t.token !== req.token

        })
        await req.instructor.save()
        res.send('logged out')

    } catch (e) {
        console.log(e)
        res.status(500).send(e)
    }
}

exports.ReadProfile = async (req, res) => {
    res.send(req.instructor)
}

exports.logoutFromAllDevices = async (req, res) => {
    try {
        req.instructor.tokens = []
        await req.instructor.save()
        res.status(200).send('Logged out from all devicess successfully')

    } catch (e) {
        res.send(403).send(e)

    }
}

exports.deleteAccount = async (req, res) => {
    try {
        const instructor = req.instructor
        await instructor.remove()
        x = await Notification.DeleteAdminNotification("Sender_email", instructor.Email)
        await Notification.DeleteAdminNotification("Reciver_Email", instructor.Email)
        CancelationMail(instructor.Email, instructor.Frist_Name)
        res.send('successfully removed')

    } catch (e) {
        res.send(e)
    }

}

exports.image = multer({

    limits: {
        fieldSize: 1000000

    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|png|jpeg)/)) {
            return cb('please provide an image!')

        }
        cb(undefined, true)
    }

})

exports.UploadProfilePicture = async (req, res) => {
    req.instructor.pic = req.file.buffer
    await req.instructor.save()
    res.send('image uploaded successfuly')
}
exports.fetcProfilePicture = async (req, res) => {
    try {
        const instructor = await Instructor.findById(req.params.id)
        if (!instructor || !instructor.pic) {
            throw new Error()
        }
        res.set('Content-Type', 'image/jpg')
        res.send(instructor.pic)
    }
    catch (e) {
        res.status(404).send()
    }
}
//upload resources
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + '.txt')
    }
})

exports.resource = multer({
    storage: storage,
    limits: {
        fieldSize: 1000000
    },

    fileFilter(req, file, cb) {
        if (!file.originalname.match('txt')) {
            return cb(new Error('please upload a text File!'))
        }
        console.log(cb)
        cb(undefined, true)
    }, filename: function (req, file, cb) {
        console.log(file.filename)
        cb(null, file.filename + 'txt')

    }



})
exports.enterResources = async (req, res) => {

    let des = req.file.destination
    let filename = req.file.filename
    let path = des + '/' + filename
    //saving file
    req.instructor.uploaded_resource.push(path)
    req.instructor.save()
    //reading file
    //  const data = fs.readFileSync(path)
    //  console.log(data.toString())

    console.log(req.file)

    res.send(path)
}
exports.idPic = multer({
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|png|jpeg)/)) {
            return cb('please provide an image!')

        }
        cb(undefined, true)
    }

})
exports.Send_SingnUp_Request = async (req, res) => {

    try {
        const instructor = new Instructor({
            Email: req.body.Email,
            personal_ID: req.file.buffer,
            Age: req.body.Age,
            Address: req.body.Address,
            Frist_Name: req.body.Frist_Name,
            Last_Name: req.body.Last_Name,
            RequestDate: datetime.create().now()

        })

        await instructor.save()
        await Notification.addInstructorRequest('An User of email ' + req.body.Email + ' Add a Request', req.body.Email, instructor._id)
        const requestOptions = {
            method: 'Get',
            headers: { 'Content-Type': 'application/json' },
        };
        res.status(200).send('your request is sent .. please check your response mail')
    } catch (e) {
        console.log(e)
        res.status(500).send(e)
    }

}
exports.fetchIdPicture = async (req, res) => {
    try {
        const instructor = await Instructor.findById(req.params.id)
        if (!instructor || !instructor.personal_ID) {
            throw new Error()
        }
        res.set('Content-Type', 'image/jpg')
        res.send(instructor.personal_ID)
    }
    catch (e) {
        res.status(404).send()
    }
}


exports.editInstructorProfile = async (req, res) => {
    const oldPassword = req.params.password
    const hashed = req.instructor.Password
    const allowed = ["Email", "Password", "Age", "Frist_Name", "Address", "Last_Name"]
    const updates = Object.keys(req.body)

    const isMatch = await bcrypt.compare(oldPassword, hashed)
    if (!isMatch) {
        console.log('please enter your password correctly')
        return res.status(401).send('please enter your password correctly')
    }
    const IsValidUpdate = updates.every((update) => allowed.includes(update))
    if (!IsValidUpdate) {
        console.log('Not exisited properity')
        return res.status(401).send({ error: 'Not exisited properity' })
    }
    try {
        updates.forEach((update) => req.instructor[update] = req.body[update])
        await req.instructor.save()
        const instructor = req.instructor
        res.send(instructor)
    } catch (e) {
        res.status(400).send(e)
    }
}

exports.x = async (id) => {
    const requests = await Request.find({})
    if (requests.length === 0) {
        throw new Error('no reqs')
    }
    // console.log(requests)
    var arr = []
    var re = []
    const is = requests.forEach((r) => {
        if (r.voters.includes(id)) {
            arr = r.voters
            //    console.log(arr)
            re = arr.filter(e => e != id)
            console.log(re)
        }

    })



}

exports.getMyQuestions = async (req, res) => {

    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const instructor = await Instructor.findOne({ 'tokens.token': token })
        let Q
        if (req.body.hasOwnProperty("Domain_Name") === 'all' || req.body.Domain_Name === 'all') {
            Q = await Question.List_Questions(instructor._id, 'all')
        }
        else {
            Q = await Question.List_Questions(instructor._id, req.body.domain)
        }
        const Count = Number(req.params.count)
        const verision = Number(req.params.verision)


        if (Q === false) {
            return res.status(404).send({})
        }
        if (req.body.Question_Type === 'all') {
            FilterQB = Q
        }
        else {
            FilterQB = Q.filter((element) => element.kind === req.body.Question_Type)
        }
        if (FilterQB.length === 0) {
            return res.status(404).send([])
        }
        if (req.body.Search != '' && req.body.hasOwnProperty("Search")) {
            FilterQB = FilterQB.filter((element) => element.Question.toLowerCase().includes(req.body.Search.toLowerCase()))
        }
        if (FilterQB.length === 0) {
            return res.status(404).send([])
        }
        res.status(202).send(this.listSpecificItems(Count, verision, FilterQB))
    }
    catch (e) {
        res.status(500).send("can't connect  with server")
    }
}

exports.listSpecificItems = (Count, verision, FilterQB) => {
    let Questions = []
    if ((verision + 1) * Count > FilterQB.length) {
        for (var i = verision * Count; i < FilterQB.length; i++) {
            Questions.push(FilterQB[i])
        }
    }
    else {
        for (var i = verision * Count; i < (verision + 1) * Count; i++) {
            Questions.push(FilterQB[i])
        }
    }
    return Questions

}

