const mongoose = require ('mongoose');
const validator = require('validator');
const jwt = require ('jsonwebtoken');
const bcrypt = require('bcrypt');
const userSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        index:true,
        minLength:2,
    },
    lastName:{
        type:String,
    },
    emailId:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Emailid is not valid");
            }
        }
    },
    password:{
        type:String,
        required:true,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("Password is not Strong");
            }
        }
    },
    age:{
        type:Number,
        min:18,
    },
    gender:{
        type:String,
        validate(value){
            if(!["male","female","others"].includes(value.toLowerCase())){
                throw new Error("Gender data is not valid");
            }
        }
    },
    photoUrl:{
        type:String,
        default:"https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp",
        validate(value){
            if(!validator.isURL(value)){
                throw new Error("URL is not valid");
            }
        }
        
        
    },
    about:{
        type:String,
        default:"This is a default about of a user and I am a Software Developer",
    },
    skills:{
        type:[String],

    }
},
{
    timestamps:true,
});

userSchema.methods.getJWT = async function() {
    const user = this;
    const token = await jwt.sign({_id:user._id},"DEVTinder@25", {expiresIn:7*60*60});
    return token;
}
userSchema.methods.validatePassword = async function(passwordInputByUser) {
    const user = this;
    const passwordHash = user.password;
    const isPasswordValid = await bcrypt.compare(passwordInputByUser,passwordHash);
    return isPasswordValid;
}

module.exports = mongoose.model("User",userSchema);