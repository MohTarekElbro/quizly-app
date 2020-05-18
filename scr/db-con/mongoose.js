const mongoose = require('mongoose');
require('dotenv').config({path:'./configurations/dev.env'})

mongoose.connect(process.env.MONGO_URL_CONNECTION,
{useNewUrlParser: true, 
    useUnifiedTopology:true,
    useCreateIndex:true,
   useFindAndModify:false}
)
