const express=require("express");
const USER=require("../models/user");

const router=express.Router();

router.get("/signup",(req,res)=>{
    return res.render("signup");
})

router.get("/signin",(req,res)=>{
    return res.render("signin");
})


router.post('/signup',async(req,res)=>{
    const {fullName,email,password}=req.body;
    await USER.create({
        fullName,
        email,
        password,
    });
    return res.render("signin");
})

router.post("/signin", async(req,res)=>{
    const {email,password}=req.body;
    try {
        const token= await USER.matchedPasswordAndGenerateToken(email,password);
   
      return res.cookie("token",token).redirect("/");
      
      
    } catch (error) {
        return res.render("signin",{
           error:"Incorrect UserID or Password" ,
        })
        
    }

    
   

})
router.get('/logout',(req,res)=>{
    res.clearCookie("token").redirect("/");
})
    
module.exports=router;



