const mongoose = require('mongoose');
 
const portOffice = new mongoose.Schema({
    name:{
        type:String,
        unique:true,
        required=[true,'Please add name'],
        maxlength=[20,'Portname can not be more than 20 characters']

    },
    address:{
        type:String,
        required: [true,'Please add an address']
    },
    isActive:[true/false],
})