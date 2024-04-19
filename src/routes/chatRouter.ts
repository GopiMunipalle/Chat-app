import chatController from "../controllers/chatController";
import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
const chatRouter=Router()


chatRouter.post('/sendMessage',authMiddleware,chatController.sendMesssage)
chatRouter.get('/getAllMessages/:receiverId',authMiddleware,chatController.getAllMessages)
chatRouter.get('/clearChat/:receiverId',authMiddleware,chatController.clearAllChat)
chatRouter.get('/deleteOneToOne/:receiverId/:messageId',authMiddleware,chatController.deleteOneToOneMessage)

export default chatRouter