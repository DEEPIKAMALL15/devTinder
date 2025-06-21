/* 
const express = require ('express');
const profileRouter =  express.Router();
const {userAuth} = require("../middlewares/auth");
const User = require ("../models/user.js");
const {validateEditProfileData }= require("../utils/validator.js")
profileRouter.get("/profile/view",userAuth, async (req,res)=>{
    try{
        const user = req.user;
        res.send(user);
    } catch (err) {
        res.status(400).send("Error : "+ err);
    }
});

profileRouter.post("/profile/edit",userAuth, async (req,res) => {
    try {
         if(!validateEditProfileData(req)) {
            throw new Error("Invalid Edit Request");
        } 
        const loggedInUser = req.user;
       
        Object.keys(req.body).forEach(key=>
            loggedInUser[key] = req.body[key]
        );
        await loggedInUser.save();
        res.json({
            message : `${loggedInUser.firstName} , your profile was updated Successfully .`,
            data: loggedInUser,
        })
    } catch (err) {
        res.status(400).send("Error :" + err.message);
    }
});


module.exports = profileRouter; */
import express from 'express';
import userAuth from '../middlewares/auth.js';
import User from '../models/user.js';
import { validateEditProfileData } from '../utils/validator.js';

const profileRouter = express.Router();

// View Profile Route
profileRouter.get('/profile/view', userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(400).send('Error: ' + err.message);
  }
});

// Edit Profile Route
profileRouter.post('/profile/edit', userAuth, async (req, res) => {
  try {
    if (!validateEditProfileData(req)) {
      throw new Error('Invalid Edit Request');
    }

    const loggedInUser = req.user;

    Object.keys(req.body).forEach((key) => {
      loggedInUser[key] = req.body[key];
    });

    await loggedInUser.save();

    res.json({
      message: `${loggedInUser.firstName}, your profile was updated successfully.`,
      data: loggedInUser,
    });
  } catch (err) {
    res.status(400).send('Error: ' + err.message);
  }
});

export default profileRouter;
