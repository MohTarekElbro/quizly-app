const mongoose = require('mongoose');
require('dotenv').config({path:'./configurations/dev.env'})

mongoose.connect(process.env.MONGODB_URI,
{useNewUrlParser: true, 
    useUnifiedTopology:true,
    useCreateIndex:true,
   useFindAndModify:false}
)
