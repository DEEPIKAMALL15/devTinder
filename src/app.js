const express = require ('express');

const app= express();

/* app.get("/user/:userId/:name:/password",(req, res) => {
    console.log(req.params);
    res.send({firstname: "Akshay", lastname: "Saini"});
});
app.get("/test",(req,res)=>{
    res.send("Test");
}) */
//app.use("/route",rH, [rH2,rH3] , rH4)
app.use("/user", (req,res,next)=> {
    //Route handler
    console.log("Handling the route 1");
    //res.send("Route Handler 1");
    next();

},
(req,res)=>{
    //another route handler
    console.log("Handling the route 2");
    res.send("Route Handler 2");
});

app.listen(3000,()=>{
    console.log("Server is successfully listening");
});
