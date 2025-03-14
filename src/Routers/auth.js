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
    await user.save();
    res.send("Data Added successfully");
  } catch (err) {
    res.status(400).send("ERROR: " + err);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId });
    if (!user) {
      throw new Error("Invalid credentials");
    }
    const isPasswordValid = await user.validatePassword(password);
    if (isPasswordValid) {
      let generateToken = await user.getJWT();
      res.cookie("token", generateToken, {
        expires: new Date(Date.now() + 900000),
        httpOnly: true,
      });
      res.send("log in successfull!!!");
    } else {
      throw new Error("Invalid credentials");
    }
  } catch (err) {
    res.status(400).send("ERROR: " + err);
  }
});

authRouter.post('/logout', async (req,res) => {
    res.cookie("token", null, {expires: new Date(Date.now())});
    res.send("User logged out successfully!!");
})

module.exports = authRouter