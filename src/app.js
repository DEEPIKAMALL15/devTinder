const express = require ('express');
const connectDB = require('./config/database');
const app= express();
const cookieParser = require ('cookie-parser');
const cors=require("cors");
const http = require("http");

require('dotenv').config();


app.use(cors({
  origin: "https://devconnect-frontend-zeta.vercel.app" || "http://localhost:5173",
  credentials: true,
  
}));



app.use(express.json());
app.use(cookieParser());


const authRouter = require("./router/auth.js");
const profileRouter = require("./router/profile.js");
const requestRouter = require("./router/request.js");
const userRouter = require("./router/user.js");
const initializaSocket = require('./utils/socket.js');
const chatRouter = require('./router/chat.js');
app.use('/',authRouter);
app.use('/',profileRouter);
app.use('/',requestRouter);
app.use('/',userRouter);
app.use('/',chatRouter);
app.get("/", (req, res) => {
  return res.send("Server is running ✅");
});


const server = http.createServer(app);
initializaSocket(server);

connectDB()
    .then(()=>{
        console.log("Database successfully established");
        server.listen(process.env.PORT,()=>{
            console.log("Server is successfully listening");
        });
    })
    .catch((err)=>{
        console.log("Something went wrong");
    })





