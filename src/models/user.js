const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:[true, "First name should be required"]
    },
    lastName:{
        type:String
    },
    emailId:{
        type:String,
        unique: [true, "duplicate email ID found"],
        trim:true,
        lowercase:true
    },
    password:{
        type:String,
        required:true,
        validate(value){
            if(!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(value)){
                throw new Error("Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&).");
            }
        }
    },
    age:{
        type:Number
    },
    gender:{
        type:String,
        validate(value){
          if(!["male", "female", "other"].includes(value)){
            throw new Error("invalid gender value");
          }
        }
    },
    photoUrl:{
        type: String,
        default: "https://cdn.vectorstock.com/i/2000v/89/50/generic-person-gray-photo-placeholder-man-vector-24848950.avif"
    },
    about:{
        type:String
    },
    skills:{
        type:[String]
    }
}, )

module.exports = mongoose.model("User", userSchema)