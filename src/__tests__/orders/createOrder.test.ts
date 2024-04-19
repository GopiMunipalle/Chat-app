import app from "../../serverT";
import request from "supertest";
import orderModel from "../../models/RazorpayOrders";
import razorpay from "../../utils/Razorpay";
import Razorpay from "razorpay";

beforeEach(() => {
  jest.resetAllMocks();
});

let jwtToken='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NjBmODQxYzgxZDFjYmFiODY3OWYwZjUiLCJlbWFpbCI6ImtyaXNobmFAZ21haWwuY29tIiwiaWF0IjoxNzEzMzMxMDgxLCJleHAiOjE3MTMzNjcwODF9.V2RNDxzn4RwDH2BaQ0Wvt2tcXrcDxACD5WLllQgbkc0'

describe('RazorPay create Order API END POINT',()=>{
    it('Should Return 400 Amount is Required',async()=>{
        const response=await request(app)
        .post('/razorpay/order')
        .send({
            amount:'',
            currency:'INR'
        })
        .set({
            authorization:`Bearer ${jwtToken}`
        })

        expect(response.status).toBe(400)
        expect(response.body).toEqual({error:"Amount is Required"})
    })

    it('Should Return 400 Currency is Required',async()=>{
        const response=await request(app)
        .post('/razorpay/order')
        .send({
            amount:80000,
            currency:''
        })
        .set({
            authorization:`Bearer ${jwtToken}`
        })

        expect(response.status).toBe(400)
        expect(response.body).toEqual({error:"Currency is Required"})
    })

    it('Should Return 500 Internal Server Error',async()=>{
        const razorpayResponse = {
            id: 'orderId123',
            amount: 8080,
            currency: 'INR'
        };
        jest.spyOn(razorpay.orders,'create').mockRejectedValueOnce(new Error('error') as never)
        // jest.spyOn(orderModel,'create').mockRejectedValueOnce(new Error('error at create order'))
        const response=await request(app)
        .post('/razorpay/order')
        .send({
            amount:80000,
            currency:'INR'
        })
        .set({
            authorization:`Bearer ${jwtToken}`
        })
        // console.log(response.body)
        expect(response.status).toBe(500)
        expect(response.body).toEqual({error:"Internal Server Error"})
    })

    it('Should create and return an order', async () => {
        const requestBody = {
            amount: 8080,
            currency: 'INR'
        };

        const razorpayResponse = {
            id: 'orderId123',
            amount: 8080,
            currency: 'INR'
        };

        jest.spyOn(razorpay.orders, 'create').mockResolvedValueOnce(razorpayResponse as never);

        jest.spyOn(orderModel, 'create').mockResolvedValueOnce({
            orderId: razorpayResponse.id,
            amount: razorpayResponse.amount,
            currency: razorpayResponse.currency
        } as any);

        const response = await request(app)
            .post('/razorpay/order')
            .send(requestBody)
            .set({
                authorization:`Bearer ${jwtToken}`
            })
        // console.log(response.body)
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('order_id');
    });
})
