import pushNotifyController from "../controllers/pushNotifyController";
import { Router } from "express";
import multer from "multer";
import { authMiddleware } from "../middlewares/authMiddleware";
const pushNotifyRouter=Router()
const upload=multer()

pushNotifyRouter.post('/token-store',authMiddleware,pushNotifyController.tokenStrore)
pushNotifyRouter.post('/send-notifications',authMiddleware,pushNotifyController.pushNotify)
pushNotifyRouter.post('/upload',authMiddleware,upload.single('image'),pushNotifyController.uplodMedia)

export default pushNotifyRouter