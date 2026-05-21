const express=require('express')
const messageRouter=express.Router()
const messageController=require('../controllers/messageController')

messageRouter.post('/sendmessage',messageController.sendMessage)
messageRouter.get('/showmessage/:senderId/:receiverId',messageController.showMessage)
messageRouter.delete('/deletemessage/:id',messageController.deleteMessage)


module.exports=messageRouter