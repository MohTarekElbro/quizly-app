const mongoose = require('mongoose');
require('dotenv').config({path:'./configurations/dev.env'})

mongoose.connect(process.env.MONGODB_URI || "mongodb+srv://quizlydb:Mm123456@cluster0-k5tpi.mongodb.net/test?retryWrites=true&w=majority",
{useNewUrlParser: true, 
    useUnifiedTopology:true,
    useCreateIndex:true,
   useFindAndModify:false}
)
const conn = mongoose.connection;
