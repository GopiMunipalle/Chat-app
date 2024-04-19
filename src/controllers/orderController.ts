import orderModel, { refundModel } from "../models/RazorpayOrders";
import { Request, Response } from "express";
import razorpay from "../utils/Razorpay";
import crypto from "crypto";

const createOrder = async (req: Request, res: Response) => {
  try {
    const { amount, currency } = req.body;
    
    if (!amount) {
      return res.status(400).send({ error: "Amount is Required" });
    }
    if (!currency) {
      return res.status(400).send({ error: "Currency is Required" });
    }
    const options = {
      amount,
      currency,
      receipt: "unique order id",
      payment_capture: 1,
    };

    const response = await razorpay.orders.create(options);
    const orderDetails = await orderModel.create({
      orderId: response.id,
      amount: response.amount,
      currency: response.currency,
    });
    return res.status(201).send({
      order_id: response.id,
      amount: response.amount,
      currency: response.currency,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: "Internal Server Error" });
  }
};

const verifyOrder = (req: Request, res: Response) => {
  const { razorpay_payment_id, order_id, razorpay_signature } = req.body;
  const sign = order_id + "|" + razorpay_payment_id;
  const hmac = crypto.createHmac("sha256", process.env.KEY_SECRET as string);
  hmac.update(sign);
  const expectedSignature = hmac.digest("hex");
  console.log("expected signature", expectedSignature);
  console.log("received signature", razorpay_signature);
  if (razorpay_signature === expectedSignature) {
    return res.status(200).send({ msg: "Payment verified successfully" });
  } else {
    return res.status(400).send({ error: "singature not match" });
  }
};

const refundPayment = async (req: Request, res: Response) => {
  try {
    const { payment_id, amount } = req.body;
    if (!payment_id) {
      return res.status(400).send({ error: "Payment Id is Required" });
    }
    if (!amount) {
      return res.status(400).send({ error: "amount is required" });
    }

    const response = await razorpay.payments.refund(payment_id, { amount });
    await refundModel.create({
      paymentId: payment_id,
      amount,
    });
    return res.status(200).send({ msg: "successfully refunded" });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: "Unable to issue Refund" });
  }
};

export default { createOrder, refundPayment, verifyOrder };
