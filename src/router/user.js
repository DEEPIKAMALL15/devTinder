/* const express = require ('express');
const userRouter = express.Router();
const {userAuth} = require("../middlewares/auth");
const ConnectionRequest = require ("../models/connectionRequest.js");
const { toUSVString } = require('util');
const User = require('../models/user.js');
const USER_SAFE_DATA = "firstName lastName photoUrl age gender about";
userRouter.get('/user/connections/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('firstName lastName photoUrl');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user });
  } catch (err) {
    console.error('Error fetching user:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

userRouter.get("/user/requests/recieved",userAuth,async (req,res) => {
    try {
        const loggedInUser = req.user;
        const connectionRequests = await ConnectionRequest.find({
            toUserId : loggedInUser._id ,
            status : "interested"
        }).populate("fromUserId",USER_SAFE_DATA);
        res.status(200).json({message:"Pending Connection requests fetched Successfuly" , data : connectionRequests});
    } catch (err) {
        res.status(404).send("Error :" + err);
    }
})

userRouter.get("/user/connections",userAuth,async (req,res)=>{
    try{
        const loggedInUser = req.user;
        const connectionRequests = await ConnectionRequest.find({
            $or:[
                {toUserId:loggedInUser._id,status:"accepted"},
                {fromUserId:loggedInUser._id,status:"accepted"}
            ]
        }).populate("fromUserId",USER_SAFE_DATA).populate("toUserId",USER_SAFE_DATA);
        const data = connectionRequests.map((row)=>{
            if(row.fromUserId._id.toString()===loggedInUser._id.toString()){
                return row.toUserId
            }
            return row.fromUserId
        });
        res.json({data});
    } catch (err) {
        res.status(404).send("Error :" + err);
    }
})

userRouter.get("/feed",userAuth,async(req,res)=>{
    try{
        //User should see all the user except his own , his connections,ignored peoples , already sent connections
        const loggedInUser = req.user;
        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        limit=limit>50 ? 50 : limit;
        const skip = (page-1)*limit;
        const connectionRequests = await ConnectionRequest.find({
            $or:[
                {fromUserId:loggedInUser},
                {toUserId:loggedInUser},
            ]
        }).select("fromUserId toUserId");
        const hideUsersFromFeed = new Set();
        connectionRequests.forEach(req=>{
            hideUsersFromFeed.add(req.fromUserId.toString());
            hideUsersFromFeed.add(req.toUserId.toString());
        });
        const users=await User.find({
            $and:[
                {_id:{$nin:Array.from(hideUsersFromFeed)}},
                {_id:{$ne:loggedInUser}},
            ]
        }).select(USER_SAFE_DATA).skip(skip).limit(limit);
        res.json({data:users});

    } catch(err){
        res.status(400).json({message:err.message});
    }
})


module.exports = userRouter; */
import express from 'express';
import userAuth from '../middlewares/auth.js';
import ConnectionRequest from '../models/connectionRequest.js';
import User from '../models/user.js';

const userRouter = express.Router();

const USER_SAFE_DATA = 'firstName lastName photoUrl age gender about';

// Get basic info of user by ID
userRouter.get('/user/connections/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('firstName lastName photoUrl');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user });
  } catch (err) {
    console.error('Error fetching user:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get received connection requests
userRouter.get('/user/requests/recieved', userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequests = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: 'interested',
    }).populate('fromUserId', USER_SAFE_DATA);

    res.status(200).json({
      message: 'Pending connection requests fetched successfully',
      data: connectionRequests,
    });
  } catch (err) {
    res.status(404).send('Error: ' + err.message);
  }
});

// Get accepted connections
userRouter.get('/user/connections', userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequests = await ConnectionRequest.find({
      $or: [
        { toUserId: loggedInUser._id, status: 'accepted' },
        { fromUserId: loggedInUser._id, status: 'accepted' },
      ],
    })
      .populate('fromUserId', USER_SAFE_DATA)
      .populate('toUserId', USER_SAFE_DATA);

    const data = connectionRequests.map((row) => {
      if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return row.toUserId;
      }
      return row.fromUserId;
    });

    res.json({ data });
  } catch (err) {
    res.status(404).send('Error: ' + err.message);
  }
});

// Get feed (excluding self, connections, ignored/sent users)
userRouter.get('/feed', userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit;
    const skip = (page - 1) * limit;

    const connectionRequests = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUser }, { toUserId: loggedInUser }],
    }).select('fromUserId toUserId');

    const hideUsersFromFeed = new Set();
    connectionRequests.forEach((req) => {
      hideUsersFromFeed.add(req.fromUserId.toString());
      hideUsersFromFeed.add(req.toUserId.toString());
    });

    const users = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUsersFromFeed) } },
        { _id: { $ne: loggedInUser._id } },
      ],
    })
      .select(USER_SAFE_DATA)
      .skip(skip)
      .limit(limit);

    res.json({ data: users });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default userRouter;
