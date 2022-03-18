const mongoose = require('mongoose');
const merchandiseInfoSchema = new mongoose.Schema({
    forwardingAgent: String,
    recipient:String,
    sealingCode:String,
    invoiceNumber:String,
    douaneAgent: String,
    portOfficeDoc:{
        type:String,
        default:no_pdf.pdf
    },
    isDraft:false,
    vehicle:{
        plateNumber:String,
        driverName:String
    }
})