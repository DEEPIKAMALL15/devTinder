/* const express = require('express');
const authRouter = express.Router();
const bcrypt = require("bcrypt");
const jwt = require ('jsonwebtoken');
const {validateSignUpData} = require("../utils/validator");
const User = require ("../models/user.js");

authRouter.post("/signup",async(req,res)=>{
    
    try{
       
        validateSignUpData(req);
        
        const {firstName,lastName,emailId,password} = req.body;
        const passwordHash = await bcrypt.hash(password,10);
        const user = new User ({
            firstName,
            lastName,
            emailId,
            password:passwordHash,
        });
        const savedUser = await user.save();
        const token = await savedUser.getJWT();
           
            res.cookie("token",token,{expires:new Date(Date.now()+8 * 3600000)});
        
        res.json({message: "User Added Successfully!", data: savedUser});
    } catch (err) {
        res.status(400).send("Error in saving data"+err);
    }
    
});
authRouter.post("/login",async (req,res)=>{
    try{
        const { emailId,password} =req.body;
        const user = await User.findOne({ emailId:emailId } );
        if(!user) {
            throw new Error("Invalid credentials");
        }
        const isPasswordValid = await user.validatePassword(password);
        if(isPasswordValid){
            
            const token = await user.getJWT();
            
            res.cookie("token",token,{expires:new Date(Date.now()+8 * 3600000)});
            res.send(user);
        }
        else{
            throw new Error("Invalid credentials");
        }
        
    } catch (err) {
        res.status(400).send("Error : "+ err);
    }
});
authRouter.post("/logout", async (req,res)=>{
    res.cookie("token",null,{
        expires:new Date(Date.now())
    });
    res.send("Logout Successfully !!!");
})

module.exports = authRouter;
 */
/* const express = require('express');
const authRouter = express.Router();
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const { validateSignUpData } = require("../utils/validator");
const User = require("../models/user.js");

authRouter.post("/signup", async (req, res) => {
  try {
    validateSignUpData(req);
    const { firstName, lastName, emailId, password } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });
    const savedUser = await user.save();
    const token = await savedUser.getJWT();
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      expires: new Date(Date.now() + 8 * 3600000)
    });
    res.json({ message: "User Added Successfully!", data: savedUser });
  } catch (err) {
    res.status(400).send("Error in saving data" + err);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId });
    if (!user) throw new Error("Invalid credentials");
    const isPasswordValid = await user.validatePassword(password);
    if (isPasswordValid) {
      const token = await user.getJWT();
      res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        expires: new Date(Date.now() + 8 * 3600000)
      });
      res.send(user);
    } else {
      throw new Error("Invalid credentials");
    }
  } catch (err) {
    res.status(400).send("Error: " + err);
  }
});

authRouter.post("/logout", async (req, res) => {
  res.cookie("token", null, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    expires: new Date(Date.now())
  });
  res.send("Logout Successfully !!!");
});

module.exports = authRouter;
 */
import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { validateSignUpData } from '../utils/validator.js';
import User from '../models/user.js';

const authRouter = express.Router();

authRouter.post('/signup', async (req, res) => {
  try {
    validateSignUpData(req);

    const { firstName, lastName, emailId, password } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });

    const savedUser = await user.save();
    const token = await savedUser.getJWT();

    res.cookie('token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      expires: new Date(Date.now() + 8 * 3600000), // 8 hours
    });

    res.json({ message: 'User added successfully!', data: savedUser });
  } catch (err) {
    res.status(400).send('Error in saving data: ' + err.message);
  }
});

authRouter.post('/login', async (req, res) => {
  try {
    const { emailId, password } = req.body;

    const user = await User.findOne({ emailId });
    if (!user) throw new Error('Invalid credentials');

    const isPasswordValid = await user.validatePassword(password);
    if (!isPasswordValid) throw new Error('Invalid credentials');

    const token = await user.getJWT();

    res.cookie('token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      expires: new Date(Date.now() + 8 * 3600000), // 8 hours
    });

    res.send(user);
  } catch (err) {
    res.status(400).send('Error: ' + err.message);
  }
});

authRouter.post('/logout', (req, res) => {
  res.cookie('token', null, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    expires: new Date(Date.now()),
  });
  res.send('Logout successfully!');
});

export default authRouter;
