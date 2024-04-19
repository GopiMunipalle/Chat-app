import { Request,Response,NextFunction } from "express";

const adduserV=(req:Request,res:Response,next:NextFunction)=>{
    const {name,email,password,number,role}=req.body
    let emailReg=/^[\w-]+(?:\.[\w-]+)*@(?:[\w-]+\.)+[a-zA-Z]{2,7}$/
    let errors=[]
     if(!name||name.length<3){
        errors.push({error:"Provide Valid Name"})
     }
     if(!emailReg.test(email)){
        errors.push({error:"Enter Valid Email"})
     }
     if(!password||password.length<4){
        errors.push({error:"Provide Valid Password"})
     }
     if(!number||isNaN(number)||number.length!==10){
        errors.push({error:"provide Valid number"})
     }
     if(errors.length>0){
        return res.status(400).send({error:errors})
     }
     next()
}

const loginV=(req:Request,res:Response,next:NextFunction)=>{
    const {email,password}=req.body
    let emailReg=/^[\w-]+(?:\.[\w-]+)*@(?:[\w-]+\.)+[a-zA-Z]{2,7}$/
    let errors=[]
    if(!emailReg.test(email)||email.length<4){
        errors.push({error:"Enter Valid Email"})
    }
    if(!password){
        errors.push({error:"Enter Valid Password"})
    }
    if(errors.length>0){
        return res.status(400).send({errors})
    }
    next()
}


export default {adduserV,loginV}