const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema({
    name : {type : String,required :true},
    specialization : {type : String , required :true},
    availability : {
        type: String ,
        enum :["Available","Not Available","Break"], 
        default: "Available"
    },
    avgConsultationTime : {type: Number,default : 8},
    email : {type : String,required :true},
    password : {type:String , required:true}
});

module.exports = mongoose.model("Doctor",doctorSchema);
