import app from "../../serverT";
import userModel from "../../models/User";
import chatModel from "../../models/ChatModel";
import request from 'supertest'

beforeEach(()=>{
    jest.clearAllMocks()
})
let jwtToken='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NjBmODQxYzgxZDFjYmFiODY3OWYwZjUiLCJlbWFpbCI6ImtyaXNobmFAZ21haWwuY29tIiwiaWF0IjoxNzEzMzMxMDgxLCJleHAiOjE3MTMzNjcwODF9.V2RNDxzn4RwDH2BaQ0Wvt2tcXrcDxACD5WLllQgbkc0'


describe('Delete ONE_TO_ONE Message API',()=>{
    it('Should Return User not found',async()=>{
        const userId={_id:"660f840281d1cbab8679f0f2"}
        jest.spyOn(userModel,'findById').mockResolvedValueOnce(null)
        const response=await requestFn()

        // console.log(response.body)
        expect(response.status).toBe(400)
        expect(response.body).toEqual({error:"User not found"})
    })

    it('Should Return Chat not found',async()=>{
        const userId={_id:"660f840281d1cbab8679f0f2"}
        const chatId='660f847881d1cbab8679f100'
        jest.spyOn(userModel,'findById').mockResolvedValueOnce(userId)
        jest.spyOn(chatModel,'findOne').mockResolvedValueOnce(null)
        const response=await requestFn()

        // console.log(response.body)
        expect(response.status).toBe(400)
        expect(response.body).toEqual({error:"Chat not found"})
    })

    it('Should Return Message Deleted Successfully', async () => {
        jest.spyOn(userModel, 'findById').mockResolvedValueOnce({ _id: "someUserId" });
        jest.spyOn(chatModel, 'findOne').mockResolvedValueOnce({ updateOne: jest.fn().mockResolvedValueOnce(true) });
        const response = await requestFn();
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ result: "Message Deleted Successfully", deleteMessage: true });
    });

    it('Should Return 500 Internal Server Error',async()=>{
        jest.spyOn(userModel,'findById').mockRejectedValueOnce(new Error('Error at delete controller'))
        const response=await requestFn()
        expect(response.status).toBe(500)
        expect(response.body).toEqual({error:"Internal Server Error"})
    })
})

function requestFn() {
    return request(app)
        .get(`/chat/deleteOneToOne/660f840281d1cbab8679f0f2/660e410d581fef694f9eb3fb`)
        .set({ authorization: `Bearer ${jwtToken}` });
}
