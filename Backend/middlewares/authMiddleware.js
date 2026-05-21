const jwt=require('jsonwebtoken')
const authMiddleware=async(req,res,next)=>{
    const token=req.cookies.token;
    if(!token){
        return res.status(401).json({msg: "Access denied"})
    }
    try{
        const decodeToken=jwt.verify(token, process.env.SECRET_KEY)
        req.User=decodeToken
        next()
    }
    catch(error){
        res.status(401).json({msg: "Invalid token"})
    }
}

module.exports=authMiddleware