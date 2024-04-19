import request from 'supertest';
import app from '../../serverT'; 
import userModel from '../../models/User'
import chatModel from '../../models/ChatModel'; 

let jwtToken='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NjBmODQxYzgxZDFjYmFiODY3OWYwZjUiLCJlbWFpbCI6ImtyaXNobmFAZ21haWwuY29tIiwiaWF0IjoxNzEzMzMxMDgxLCJleHAiOjE3MTMzNjcwODF9.V2RNDxzn4RwDH2BaQ0Wvt2tcXrcDxACD5WLllQgbkc0'

describe('Send Message API Endpoint', () => {
    beforeEach(() => {
        jest.clearAllMocks(); 
    });

    it('should send message successfully when chat exists', async () => {
        const senderId = '660f841c81d1cbab8679f0f5';
        const receiverId = '660f840281d1cbab8679f0f2';
        const sender = { _id: senderId };
        const receiver = { _id: receiverId };
        jest.spyOn(userModel, 'findById').mockResolvedValueOnce(sender);
        jest.spyOn(userModel,'findById').mockResolvedValueOnce(receiver)
        const existingChat = { _id: '660f847881d1cbab8679f100' };
        jest.spyOn(chatModel, 'findOne').mockResolvedValueOnce({updateOne:jest.fn().mockResolvedValueOnce(true)});
        const requestBody = { receiverId: receiverId, content: 'Test message' };

        const response = await request(app)
            .post('/chat/sendMessage')
            .send(requestBody)
            .set({authorization:`Bearer ${jwtToken}`})
        console.log(response.body)
        expect(response.status).toBe(200);
        expect(response.body).toEqual({message:"Successfully sent Message"});
    });

    it('should create new chat and send message successfully', async () => {
        const senderId = '660f841c81d1cbab8679f0f5';
        const receiverId = '660f840281d1cbab8679f0f2';
        const sender = { _id: senderId };
        const receiver = { _id: receiverId };
        jest.spyOn(userModel, 'findById').mockResolvedValueOnce(sender)
        jest.spyOn(userModel,'findById').mockResolvedValueOnce(receiver)
        jest.spyOn(chatModel, 'findOne').mockResolvedValueOnce(null);

        const createdChat = { _id: '660f847881d1cbab8679f100' };
        jest.spyOn(chatModel, 'create').mockResolvedValueOnce(createdChat as any);
        const requestBody = { receiverId: receiverId, content: 'Test message' };
        const response = await request(app)
            .post('/chat/sendMessage')
            .send(requestBody)
            .set({authorization:`Bearer ${jwtToken}`})

        expect(response.status).toBe(200);
        expect(response.body).toEqual({message:"Successfully sent Message"});
    });

    it('should return error when sender or receiver not found', async () => {
        let sender={senderId:'660f841c81d1cbab8679f0f5'}
        jest.spyOn(userModel, 'findById').mockResolvedValueOnce(sender);
        jest.spyOn(userModel,'findById').mockResolvedValueOnce(null)
        const requestBody = { receiverId: '660f840281d1cbab8679f0f2', content: 'Test message' };
        const response = await request(app)
            .post('/chat/sendMessage')
            .send(requestBody)
            .set({authorization:`Bearer ${jwtToken}`})
        // console.log(response.body)
        expect(response.status).toBe(404);
        expect(response.body).toEqual({ error: 'Sender or receiver not found' });
    });

    it('should return internal server error', async () => {
        jest.spyOn(userModel, 'findById').mockRejectedValueOnce(new Error('Internal server error'));

        const requestBody = { receiverId: '660f840281d1cbab8679f0f2', content: 'Test message' };

        const response = await request(app)
            .post('/chat/sendMessage')
            .send(requestBody)
            .set({authorization:`Bearer ${jwtToken}`})
        // console.log(response.body)
        expect(response.status).toBe(500);
        expect(response.body).toEqual({ error: 'Internal Server Error' });
    });

});
