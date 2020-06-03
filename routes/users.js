const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

// Bring in User Model
let User = require('../models/user');
let UserStatus = require('../models/userStatus');
let ignite = require('../models/ignite');


router.all('/userhome/*', ensureAuthenticated,function (req, res, next) {
  req.app.locals.layout = 'layout_user'; // set User layout here
  if(!req.user.paid){
    req.app.locals.layout = 'layout'; // set User layout here
    res.redirect('/users/payment');
  }
  else{
    next(); // pass control to the next handler
  }
});


router.get('/register',function(req,res){
  if(req.user){
    res.redirect('/users/userhome');
  }
  else{
    res.render('register');
  }
});

router.post('/register', function(req, res){
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    const course = req.body.course;
    console.log(course);
  
    req.checkBody('firstName', 'firstname is required').notEmpty();
    req.checkBody('lastName', 'lastname is required').notEmpty();
    req.checkBody('email', 'Email is required').notEmpty();
    req.checkBody('email', 'Email is not valid').isEmail();
    req.checkBody('password', 'Password is required').notEmpty();
    req.checkBody('course', 'select course').isIn(['ignite','kindle']);
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
        course:course,
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
  if(req.user){
    res.redirect('/users/userhome');
  }
  else{
    res.render('login');
  }
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
  console.log(req.body.email);
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
        successRedirect:'/users/payment',
        failureRedirect:'/users/login',
        failureFlash: true
      })(req, res, next);
    }
});

router.get('/payment',ensureAuthenticated, function(req,res,next){
  let query={email:req.user.email};
  if(req.user.paid){
    UserStatus.findOne(query,function(err,user){
      if(err) throw err;
      if(!user){
            let newUserStatus = new UserStatus({
              Name:req.user.firstName+req.user.lastName,
              email:req.user.email,
              course:req.user.course,
            });
            newUserStatus.save(function(err){
              if(err){
                console.log(err);
                return;
              }
            });
          res.redirect('/users/userhome');
        }
      else{
        res.redirect('/users/userhome');
      }
    });
  }
  else{
    res.render('payment');
  }
});

router.get('/userhome',ensureAuthenticated,function(req,res,next){
  if(req.user.paid){
    res.render('user_home',{layout:'layout_user',course:req.user.course});
  }
  else{
    res.redirect('/users/payment');
  }
});



//ignite routes starts here.
router.get('/userhome/ignite',function(req,res,next){
  let query = {email : req.user.email};
  UserStatus.findOne(query, function(err, user){
    if(err) throw err;
    //console.log(user);
    let week = user.week;
    console.log(week);
    res.render('ignite',{weekcount:4,week:week});
  });
});

router.get('/userhome/ignite/week:week',function(req,res,next){
  let query = {email : req.user.email};
  UserStatus.findOne(query, function(err, user){
    if(err) throw err;
    //console.log(user);
    let day = user.DayOrLevel;
    //console.log(day);
    res.render('ignite',{day:day,week:user.week,weekcount:4});
  });
});

router.get('/userhome/ignite/week:week/day:day/',function(req,res,next){
  console.log("week"+req.params.week);
  console.log("day"+req.params.day);
  //var query = {$and:[{week:{$regex: req.params.week, $options: 'i'}},{day:{$regex: req.params.day, $options: 'i'}}]}
  //var query = {week:req.params.week,day:req.params.day};
  //var query = query.and([{ week: req.params.week }, { day: req.params.day }])
  ignite.find({ $and: [ { week:parseInt(req.params.week) }, { Day:parseInt(req.params.day) } ] },'title id', function(err, user){
    if(err) throw err;
    console.log(user);
    res.render('ignite',{user:user,weekcount:4,week:parseInt(req.params.week),day:parseInt(req.params.day)});
  });
});

router.get('/userhome/ignite/week:week/day:day/video:video',function(req,res,next){
  console.log("week"+req.params.week);
  console.log("day"+req.params.day);
  var video_count = parseInt(req.params.video);
  ignite.find({ $and: [ { week:parseInt(req.params.week) }, { Day:parseInt(req.params.day) } ] },'title', function(err, data){
    if(err) throw err;
    console.log(data);
    res.render('ignite',{data:data});
  });
});

//kindle routes starts here.
router.get('/userhome/kindle',function(req,res){
  res.render('kindle');
});

// logout
router.get('/logout', ensureAuthenticated,function(req, res){
  req.logout();
  req.app.locals.layout = 'layout'; // set User layout here
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