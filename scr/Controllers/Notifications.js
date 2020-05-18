const webpush = require("web-push");
const Instructor = require('../models/instructorAccount')
const Notification = require('../models/Notification')
const Admin = require('../models/AdminAccount')
var datetime = require('node-datetime');


// Set static path



webpush.setVapidDetails(
    "mailto:omarrasmy00@gmail.com",
    process.env.publicVapidKey,
    process.env.privateVapidKey
);


exports.addAdminNotifications = async (Description,filterNotify) => {
    try {
        const instructors = await Instructor.find({ accepted: true })
        if (instructors.length === 0) {
            return 0
        }

        instructors.forEach((instructor) => {
            x = new Notification({
                Sender_email: 'Admin',
                Reciver_Email: instructor.Email,
                tokens: instructor.tokens,
                Discription: Description,
                date:datetime.create().now(),
                filterNotify
            });
            x.date.setHours(x.date.getHours() + 2)
            x.save()
        });
        return 1
    } catch (e) {
        console.log(e)
        return -1
    }
}

exports.addInstructorRequest = async (Description, Email,filterNotify) => {
    try {
        const instructors = await Instructor.find({ Email })
        const admins = await Admin.find({})
        if (!admins) {
            return 0
        }
        admins.forEach((admin) => {
            x = new Notification({
                Sender_email: Email,
                Reciver_Email: admin.email,
                tokens: admin.tokens,
                Discription: Description,
                date:datetime.create().now(),
                filterNotify
            })
            x.date.setHours(x.date.getHours() + 2)
            x.save()
        })

        return 1
    } catch (e) {
        console.log(e)
        return -1
    }
}

exports.DeleteAdminNotification = async (typ,value) => {
    try {
        x = await Notification.deleteMany({[typ]:value })
        return x.deletedCount
    } catch (e) {
        return 0
    }
}

exports.ListSpecificNotification = async (req, res) => {
    try {
        user = await Notification.find({ Reciver_Email: req.params.Reciver_Email })
        if (!user) {
            return res.status(404).send('No user with this mail')
        }
        else if (user.length == 0) {
            return res.status(404).send('There is no Notification for that user')
        }
        user.sort((a, b) => new Date(b.date) - new Date(a.date))
        let Notify = []
        if (req.params.verision === 'all' || req.params.count === 'all') {
            return res.status(200).send(user)
        }
        const Count = Number(req.params.count)
        const verision = Number(req.params.verision)
        if ((verision + 1) * Count > user.length) {
            console.log(user.length)
            for (var i = verision * Count; i < user.length; i++) {
                Notify.push(user[i])
            }
        }
        else {
            for (var i = verision * Count; i < (verision + 1) * Count; i++) {
                Notify.push(user[i])
            }
        }
        res.status(200).send(Notify)
    } catch (e) {
        console.log(e)
        return res.status(500).send(e)
    }

}


exports.SeenNotification = async (req, res) => {
    Notif = await Notification.findById(req.params.id).catch(e => { return res.status(500).send(e) })
    if (!Notif) {
        return res.status(404).send('No Notification With This ID')
    }
    Notif.Seen = true
    await Notif.save().catch(e => { return res.status(500).send(e) })
    res.status(202).send(Notif)
}

// Subscribe Route
exports.updateTokens = async (email, token) => {
    Not = await Notification.find({ Reciver_Email: email })
    if (!Not) {
        return 0;
    }
    for (var i = 0; i < Not.length; i++) {
        if (Not[i].pushFlag === false) {
            Not[i].tokens = Not[i].tokens.concat({ token })
            Not[i].save()
        }
    }

}

// Subscribe Route
exports.PushNotification = async (req, res) => {
    // Get pushSubscription object
    const token = req.header('Authorization').replace('Bearer ', '')
    Notif = await Notification.find({})
    if (!Notif) {
        return res.status(200)
    }
    var id
    var NotifcationContent
    for (var i = 0; i < Notif.length; i++) {
        id = Notif[i].tokens.find(usertoken => usertoken.token == token)
        if (id) {
            x = Notif[i].tokens.indexOf(id)
            NotifcationContent = Notif[i]
            Notif[i].tokens.splice(x, 1)
            await Notif[i].save()
            break;

        }
    }
    if (id) {
        if (NotifcationContent.pushFlag === false) {
            NotifcationContent.pushFlag = true
            NotifcationContent.save()
            const subscription = req.body;

            // Send 201 - resource created
            res.status(201).json({});

            // Create payload
            const payload = JSON.stringify({ title: "Quizy", Description: Notification.Description, url: "http://localhost:3000/adminHome/adminInstractors" });
            // Pass object into sendNotification
            webpush
                .sendNotification(subscription, payload)
                .catch(err => console.error(err));
        }

    }

}


exports.GetNumberOfNotification = async (req, res) => {
    // Get pushSubscription object
    const token = req.header('Authorization').replace('Bearer ', '')
    Notif = await Notification.find({})
    if (!Notif) {
        return res.status(404)
    }
    var id
    var NotifcationContent = []
    for (var i = 0; i < Notif.length; i++) {
        id = Notif[i].tokens.find(usertoken => usertoken.token == token)
        if (id) {
            y = Notif[i].tokens.indexOf(id)
            NotifcationContent.push(Notif[i])
        }
    }
    if (NotifcationContent.length != 0) {
        return res.status(202).send({ Count: NotifcationContent.length })
    }
    else {
        return res.status(404).send({})
    }


}
