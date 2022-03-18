const mongoose = require ('mongoose');

const clientSchema = new mongoose.Schema({
    name:{
      type:String,
      required:[true,'Please add a name'],
      maxlength: [20,'Client name  can not be more than 20 characters ']
    },
    Email:{
        
        type: String,
        match: [/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,'Please add a valid email'] 
    },
    Tin:{
      type:String,
      unique:true,
      maxlength:[10,'Tin number must can not be more than 10 characters']
  
    },
    address:{
      type:String,
      required: [true,'Please add an address']
  },
    Phone:{
      type: String,
       maxlength: [20,'Phone number can not be more than 20 characters ']

    },
    Business:{
      type:String,
      required: [true,'Please add Business name'],
      maxlength: [20,'Business name  can not be more than 20 characters '],
     

    },
    isActive:[true/false],
   
})