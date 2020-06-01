const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
var mongoose = require('mongoose');
const config = require('./config/database');


mongoose.connect(config.database, { useNewUrlParser: true, useUnifiedTopology: true });

router.get('/login', function (req, res) {
    res.render('admin_login');
});

router.post('/login', function (req, res) {
    const adminEmail = req.body.adminEmail;
    const adminPassword = req.body.adminPassword;
    req.checkBody('adminEmail', 'Email is required').notEmpty();
    req.checkBody('adminEmail', 'Email is not valid').isEmail();
    req.checkBody('adminPassword', 'Password is required').notEmpty();

    let errors = req.validationErrors();

    if (errors) {
        console.log(errors);
        res.render('admin_login', {
            errors: errors,
        });
    }
    else {
        if (adminEmail === 'EggHeads_@outlook.com' && adminPassword === 'breaksomeeggs'){
            req.flash('success_msg', 'You are Authorized');
            // Wait until connection is established
            mongoose.connection.on('open', function (err, doc) {
                console.log("connection established");

                mongoose.connection.db.collection('users', function (err, docs) {
                    // Check for error
                    if (err) return console.log(err);
                    // Walk through the cursor
                    docs.find().each(function (err, doc) {
                        // Check for error
                        if (err) return console.err(err);
                        // Log document
                        console.log(doc);
                    })
                });
            });
            res.render('user_data')
        }
        else{
            req.flash('error_msg', 'You are not an Administrator');
            res.redirect('/admin/login');
        }
       
    }
});

module.exports = router;



// Wait until connection is established
mongoose.connection.on('open', function (err, doc) {
    console.log("connection established");

    mongoose.connection.db.collection('ftse100', function (err, docs) {
        // Check for error
        if (err) return console.log(err);
        // Walk through the cursor
        docs.find().each(function (err, doc) {
            // Check for error
            if (err) return console.err(err);
            // Log document
            console.log(doc);
        })
    });
});