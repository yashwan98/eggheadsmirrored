const mongoose = require('mongoose');
var Schema = mongoose.Schema;

//userStatus
const igniteSchema = new Schema({
    id:{
      type: Number,
      required: true
    },
    title:{
      type: String,
      required: true
    },
    completed:{
      type: Number,
      required: true
    },
    src:{
      type: String,
      required: true
    },
    day:{
      type: Number,
      required: true
    },
    week:{
      type : Number,
      required: true
    },
    course:{
      type : String,
      required: true
    }
  });

  const ignite = module.exports = mongoose.model('ignite', igniteSchema);