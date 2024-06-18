const express=require("express");
const multer=require("multer");
const path=require("path");
const router=express.Router();
const Blog=require("../models/blog");
const comment=require("../models/comments")



const storage=multer.diskStorage({
destination:function(req,file,cb) {
    cb(null, path.resolve(`./public/uploads/`));
},
    filename:function(req,file,cb){
        const fileName=`${Date.now()}-${file.originalname}`
        cb(null,fileName);
    },
})

const upload=multer({storage:storage});

router.get("/add-new",(req,res)=>{
    res.render("addblog",{
        user:req.user,
    });
})

router.get("/delete/:id",async(req,res)=>{
 

  if(!req.user){
   return  res.redirect("/user/signin");
  }
 
  
  try {

    let blog=await Blog.findByIdAndDelete(req.params.id);
  
    
    if (!blog) {
      // Handle case where blog entry doesn't exist
      return res.status(404).send("Blog not found");
    }

    
    


    // Redirect to the home page
    return res.redirect("/");
  }catch (error) {
    console.log(error)
    
  }
   


})


router.get("/:id", async(req,res)=>{
  const blog=await Blog.findById(req.params.id).populate("createdBy");
  const comments= await comment.find({blogId:req.params.id}).populate("createdBy");
  res.render("blog",{
    blog,
    user:req.user,
    comments,

  });
})

router.post("/comment/:blogId" ,async(req,res)=>{
  const cb=await comment.create({
    content:req.body.content,
    blogId:req.params.blogId,
    createdBy: req.user._id,

 });
 
  res.redirect(`/blog/${req.params.blogId}`)
})

router.post("/",upload.single("coverImageURL") ,async(req,res)=>{
    const {title,body}=req.body
   const blog= await Blog.create({
    body,
        title,
        createdBy:req.user._id,
        coverImageURL:`/uploads/${req.file.filename}`,
    })

   return  res.redirect(`blog/${blog._id}`);
})

module.exports=router;