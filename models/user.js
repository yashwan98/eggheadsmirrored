const mongoose = require('mongoose');

// User Schema
const UserSchema = mongoose.Schema({
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
  confirmPassword:{
    type: String,
    required: true
  }
});

const User = module.exports = mongoose.model('User', UserSchema);