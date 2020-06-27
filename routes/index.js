var express = require('express');
const authenticationEnsurer = require('./authenticationEnsurer');
var router = express.Router();
let link = require('../models/link_container');
/* GET home page. */
router.get('/', function(req, res, next) {
  if(req.user){
   link.findAll({
     where:{
       userId:req.user.id
     },
   }).then((links) =>{
     console.log(links.length);
     
     res.render('index',{
       user:req.user,
       links
     });
   });
  }else{
  res.render('index', { title: 'Express' ,user:req.user,});
  }
});


module.exports = router;
