const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const StudentSchma = new Schema({
    faculty:{
        type: String,
        required: true
    },
    school:{
        type: String,
        required: true
    },
    programme:{
        type: String,
        required: true
    },
    specialization:{
        type: String,
        required: true
    },
    reg_no:{
        type: Number,
        required: true,
        maxlength: 11
    },
    student_name:{
        type: String,
        required: true
    },
    gender:{
        type: String,
        required: true,
        maxlength: 11
    },
    batch:{
        type: Number,
        required: true
    },
    credits:{
        type: Number,
        required: true
    },
    cgpa:{
        type: String,
        required: true
    },
    remark:{
        type: String
    },
    is_paid:{
        type: Boolean,
        default: false
    },
},{timestamps:true});

module.exports = mongoose.model('Student', StudentSchma);