const express=require("express");
require("dotenv").config();
const mongoose=require("mongoose");
const app=express();
const path=require("path");
var cookieParser = require('cookie-parser')
const {checkForAuthenticationCookie}=require("./middleware/authentication");
const userRoute=require("./routes/user");
const blogRoute=require("./routes/blog");
const Blog=require("./models/blog");

const port=8000;



app.set("view engine", "ejs");
app.set('views',path.resolve("./views"));
app.use(express.urlencoded({extended:false}));
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));
app.use(express.static(path.resolve("./public")));

app.get("/",async(req,res)=>{
    const allBlogs=await Blog.find({})
    res.render("homepage",{
        user:req.user,
        blogs:allBlogs,
    });
});

app.get("/home",(req,res)=>{
    res.render("homepage");
})



app.use("/user",userRoute);
app.use("/blog",blogRoute);


mongoose.connect(process.env.MONGO_URL).then((e)=>
    console.log("connection is successfull..."));

app.listen(port,()=>{
    console.log(" Server is running at "  +`${port}`)
})
