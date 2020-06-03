<<<<<<< HEAD
var mongoose = require("mongoose");
=======
const mongoose = require('mongoose');
var Schema = mongoose.Schema;
>>>>>>> 99a517b79d44a5a86f83b62ae5bd9174d62dcb6c

// User Schema
const UserSchema = new Schema({
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

<<<<<<< HEAD
const User = module.exports = mongoose.model('User', UserSchema);


=======

const User = module.exports = mongoose.model('User', UserSchema);
>>>>>>> 99a517b79d44a5a86f83b62ae5bd9174d62dcb6c
