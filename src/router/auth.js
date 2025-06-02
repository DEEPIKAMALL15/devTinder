const express = require('express');
const authRouter = express.Router();
const bcrypt = require("bcrypt");
const jwt = require ('jsonwebtoken');
const {validateSignUpData} = require("../utils/validator");
const User = require ("../models/user.js");

authRouter.post("/signup",async(req,res)=>{
    
    try{
        //validate the data
        validateSignUpData(req);
        //encrypt the password
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
            //Add token to cookie and send reply back to user
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
            // create a jwt token
            const token = await user.getJWT();
            //Add token to cookie and send reply back to user
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
