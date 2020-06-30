const jwt = require('jsonwebtoken')
const Instructor = require('../models/instructorAccount')
const Admin = require('../models/AdminAccount')

const Check = async (req, res) => {
    let token = req.body.token
    try {
        if (req.body.hasOwnProperty('token')) {
            const decoded = jwt.verify(token, process.env.JWTSEC)
            const admin = await Admin.findOne({ _id: decoded._id, 'tokens.token': token })
            if (admin) {
                return res.status(201).send({
                    admin,
                    type: 'admin'
                })
            }
            const instructor = await Instructor.findOne({ _id: decoded._id, 'tokens.token': token })
            if (instructor) {
                return res.status(201).send({
                    instructor,
                    type: 'instructor'
                })
            }
            return res.status(404).send('No one has token like that ')
        }
        return res.status(400).send('please enter a token ')
    }
    catch (e) { res.status(500).send(e.message) }
}

const Auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(token, process.env.JWTSEC)
        const instructor = await Instructor.findOne({ _id: decoded._id, 'tokens.token': token })

        if (!instructor) {
            throw new Error()
        }
        req.token = token
        req.instructor = instructor
        next()

    } catch (e) {
        res.status(401).send('require Authorization!')


    }
}

const AdminAuth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(token, process.env.JWTSEC)
        const admin = await Admin.findOne({ _id: decoded._id, 'tokens.token': token })
        if (!admin) {
            throw new Error()
        }
        req.token = token
        req.admin = admin
        next()

    } catch (e) {
        res.status(401).send('require Authorization!')


    }
}
module.exports = {
    Auth,
    AdminAuth,
    Check
}
