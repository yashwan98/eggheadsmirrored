const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

// requiring the MODEL
let User = require('../models/user');
let UserStatus = require('../models/userStatus');
let ignite = require('../models/ignite');


router.all('/userhome/*',ensureAuthenticated, function (req, res, next) {
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

  var query = {email: req.body.email};
  
  User.find(query, function(err, doc){
    if(doc.length !== 0)
    {
      req.flash('error_msg', 'Email Id already exist !!!');
      res.redirect('/users/register');
    }
    else{
      const firstName = req.body.firstName;
      const lastName = req.body.lastName;
      const email = req.body.email;
      const password = req.body.password;
      const confirmPassword = req.body.confirmPassword;
      const course = req.body.course;

      req.checkBody('firstName', 'firstname is required').notEmpty();
      req.checkBody('lastName', 'lastname is required').notEmpty();
      req.checkBody('email', 'Email is required').notEmpty();
      req.checkBody('email', 'Email is not valid').isEmail();
      req.checkBody('password', 'Password is required').notEmpty();
      req.checkBody('course', 'select course').isIn(['ignite', 'kindle']);
      req.checkBody('confirmPassword', 'Passwords do not match').equals(req.body.password);

      let errors = req.validationErrors();

      if (errors) {
        console.log(errors);
        res.render('register', {
          errors: errors,
        });
      } else {

        let newUser = new User({
          firstName: firstName,
          lastName: lastName,
          email: email,
          password: password,
          course: course,
        });

        bcrypt.genSalt(10, function (err, salt) {
          bcrypt.hash(newUser.password, salt, function (err, hash) {
            if (err) {
              console.log(err);
            }
            newUser.password = hash;
            newUser.save(function (err) {
              if (err) {
                console.log(err);
                return;
              } else {
                req.flash('success_msg', 'You are now registered and can log in');
                res.redirect('/users/login');
              }
            });
          });
        });
      }
    }
  });
    /* req.flash('error_msg', 'Email Id already exist !!!');
    res.redirect('/users/register'); */
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
  //console.log(req.body.email);
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

router.get('/payment', ensureAuthenticated, function(req,res,next){
  let query={email: req.user.email};
  if(req.user.paid){
    UserStatus.findOne(query, function(err, userStatus) {
      if(err) throw err;
      if(!userStatus){
            let newUserStatus = new UserStatus({
              Name: req.user.firstName + req.user.lastName,
              email: req.user.email,
              course: req.user.course,
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

router.get('/userhome', ensureAuthenticated, function(req,res,next){
  if(req.user.paid){
    res.render('user_home', {
      layout:'layout_user', 
      course: req.user.course
    });
  }
  else{
    res.redirect('/users/payment');
  }
});



//IGNITE routes starts here.
router.get('/userhome/ignite', function(req, res, next) {
  let query = {email : req.user.email};
  UserStatus.findOne(query, function(err, userStatus){
    if(err) throw err;
    //console.log(user);
    let currentWeek = userStatus.week;
    //console.log(week);
    res.render('ignite', { 
      weekCount: 4, 
      currentWeek: currentWeek 
    });
  });
});

router.get('/userhome/ignite/week:currentWeek', function(req, res, next) {
  let query = {email : req.user.email};
  UserStatus.findOne(query, function(err, userStatus) {
    if(err) throw err;
    //console.log(user);
    let currentWeek = userStatus.week;
    let currentDay = userStatus.DayOrLevel;
    //console.log(day);
    res.render('ignite', { 
      currentDay: currentDay, 
      currentWeek: currentWeek, 
      weekCount:4, 
      dayCount:5 
    });
  });
});

router.get('/userhome/ignite/week:currentWeek/day:clickedDay/', function(req, res, next) {
  //console.log("week"+req.params.week);
  //console.log("day"+req.params.day);
  var currentTitle_id;
  //var query = {$and:[{week:{$regex: req.params.week, $options: 'i'}},{day:{$regex: req.params.day, $options: 'i'}}]}

  //var query = query.and([{ week: req.params.week }, { day: req.params.day }])
  
  ignite.find({ $and: [{ week: parseInt(req.params.currentWeek) }, { Day: parseInt(req.params.clickedDay) } ] },'title id').lean().exec(function(err, titleAndIds) {
    if(err) throw err;
    //console.log(user);
    var query = {email: req.user.email};
    UserStatus.findOne(query, function(err, userStatus){
      currentTitle_id = userStatus.title_id;
      res.render('ignite', {
        currentTitle_id: currentTitle_id,
        titleAndIds: titleAndIds,
        weekCount: 4,
        dayCount: 5,
        currentWeek: userStatus.week,
        currentDay: userStatus.DayOrLevel,
        url_day: parseInt(req.params.currentWeek),
        url_week: parseInt(req.params.clickedDay)
      });
    });
  });
});

router.get('/userhome/ignite/week:currentWeek/day:clickedDay/video:videoId', async function(req, res, next) {
  //console.log("week"+req.params.week);
  //console.log("day"+req.params.day);
  var query = {email: req.user.email};
  //console.log(parseInt(req.params.video));
  var video = parseInt(req.params.videoId);

  let video_id,title,src,video_week,video_day,quiz;
  let video_array = await UserStatus.find(query).lean().exec();
  video_array.forEach(e => {
    video_id = e.title_id;
  });
  console.log("video_id"+video_id);
  if(video==video_id){

    var query = {id: video_id};
    let data = await ignite.find(query,'title src quiz').lean().exec();
    data.forEach(e=>{
      title = e.title;
      src = e.src;
      quiz = e.quiz;
    });
    var query = {id: video_id+1};
    let week_day_data = await ignite.find(query,'week Day').lean().exec();
    week_day_data.forEach(e=>{
      video_week = e.week;
      video_day = e.Day;
    });

    if (video_week == parseInt(req.params.currentWeek)){
      if (video_day != parseInt(req.params.clickedDay)){
        new Promise((resolve, reject) => {
          var query = {email: req.user.email};
          //you update code here
          UserStatus.findOneAndUpdate(
            query,
            { $set: { DayOrLevel: parseInt(req.params.clickedDay)+1}},
            { new: true }
          )
            .then((result) => resolve())
            .catch((err) => reject(err));
        });
      }
    }
    /*else{
      new Promise((resolve, reject) => {
        var query = {email:req.user.email};
        //you update code here
        UserStatus.findOneAndUpdate(
          query,
          {$set:{week : parseInt(req.params.week)+1}},
          {$set:{DayOrLevel : 1}},
          { new: true }
        )
          .then((result) => resolve())
          .catch((err) => reject(err));
      });
    }*/
    var query = {email: req.user.email};
        new Promise((resolve, reject) => {
        //you update code here
        UserStatus.findOneAndUpdate(
          query,
          {$set:{title_id: video+1}},
          { new: true }
        )
          .then((result) => resolve())
          .catch((err) => reject(err));
      });
    //await UserStatus.findOneAndUpdate(query, {$set:{title_id:video+1}}, {useFindAndModify: false},{new: true}).exec();
    res.render('video', {
      title: title,
      src: src,
      week: parseInt(req.params.currentWeek),
      day: parseInt(req.params.clickedDay),
      id: video,
      quiz: quiz
    });
  }
  else{
    var query = {id: video};
    let data = await ignite.find(query,'title src quiz').lean().exec();
    data.forEach(e=>{
      title = e.title;
      src = e.src;
      quiz = e.quiz;
    });
      res.render('video', {
        title: title,
        src: src,
        week: parseInt(req.params.currentWeek),
        day: parseInt(req.params.clickedDay),
        id: video,
        quiz: quiz
      });
  }
    /*if(video==video_id){
      var query = {id:video};
      await ignite.find(query,'title src').lean().exec(function(err, data){
        if(err) throw err;
        var query = {email:req.user.email};
        UserStatus.findOneAndUpdate(query, {$set:{title_id:video+1}}, {useFindAndModify: false},{new: true}, (err, doc) => {
          if (err) {
              console.log("Something wrong when updating data!");
          }
          console.log("doc"+doc);
          res.render('video',{data:data,week:parseInt(req.params.week),day:parseInt(req.params.day),id:video});
        });
      });
    }*/
    
  });

router.get('/userhome/ignite/week:week/day:day/video:id/quiz', function(req, res) {
  res.render('quiz');
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