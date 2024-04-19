import chatGroupController from "../controllers/chatGroupController";
import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
const chatGroupRouter=Router()

chatGroupRouter.post('/createGroup',authMiddleware,chatGroupController.createChatGroup)
chatGroupRouter.post('/sendMessagesInGroup/:groupId',authMiddleware,chatGroupController.sendMessageInGroup)
chatGroupRouter.get('/addNewUser/:groupId/:newUserId',authMiddleware,chatGroupController.addNewUserInGroup)
chatGroupRouter.get('/removeUser/:groupId/:newUserId',authMiddleware,chatGroupController.removeUserInGroup)
chatGroupRouter.get('/clearGroupData/:groupId',authMiddleware,chatGroupController.cleareGroupChat)
chatGroupRouter.get('/deleteMessage/:groupId/:messageId',authMiddleware,chatGroupController.deleteMessageInGroup)
chatGroupRouter.post('/admin/',authMiddleware,chatGroupController.giveAdminToParticipant)
chatGroupRouter.get('/getParticipants/:groupId',authMiddleware,chatGroupController.groupParticipants)

export default chatGroupRouter