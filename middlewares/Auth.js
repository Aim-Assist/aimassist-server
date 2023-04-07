const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authentication = async (req, res, next) => {
    try{
        console.log(req.cookies);
        const token = req.cookies.jwttoken;
        if(token == undefined || !token){
            return res.status(401).json({message:"Unauthorized"});
        }
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        const user = await User.findOne({_id:decoded._id,"token":token});
        if(!user){
            throw new Error();
        }
        req.user = user;
        req.token = token;
        req.userid = user._id;
        next();
    }
    catch(err){
        console.log("Err",err);
        return res.status(401).json({message:"Unauthorized 2"});
    }
}

module.exports = authentication;