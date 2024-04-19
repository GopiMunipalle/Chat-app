import Razorpay from "razorpay";
import { config } from "dotenv";
config()


let razorpay_id=process.env.RAZORPAY_KEY_ID as string
let razorpay_secret_id=process.env.KEY_SECRET

 const razorpay=new Razorpay({
    key_id:razorpay_id,
    key_secret:razorpay_secret_id
})
export default razorpay