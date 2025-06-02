
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
        /* if (!loggedInUser) {
            return res.status(401).send("User not authenticated");
        } */
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

/* profileRouter.get("/user",async(req,res)=>{
    const userEmail= req.body.emailId;
    try{
        const users = await User.find({emailId:userEmail});
        if(users.length===0){
            res.status(404).send("User not found");
        }
        else{
        res.send(users);
        }
    } catch(err){
        res.status(400).send("Something went wrong");
    }

})
profileRouter.get("/feed",async (req,res)=>{
    try{
        const users= await User.find({});
        res.send(users);
    } catch(err){
        res.status(400).send("Something went wrong");
    }
});
//delete a user 
profileRouter.delete("/user", async(req,res)=>{
    const userId=req.body.userId;
    try{
        const user =  await User.findByIdAndDelete(userId);
        res.send("User deleted Successfully");
    } catch(err){
        res.status(400).send("Something went wrong");
    }
})
profileRouter.patch("/user/:userId",async (req,res)=>{
    const userId = req.params?.userId;
    const data = req.body;
    try{
        const ALLOWED_UPDATES=[
            "photoUrl","skills","gender","age","about"
        ];
        const isUpdateAllowed = Object.keys(data).every((k)=>
            ALLOWED_UPDATES.includes(k)
        );
        if(!isUpdateAllowed){
            throw new Error ("User not Allowed");
        }

        await User.findByIdAndUpdate(userId,data,{
            returnDocument:"after",
            runValidators:true,
        });
        res.send("User updated successfully");
    } catch(err){
        res.status(400).send("Something went wrong"+err);
    }

}) */
module.exports = profileRouter;