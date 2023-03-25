const jwt = require('jsonwebtoken');

const {UserSchema, TYPES} = require('../models/User.js');

const SECRET_KEY='some-secret-key';

const encode = async(req, res, next) => { 
    try {
        //console.log("header: "+req.headers);
        //console.log("Schema: "+UserSchema);
        const { userid } = req.headers;
        const user = await UserSchema.findById(userid);
        console.log("hell");
        console.log("userid: "+userid );
        const payload = {
            userId: user._id,
            userType: user.type
        };
        const authToken = jwt.sign(payload, SECRET_KEY);
        console.log('Auth', authToken);
        req.authToken = authToken;
        next();
    } catch (error) {
        return res.json({success: false, message: error.message});
    }
}


const decode = (req, res, next) => {
    console.log("Hello Dude");
    if(!req.headers['authorization']){
        return res.json({success: false, message: 'No access token provided'});
    }
    const accessToken = req.headers.authorization.split(' ')[0];
    try {
        console.log("Printing JWT: ", jwt);
        console.log("Access Key", accessToken);
        console.log("Secret Key", SECRET_KEY);
        
        const decoded = jwt.verify(accessToken, SECRET_KEY);
        req.userId = decoded.userId;
        req.userType = decoded.type;
        return next();
    } catch (error) {
        console.log(error);
        return res.json({success:false, message:error.message});
    }
 }


module.exports =  {decode,encode};

