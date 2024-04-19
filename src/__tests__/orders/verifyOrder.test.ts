import app from "../../serverT";
import request from "supertest";
import orderModel from "../../models/RazorpayOrders";
import razorpay from "../../utils/Razorpay";
import Razorpay from "razorpay";
import crypto from 'crypto'

beforeEach(() => {
  jest.resetAllMocks();
});

let jwtToken='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NjBmODQxYzgxZDFjYmFiODY3OWYwZjUiLCJlbWFpbCI6ImtyaXNobmFAZ21haWwuY29tIiwiaWF0IjoxNzEzMzMxMDgxLCJleHAiOjE3MTMzNjcwODF9.V2RNDxzn4RwDH2BaQ0Wvt2tcXrcDxACD5WLllQgbkc0'

describe('Verify Order API',()=>{
    it('Should Return Payment Verified Successfully',async()=>{
        const options={
            razorpay_payment_id:'pay_123',
            order_id:'order_123',
            razorpay_signature:'f2c9e74c81bccc8634356a1c230be88ee916c31f5ecc6439e86df2184791ccb8'
        }
        const response=await request(app)
        .post('/razorpay/verify')
        .send(options)
        .set({
            authorization:`Bearer ${jwtToken}`
        })

        expect(response.status).toBe(200)
        expect(response.body).toEqual({msg:"Payment verified successfully"})
    })

    it('Should Return Signature not Match',async()=>{
        const options={
            razorpay_payment_id:'pay_123',
            order_id:'order_123',
            razorpay_signature:'123signature'
        }
        const response=await request(app)
        .post('/razorpay/verify')
        .send(options)
        .set({
            authorization:`Bearer ${jwtToken}`
        })

        expect(response.status).toBe(400)
        expect(response.body).toEqual({error:"singature not match"})
    })

    it('Should Return 400 token not found',async()=>{
        const options={
            razorpay_payment_id:'pay_123',
            order_id:'order_123',
            razorpay_signature:'f2c9e74c81bccc8634356a1c230be88ee916c31f5ecc6439e86df2184791ccb8'
        }
        const response=await request(app)
        .post('/razorpay/verify')
        .send(options)
        .set({
            authorization:` `
        })

        expect(response.status).toBe(400)
        expect(response.body).toEqual({error:"token not found"})
    })

    it('Should Return 400 Provide token',async()=>{
        const options={
            razorpay_payment_id:'pay_123',
            order_id:'order_123',
            razorpay_signature:'f2c9e74c81bccc8634356a1c230be88ee916c31f5ecc6439e86df2184791ccb8'
        }
        const response=await request(app)
        .post('/razorpay/verify')
        .send(options)
        .set({
            authorization:`Bearer `
        })

        expect(response.status).toBe(400)
        expect(response.body).toEqual({error:"please provide token"})
    })

    it('Should Return 400 Invalid Token',async()=>{
        const options={
            razorpay_payment_id:'pay_123',
            order_id:'order_123',
            razorpay_signature:'f2c9e74c81bccc8634356a1c230be88ee916c31f5ecc6439e86df2184791ccb8'
        }
        const response=await request(app)
        .post('/razorpay/verify')
        .send(options)
        .set({
            authorization:`Bearer jwttoken `
        })

        expect(response.status).toBe(400)
        expect(response.body).toEqual({error:"Invalid token"})
    })
})