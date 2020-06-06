const mongoose = require('mongoose');
//mongoose.pluralize(null);
var Schema = mongoose.Schema;

//userStatus
const quizSchema = new Schema({
    id:{
      type: Number,
      required: true
    },
    question:{
      type: String,
      required: true
    },
    A:{
      type: String,
      required: true
    },
    B:{
      type: String,
      required: true
    },
    C:{
      type: String,
      required: true
    },
    D:{
      type : String,
      required: true
    },
    correct:{
      type : String,
      required: true
    },
    week:{
        type : Number,
        required: true
    },
    day:{
        type : Number,
        required: true
    },
    course:{
        type : String,
        required: true
    }
  });

  const quiz = module.exports = mongoose.model('quiz', quizSchema);