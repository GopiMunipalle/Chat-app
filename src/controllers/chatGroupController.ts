import { Request, Response } from "express";
import chatGroupModel from "../models/ChatGroupModel";
import userModel from "../models/User";

const createChatGroup = async (req: Request, res: Response) => {
  try {
    const { name, participants } = req.body;
    const userId = req._id;
    const admin = await userModel.findById(userId);
    if (!admin) {
      return res.status(400).send({ error: "user not found" });
    }
    if (!Array.isArray(participants) || participants.length < 2) {
      return res
        .status(400)
        .send({ error: "At least two members are required" });
    }
    const isSenderExist = participants.find(
      (eachId: string) => eachId === admin._id.toString()
    );
    if (isSenderExist) {
      return res
        .status(400)
        .send({
          error: "Participants array should not contain the group creator",
        });
    }
    const users = await userModel.find({ _id: { $in: participants } });
    console.log("users", users);
    if (users.length !== participants.length) {
      const missingUsers = participants.filter(
        (id) => !users.find((user) => user._id === id)
      );
      return res
        .status(404)
        .send({ error: `Users ${missingUsers.join(" ")} not found` });
    }

    const newGroup = await chatGroupModel.create({
      name: name,
      admin: admin._id,
      content: [],
      participants: participants,
    });
    // console.log(newGroup)
    return res
      .status(201)
      .send({ group: newGroup, result: `Group created by ${admin.name}` });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: "Internal Server Error" });
  }
};

const sendMessageInGroup = async (req: Request, res: Response) => {
  try {
    const { groupId } = req.params;
    const { message } = req.body;

    const user = await userModel.findById(req._id);
    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }

    const updatedGroup = await chatGroupModel.findByIdAndUpdate(
      groupId,
      {
        $push: { content: { messagerId: user._id, message: message } },
      },
      { new: true }
    );

    if (!updatedGroup) {
      return res.status(404).send({ error: "Group not found" });
    }

    return res
      .status(200)
      .send({ message: "Message sent successfully", group: updatedGroup });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: "Internal Server Error" });
  }
};

const addNewUserInGroup = async (req: Request, res: Response) => {
  try {
    const { groupId, newUserId } = req.params;
    const user=await userModel.findById(req._id)
    if(!user){
      return res.status(400).send({error:"User not found"})
    }
    if(user.role!=='admin'){
      return res.status(400).send({error:"Your Not An Admin"})
  }
    const group = await chatGroupModel.findById(groupId);
    if (!group) {
      return res.status(400).send({ error: "Group not exists" });
    }
    const participant = await userModel.findById({ _id: newUserId });
    if (!participant) {
      return res.status(400).send({ error: "Participant is not exist" });
    }
    if (group.participants.includes(newUserId)) {
      return res.status(400).send({ error: "User is already in the group" });
    }
    const updatedChat = await chatGroupModel.findByIdAndUpdate(
      groupId,
      { $push: { participants: newUserId } },
      { new: true }
    );
    return res
      .status(200)
      .send({ result: "Participant added successfully", updatedChat });
  } catch (error) {
    console.log(error)
    return res.status(500).send({error:"Internal Server Error"})
  }
};

const removeUserInGroup = async (req: Request, res: Response) => {
  try {
    const { groupId, newUserId } = req.params;
    const user=await userModel.findById(req._id)
    if(!user){
      return res.status(400).send({error:"User not found"})
    }
    if(user.role!=='admin'){
      return res.status(400).send({error:"Your Not An Admin"})
    }
    const group = await chatGroupModel.findById(groupId);
    if (!group) {
      return res.status(400).send({ error: "Group not exists" });
    }
    if (!group.participants.includes(newUserId)) {
      return res.status(400).send({ error: "User not in the group" });
    }
    const updatedChat = await chatGroupModel.findByIdAndUpdate(
      groupId,
      { $pull: { participants: newUserId } },
      { new: true }
    );
    return res
      .status(200)
      .send({ result: "Participant removed successfully", updatedChat });
  } catch (error) {
    console.log(error)
    return res.status(500).send({error:"Internal Server Error"})
  }
};

const cleareGroupChat = async (req: Request, res: Response) => {
  try {
    const { groupId } = req.params;
    const user = await userModel.findById(req._id);
    if (!user) {
      return res.status(400).send({ error: "User not exists" });
    }
    if(user.role!=='admin'){
        return res.status(400).send({error:"Your Not An Admin"})
    }
    const group = await chatGroupModel.updateMany(
      { _id: groupId },
      { $set: { content: [] } }
    );
    return res.status(200).send({ message: "cleared All data", group });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: "Internal Server Error" });
  }
};

const deleteMessageInGroup = async (req: Request, res: Response) => {
  try {
    const { groupId, messageId } = req.params;

    const group = await chatGroupModel.findById(groupId);
    if (!group) {
      return res.status(400).send({ error: "Group not found" });
    }

    const deleteMessage = await group.updateOne({
      $pull: { content: { _id: messageId } },
    });

    return res
      .status(200)
      .send({ result: "Message Deleted Successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: "Internal Server Error" });
  }
};

const giveAdminToParticipant = async (req: Request, res: Response) => {
  try {
    const { groupId, receiverId,isAdmin } = req.body;
    console.log(isAdmin)
    const user = await userModel.findById(req._id);
    if (!user) {
      return res.status(400).send({ error: "User not found" });
    }
    console.log(user.role)
    if(user.role!=='admin'){
        return res.status(400).send({error:"You not an admin"})
    }
    const group = await chatGroupModel.findById(groupId);
    
    if (!group) {
      return res.status(400).send({ error: "group not found" });
    }
    console.log(group)
    const isReceiverExists = group.participants.includes(receiverId)

    if(!isReceiverExists){
        return res.status(400).send({error:"receiver not found"})
    }
    if(!isAdmin){
     const participant=await userModel.findByIdAndUpdate(receiverId,{$set:{role:''}},{new:true})
     return res.status(200).send({message:`Admin Removed By ${user.number}` ,participant})
    }
      const participant=await userModel.findByIdAndUpdate(receiverId,{$set:{role:"Admin"}},{new:true})
      return res.status(200).send({ message: `Admin Given By ${user.number}` ,participant});
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: "Internal Server Error" });
  }
};

const groupParticipants=async(req:Request,res:Response)=>{
    try {
        const {groupId}=req.params

        const user=await userModel.findById(req._id)
        if(!user){
            return res.status(400).send({error:"User not found"})
        }
        const participants=await chatGroupModel.findById(groupId).populate('participants')
        console.log(participants)
        if(!participants){
            return res.status(400).send({error:"Group Id not Found"})
        }
        return res.status(200).send(participants?.participants)
    } catch (error) {
        console.log(error)
        return res.status(500).send({error:"Internal Server Error"})
    }
}

export default {
  createChatGroup,
  sendMessageInGroup,
  addNewUserInGroup,
  removeUserInGroup,
  cleareGroupChat,
  deleteMessageInGroup,
  giveAdminToParticipant,
  groupParticipants
};
