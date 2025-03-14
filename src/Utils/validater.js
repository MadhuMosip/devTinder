const { Error } = require("mongoose");
const validate = require("validator");

function validator(req){
    const {firstName, lastName, emailId, password} = req.body;
    if(!firstName || !lastName){
        throw new Error("name is mandatory")
    }else if(!validate.isEmail(emailId)){
        throw new Error("Invalid email Id");
    }else if(!validate.isStrongPassword(password)){
        throw new Error("Use Strong password")
    }
}

function validateProfileUpdate(req){
    const newData = req.body;
    const allowedUpdateFields = ["firstName", "lastName", "age", "gender", "photoUrl", "about", "skills"];
    
    return Object.keys(newData).every(field => allowedUpdateFields.includes(field)); 
}

function validatePasswordDetails(req){
    
    if(!req.oldPassword || !req.newPassword || !req.confirmPassword){
        throw new Error("Invalid request Data");
    }else if(req.newPassword !== req.confirmPassword){
        throw new Error("New password and confirm password is not matched");
    }else if(!validate.isStrongPassword(req.newPassword)){
        throw new Error("Create strong password")
    }
}

function validateForgotPassword(req){
    if(!req.emailId || !req.newPassword || !req.confirmPassword){
        throw new Error("Invalid request data");
    }else if(req.newPassword !== req.confirmPassword){
        throw new Error("New password and confirm password is not matched")
    }else if(!validate.isStrongPassword(req.newPassword)){
        throw new Error("Create strong password");
    }
}
module.exports = {
    validator,
    validateProfileUpdate,
    validatePasswordDetails,
    validateForgotPassword
}