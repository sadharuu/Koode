const express=require('express')
const userRouter=express.Router()
const userController=require('../controllers/userController')
const authMiddleware=require('../middlewares/authMiddleware')

userRouter.post('/createUser',userController.createUser)
userRouter.post('/login',userController.login)
userRouter.get('/showuser',userController.showUser)

module.exports=userRouter