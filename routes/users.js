const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

// Bring in User Model
let User = require('../models/user');

router.all('/userhome/*', ensureAuthenticated,function (req, res, next) {
  req.app.locals.layout = 'layout_user'; // set User layout here
  next(); // pass control to the next handler
});

router.get('/userhome/ignite',function(req,res){
  res.render('ignite');
});

router.get('/register',function(req,res){
  res.render('register');
})

router.post('/register', function(req, res){
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
  
    req.checkBody('firstName', 'firstname is required').notEmpty();
    req.checkBody('lastName', 'lastname is required').notEmpty();
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

router.get('/userhome',ensureAuthenticated,function(req,res){
  res.render('user_home',{layout:'layout_user'});
});

router.get('/login',function(req,res){
  res.render('login');
});

/*// Login Process
router.post('/login', function(req, res, next){
  passport.authenticate('local', {
    successRedirect:'/userhome',
    failureRedirect:'/users/login',
    failureFlash: true
  })(req, res, next);
});*/

router.post('/login', function(req, res, next){
  const email = req.body.email;
  const password = req.body.password;
  req.checkBody('email', 'Email is required').notEmpty();
  req.checkBody('email', 'Email is not valid').isEmail();
  req.checkBody('password', 'Password is required').notEmpty();

  let errors = req.validationErrors();
  
    if(errors){
      console.log(errors);
      res.render('login',{
        errors:errors,
      });
    }
    else{
      passport.authenticate('local', {
        successRedirect:'/users/userhome',
        failureRedirect:'/users/login',
        failureFlash: true
      })(req, res, next);
    }
});
  
  // logout
  router.get('/logout', ensureAuthenticated,function(req, res){
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/users/login');
  });

  // Access Control
function ensureAuthenticated(req, res, next){
  if(req.isAuthenticated()){
    return next();
  } else {
    req.flash('error_msg', 'Please login');
    res.redirect('/users/login');
  }
}
  module.exports = router;