import { Schema,Types,model } from "mongoose";

type contentT={
    message:string
}

const contentSchema=new Schema<contentT>({
    message:{type:String,required:false}
},{versionKey:false,timestamps:true})

type chatT={
    senderId:string;
    receiverId:string
    content:[{message:string}];
}

const chatSchema=new Schema<chatT>({
    senderId:{
        type:String,
        required:true
    },
    receiverId:{
        type:String,
        required:true
    },
    content:{
        type:[contentSchema],
        required:false
    }
},{versionKey:false,timestamps:true})


const chatModel=model<chatT>('Chat',chatSchema)
export default chatModel