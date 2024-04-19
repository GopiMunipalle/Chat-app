import userModel from "../../models/User";
import chatModel from "../../models/ChatModel";
import app from "../../serverT";
import request from "supertest";
import jwt from 'jsonwebtoken'

beforeEach(()=>{
    jest.clearAllMocks()
})

let jwtToken='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NjBmODQxYzgxZDFjYmFiODY3OWYwZjUiLCJlbWFpbCI6ImtyaXNobmFAZ21haWwuY29tIiwiaWF0IjoxNzEzMzMxMDgxLCJleHAiOjE3MTMzNjcwODF9.V2RNDxzn4RwDH2BaQ0Wvt2tcXrcDxACD5WLllQgbkc0'

describe('GetAllMessages API END POINT',()=>{
    it('should get all messages successfully', async () => {
        const userId = '660f840281d1cbab8679f0f2';
        const user = { _id: userId };
        jest.spyOn(userModel, 'findById').mockResolvedValueOnce(user);

        const content = [
            { _id: '660f84c781d1cbab8679f10e', message: 'Message 1' },
            { _id: '660f84c781d1cbab8679f10e', message: 'Message 2' }
        ];
        jest.spyOn(chatModel, 'findOne').mockResolvedValueOnce(content);

        const response = await request(app)
            .get(`/chat/getAllMessages/${userId}`)
            .set({ authorization: `Bearer ${jwtToken}` }); 

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('messages');
    });

    it('Should Return Internal Server Error',async()=>{
        const receiverId='660f840281d1cbab8679f0f2'
        const userId='660f841c81d1cbab8679f0f5'
        jest.spyOn(userModel,'findById').mockRejectedValueOnce(new Error('Get All Messages API Error'))
        const response=await request(app)
        .get(`/chat/getAllMessages/${receiverId}`)
        .set({authorization:`Bearer ${jwtToken}`})

        // console.log(response.body)
        expect(response.status).toBe(500)
        expect(response.body).toEqual({error:"Internal Server Error"})
    })
})