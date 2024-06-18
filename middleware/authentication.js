const { validateToken } = require("../services/authentication");

function checkForAuthenticationCookie(tokenname){
    return(req,res,next)=>{
    const tokenvalue=req.cookies[tokenname];
    if(!tokenvalue) {
        return next();
    }

    try {
        const userpayload=validateToken(tokenvalue);
        req.user=userpayload;
        
        
    } catch (error) {
        
    }
    next();
};
}

module.exports={
    checkForAuthenticationCookie,
}