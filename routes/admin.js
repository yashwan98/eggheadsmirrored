const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
var mongoose = require('mongoose');
const config = require('../config/database');

mongoose.connect(config.database, { useNewUrlParser: true, useUnifiedTopology: true });
let db = mongoose.connection;

router.get('/login', function (req, res) {
    res.render('admin_login');
});

router.get('/k', function (req, res) {
    var dbo = db.useDb("eggheads");
    dbo.collection("users").find({}).toArray(function (err, result) {
        if (err) throw err;
        result.course = "kindle";
        //console.log(result);
        db.close();
    });
    res.render('user_data', {
        results: result,
    });
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
            var dbo = db.useDb("eggheads");
            dbo.collection("users").find({}).toArray(function (err, result) {
                if (err) throw err;
                res.render('user_data', {
                    results: result,
                });
                //console.log(result);
                db.close();
            });
        }
        else{
            req.flash('error_msg', 'You are not an Administrator');
            res.redirect('/admin/login');
        }
       
    }
});


module.exports = router;