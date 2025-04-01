const express = require("express");
const authRouter = express.Router();
const bcrypt = require("bcrypt");

const {validator} = require("../Utils/validater");
const User = require("../models/user");

authRouter.post("/signup", async (req, res) => {
  const { firstName, lastName, emailId, password } = req.body;

  try {
    validator(req);

    let encryptedPassword = await bcrypt.hash(password, 10);

    const userData = {
      firstName,
      lastName,
      emailId,
      password: encryptedPassword,
    };

    let user = new User(userData);

    const generateToken = await user.getJWT();

    res.cookie("token", generateToken, {
      expires: new Date(Date.now() + 86400000),
      httpOnly:true,
    });
     
    let newUser = await user.save();
    res.json({message:"Data Added successfully", data:newUser});
  } catch (err) {
    res.status(400).send("ERROR: " + err);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const allowData = ["firstName", "lastName", "emailId", "photoUrl", "skills", "about", "age", "gender"];
    const user = await User.findOne({ emailId });
    if (!user) {
      return res.status(401).send("Invalid credentials");
    }
    const isPasswordValid = await user.validatePassword(password);
    if (isPasswordValid) {
      let generateToken = await user.getJWT();
      res.cookie("token", generateToken, {
        expires: new Date(Date.now() + 86400000),
        httpOnly: true,
      });
      
      const data = allowData.reduce((acc, field) =>{
        if (user[field]) acc[field] = user[field];
        return acc
      }, {});
      res.json({message:"log in successfull!!!", data});
    } else {
      return res.status(401).send("Invalid credentials");
    }
  } catch (err) {
    res.status(400).send("ERROR: " + err);
  }
});

authRouter.post('/logout', async (req,res) => {
    res.cookie("token", null, {expires: new Date(Date.now())});
    res.json({message:"User logged out successfully!!"});
})

module.exports = authRouter