/* const mongoose = require ('mongoose'); */
import mongoose from 'mongoose';
const connectDB = async () => {
     
    await mongoose.connect(process.env.DB_CONNECTION_SECRET);
};
/* module.exports = connectDB; */
export default connectDB;