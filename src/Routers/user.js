const express = require("express");
const {UserAuth} = require("../middleWare/auth");
const ConnectionRequest = require("../models/connectionRequest");
const userRouter = express.Router();
const User = require("../models/user");


const USER_ALLOWED_DATA = "firstName lastName photoUrl skills about"

userRouter.get("/user/requests/received", UserAuth, async (req, res) =>{
    try{
        const userData = req.user
        const connectionReqData = await ConnectionRequest.find({
            toUserId: userData._id,
            status:"interested"
        }).populate("fromUserId", USER_ALLOWED_DATA);
        res.json({message:"Data fetched successfully",data:connectionReqData})
    }catch(err){
        res.status(400).send("ERROR: " + err)
    }
});

userRouter.get("/user/connections", UserAuth, async (req,res) => {
    try{
        const userData = req.user;
        const connectionDetails = await ConnectionRequest.find({
            $or:[
                {toUserId:userData._id, status:"accepted"},
                {fromUserId:userData._id, status:"accepted"}
            ]
        }).populate("fromUserId", USER_ALLOWED_DATA)
        .populate("toUserId", USER_ALLOWED_DATA);
         
        const data = connectionDetails.map(row =>{
            if(row.fromUserId._id.toString() === userData._id.toString()){
                return row.toUserId
            }
            return row.fromUserId
        })

        res.json({data})
    }catch(err){
        res.status(400).send("ERROR: " + err)
    }
})

userRouter.get("/user/feed", UserAuth, async (req, res) =>{
    try{
        let {limit, page} = req.query;
        const loggedInUser = req.user;

        page = parseInt(page) || 1;
        limit = parseInt(limit) || 5;
        limit = limit > 20 ? 20 : limit;
        
        const connectionsData = await ConnectionRequest.find({
            $or:[{fromUserId: loggedInUser._id}, {toUserId: loggedInUser._id}]
        }).select("fromUserId toUserId" );
        
        const skip = (page-1)*limit

        const hideConnectedUsers = new Set();
        connectionsData.forEach(item =>{
            hideConnectedUsers.add(item.toUserId.toString());
            hideConnectedUsers.add(item.fromUserId.toString());
        })


        const usersData = await User.find({
           $and:[{_id: {$nin: Array.from(hideConnectedUsers)}}, {_id:{$ne: loggedInUser._id}}]
        }).skip(skip).limit(limit).select(USER_ALLOWED_DATA );

        res.json({skip,limit, items:usersData.length, data: usersData})

    }catch(err){
        res.status(400).send("ERROR: " + err)
    }
})



module.exports = userRouter;