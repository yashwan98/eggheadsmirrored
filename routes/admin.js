const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

// Bring in User Model
let User = require('../models/user');

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
        if (email === 'EggHeads_@outlook.com' && password === 'breaksomeeggs'){
            req.flash('success_msg', 'You are Authorized');
            console.log(User.find({}));
            res.render('user_data')
        }
        else{
            req.flash('error_msg', 'You are not an Administrator');
            res.redirect('/admin/login');
        }
       
    }
});

module.exports = router;