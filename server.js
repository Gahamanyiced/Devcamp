const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const errorHandler = require('./middleware/error');
const connectDB = require('./config/db.js');
const fileUpload = require('express-fileupload');
const cookieParser = require('cookie-parser');
const colors = require('colors');
const path = require('path');
const cloudinaryUpload = require('./utils/cloudinary');
const cloudinary = require('cloudinary').v2;

// Load env vars
dotenv.config({ path: './config/config.env' });

//connect to Database
connectDB();

//connect to cloudinary
cloudinaryUpload();

//routes files
const bootcamps = require('./routes/bootcamps.js');
const courses = require('./routes/courses.js');
const auth = require('./routes/auth');

const app = express();

//Body Parser
app.use(express.json());

//Cookie parser
app.use(cookieParser());

// logger
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

//File upload
app.use(
  fileUpload({
    useTempFiles: true,
  })
);

//Set static folder
app.use(express.static(path.join(__dirname, 'public')));

//mount routes files
app.use('/api/v1/bootcamps', bootcamps);
app.use('/api/v1/courses', courses);
app.use('/api/v1/auth', auth);

app.use(errorHandler);

const PORT = process.env.PORT;

const server = app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on PORT ${PORT} `.yellow
      .bold
  )
);

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`.red);

  // close server & exit process
  server.close(() => process.exit(1));
});
