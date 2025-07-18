 
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
 /* const userAuth = async  (req,res,next) => {
    try{
        const {token} = req.cookies;
        const decodeObj = await jwt.verify(token,process.env.JWT_SECRET);
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

module.exports = {userAuth}; */
/* const jwt = require('jsonwebtoken');
const User = require('../models/user.js');
 */
import jwt from 'jsonwebtoken';
import User from '../models/user.js';
const userAuth = async (req, res, next) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({ error: "No token found. Please log in." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded._id);

    if (!user) {
      return res.status(401).json({ error: "User not found. Please log in." });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("Auth error:", err.message);
    res.status(401).json({ error: "Unauthorized access. Invalid or expired token." });
  }
};

export default userAuth;
