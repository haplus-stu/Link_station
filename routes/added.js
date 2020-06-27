var express = require('express');
const authenticationEnsurer = require('./authenticationEnsurer');
var router = express.Router();
const Link = require('../models/link_container');

router.post('/',authenticationEnsurer,(req,res,next) =>{
    console.log(req.body);
    Link.create({
        name:req.body.save_name || req.body.url,
        url:req.body.url,
        userId:req.user.id
    });
    res.redirect('/');
});

module.exports = router;
