const express = require("express");
const app = express();
const { connectDB } = require("./config/database");
const User = require("./models/user");
const { Error } = require("mongoose");
const {validator} = require("./Utils/validater");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

const {UserAuth} = require("./middleWare/auth");

app.use(express.json());
app.use(cookieParser());

app.post("/signup", async (req, res) => {

  const {firstName, lastName, emailId, password} = req.body

  try{
    validator(req);

    let encryptedPassword = await bcrypt.hash(password,10);
    
    const userData = {
      firstName,
      lastName,
      emailId,
      password:encryptedPassword
    };

    let user = new User(userData);
    await user.save();
    res.send("Data Added successfully");
  }catch(err){
    res.status(400).send("ERROR: " + err);
  }
});

app.post("/login", async (req, res) =>{
  try{
    const {emailId, password} = req.body;
    const user = await User.findOne({emailId});
    if(!user){
      throw new Error("Invalid credentials");
    };
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if(isPasswordValid){
      let generateToken = jwt.sign({_id:user._id}, "DEV@TINDER$790",  { expiresIn: '1d' });
      res.cookie("token", generateToken, { expires: new Date(Date.now() + 900000), httpOnly: true });
      res.send("log in successfull!!!")
    }else{
      throw new Error("Invalid credentials");
    }
  }catch(err){
    res.status(400).send("ERROR: " + err);
  }
})

app.get("/user", UserAuth, async (req,res) =>{

  try{
    res.send(req.user);
  }catch(err){
    res.status(400).send("ERROR: " + err);
  }
});

connectDB()
  .then(() => {
    console.log("successfully connection establised..");
    app.listen(3000, () => {
      console.log("Server is running on port 3000");
    });
  })
  .catch((err) => {
    console.log(err)
    console.log("Connection failed!!");
  });
