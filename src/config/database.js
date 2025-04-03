const mongoose = require("mongoose");


const connectDB = async () => {
    await mongoose.connect(
        "mongodb+srv://madhuravasreddy1998:hbrjhfbhbh@jr-dairyfarm.sabtr.mongodb.net/devTinder"
    )
} 


module.exports = {connectDB}
