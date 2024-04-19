import app from '../../serverT'
import request from 'supertest'
import userModel from '../../models/User'
import chatGroupModel from '../../models/ChatGroupModel'

beforeEach(()=>{
    jest.clearAllMocks()
})

let jwtToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NjBmODQxYzgxZDFjYmFiODY3OWYwZjUiLCJlbWFpbCI6ImtyaXNobmFAZ21haWwuY29tIiwiaWF0IjoxNzEzMzMxMDgxLCJleHAiOjE3MTMzNjcwODF9.V2RNDxzn4RwDH2BaQ0Wvt2tcXrcDxACD5WLllQgbkc0";


describe('Clear All Mocks API',()=>{
    it('Should Return 400 user not exists',async()=>{
        jest.spyOn(userModel,'findById').mockResolvedValueOnce(null)
        const response=await request(app)
        .get('/group/clearGroupData/660f904592ef2e28b21e530c')
        .set({authorization:`Bearer ${jwtToken}`})

        expect(response.status).toBe(400)
        expect(response.body).toEqual({error: "User not exists"})
    })

    it('Should Return Your not an admin',async()=>{
        const user={
            _id:'660f904592ef2e28b21e530c',
            email:"gopi@gmail.com",
            password:"abcd",
            number:'9999999999',
            role:'user'
        }

        jest.spyOn(userModel,'findById').mockResolvedValueOnce(user)
        const response=await request(app)
        .get('/group/clearGroupData/660f904592ef2e28b21e530c')
        .set({authorization:`Bearer ${jwtToken}`})

        expect(response.status).toBe(400)
        expect(response.body).toEqual({error:"Your Not An Admin"})
    })
    it('Should Return 500 Internal Server Error',async()=>{
        jest.spyOn(userModel,'findById').mockRejectedValueOnce(new Error('error at clear group chat'))
        const response=await request(app)
        .get('/group/clearGroupData/660f904592ef2e28b21e530c')
        .set({authorization:`Bearer ${jwtToken}`})

        expect(response.status).toBe(500)
        expect(response.body).toEqual({error: "Internal Server Error"})
    })
    it('Should Return Chat cleared with 200 code',async()=>{
        const user={
            _id:'660f904592ef2e28b21e530c',
            email:"gopi@gmail.com",
            password:"abcd",
            number:'9999999999',
            role:'admin'
        }
        const group={
            _id:'660f904592ef2e28b21e530c',
            name:"gopi@gmail.com",
            admin:"abcd",
            participants:['9999999999'],
            content:'admin'
        }
        jest.spyOn(userModel,'findById').mockResolvedValueOnce(user)
        jest.spyOn(chatGroupModel,'updateMany').mockResolvedValueOnce(group as never)
        const response=await request(app)
        .get('/group/clearGroupData/660f904592ef2e28b21e530c')
        .set({authorization:`Bearer ${jwtToken}`})

        expect(response.status).toBe(200)
        expect(response.body).toEqual({ message: "cleared All data", group})
    })
})