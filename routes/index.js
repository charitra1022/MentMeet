const express = require('express');
//controllers
const users = require('../controllers/user.js');
//Middlewares
const {encode} = require('../middlewares/jwt.js');

const router = express.Router();

router.post('/login', encode, (req, res, next)=>{ 
    console.log(req.authToken)
    return res.json({success:true, authorization: req.authToken});
});

module.exports =  router;