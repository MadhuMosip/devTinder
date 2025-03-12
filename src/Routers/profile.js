const express = require("express");

const profileRouter = express.Router();
const {UserAuth} = require("../middleWare/auth");


profileRouter.get("/user", UserAuth, async (req,res) =>{
  try{
    res.send(req.user);
  }catch(err){
    res.status(400).send("ERROR: " + err);
  }
});

module.exports =  profileRouter