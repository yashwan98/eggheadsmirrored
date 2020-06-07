const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
var mongoose = require('mongoose');
const config = require('../config/database');

//database connection
mongoose.connect(config.database, { useNewUrlParser: true, useUnifiedTopology: true });
let db = mongoose.connection;

//routes to admin_login.handlebars page
router.get('/login', function (req, res) {
    res.render('admin_login');
});

router.post('/course_change/:id', function (req, res) {
    //requiring the user's ID as in mongoDB
    var id = req.params.id;

    var ObjectID = require('mongodb').ObjectID;

    //requiring the changes made to the course and pay details
    var courseChange = req.body.courseChange;
    var Paid = parseInt(req.body.Paid);

    //asking to use the 'eggheadsIgnite' database
    var dbo = db.useDb("eggheadsIgnite");

    //converting the user's ID to ObjectID and creating a query object
    var myquery = { _id:  ObjectID(id)};

    //setting the new values i.e the changed course name
    var newvalues = { $set: { course: courseChange, paid: Paid} };

    //updating to DB based on the newvalues
    dbo.collection("users").updateOne(myquery, newvalues, function (err, res) {
        if (err) throw err;
    });

    //again displaying the not_paid_user_data page with the UPDATED data
    dbo.collection("users").find({}).toArray(function (err, result) {
        if (err) throw err;
        res.redirect('/admin/not_paid_user_data');
    });
});

router.get('/not_paid_user_data', function(req, res) {
    var dbo = db.useDb("eggheadsIgnite");
    var query = {paid: 0};
    dbo.collection("users").find(query).toArray(function (err, result) {
        if (err) throw err;
        res.render('not_paid_user_data', {
            results: result,
        });
    });
});

router.post('/paid_user_data', function (req, res) {
    var dbo = db.useDb("eggheadsIgnite");

    dbo.collection("userstatuses").find({}).toArray(function (err, result) {
        if (err) throw err;
        console.log(result);
        res.render('paid_user_data', {
            results: result,
        });
    });
});

router.post('/change_week_for_all_students', function (req, res) {
    var dbo = db.useDb("eggheadsIgnite");
    var Week = parseInt(req.body.weekChange)
    var query ={};
    var newWeek = { $inc: { title_id: 1}, $set: { week: Week, DayOrLevel:1, quiz_attended: 0, quiz_status: 0} };

    dbo.collection("userstatuses").updateMany(query, newWeek, function(err, res) {
            if (err) throw err;
    });

    dbo.collection("userstatuses").find({}).toArray(function (err, result) {
        if (err) throw err;
        res.render('paid_user_data', {
            results: result,
        });
    });
});

router.post('/not_paid_user_data', function (req, res) {
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
            var dbo = db.useDb("eggheadsIgnite");
            var query = { paid: 0 };
            dbo.collection("users").find(query).toArray(function (err, result) {
                if (err) throw err;
                res.render('not_paid_user_data', {
                    results: result,
                });
            });
        }
        else{
            req.flash('error_msg', 'You are not an Administrator');
            res.redirect('/admin/login');
        }
       
    }
});

module.exports = router;