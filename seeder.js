const fs = require('fs');
const mongoose = require('mongoose');
const colors = require('colors');
const dotenv = require('dotenv');
// Load env vars
dotenv.config({path : './config/config.env' });

//Load models
const Bootcamp = require('./models/Bootcamp')
const Course = require('./models/Course')
//connect to DB

mongoose.connect(process.env.MONGO_URI,{
        useNewUrlParser:true,
        //useCreateIndex: true,
        //useFindAndModify:false,
        useUnifiedTopology:true
     }).then(()=>console.log('connected'))
     .catch(e=>console.log(e));

//Read json files
const bootcamps = JSON.parse(fs.readFileSync(`${__dirname}/_data/bootcamps.json`,'utf-8'));
const courses = JSON.parse(fs.readFileSync(`${__dirname}/_data/courses.json`,'utf-8'));
//Import into DB
const importData = async()=> {
    try{
        await Bootcamp.create(bootcamps);
        await Course.create(courses);
        console.log('Data Imported..'.green); 
        process.exit();
    }
    catch(err){
        console.error(err);
    }
}

//Delete data
const deleteData = async()=> {
    try{
        await Bootcamp.deleteMany();
        await Course.deleteMany();
        console.log('Data destroyed..'.red);
        process.exit();
    }
    catch(err){
        console.error(err);
    }
}
if(process.argv[2]==='-i'){
    
    importData();
}
else if (process.argv[2]==='-d'){
   
    deleteData();
}

/*const PORT = process.env.PORT;

const server = app.listen(PORT
    ,console.log(`Server running in ${process.env.NODE_ENV} mode on PORT ${PORT} `.yellow.bold));*/