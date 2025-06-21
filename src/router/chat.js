/* const express = require('express');
const { Chat } = require('../models/chat');
const { userAuth } = require('../middlewares/auth');

const chatRouter = express.Router();

chatRouter.get('/chat/:targetUserId',userAuth, async (req,res)=> {
    const {targetUserId} = req.params;
    const userId = req.user._id;
    try{
        let chat = await Chat.findOne({
            participants: {$all: [userId,targetUserId]},
        }).populate({
            path: "messages.senderId",
            select: "firstName lastName photoUrl"
        })
        if(!chat){
            chat = new Chat({
                participants: [userId,targetUserId],
                messages: [],
            });
            await chat.save();

        } 
        res.json(chat);
    } catch(err){
        console.log(err);
    }
})


module.exports = chatRouter; */
import express from 'express';
import Chat from '../models/chat.js';
import userAuth from '../middlewares/auth.js';

const chatRouter = express.Router();

chatRouter.get('/chat/:targetUserId', userAuth, async (req, res) => {
  const { targetUserId } = req.params;
  const userId = req.user._id;

  try {
    let chat = await Chat.findOne({
      participants: { $all: [userId, targetUserId] },
    }).populate({
      path: 'messages.senderId',
      select: 'firstName lastName photoUrl',
    });

    if (!chat) {
      chat = new Chat({
        participants: [userId, targetUserId],
        messages: [],
      });
      await chat.save();
    }

    res.json(chat);
  } catch (err) {
    console.error('Error in chat route:', err.message);
    res.status(500).send('Internal Server Error');
  }
});

export default chatRouter;
