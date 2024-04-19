import orderController from "../controllers/orderController";
import { Router } from "express";
import {authMiddleware} from "../middlewares/authMiddleware";
const orderRouter=Router()

orderRouter.post('/order',authMiddleware,orderController.createOrder)
orderRouter.post('/verify',authMiddleware,orderController.verifyOrder)
orderRouter.post('/refund-payment',authMiddleware,orderController.refundPayment)

export default orderRouter