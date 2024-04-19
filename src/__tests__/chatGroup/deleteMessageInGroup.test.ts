import app from '../../serverT'
import request from 'supertest'
import chatGroupModel from '../../models/ChatGroupModel'

beforeEach(()=>{
    jest.clearAllMocks()
})

let jwtToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NjBmODQxYzgxZDFjYmFiODY3OWYwZjUiLCJlbWFpbCI6ImtyaXNobmFAZ21haWwuY29tIiwiaWF0IjoxNzEzMzMxMDgxLCJleHAiOjE3MTMzNjcwODF9.V2RNDxzn4RwDH2BaQ0Wvt2tcXrcDxACD5WLllQgbkc0";


describe('Delete Message From Group',()=>{
    it('Should Return Group Not Found',async()=>{
        jest.spyOn(chatGroupModel,'findById').mockResolvedValueOnce(null)
        const response=await request(app)
        .get('/group/deleteMessage/660f904592ef2e28b21e530c/660f841c81d1cbab8679f0f5')
        .set({authorization:`Bearer ${jwtToken}`})

        expect(response.status).toBe(400)
        expect(response.body).toEqual({error: "Group not found" })
    })

    it('Should Return 500 Internal Server Error',async()=>{
        jest.spyOn(chatGroupModel,'findById').mockRejectedValueOnce(new Error('error at delete message in group'))
        const response=await request(app)
        .get('/group/deleteMessage/660f904592ef2e28b21e530c/660f841c81d1cbab8679f0f5')
        .set({authorization:`Bearer ${jwtToken}`})

        expect(response.status).toBe(500)
        expect(response.body).toEqual({error:"Internal Server Error"})
    })

    it('Should Return 200 for message deleted Successfully',async()=>{
        jest.spyOn(chatGroupModel,'findById').mockResolvedValueOnce({updateOne:jest.fn().mockResolvedValueOnce(true)})
        const response=await request(app)
        .get('/group/deleteMessage/660f904592ef2e28b21e530c/660f841c81d1cbab8679f0f5')
        .set({authorization:`Bearer ${jwtToken}`})
        // console.log(response.body)
        expect(response.status).toBe(200)
        expect(response.body).toEqual({result: "Message Deleted Successfully"})
    })
})  