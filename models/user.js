const mongoose = require('mongoose');

// User Schema
const UserSchema = mongoose.Schema({
  serialNumber:{
    type: Number,
    required: true
  },
  firstName:{
    type: String,
    required: true
  },
  lastName:{
    type: String,
    required: true
  },
  email:{
    type: String,
    required: true
  },
  password:{
    type: String,
    required: true
  },
  course:{
    type: String,
    default : 'course'
  },
  paid:{
    type : Number,
    default : 0
  }
});

const User = module.exports = mongoose.model('User', UserSchema);