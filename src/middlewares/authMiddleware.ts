import { Request,Response,NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";


export const authMiddleware=async(req:Request,res:Response,next:NextFunction)=>{
    try {
        const authtoken=req.headers['authorization']
        if(!authtoken){
            return res.status(400).send({error:"token not found"})
        }
        const jwtToken=authtoken.split(' ')[1]
        if(!jwtToken){
            return res.status(400).send({error:"please provide token"})
        }
        await jwt.verify(jwtToken,process.env.JWT_SECRET as string,(error,payload)=>{
            if(error){
                console.log(error)
                return res.status(400).send({error:"Invalid token"})
            }
            req._id=(payload as JwtPayload)._id
            next()
        })
    } catch (error) {
        console.log(error)
        return res.status(500).send({error:"Internal Server Error"})
    }
}
