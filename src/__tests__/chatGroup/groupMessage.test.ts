import userModel from "../../models/User";
import chatGroupModel from "../../models/ChatGroupModel";
import app from "../../serverT";
import request from 'supertest'

beforeEach(()=>{
    jest.clearAllMocks()
})

let jwtToken='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NjBmODQxYzgxZDFjYmFiODY3OWYwZjUiLCJlbWFpbCI6ImtyaXNobmFAZ21haWwuY29tIiwiaWF0IjoxNzEzMzMxMDgxLCJleHAiOjE3MTMzNjcwODF9.V2RNDxzn4RwDH2BaQ0Wvt2tcXrcDxACD5WLllQgbkc0'

describe('SendMessagesIN GROUP API ENDPOINT',()=>{

    it('Should Return User not found',async()=>{
        const userId={_id:"65c49a7a7e6ffa22d9c615ce"}
        jest.spyOn(userModel,'findById').mockResolvedValueOnce(null)
        const response=await request(app)
        .post('/group/sendMessagesInGroup/660f84f581d1cbab8679f113')
        .send({message:'Hello'})
        .set({authorization:`Bearer ${jwtToken}`})

        expect(response.status).toBe(404)
        expect(response.body).toEqual({error: "User not found"})
    })
    it('Should Return Group not found',async()=>{
        const userId={_id:"65c49a7a7e6ffa22d9c615ce"}
        jest.spyOn(userModel,'findById').mockResolvedValueOnce(userId)
        jest.spyOn(chatGroupModel,'findByIdAndUpdate').mockResolvedValueOnce(null)
        const respnse=await request(app)
        .post('/group/sendMessagesInGroup/660f84f581d1cbab8679f113')
        .send({message:"Hello"})
        .set({authorization:`Bearer ${jwtToken}`})

        expect(respnse.status).toBe(404)
        expect(respnse.body).toEqual({error: "Group not found"})
    })

    it('Should Return Message sent Successfully',async()=>{
        const userId={_id:"65c49a7a7e6ffa22d9c615ce"}
        const groupId={_id:"660f84f581d1cbab8679f113"}
        const updatedGroup={_id: "660f84f581d1cbab8679f113"}
        jest.spyOn(userModel,'findById').mockResolvedValueOnce(userId)
        jest.spyOn(chatGroupModel,'findByIdAndUpdate').mockResolvedValueOnce(groupId)
        const respnse=await request(app)
        .post('/group/sendMessagesInGroup/660f84f581d1cbab8679f113')
        .send({message:"Hello"})
        .set({authorization:`Bearer ${jwtToken}`})

        console.log(respnse.body)
        expect(respnse.status).toBe(200)
        expect(respnse.body).toEqual({message: "Message sent successfully", group: updatedGroup})
    })

    it('Should Return Internal Server Error',async()=>{
        jest.spyOn(userModel,'findById').mockRejectedValueOnce(new Error('Error at Group Message'))
        const response=await request(app)
        .post('/group/sendMessagesInGroup/660f84f581d1cbab8679f113')
        .send({message:"Hello"})
        .set({authorization:`Bearer ${jwtToken}`})

        expect(response.status).toBe(500)
        expect(response.body).toEqual({ error: "Internal Server Error"})
    })
})