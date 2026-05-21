const User=require('../models/userModel')
const bcrypt=require('bcrypt')
const saltround=10
const jwt=require('jsonwebtoken')
require('dotenv').config()

const createUser=async(req,res)=>{
    const{username,email,password}=req.body

    try{
        const data=await User.findOne({email})
        if(data){
            return res.status(400).json({msg: "user exists"})
        }
        const hashPassword=await bcrypt.hash(password,saltround)
        const newdata=await new User({
            username,
            email,
            password:hashPassword
        })
        await newdata.save()
        res.status(203).json({msg: `user created successfully, data is: ${newdata}`})
    }
    catch(error){
        console.log(error);
        
        res.status(500).json({msg:"server error"})
    }
}

const login=async(req,res)=>{
    const{email,password}=req.body

    try{
        const data=await User.findOne({email})
        if(!data){
            return res.status(404).json({msg: "No user registered"})
        }
        const matchPassword=await bcrypt.compare(password,data.password)
        if(!matchPassword){
            return res.status(404).json({msg: "Invalid password"})
        }
        const token=jwt.sign(
            {id:data._id, name:data.username},
            process.env.SECRET_KEY,
            {expiresIn:'1h'}
        );
        res.cookie("token",token,{
            httpOnly:true,
            secure:false,
            sameSite:"lax",
            maxAge:60*60*1000           
        })
        res.status(200).json({
            msg: "Login Successfully",
            token,
            user:{
                _id: data._id,
                username: data.username,
                email: data.email,
            },
        })
    }
    catch(error){
        return res.status(500).json({msg: "server error"})
    }
}

const logout=(req,res)=>{
    res.clearCookie("token")
    res.status(200).json({msg: "Logout Successful"})
}

const showUser=async(req,res)=>{
    try{
        const data=await User.find().sort({createdAt: -1})
        res.status(200).json({msg: "all post", data:data})
    }
    catch(error){
        res.status(500).json({msg: "server error"})
    }
}


module.exports={createUser,login,logout,showUser}