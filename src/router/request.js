const express = require('express');
const requestRouter = express.Router();
const {userAuth} = require("../middlewares/auth");
const User = require('../models/user');
const ConnectionRequest = require('../models/connectionRequest');

requestRouter.post("/request/send/:status/:toUserId",userAuth,async(req,res)=>{
    try{
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;
        const allowedStatus = ["ignored","interested"];
        if(!allowedStatus.includes(status)){
            return res.status(400).json({message:"Invalid status Type:" + status});
        }
        const toUser = await User.findById(toUserId);
        if(!toUser){
            return res.status(404).json({message:"User not found"});
        }
        const existingConnectionRequest = await ConnectionRequest.findOne({
            $or:[
                {fromUserId,toUserId},
                {fromUserId:toUserId,toUserId:fromUserId}
            ],
        });
        if(existingConnectionRequest){
            return res.status(400).send("Connection Request Already exists");
        }
        const connectionRequest = new  ConnectionRequest({
            fromUserId,toUserId,status
        });
        const data = await connectionRequest.save();
        res.json({
            message:"Connection Request sent Successfully"
        });
    } catch (err) {
        res.status(401).send("Error :" + err);
    }
});

requestRouter.post("/request/review/:status/:requestId",userAuth,async(req,res)=>{
    try{
        const loggedInUser = req.user;
        //loggedInUser=toUserId
        //status=interested
        //reqid should be valid
        const {status,requestId} = req.params;
        const allowedStatus = ["accepted","rejected"] ;
        if(!allowedStatus.includes(status)){
            return res.status(400).json({message:"Status not allowed !"})
        }
        const connectionRequest = await ConnectionRequest.findOne({
            _id:requestId,
            toUserId:loggedInUser._id,
            status:"interested"
        });
        if(!connectionRequest){
            return res.status(400).json({message:"Connect Request not found"});
        }
        connectionRequest.status = status ;
        const data = await connectionRequest.save();
        res.json({message:"Connection request"+status , data});
        
    } catch (err) {
        res.status(401).send("Error :" + err);
    }
});

module.exports =  requestRouter;