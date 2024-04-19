import app from "../../serverT";
import userModel from "../../models/User";
import chatModel from "../../models/ChatModel";
import request from 'supertest'
import chatGroupModel from "../../models/ChatGroupModel";

beforeEach(()=>{
    jest.clearAllMocks()
})
let jwtToken='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NjBmODQxYzgxZDFjYmFiODY3OWYwZjUiLCJlbWFpbCI6ImtyaXNobmFAZ21haWwuY29tIiwiaWF0IjoxNzEzMzMxMDgxLCJleHAiOjE3MTMzNjcwODF9.V2RNDxzn4RwDH2BaQ0Wvt2tcXrcDxACD5WLllQgbkc0'


describe('GroupParticipants Deatails API',()=>{

    it('Should Return User Not Found',async()=>{
        jest.spyOn(userModel,'findById').mockResolvedValueOnce(null)
        const response=await request(app)
        .get('/group/getParticipants/660f84f581d1cbab8679f113')
        .set({authorization:`Bearer ${jwtToken}`})

        expect(response.status).toBe(400)
        expect(response.body).toEqual({error:"User not found"})
    })

    it('Should Retrun Group Id not found',async()=>{
        const user={
            name:'test',
            email:'test@gmail.com',
            password:'hashedPassword',
            number:'9898989898',
            role:'admin'
        }
        jest.spyOn(userModel,'findById').mockResolvedValueOnce(user)
        jest.spyOn(chatGroupModel, 'findById').mockImplementation(() => ({
            populate: jest.fn().mockResolvedValueOnce(null)
          })as any);          
        const response=await request(app)
        .get('/group/getParticipants/660f84f581d1cbab8679f113')
        .set({authorization:`Bearer ${jwtToken}`})
        console.log(response.body)
        expect(response.status).toBe(400)
        expect(response.body).toEqual({error:'Group Id not Found'})
    })

    it('Should Return 500 Internal Server Error',async()=>{
        jest.spyOn(userModel,'findById').mockRejectedValueOnce(new Error('error'))
        const response=await request(app)
        .get('/group/getParticipants/660f84f581d1cbab8679f113')
        .set({authorization:`Bearer ${jwtToken}`})

        expect(response.status).toBe(500)
        expect(response.body).toEqual({error:"Internal Server Error"})
    })

    it('Should Return participants Details',async()=>{
        const userID="660f840281d1cbab8679f0f2"
        const participants=["660f840281d1cbab8679f0f2","660f840281d1cbab8679f0f2"]
        jest.spyOn(userModel,'findById').mockResolvedValueOnce(userID)
        jest.spyOn(chatGroupModel, 'findById').mockImplementation(() => ({
            populate: jest.fn().mockResolvedValueOnce('participants')
        })as any);

        const response=await request(app)
        .get('/group/getParticipants/660f84f581d1cbab8679f113')
        .set({authorization:`Bearer ${jwtToken}`})
        // console.log(response.body)
        expect(response.status).toBe(200)
        expect(response.body).toEqual({})
    })
})