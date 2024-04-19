import {Request,Response} from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import userModel from "../models/User";
import { UserT } from '../models/User';
import { config } from 'dotenv';
config()

let secret_key=process.env.JWT_SECRET

const addUser=async(req:Request,res:Response)=>{
    try {
        const {name,email,password,number,role}=req.body

        const user=await userModel.findOne({email:email})
        const hashedPassword=await bcrypt.hash(password,10)
        if(!user){
            const newUser=await userModel.create({
                name,
                email,
                password:hashedPassword,
                number,
                role
            })
            return res.status(201).send({message:"User Added Successfully"})
        }
        return res.status(400).send({error:"User Already Exists"})
    } catch (error) {
        console.log(error)
        return res.status(500).send({error:"Internal Server Error"})
    }
}

const getAllUsers=async(req:Request,res:Response)=>{
    try {
        const users=await userModel.find()
        return res.status(200).send({users})
    } catch (error) {
        console.log(error)
        return res.status(500).send({error:"Internal Server Error"})
    }
}

const updateUserById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { name, email, password, number }= req.body;
        const user = await userModel.findById(id);

        if (!user) {
            return res.status(400).send({ error: "Invalid User Id" });
        }

        let updates: Partial<UserT> = {}
        if (name) updates.name = name;
        if (email) updates.email = email;
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            updates.password = hashedPassword;
        }
        if (number) updates.number = number;

        const updatedUser = await userModel.findByIdAndUpdate(id, updates, { new: true });

        return res.status(200).send({ message: "User Updated Successfully", user: updatedUser });
    } catch (error) {
        console.log(error);
        return res.status(500).send({ error: "Internal Server Error" });
    }
}


const deletUserById=async(req:Request,res:Response)=>{
    try {
        const {id}=req.params
        const user=await userModel.findByIdAndDelete(id)
        if(!user){
            return res.status(404).send({error:"User id not found"})
        }
        return res.status(200).send({error:"User deleted successfully"})
    } catch (error) {
        console.log(error)
        return res.status(500).send({error:"Internal Server Error"})
    }
}

const loginUser=async(req:Request,res:Response)=>{
    try {
     
        const {email,password}=req.body
        const user=await userModel.findOne({email:email})
        if(!user){
            return res.status(400).send({error:"User not registered"})
        }
        const isPasswordValid=await bcrypt.compare(password,user.password)
        if(!isPasswordValid){
            return res.status(400).send({error:"Incorrect Password"})
        }

        const jwtToken=await jwt.sign({_id:user._id,email:email},secret_key as string,{expiresIn:"10h"})
        return res.status(200).send({result:jwtToken,user})
    } catch (error) {
        console.log(error)
        return res.status(500).send({error:"Internal Server Error"})
    }
}

export default {addUser,getAllUsers,updateUserById,deletUserById,loginUser}