import { Schema,model } from "mongoose";

type messageT={
    messagerId:string;
    message:{type:string}
}

const messageSchema=new Schema<messageT>({
    messagerId:{type:String,required:false},
    message:{type:String,required:false}
})

type chatGroupT={
    name:string;
    admin:string;
    participants:string[];
    content:[{message:string}];
}

const chatGroupSchema=new Schema<chatGroupT>({
    name:{
        type :String,
        required:true
    },
    admin:{
        type:String,
        required:true,
    },
    participants:{
        type:[String],
        required:true,
        ref:"User"
    },
    content:{
        type:[messageSchema],
        required:false,
    }
},{versionKey:false,timestamps:true})


const chatGroupModel=model<chatGroupT>('ChatGroup',chatGroupSchema)
export default chatGroupModel