const express = require("express");
const app = express();
const { connectDB } = require("./config/database");
const User = require("./models/user");
const { Error } = require("mongoose");
const {validator} = require("./Utils/validater");
const bcrypt = require("bcrypt");

app.use(express.json());

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
      res.send("log in successfull!!!")
    }else{
      throw new Error("Invalid credentials");
    }
  }catch(err){
    res.status(400).send("ERROR: " + err);
  }
})

app.get("/user", async (req,res) =>{
  let filterData = req.body.emailId;

  try{
    let users = await User.find({emailId: filterData});
    if(users.length !== 0){
      res.send(users);
    }else{
      res.status(404).send("User Data not found");
    }
  }catch(err){
    res.status(400).send("something went worng");
  }
});

app.get("/feed", async (req, res) =>{
  try{
    let users = await User.find({});
    if(users.length !== 0){
      res.send(users);
    }else{
      res.status(404).send("currently no one registred");
    }
  }catch(err){
    res.status(400).send("something went worng");
  }
});

app.delete("/user/:userId", async (req, res) => {
  let userId = req.params.userId;

  try{
    let deletedUser = await User.findByIdAndDelete(userId);
    if(deletedUser){
      res.send("Deleted User Data")
    }else{
      res.status(400).send("User not found");
    }
    
  }catch(err){
    res.status(400).send("invalid User ID");
  }
})

app.patch("/user/:userId", async (req, res) => {
  let userId = req.params.userId;
  let data = req.body

  try{

    let ALLOW_UPDATEDATA = ["firstName", "lastName", "gender", "skills"];

    let checkUpdateData = Object.keys(data).every(item =>{ return ALLOW_UPDATEDATA.includes(item)});

    if(!checkUpdateData){
      throw new Error("Failed to update data")
    }

    let checkSkillsLength = req.body?.skills.length;

    if(checkSkillsLength > 10){
      throw new Error("Skills sholuld be 10 or less then 10");
      
    }

    let userData = await User.findByIdAndUpdate(userId, data, {returnDocument:'before',runValidators: true});
    if(userData){
      res.send("Data Updated successfully")
    }else{
      res.status(400).send("Data not found")
    }
  }catch(err){
    res.status(400).send("UPDATE FAILED" + err);
  }
})

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
