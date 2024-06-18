const jwt=require("jsonwebtoken");

const secret="$kandpanDey";

function createTokenforUser(user){
    const payload={
        _id:user._id,
        profileImageUrl:user.profileImageUrl,
        email:user.email,
        role:user.role,

    };

    const token=jwt.sign(payload,secret);
    return token;

}

function validateToken(token){
    const payload=jwt.verify(token,secret);
    return payload;

}

module.exports={
    createTokenforUser,
    validateToken,
}