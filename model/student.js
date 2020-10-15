const mongoose = require('mongoose');
const { JWT_SECRET } = require('../config/dev');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

const StudentSchema = new Schema(
  {
    faculty: {
      type: String,
      required: [true, 'faculty is required'],
    },
    email: {
      type: String,
      unique: false,
      required: [true, 'email is required!'],
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please enter a valid email',
      ],
    },
    school: {
      type: String,
      required: [true, 'school is required'],
    },
    programme: {
      type: String,
      required: [true, 'program is required'],
    },
    specialization: {
      type: String,
      required: [true, 'specialization is required'],
    },
    reg_no: {
      type: Number,
      required: [true, 'registration number is required'],
      unique: true,
      maxlength: 9,
    },
    student_name: {
      type: String,
      required: [true, 'student name is required'],
    },
    gender: {
      type: String,
      required: [true, 'gender is required'],
      maxlength: 1,
    },
    batch: {
      type: Number,
      required: [true, 'batch is requred'],
    },
    credits: {
      type: Number,
      required: [true, 'credits are required'],
    },
    cgpa: {
      type: String,
      required: [true, 'cgpa is required'],
    },
    remark: {
      type: String,
    },
    is_paid: {
      type: Boolean,
      default: false,
    },
    password: {
      type: String,
    },
    country: {
      type: String,
    },
    phone: {
      type: String,
    },
    street: {
      type: String,
    },
    city: {
      type: String,
    },
    district: {
      type: String,
    },
    state: {
      type: String,
    },
    pincode: {
      type: Number,
    },
    account_holder_name: {
      type: String,
    },
    bank_address: {
      type: String,
    },
    account_number: {
      type: String,
    },
    bank_name: {
      type: String,
    },
    branch_name: {
      type: String,
    },
    ifsc_code: {
      type: String,
    },
    role: {
      type: String,
      enum: ['student', 'department', 'admin'],
      default: 'student',
    },
  },
  { timestamps: true }
);

// Sign JWT and return
StudentSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, JWT_SECRET, {
    expiresIn: 36000,
  });
};

// Match user entered password to hashed password in database
StudentSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('Student', StudentSchema);
