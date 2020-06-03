var mongoose = require("mongoose"),
  Schema = mongoose.Schema,
  autoIncrement = require("mongoose-auto-increment");

var connection = mongoose.createConnection(
  "mongodb://localhost:27017/eggheads"
);

autoIncrement.initialize(connection);

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
  course:{
    type: String,
    default : 'course'
  },
  paid:{
    type : Number,
    default : 0
  }
});

UserSchema.plugin(autoIncrement.plugin, "User");
const User = module.exports = mongoose.model('User', UserSchema);


