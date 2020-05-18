const mongoose = require('mongoose');
require('dotenv').config({path:'./configurations/dev.env'})

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/Question-Generation-System",
{useNewUrlParser: true, 
    useUnifiedTopology:true,
    useCreateIndex:true,
   useFindAndModify:false}
)
