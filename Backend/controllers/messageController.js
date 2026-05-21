const Message=require('../models/messageModel')

const sendMessage=async(req,res)=>{
    const{senderId,receiverId,message}= req.body

    try{
        const newdata=await new Message({
            senderId,
            receiverId,
            message
        })
        await newdata.save()
        res.status(201).json({msg: "created successfully", data: newdata})
    }
    catch(error){
        console.log(error);
        res.status(500).json({msg: "server error"})
    }
}

const showMessage=async(req,res)=>{
    const {senderId, receiverId} = req.params
    try {
        const messages = await Message.find({
          $or: [
            { senderId, receiverId },
            { senderId: receiverId, receiverId: senderId },
          ],
        }).sort({ createdAt: 1 });

        res.status(200).json({
        msg: "Messages fetched successfully",
          data: messages,
        });
    } catch (error) {
        console.error("Error fetching messages:", error);
        res.status(500).json({
          msg: "Server error",
          data: [],
        });
    }
};


const deleteMessage=async(req,res)=>{
    try{
        const {id}= req.params
        const deletedata=await Message.findByIdAndDelete(id)
        if(!deletedata){
            return res.status(404).json({msg: "message not found"})
        }
        res.status(200).json({msg: "message deleted"})
    }
    catch(error){
        res.status(500).json({msg: "server error"})
    }
}


module.exports={sendMessage,showMessage,deleteMessage}