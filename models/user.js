const {createHmac,randomBytes} = require("crypto");
const mongoose=require("mongoose");
const {createTokenforUser}=require('../services/authentication');


const userSchema=new mongoose.Schema({
fullName:{
    type:String,
    required:true,

},
email:{
    type:String,
    required:true,
    unique:true,
},
salt:{
    type:String,
    
},
password:{
    type:String,
    required:true,
},
profileImageUrl:{
    type:String,
    default:"/images/default.jpg",

},
role:{
    type:String,
    enum:["USER","ADMIN"],
    default:"USER",
}


},{timestamps:true})

userSchema.pre("save",function(next){
    const user=this;

    if(!user.isModified('password')) return;

    const salt=randomBytes(16).toString();
    const hashedPassword=createHmac("sha256",salt).update(user.password).digest('hex');

    this.salt=salt;
    this.password=hashedPassword;
    next();
})

userSchema.static("matchedPasswordAndGenerateToken",async function(email,password){
    const user=await this.findOne({email});
    if(!user) throw new Error ("User not found");
    const hashedPassword=user.password;

    const salt=user.salt;
    const userProvidedPassword=createHmac("sha256",salt)
    .update(password)
    .digest('hex');

    if(hashedPassword !== userProvidedPassword) throw new Error ("Incorrect username or Password");

    const token=createTokenforUser(user)
    return token;
})

const USER=mongoose.model('user',userSchema);

module.exports=USER;