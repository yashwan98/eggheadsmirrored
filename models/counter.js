const mongoose = require('mongoose');

// counter Schema
const counterSchema = mongoose.Schema({
    "S.No": "users",
    "sequence_value": 0
});

const counter = module.exports = mongoose.model('counterSchema', counterSchema);