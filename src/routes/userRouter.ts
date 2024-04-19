import userController from "../controllers/userController";
import userValidations from "../validations/userValidations";
import { Router } from "express";

const userRouter=Router()

userRouter.post('/addUser',userValidations.adduserV,userController.addUser)
userRouter.get('/getAll',userController.getAllUsers)
userRouter.put('/update/:id',userController.updateUserById)
userRouter.delete('/delete/:id',userController.deletUserById)
userRouter.post('/login',userValidations.loginV,userController.loginUser)

export default userRouter