var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
let loginRouter = require('./routes/login');
let addRouter = require('./routes/add');
let addedRouter =require('./routes/added');
let helmet = require('helmet');

var app = express();

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

//loading models
let User = require('./models/users');
let Link = require('./models/link_container');


User.sync().then(()=>{
  Link.belongsTo(User,{foreignKey:'userId'});
  Link.sync();
})

passport.serializeUser((user,done) =>{
  done(null,user);
});

passport.deserializeUser((user,done) =>{
  done(null,user);
});

//Google login auth
passport.use(new GoogleStrategy({
  clientID:'462079283892-53v74ftue8a4gfo4cju7735rop68k534.apps.googleusercontent.com',
  clientSecret:'Vvvi-L_r60mzUNJkqdl3oQCj',
  callbackURL:'/auth/google/callback'
},
  function(accessToken,refreshToken,profile,done){
    process.nextTick(function(){
      User.upsert({
        userId:profile.id,
        username:profile.displayName
      }).then(()=>{
        done(null,profile);
      });
    });
  }
));
//use session
const session = require('express-session');

app.use(session({
  secret:'secret',
  resave:false,
  saveUninitialized:true
}));

app.use(passport.initialize());
app.use(passport.session());




// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(helmet());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/static', express.static(__dirname + '/public'));
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/login', loginRouter);
app.use('/add',addRouter);
app.use('/added',addedRouter);

app.get('/auth/google',passport.authenticate('google',{
  scope: ['https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/userinfo.email'
  ]
}));

app.get('/auth/google/callback',
  passport.authenticate('google',{failureRedirect:'/login'}),
  function(req,res){
    res.redirect('/');
    
  });
app.get('/logout',function(req,res){
  req.logout();
  res.redirect('/');
});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
