import chatModel from "../models/ChatModel";
import userModel from "../models/User";
import { Request, Response } from "express";

const sendMesssage = async (req: Request, res: Response) => {
  try {
    const { receiverId, content } = req.body;
    const senderId=req._id
    const sender = await userModel.findById(req._id);
    const receiver = await userModel.findById(receiverId);
    if (!sender || !receiver) {
      return res.status(404).send({ error: "Sender or receiver not found" });
    }
    const existingChat = await chatModel.findOne({$or: [
      { senderId, receiverId },
      { senderId: receiverId, receiverId: senderId }]
    });
    // console.log(existingChat)
    if(!existingChat){
      await chatModel.create({
        senderId: sender._id,
        receiverId: receiverId,
        content: {message: content }
      });
      return res.status(200).send({ message:"Successfully sent Message" });
    }
    await existingChat.updateOne({$push:{content:{message:content}}},{new:true})
    return res.status(200).send({ message:"Successfully sent Message" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

const getAllMessages = async (req: Request, res: Response) => {
  try {
    const {receiverId}=req.params

    const user=await userModel.findById(req._id)

    let senderId=user?._id.toString()
    const messages = await chatModel.findOne({$or: [
      { senderId, receiverId },
      { senderId: receiverId, receiverId: senderId }]
    })

    return res.status(200).send({messages});
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: "Internal Server Error" });
  }
};

const clearAllChat = async (req: Request, res: Response) => {
  try {
    const { receiverId } = req.params;

    const user = await userModel.findById(req._id);
    if (!user) {
      return res.status(400).send({ error: "User not found" });
    }
    const receiver = await userModel.findOne({ _id: receiverId });
    if (!receiver) {
      return res.status(400).send({ error: `User ${receiverId} not found` });
    }
    const clearChat=await chatModel.updateMany(
      {
        senderId: user._id.toString(),
        receiverId: receiver._id.toString()
      },
      { $set: { content: [] } }
    );

    return res
      .status(200)
      .send({ message: "All chat contents cleared successfully",clearChat });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: "Internal Server Error" });
  }
};

const deleteOneToOneMessage=async(req:Request,res:Response)=>{
  try {
    const {receiverId,messageId}=req.params

    const user=await userModel.findById(req._id)
    if(!user){
        return res.status(400).send({error:"User not found"})
    }
    let userId=user._id.toString()
    const chat=await chatModel.findOne({$and:[{senderId:userId},{receiverId:receiverId}]})
    if(!chat){
        return res.status(400).send({error:"Chat not found"})
    }
    
    const deleteMessage = await chat.updateOne({ $pull: { content: { _id: messageId } } });

    return res.status(200).send({result:"Message Deleted Successfully",deleteMessage})
} catch (error) {
    console.log(error)
    return res.status(500).send({error:"Internal Server Error"})
}
}


export default { sendMesssage, getAllMessages,clearAllChat,deleteOneToOneMessage };