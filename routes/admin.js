const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

// Bring in Admin Model
let adminModel = require('../models/admin_model');

router.get('/login', function (req, res) {
    res.render('admin_login');
});

router.post('/login', function (req, res, next) {
    const email = req.body.adminEmail;
    const password = req.body.adminPassword;
    req.checkBody('email', 'Email is required').notEmpty();
    req.checkBody('email', 'Email is not valid').isEmail();
    req.checkBody('password', 'Password is required').notEmpty();

    let errors = req.validationErrors();

    if (errors) {
        console.log(errors);
        res.render('admin_login', {
            errors: errors,
        });
    }
    else {
        res.render('user_data')
    }
});

module.exports = router;