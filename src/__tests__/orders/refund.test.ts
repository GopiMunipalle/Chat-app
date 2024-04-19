import app from "../../serverT";
import request from "supertest";
import { refundModel } from "../../models/RazorpayOrders";
import razorpay from "../../utils/Razorpay";
import Razorpay from "razorpay";
import crypto from 'crypto'

beforeEach(() => {
  jest.resetAllMocks();
});

let jwtToken='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NjBmODQxYzgxZDFjYmFiODY3OWYwZjUiLCJlbWFpbCI6ImtyaXNobmFAZ21haWwuY29tIiwiaWF0IjoxNzEzMzMxMDgxLCJleHAiOjE3MTMzNjcwODF9.V2RNDxzn4RwDH2BaQ0Wvt2tcXrcDxACD5WLllQgbkc0'

describe('Refund API END POINT',()=>{
    it('Should Return Successfully Refunded',async()=>{
        const payment_id='pay_NuoxB8SVPj1BLb'
        const amount=500
        jest.spyOn(razorpay.payments,'refund').mockResolvedValueOnce(true as never)
        jest.spyOn(refundModel,'create').mockResolvedValueOnce({paymentId:payment_id,amount}as any)
        const response=await request(app)
        .post('/razorpay/refund-payment')
        .send({payment_id,amount})
        .set({authorization:`Bearer ${jwtToken}`})

        expect(response.status).toBe(200)
        expect(response.body).toEqual({msg:"successfully refunded"})
    })

    it('Should Return PaymentId is Required',async()=>{
        const response=await request(app)
        .post('/razorpay/refund-payment')
        .send({payment_id:'',amount:'500'})
        .set({authorization:`Bearer ${jwtToken}`})
        // console.log(response.body)
        expect(response.status).toBe(400)
        expect(response.body).toEqual({error:"Payment Id is Required"})
    })

    it('Should Return amount is Required',async()=>{
        const response=await request(app)
        .post('/razorpay/refund-payment')
        .send({payment_id:'pay_NuoxB8SVPj1BLb',amount:''})
        .set({authorization:`Bearer ${jwtToken}`})

        expect(response.status).toBe(400)
        expect(response.body).toEqual({error:"amount is required"})
    })

    it('Should Return Internal Server Error',async()=>{
        jest.spyOn(refundModel,'create').mockRejectedValueOnce(new Error('error'))
        const response=await request(app)
        .post('/razorpay/refund-payment')
        .send({payment_id:'pay_NuoxB8SVPj1BLb',amount:'500'})
        .set({authorization:`Bearer ${jwtToken}`})

        expect(response.status).toBe(500)
        expect(response.body).toEqual({error:"Unable to issue Refund"})
    })
    it('Should Return 400 token not found',async()=>{
        const response=await request(app)
        .post('/razorpay/refund-payment')
        .send({payment_id:'',amount:''})
        .set({
            authorization:` `
        })

        expect(response.status).toBe(400)
        expect(response.body).toEqual({error:"token not found"})
    })

    it('Should Return 400 Provide token',async()=>{
        const response=await request(app)
        .post('/razorpay/refund-payment')
        .send({payment_id:"",amount:''})
        .set({
            authorization:`Bearer `
        })

        expect(response.status).toBe(400)
        expect(response.body).toEqual({error:"please provide token"})
    })

    it('Should Return 400 Invalid Token',async()=>{
        const response=await request(app)
        .post('/razorpay/refund-payment')
        .send({payment_id:'',amount:''})
        .set({
            authorization:`Bearer jwttoken `
        })

        expect(response.status).toBe(400)
        expect(response.body).toEqual({error:"Invalid token"})
    })
})