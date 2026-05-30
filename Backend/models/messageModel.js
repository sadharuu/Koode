const mongoose=require('mongoose');

const MessageSchema=new mongoose.Schema({
    senderId:{
        type:String,
        required:true
    },
    receiverId:{
        type:String,
        required:true
    },
    message:{
        type:String,
        default: ""
    },
    image:{
        type:String,
        default: ""
    }
},{timestamps:true})

const Message=mongoose.model('message',MessageSchema)

module.exports=Message