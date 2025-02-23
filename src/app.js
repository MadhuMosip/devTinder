const express = require("express");
const app = express();
const { connectDB } = require("./config/database");
const User = require("./models/user");

const { AdminAuth, UserAuth } = require("./middleWare/auth");

app.post("/signup", async (req, res) => {
  let userData = {
    firstName: "Madhuravas",
    lastName: "Reddy",
    emailId: "madhu@gmail.com",
    password:"madhu@123"
  };
  
  let user = new User(userData);
  await user.save();

  await user.save(userData);
  res.send("Data Added successfully")
});

connectDB()
  .then(() => {
    console.log("successfully connection establised..");
    app.listen(7070, () => {
      console.log("Server is running on port 7070");
    });
  })
  .catch((err) => {
    console.log("Connection failed!!");
  });
