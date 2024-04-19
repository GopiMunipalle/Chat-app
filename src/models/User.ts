import { Schema,model } from "mongoose";

export type UserT={
    name:string;
    email:string;
    password:string;
    number:string;
    role:string;
    deviceToken:string;
}

const userSchema=new Schema<UserT>({
    name:{
        type:String,
        required:false
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    number:{
        type:String,
        required:false
    },
    role:{
        type:String,
        required:false
    },
    deviceToken:{
        type:String,
        required:false
    }
},{
    versionKey:false,
    timestamps:true
})

const userModel=model<UserT>('User',userSchema)
export default userModel