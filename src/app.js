const express = require ('express');
const connectDB = require('./config/database');
const app= express();




const cookieParser = require ('cookie-parser');
const cors=require("cors");



/*  app.use(cors({
    origin:"http://localhost:5173",
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials:true,
    
})); */
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
  
}));



app.use(express.json());
app.use(cookieParser());

const authRouter = require("./router/auth.js");
const profileRouter = require("./router/profile.js");
const requestRouter = require("./router/request.js");
const userRouter = require("./router/user.js");
app.use('/',authRouter);
app.use('/',profileRouter);
app.use('/',requestRouter);
app.use('/',userRouter);








connectDB()
    .then(()=>{
        console.log("Database successfully established");
        app.listen(3000,()=>{
            console.log("Server is successfully listening");
        });
    })
    .catch((err)=>{
        console.log("Something went wrong");
    })





/* const { adminAuth,userAuth }= require ("./middlewares/auth.js");
app.use("/admin",adminAuth);
app.use("/user",userAuth,(req,res)=>{
    res.send("User Data sent");
});
app.get("/admin/getAllData",(req,res)=>{
    res.send("All Data send");
})
app.get("/admin/deleteData",(req,res)=>{
    res.send("Delete data");
})

app.use("/",(error,req,res,next)=>{
    if(err){
        res.status(500).send("Something went wrong");
    }
}) */


/* app.get("/user/:userId/:name:/password",(req, res) => {
    console.log(req.params);
    res.send({firstname: "Akshay", lastname: "Saini"});
});
app.get("/test",(req,res)=>{
    res.send("Test");
}) */
//app.use("/route",rH, [rH2,rH3] , rH4)

/* app.get("/user/:userId",(req,res)=>{
    console.log(req.params);
    res.send({firstName:"Deepiks"});
});
app.post("/user",(req,res)=>{
    res.send("Successfully saved data");
}) */

//Multiple Routing....................................
/* app.use("/user", (req,res,next)=> {
    //Route handler
    console.log("Handling the route 1");
    //res.send("Route Handler 1");
    next();

},
(req,res)=>{
    //another route handler
    console.log("Handling the route 2");
    res.send("Route Handler 2");
}); */
