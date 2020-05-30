const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

// Bring in User Model
let User = require('../models/user');

router.get('/register',function(req,res){
  res.render('register');
})

router.post('/register', function(req, res){
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
  
    req.checkBody('firstName', 'firstName is required').notEmpty();
    req.checkBody('lastName', 'lastName is required').notEmpty();
    req.checkBody('email', 'Email is required').notEmpty();
    req.checkBody('email', 'Email is not valid').isEmail();
    req.checkBody('password', 'Password is required').notEmpty();
    req.checkBody('confirmPassword', 'Passwords do not match').equals(req.body.password);
  
    let errors = req.validationErrors();
  
    if(errors){
      console.log(errors);
      res.render('register',{
        errors:errors,
      });
    } else {
      let newUser = new User({
        firstName:firstName,
        lastName : lastName,
        email:email,
        password:password,
        confirmPassword : confirmPassword,
        
      });
  
      bcrypt.genSalt(10, function(err, salt){
        bcrypt.hash(newUser.password, salt, function(err, hash){
          if(err){
            console.log(err);
          }
          newUser.password = hash;
          newUser.save(function(err){
            if(err){
              console.log(err);
              return;
            } else {
              req.flash('success_msg','You are now registered and can log in');
              res.redirect('/users/login');
            }
          });
        });
      });
    }
  });

  router.get('/login',function(req,res){
    res.render('login');
  });

  router.get('/home',function(req,res){
    res.render('home');
  });
  router.post('/login', function(req, res, next){
    console.log("login");
    passport.authenticate('local', {
      successRedirect:'/',
      failureRedirect:'/users/login',
      failureFlash: true
    },function(req, res) {
      req.flash('success_msg','Logged in Successfully');
      res.redirect('/users/home');
  });(req, res, next);
  });
  
  // logout
  router.get('/logout', function(req, res){
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/users/login');
  });

  module.exports = router;