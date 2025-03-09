const express = require("express");
const app = express();
const { connectDB } = require("./config/database");
const User = require("./models/user");


app.use(express.json());

app.post("/signup", async (req, res) => {
  
  let user = new User(req.body);
  try{
    await user.save();
    res.send("Data Added successfully");
  }catch(err){
    res.status(400).send("something went worng" + err);
  }
});

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

app.patch("/user", async (req, res) => {
  let userId = req.body.userId;
  let data = req.body

  try{
    let userData = await User.findByIdAndUpdate(userId, data, {returnDocument:'before',runValidators: true});
    if(userData){
      res.send("Data Updated successfully")
    }else{
      res.status(400).send("Data not found")
    }
  }catch(err){
    res.status(400).send("something went wrong" + err);
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
