const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const exphbs = require('express-handlebars');
const Handlebars = require('handlebars');
const session = require('express-session');
const flash = require('connect-flash');
const path = require('path');
const passport = require('passport');
const mongoose = require('mongoose');
const multer = require('multer');
const expressValidator = require('express-validator');
const methodOverride = require('method-override');
const config = require('./config/database');


mongoose.connect(config.database,{ useNewUrlParser: true,useUnifiedTopology: true });
let db = mongoose.connection;

// Check connection
db.once('open', function(){
  console.log('Connected to MongoDB');
});

// Check for DB errors
db.on('error', function(err){
  console.log(err);
});

const app = express();

//config Views
app.set('views',path.join(__dirname,'views'));
app.engine('handlebars',exphbs({defaultLayout:'layout'}));
app.set('view engine','handlebars');

//config bodyParser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

//config CookieParser
app.use(cookieParser());

//config session
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
  }));

app.use('/static', express.static(path.join(__dirname, 'clients')))
// app.use(express.static(path.join(__dirname,'clients')));

// Express Messages Middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

app.use(flash());

app.use(function(req,res,next){
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.msg = req.flash('msg');
    next();
});

app.get('*', function(req,res,next){
  res.locals.success = req.flash('success');
  res.locals.danger = req.flash('danger');
  res.locals.warning = req.flash('warning');
  res.locals.user_status = 0;
  next();
});

app.get('*', function(req, res, next){
  res.locals.user = req.user || null;
  next();
});

// Express Validator Middleware
app.use(expressValidator({
    errorFormatter:function(param,msg,value){
        var namespace = param.split('.'),
        root = namespace.shift(),
        formParm = root;

        while(namespace.length){
            formParm += '[' + namespace.shift() +']';
        }
        return {
            param:formParm,
            msg:msg,
            value:value
        };
    }
}));  

// Passport Config
require('./config/passport')(passport);
// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

Handlebars.registerHelper('times', function(n, block) {
  var accum = '';
  for(var i = 0; i < n; ++i)
      accum += block.fn(i);
  return accum;
});

Handlebars.registerHelper('iff', function(a, operator, b, opts) {
  var bool = false;
  switch(operator) {
    case '==':
        bool = a == b;
        break;
    case '>':
        bool = a > b;
        break;
    case '<':
        bool = a < b;
        break;
    case '<=':
        bool = a <= b;
        break;
    case '>=':
        bool = a >= b;
        break;
    default:
        throw "Unknown operator " + operator;
  }

  if (bool) {
      return opts.fn(this);
  } else {
      return opts.inverse(this);
  }
});

Handlebars.registerHelper("math", function(lvalue, operator, rvalue, options) {
  lvalue = parseFloat(lvalue);
  rvalue = parseFloat(rvalue);
      
  return {
      "+": lvalue + rvalue,
      "-": lvalue - rvalue,
      "*": lvalue * rvalue,
      "/": lvalue / rvalue,
      "%": lvalue % rvalue
  }[operator];
});

//used in not_paid_user_data and paid_user_data handelbars
Handlebars.registerHelper("inc", function (value, options) {
  return parseInt(value) + 1;
});

//USER
const users = require('./routes/users');
app.use('/users', users);

//ADMIN
const admin = require('./routes/admin');
app.use('/admin', admin);

//port is set at 4000
app.set('port', (process.env.PORT || 4000));

//localhost:4000 hits as below
app.get('/', (req, res, next) => {
  if(req.user){
    res.redirect('/users/userhome');
  }
  else{
    res.render("home");
  }
});

module.exports = { app };