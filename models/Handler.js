const mongoose = require ('mongoose');
const handlerSchema= new mongoose.Schema({
    name:{
        type:String,
        unique:true,
        required=[true,'Please add name'],
        maxlength=[20,'Portname can not be more than 20 characters']

    },
    Tin:{
        type:String,
        unique:true,
        maxlength:[10,'Tin number must can not be more than 10 characters']
    
      },
    
    isActive:[true/false],
})