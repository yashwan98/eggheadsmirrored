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

router.post('/course_change/:id', function (req, res) {
    //requiring the user's ID as in mongoDB
    var id = req.params.id;
    console.log(req.body);
    var ObjectID = require('mongodb').ObjectID;

    //requiring the changes made to the course and pay details
    var courseChange = req.body.courseChange;
    var Paid = parseInt(req.body.Paid);
    console.log(courseChange, Paid);
    //asking to use the 'eggheads' database
    var dbo = db.useDb("eggheads");

    //converting the user's ID to ObjectID
    var myquery = { _id:  ObjectID(id)};

    //setting the new values i.e the changed course name
    var newvalues = { $set: { course: courseChange, paid: Paid} };

    //updating to DB based on the query
    dbo.collection("users").updateOne(myquery, newvalues, function (err, res) {
        if (err) throw err;
        console.log("1 document updated");
    });

    //again displaying the user_data page with the UPDATED data
    dbo.collection("users").find({}).toArray(function (err, result) {
        if (err) throw err;
        res.render('user_data', {
            results: result,
        });
    });
});

router.post('/show_paid_user_data', function (req, res) {
    //asking to use the 'eggheads' database
    var dbo = db.useDb("eggheads");

    //query the DB
    var query = { paid: 1 };
    dbo.collection("users").find(query).toArray(function (err, result) {
        if (err) throw err;
        console.log(result);
        res.render('paid_user_data', {
            results: result,
        });
        db.close();
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
                console.log(result);
            });
        }
        else{
            req.flash('error_msg', 'You are not an Administrator');
            res.redirect('/admin/login');
        }
       
    }
});


module.exports = router;