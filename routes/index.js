var express = require('express');
var router = express.Router();

const passport = require('passport');
const userModel = require('./users');
const localStrategy = require('passport-local');

passport.use(new localStrategy(userModel.authenticate()));

let app = express();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.post('/register',function(req,res,next){
  var newUser = new userModel ({
    username: req.body.username
  })
  userModel.register(newUser, req.body.password)
  .then(function(data){
    passport.authenticate('local')(req,res,function(){
      res.redirect('/profile')
    })
  })
  .catch(function(err){
    res.send(err);
  })
});

router.post('/login',passport.authenticate('local',{
  successRedirect: '/profile',
  failureRedirect: '/'
}),function(req,res,next){});

router.get('/profile',isLoggedIn,function(req,res,next){
  userModel.findOne({username: req.session.passport.user})
  .then(function(almost){
    res.render('profile',{val: almost});
  })
})

router.post('/createpost',function(req,res){
  userModel.findOne({username: req.session.passport.user})
  .then(function(founduser){
    founduser.posts.push(req.body.posts)
    founduser.save()
    .then(function(saved){
     res.redirect('/profile')
    })
  })
})

router.get('/logout',function(req,res,next){
  req.logout();
  res.redirect('/');
});

function isLoggedIn(req,res,next){
  if(req.isAuthenticated()){
    return next();
  }
  else{
    res.redirect('/');
  }
}

module.exports = router;
