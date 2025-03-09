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


module.exports = {
    validator
}