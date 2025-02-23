const express = require("express");

const app = express();

const {AdminAuth, UserAuth} = require('./middleWare/auth')


app.use("/admin", AdminAuth)

app.get('/user/getUserData', UserAuth, (req, res) =>{
  res.send("Send user data successfully")
})

app.get('/admin/getUserDetails', (req,res) =>{

  res.send("successfully sent user details to admin")
});

app.get('/admin/deleteUser', (req,res) =>{
  res.send("successfully deleted user details")
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
