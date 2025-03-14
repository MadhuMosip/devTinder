const express = require("express");

const profileRouter = express.Router();
const {UserAuth} = require("../middleWare/auth");
const {validateProfileUpdate, validatePasswordDetails, validateForgotPassword} = require('../Utils/validater');
const { Error } = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../models/user");


profileRouter.get("/profile/get", UserAuth, async (req,res) =>{
  try{
    res.send(req.user);
  }catch(err){
    res.status(400).send("ERROR: " + err);
  }
});

profileRouter.patch("/profile/edit", UserAuth, async (req,res) => {
    try{
        if(!validateProfileUpdate(req)){
            throw new Error("Invalid user data");
        }
        const createData = req.user;
        Object.keys(req.body).every(key => createData[key] = req.body[key]);
        createData.save();
        res.send({message:`${createData.firstName}, your Data updated successfully`, data: createData})
    }catch(err){
        res.status(400).send("ERROR: " + err.message)
    }
});

profileRouter.patch("/profile/updatePassword", UserAuth, async (req, res) =>{
    const userSendData = req.body;
   try{
       validatePasswordDetails(userSendData);
       const user = req.user
       const ispasswordvalid = await user.validatePassword(userSendData.oldPassword);

       if(ispasswordvalid){
            const newHashPassword = await bcrypt.hash(userSendData.newPassword, 10);
            user.password = newHashPassword;
            await user.save();
            res.send({message: `${user.firstName} your data updated successfully`});
       }else{
        throw new Error("Invalid Credentials")
       }
   }catch(err){
       res.status(400).send("ERROR: " + err);
   }
});

profileRouter.patch('/profile/forgotPassword', async (req, res) =>{
    const userReqData = req.body;
    try{
        validateForgotPassword(userReqData);
        const user = await User.findOne({emailId: userReqData.emailId});
        if(!user){
            throw new Error("user not existed");
        }

        const newPasswordHash = await bcrypt.hash(userReqData.newPassword, 10);
        user.password = newPasswordHash;
        await user.save();
        res.send({message: `${user.firstName} your password updated successfully`});
    }catch(err){
        res.status(400).send("ERROR: " + err.message)
    }
})





module.exports =  profileRouter