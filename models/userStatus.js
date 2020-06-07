const mongoose = require('mongoose');
var Schema = mongoose.Schema;

//userStatus
const UserStatusSchema = new Schema({
    Name:{
      type: String,
      required: true
    },
    email:{
      type: String,
      required: true
    },
    course:{
      type: String,
      required: true
    },
    title_id:{
      type: Number,
      default : 1,
    },
    DayOrLevel:{
      type: Number,
      default : 1,
    },
    week:{
      type : Number,
      default : 1,
    },
    quiz_attended:{
      type : Number,
      default : 0,
    },
    quiz_status:{
      type : Number,
      default : 0,
    },
    quiz_cumulative_score:{
      type : Number,
      default : 0,
    }
  });

  const UserStatus = module.exports = mongoose.model('UserStatus', UserStatusSchema);