const mongoose = require("mongoose");


const connectionRequest = new mongoose.Schema({
    fromUserId:{
        type:mongoose.Schema.Types.ObjectId,
        require:true
    },
    toUserId:{
        type:mongoose.Schema.Types.ObjectId,
        require:true
    },
    status:{
        type:String,
        require:true,
        enum:{
            values:["ignored", "interested", "accepted", "rejected"],
            message:`{value} is not accecpted`
        }
    }
},{timestamps:true});

connectionRequest.index({fromUserId:1, toUserId:1})

connectionRequest.pre("save", function(next){
    const connectionRequestDetails = this;
    if(connectionRequestDetails.fromUserId.equals(connectionRequestDetails.toUserId)){
        throw new Error("ERROR: You can't send connection request yourself")
    }
    next();
})

module.exports = mongoose.model("ConnectionRequest", connectionRequest);

