var express = require('express');
const authenticationEnsurer = require('./authenticationEnsurer');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('add', { title: 'Express' ,user:req.user,});
});



  
module.exports = router;