import userModel from "../../models/User";
import chatModel from "../../models/ChatModel";
import app from "../../serverT";
import request from 'supertest'
import jwt from 'jsonwebtoken'

beforeEach(()=>{
    jest.clearAllMocks()
})

let jwtToken='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NjBmODQxYzgxZDFjYmFiODY3OWYwZjUiLCJlbWFpbCI6ImtyaXNobmFAZ21haWwuY29tIiwiaWF0IjoxNzEzMzMxMDgxLCJleHAiOjE3MTMzNjcwODF9.V2RNDxzn4RwDH2BaQ0Wvt2tcXrcDxACD5WLllQgbkc0'

describe("ClearAll Chat API EndPoin",()=>{
    it('Should Return User not found',async()=>{
        const userid="660f840281d1cbab8679f0f2"
        jest.spyOn(userModel,'findById').mockResolvedValueOnce(null)
        const response=await request(app)
        .get('/chat/clearChat/660f840281d1cbab8679f0f2')
        .set({authorization:`Bearer ${jwtToken}`})

        expect(response.status).toBe(400)
        expect(response.body).toEqual({error:"User not found"})
    })

    it('Should Return ReceiverId is not found',async()=>{
        const userid='660f840281d1cbab8679f0f2'
        let user={_id:userid}
        jest.spyOn(userModel,'findById').mockResolvedValueOnce(user)
        jest.spyOn(userModel,'findOne').mockResolvedValueOnce(null)
        const response=await request(app)
        .get(`/chat/clearChat/${userid}`)
        .set({authorization:`Bearer ${jwtToken}`})

        expect(response.status).toBe(400)
        expect(response.body).toEqual({error: `User ${userid} not found`})
    })

    it('Should Return Chat Cleared Successfully', async () => {
        const userId = '660f840281d1cbab8679f0f2';
        const receiverId = "660f841c81d1cbab8679f0f5";
        const user = { _id: userId }; 
        const receiver = { _id: receiverId };
        
        let clearChat={ nModified: 1}
    
        jest.spyOn(userModel, 'findById').mockResolvedValueOnce(user); 
        jest.spyOn(userModel, 'findOne').mockResolvedValueOnce(receiver); 
        jest.spyOn(chatModel, 'updateMany').mockResolvedValueOnce(clearChat as any);
    
        const response = await request(app)
            .get(`/chat/clearChat/${userId}`)
            .set({ authorization: `Bearer ${jwtToken}` });
    
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ message: 'All chat contents cleared successfully',clearChat });
    });

    it('Should Return 500 Internal Server Error',async()=>{
        const userId = '660f840281d1cbab8679f0f2';
        jest.spyOn(userModel,'findById').mockRejectedValueOnce(new Error('error at clear all chats'))
        const response=await request(app)
        .get(`/chat/clearChat/${userId}`)
        .set({authorization:`Bearer ${jwtToken}`})

        expect(response.status).toBe(500)
        expect(response.body).toEqual({error:"Internal Server Error"})
    })
})