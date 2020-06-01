const mongoose = require('mongoose');

// Admin Schema
const adminSchema = mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
});

const adminModel = module.exports = mongoose.model('adminModel', adminSchema);