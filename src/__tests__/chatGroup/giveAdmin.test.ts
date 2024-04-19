import app from "../../serverT";
import userModel from "../../models/User";
import request from 'supertest'
import chatGroupModel from "../../models/ChatGroupModel";
// import { disconnectTestDb, testDb } from "../../db";



beforeEach(()=>{
    jest.clearAllMocks()
})
let jwtToken='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NjBmODQxYzgxZDFjYmFiODY3OWYwZjUiLCJlbWFpbCI6ImtyaXNobmFAZ21haWwuY29tIiwiaWF0IjoxNzEzMzMxMDgxLCJleHAiOjE3MTMzNjcwODF9.V2RNDxzn4RwDH2BaQ0Wvt2tcXrcDxACD5WLllQgbkc0'

describe('GiveAdmin API END POINT',()=>{
    const body={
        groupId:'660f904592ef2e28b21e530c',
        receiverId:'660f83ed81d1cbab8679f0ef',
        isAdmin:Boolean(true)
    }

    it('Should Return User not found',async()=>{
        jest.spyOn(userModel,'findById').mockResolvedValueOnce(null)
        const response=await request(app)
        .post('/group/admin')
        .set({authorization:`Bearer ${jwtToken}`})
        .send(body)

        expect(response.status).toBe(400)
        expect(response.body).toEqual({error: "User not found"})
    })

    it('Should Return Your Not An Admin',async()=>{
        const user={
            name:'test',
            email:'test@gmail.com',
            password:'Test@123',
            numer:'999999999',
            role:'user'
        }
        jest.spyOn(userModel,'findById').mockResolvedValueOnce(user)
        const response=await request(app)
        .post('/group/admin')
        .set({authorization:`Bearer ${jwtToken}`})
        .send(body)

        expect(response.status).toBe(400)
        expect(response.body).toEqual({error:"You not an admin"})
    })

    it('Should Return ChatGroup Not found',async()=>{
        const user={ 
            name:'test',
            email:'test@gmail.com',
            password:'Test@123',
            numer:'999999999',
            role:'admin'
        }
        jest.spyOn(userModel,'findById').mockResolvedValueOnce(user)
        jest.spyOn(chatGroupModel,'findById').mockResolvedValueOnce(null)
        const response=await request(app)
        .post('/group/admin')
        .set({authorization:`Bearer ${jwtToken}`})
        .send(body)

        expect(response.status).toBe(400)
        expect(response.body).toEqual({error: "group not found"})
    })

    it('Should Return Receiver not found',async()=>{
        const user={
            name:'test',
            email:'test@gmail.com',
            password:'Test@123',
            numer:'999999999',
            role:'admin'
        }
        const chatId={groupId:'660f904592ef2e28b21e530c',participants:[""]}
        jest.spyOn(userModel,'findById').mockResolvedValueOnce(user)
        jest.spyOn(chatGroupModel,'findById').mockResolvedValueOnce(chatId)
        const response=await request(app)
        .post('/group/admin')
        .set({authorization:`Bearer ${jwtToken}`})
        .send(body)

        console.log(response.body)
        expect(response.status).toBe(400)
        expect(response.body).toEqual({error: "receiver not found"})
    })

    it('Should Remove Admin Access',async()=>{
        const requestBody={
            groupId:'660f904592ef2e28b21e530c',
            receiverId:'660f83ed81d1cbab8679f0ef',
            isAdmin:Boolean(false)
        }
        const chatId={groupId:'660f904592ef2e28b21e530c',participants:["660f83ed81d1cbab8679f0ef","660f840281d1cbab8679f0f2"]}
        const user={
            name:'test',
            email:'test@gmail.com',
            password:'Test@123',
            number:'999999999',
            role:'admin'
        }
        jest.spyOn(userModel,'findById').mockResolvedValueOnce(user)
        jest.spyOn(chatGroupModel,'findById').mockResolvedValueOnce(chatId)
        jest.spyOn(userModel,'findByIdAndUpdate').mockResolvedValueOnce(true)
        const response=await request(app)
        .post('/group/admin')
        .set({authorization:`Bearer ${jwtToken}`})
        .send(requestBody)

        console.log(response.body)
        expect(response.status).toBe(200)
        expect(response.body).toEqual({message: `Admin Removed By ${user.number}`,participant: true})
    })

    it('Should Give Admin Access',async()=>{
        const chatId={groupId:'660f904592ef2e28b21e530c',participants:["660f83ed81d1cbab8679f0ef","660f840281d1cbab8679f0f2"]}
        const user={
            name:'test',
            email:'test@gmail.com',
            password:'Test@123',
            number:'999999999',
            role:'admin'
        }
        jest.spyOn(userModel,'findById').mockResolvedValueOnce(user)
        jest.spyOn(chatGroupModel,'findById').mockResolvedValueOnce(chatId)
        jest.spyOn(userModel,'findByIdAndUpdate').mockResolvedValueOnce(true)
        const response=await request(app)
        .post('/group/admin')
        .set({authorization:`Bearer ${jwtToken}`})
        .send(body)

        // console.log(response.body)
        expect(response.status).toBe(200)
        expect(response.body).toEqual({message: `Admin Given By ${user.number}`,participant: true})
    })

    it('Should Return 500 Internal Server Error',async()=>{
        jest.spyOn(userModel,'findById').mockRejectedValueOnce(new Error('error'))
        const response=await request(app)
        .post('/group/admin')
        .set({authorization:`Bearer ${jwtToken}`})
        .send(body)

        expect(response.status).toBe(500)
        expect(response.body).toEqual({error: "Internal Server Error"})
    })
})