const mongoose = require('mongoose')
const validator = require('validator')
const uniqueValidator = require('mongoose-unique-validator')
const validateInteger = require('mongoose-integer')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt');
const Exam = require('./Exam')
const Request = require('./DomainRequests')


const InstructorSchema = new mongoose.Schema(
    {
        Email: {
            type: String,
            required: true,
            trim: true,
            unique: true,
            lowercase: true
        },
        Password: {
            type: String,
            trim: true,
            minlength: 6,
            validate(value) {
                if (validator.contains(value.toLowerCase(), 'password')) {
                    throw new Error('PASSWORD MUST NOT HAS password STRING!')
                }
            }
        },
        personal_ID: {
            type: Buffer

        },
        pic: {
            type: Buffer
        },
        Age: {
            type: Number,
            default: 23,
            validate(value) {
                if (value < 23) {
                    throw new Error('Age must be 23 or above!')
                }
            }

        },
        Frist_Name: {
            type: String,
            trim: true,
            required: true
        }, Last_Name: {
            type: String,
            trim: true,
            required: true
        },
        Address: {
            type: String,
            trim: true,
        },
        accepted: {
            type: Boolean,
            default: false
        },
        requests: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Request'
        },
        RequestDate: {
            type: Date
        }, tokens: [
            {
                token: {
                    type: String,
                    required: true
                }
            }
        ], uploaded_resource: [
            {
                type: String
            }
        ]


    })
InstructorSchema.plugin(uniqueValidator)
InstructorSchema.plugin(validateInteger)

InstructorSchema.virtual('Exams',
    {
        ref: 'Exam',
        localField: '_id',
        foreignField: 'owner'

    }
)
InstructorSchema.methods.toJSON = function () {
    const instructor = this
    const instructorObject = instructor.toObject()
    delete instructorObject.Password
    delete instructorObject.personal_ID
    return instructorObject
}
InstructorSchema.methods.GenerateTokens = async function () {
    const instructor = this
    const token = await jwt.sign({ _id: instructor._id.toString() }, process.env.JWTSEC)

    instructor.tokens = instructor.tokens.concat({ token })
    await instructor.save()

    return token
}
InstructorSchema.statics.findByCredentials = async (Email, Password) => {

    const instructor = await Instructor.findOne({ Email })
    if (!instructor) {
        throw new Error({ error: 'unable to login' })
    }
    const isMatch = await bcrypt.compare(Password, instructor.Password)
    if (!isMatch) {
        throw new Error({ error: 'unable to login' })
    }
    return instructor
}

// Hashing password before saving it into database

InstructorSchema.pre('save', async function (next) {
    const instructor = this
    console.log(instructor.Password)
    if (instructor.isModified('Password')) {
        instructor.Password = await bcrypt.hash(instructor.Password, 8)
    }
    next()
})
InstructorSchema.pre('remove', async function (next) {
    const instructor = this
    const id = instructor._id
    await Exam.deleteMany({ owner: id })
    // handel req
    // const requests= await Request.find({})
    // if(requests.length===0){
    //     throw new Error('no reqs')
    // }
    // // console.log(requests)
    // var arr=[]
    // var re=[]
    // const is= requests.forEach((r)=>{
    //     if(r.voters.includes(id)){
    //         arr= r.voters

    //     //    console.log(arr)
    //      re=arr.filter(e=>e!=id)
    //      console.log(re)
    //      r.voters=re
    //      r.votes--

    //     }
    //     is.save()

    // })







    next()

})

const Instructor = mongoose.model('Instructor', InstructorSchema)
module.exports = Instructor