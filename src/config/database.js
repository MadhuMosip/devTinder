const mongoose = require("mongoose");


const connectDB = async () => {
    await mongoose.connect(
        "mongodb+srv://madhuravasreddy1998:qP99RLTmv0wDwTo7@jr-dairyfarm.sabtr.mongodb.net/"
    )
} 


module.exports = {connectDB}