const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

// Bring in Admin Model
let adminModel = require('../models/admin_model');

router.get('/admin/login', function (req, res) {
    res.render('admin_login');
});

router.get('/login', function (req, res) {
    if (req.user) {
        res.redirect('/users/userhome');
    }
    else {
        res.render('login');
    }
});

router.post('/admin/login', function (req, res, next) {
    const email = req.body.adminEmail;
    const password = req.body.adminPassword;
    req.checkBody('email', 'Email is required').notEmpty();
    req.checkBody('email', 'Email is not valid').isEmail();
    req.checkBody('password', 'Password is required').notEmpty();

    let errors = req.validationErrors();

    if (errors) {
        console.log(errors);
        res.render('login', {
            errors: errors,
        });
    }
    else {
        passport.authenticate('local', {
            successRedirect: '/admin/data',
            failureRedirect: '/',
            failureFlash: true
        })(req, res, next);
    }
});

router.get('/data', ensureAuthenticated, function (req, res, next) {
    if (req.user.paid) {
        res.redirect('/users/userhome');
    }
    else {
        res.render('payment');
    }
});

router.get('/userhome', ensureAuthenticated, function (req, res, next) {
    if (req.user.paid) {
        res.render('user_home', { layout: 'layout_user', course: req.user.course });
    }
    else {
        res.redirect('/users/payment');
    }
});

router.all('/userhome/*', ensureAuthenticated, function (req, res, next) {
    req.app.locals.layout = 'layout_user'; // set User layout here
    if (!req.user.paid) {
        req.app.locals.layout = 'layout'; // set User layout here
        res.redirect('/users/payment');
    }
    else {
        next(); // pass control to the next handler
    }

});

//ignite routes starts here.
router.get('/userhome/ignite', function (req, res) {
    res.render('ignite');
});

//kindle routes starts here.
router.get('/userhome/kindle', function (req, res) {
    res.render('kindle');
});

// logout
router.get('/logout', ensureAuthenticated, function (req, res) {
    req.logout();
    req.app.locals.layout = 'layout'; // set User layout here
    req.flash('success_msg', 'You are logged out');
    res.redirect('/users/login');
});

// Access Control
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        req.flash('error_msg', 'Please login');
        res.redirect('/users/login');
    }
}
module.exports = router;