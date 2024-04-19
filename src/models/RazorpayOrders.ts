import { Schema,model } from "mongoose";

type orderT={
    orderId:string,
    amount:number,
    currency:string
}

type refundT={
    paymentId:string,
    amount:number
}

const orderSchema=new Schema<orderT>({
    orderId:{
        type:String,
        required:true
    },
    amount:{
        type:Number,
        required:true
    },
    currency:{
        type:String,
        required:true
    }
},{versionKey:false,timestamps:true})

const refundSchema=new Schema<refundT>({
    paymentId:{
        type:String,
        required:true
    },
    amount:{
        type:Number,
        required:true
    }
},{versionKey:false,timestamps:true})


const orderModel=model<orderT>("Order",orderSchema)
export const refundModel=model<refundT>("Refund",refundSchema)
export default orderModel