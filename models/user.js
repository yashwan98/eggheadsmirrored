const mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
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
    unique: true
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
autoIncrement.initialize(mongoose.connection);
userSchema.plugin(autoIncrement.plugin, 'User');
const User = module.exports = mongoose.model('User', UserSchema);