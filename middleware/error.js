const ErrorResponse = require('../utils/errorResponse')
const errorHandler = (err,req,res,next) =>{
    //Log to console for dev
 error = {...err}
 error.message = err.message
 //console.log(err)
    
    //Mongoose bad objects
 if(err.name === 'CastError'){
        const message = `Bootcamp not found with id of ${err.value}`
        error= new ErrorResponse(message,404);
 }
  //Mongoose Duplicate Key
  if(err.code === 11000){
    const message = 'Duplicate field value Entered'
    error= new ErrorResponse(message,400); 
  }
  //Mongoose Validation Error
 /*if(err.name === 'ValidatorError'){
    const message = Object.values(err.errors).map(val => val.message);
    error= new ErrorResponse(message,400); 
  }*/
 console.log(error.message)
 res.status(error.statusCode || 500).json({success:false,error:error.message || 'Server error' });
};

module.exports = errorHandler;
