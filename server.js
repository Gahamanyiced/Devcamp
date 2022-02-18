const express = require('express');
const dotenv = require('dotenv');
const morgan =require('morgan');
const connectDB = require('./config/db.js')
const colors = require('colors');

// Load env vars
dotenv.config(({path: './config/config.env'}));

//connect to Database
connectDB();

//routes files
const bootcamps = require('./routes/bootcamps.js');

const app = express();

//Body Parser
app.use(express.json());
// logger
if (process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
}

//mount routes files
app.use('/api/v1/bootcamps',bootcamps);


 

const PORT = process.env.PORT;

const server = app.listen(PORT
    ,console.log(`Server running in ${process.env.NODE_ENV} mode on PORT ${PORT} `.yellow.bold));

//Handle unhandled promise rejections
process.on('unhandledRejection',(err,promise)=>{
  console.log(`Error: ${err.message}`.red);

  // close server & exit process
  server.close(()=>process.exit(1));
});