const express=require('express')
const messageRouter=express.Router()
const messageController=require('../controllers/messageController')
const multer=require('multer')
const path=require('path')


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },

  filename: (req, file, cb) => {
    cb(
      null,
      Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage });


messageRouter.post("/uploadimage",upload.single("image"),messageController.uploadImage);


messageRouter.post('/sendmessage',messageController.sendMessage)
messageRouter.get('/showmessage/:senderId/:receiverId',messageController.showMessage)
messageRouter.delete('/deletemessage/:id',messageController.deleteMessage)








module.exports=messageRouter