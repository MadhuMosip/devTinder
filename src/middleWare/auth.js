const jwt = require("jsonwebtoken");
const User = require("../models/user");

const UserAuth = async (req,res,next) =>{
  try{
    const {token} = req.cookies;

    if(!token){
      return res.status(401).send("Cookies not found");
    }

    const userData = await jwt.verify(token, "DEV@TINDER$790");

    const user = await User.findById(userData._id).select("-password");
    
    if(!user){
      throw new Error("user not availabe");
    }

    req.user = user
    next();
  }catch(err){
    res.status(400).send("ERROR: " + err.message)
  }
}


module.exports = {
    UserAuth
}