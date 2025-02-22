const express = require("express");

const app = express();

app.get("/user", (req,res) =>{
  res.send({name:"Madhu", age:27})
})

app.post("/user", (req,res) =>{
  res.send("Data saved succesfully")
})

app.delete("/user", (req,res) =>{
  res.send("Data delated successfully")
})

app.use("/test", (req, res) => {
  res.send("Test Hello World!");
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
