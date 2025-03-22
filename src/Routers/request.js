const express = require("express");
const { UserAuth } = require("../middleWare/auth");
const ConnectionRequest = require('../models/connectionRequest');
const User = require("../models/user");


const requestRouter = express.Router();


requestRouter.post("/connection/send/:status/:toUserId", UserAuth, async (req, res) =>{
    const fromUserId = req.user._id;
    const {status, toUserId} = req.params;

    try{
        const connectionReqData = {
            fromUserId,
            toUserId,
            status
        };

        const allowedConnections = ["ignored", "interested"];

        if(!allowedConnections.includes(status)){
            return res.status(404).send("ERROR: Invalid request status")
        }
        
        const toUserDetails = await User.findById(toUserId);
        if(!toUserDetails){
           return res.status(404).send("ERROR: Invalid user details")
        };

        const isExistingRequest = await ConnectionRequest.findOne({
            $or:[{fromUserId, toUserId}, {toUserId: fromUserId, fromUserId: toUserId}]
        });

        if(isExistingRequest){
          return  res.status(409).send("ERROR: Duplicate connection Request");
        };

        const connectionRequest = new ConnectionRequest(connectionReqData);
        const data = await connectionRequest.save();
        res.json({message: `connection ${status}`, data})
    }catch(err){
        res.status(400).send("ERROR: " + err)
    }

});

requestRouter.post("/connection/review/:status/:requestId", UserAuth, async (req,res) =>{
    try{
        const {status, requestId} = req.params;
        const userData = req.user

        const allowedStatus = ["accepted", "rejected"];

        if(!allowedStatus.includes(status)){
            return res.status(400).send("Status is not valid");
        };

        const connectionRequest = await ConnectionRequest.findOne({
            $or:[{ _id: requestId, toUserId: userData._id,status: "interested"},
            { _id: requestId, toUserId: userData._id,status: "accepted"}]
           
        });

        if(!connectionRequest){
           return res.status(400).send("Invalid request details");
        };

        connectionRequest.status = status;              

        connectionRequest.save();
        res.json({message:"Connection " + status});
    }catch(err){
        res.status(400).send("ERROR: " + err)
    }
})


module.exports = requestRouter