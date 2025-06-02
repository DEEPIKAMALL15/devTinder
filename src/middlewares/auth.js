 const jwt = require ('jsonwebtoken');
 const User = require ("../models/user.js");
 /* const adminAuth = (req,res,next) => {
    console.log("Admin Auth is getting checked!")
    const token ="xyz";
    const isAuthorized = token==="xyz";
    if(!isAuthorized){
        res.status(401).send("Unauthorized Access");
    } else {
        next();
    }
} */
 const userAuth = async  (req,res,next) => {
    try{
        const {token} = req.cookies;
        const decodeObj = await jwt.verify(token,"DEVTinder@25");
        const {_id}= decodeObj;
        const user = await User.findById(_id);
        if(!user){
            return res.status(401).send("Please Login");
        }
        req.user = user;
        next();
    } catch (err) {
        res.status(401).send("Unauthorized Access");
    }
}

module.exports = {userAuth};