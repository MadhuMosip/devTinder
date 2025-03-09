const mongoose = require("mongoose");
const validate = require("validator");

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
        lowercase:true,
        validate(value){
            if(!validate.isEmail(value)){
                throw new Error("invalid email");
            }
        }
    },
    password:{
        type:String,
        required:true,
        validate(value){
            if(!validate.isStrongPassword(value)){
                throw new Error("provide strong password");
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
        default: "https://cdn.vectorstock.com/i/2000v/89/50/generic-person-gray-photo-placeholder-man-vector-24848950.avif",
        validate(value){
            if(!validate.isURL(value)){
                throw new Error("invalid URL");
            }
        }
    },
    about:{
        type:String
    },
    skills:{
        type:[String]
    }
}, { timestamps: true })

module.exports = mongoose.model("User", userSchema)