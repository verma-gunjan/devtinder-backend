const jwt = require('jsonwebtoken');
const User = require('../src/model/user');
const userAuth = async (req, res, next) =>{
    try{
        const {token} = req.cookies;
        if(!token){
            res.status(401).send("Token not valid");
        }
        // decoding the token
        const decode = jwt.verify(token, "DevTinder$123");
        const userId = decode._id;
        const user = await User.findById(userId);
        if(!user){
            res.status(404).send("user not found");
        }
        req.user = user;
        next();
    }catch(err){
        res.status(404).send("Error:" + err);
    }
};

module.exports = {userAuth};