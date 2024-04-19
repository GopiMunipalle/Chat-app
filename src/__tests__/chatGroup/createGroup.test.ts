import userModel from "../../models/User";
import chatGroupModel from "../../models/ChatGroupModel";
import app from "../../serverT";
import request from 'supertest'

beforeEach(()=>{
    jest.clearAllMocks()
})

let jwtToken='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NjBmODQxYzgxZDFjYmFiODY3OWYwZjUiLCJlbWFpbCI6ImtyaXNobmFAZ21haWwuY29tIiwiaWF0IjoxNzEzMzMxMDgxLCJleHAiOjE3MTMzNjcwODF9.V2RNDxzn4RwDH2BaQ0Wvt2tcXrcDxACD5WLllQgbkc0'

describe('CreateGroup API',()=>{

    it('Should Return User not found',async()=>{
        jest.spyOn(userModel,'findById').mockResolvedValueOnce(null)
        const response=await request(app)
        .post('/group/createGroup')
        .send({
            name:"NodeJs",
            participants:['0456464465646','56141654564646465']
        })
        .set({authorization:`Bearer ${jwtToken}`})

        expect(response.status).toBe(400)
        expect(response.body).toEqual({error:"user not found"})
    })

    it('Should Return ATLeast Two members are required',async()=>{
        const userId={_id:"660f841c81d1cbab8679f0f5"}
        jest.spyOn(userModel,'findById').mockResolvedValueOnce(userId)
        const response=await request(app)
        .post('/group/createGroup')
        .send({name:'NodeJs',parcipatns:[]})
        .set({authorization:`Bearer ${jwtToken}`})

        expect(response.status).toBe(400)
        expect(response.body).toEqual({error: "At least two members are required"})
    })

    it('Should Return not contain Group Creator',async()=>{
        const userId={_id:"660f841c81d1cbab8679f0f5"}
        jest.spyOn(userModel,'findById').mockResolvedValueOnce(userId)
        const response=await request(app)
        .post('/group/createGroup/')
        .send({
            name:'NodeJs',
            participants:[
                "660f841c81d1cbab8679f0f5",
                "660f841c81d1cbab8679f0f9"
            ]
        })
        .set({authorization:`Bearer ${jwtToken}`})

        expect(response.status).toBe(400)
        expect(response.body).toEqual({error: "Participants array should not contain the group creator"})
    })

    it('Should Return Missing User',async()=>{
        const userId={_id:"660f841c81d1cbab8679f0f5"}
        const participants=["65c49a7a7e6ffa22d9c615ce"]
        jest.spyOn(userModel,'findById').mockResolvedValueOnce(userId)
        jest.spyOn(userModel,'find').mockResolvedValueOnce(participants)
        const response=await request(app)
        .post('/group/createGroup')
        .send({
            name:'NodeJs',
            participants:["65c49a7a7e6ffa22d9c615ce","660f840281d1cbab8679f0f2"]
        })
        .set({authorization:`Bearer ${jwtToken}`})
        console.log(response.body)
        expect(response.status).toBe(404)
        expect(response.body).toEqual({ error:`Users 65c49a7a7e6ffa22d9c615ce 660f840281d1cbab8679f0f2 not found`})
    })

    it('Should Create Group',async()=>{
        const userId={_id:"660f841c81d1cbab8679f0f5"}
        let admin={name:"Gopi"}
        const requestObj={
            name:"Gopi",
            admin:"660f83ed81d1cbab8679f0ef",
            content:[],
            participants:["660f83ed81d1cbab8679f0ef","660f840281d1cbab8679f0f2"]
        }
        let participants=["660f83ed81d1cbab8679f0ef","660f840281d1cbab8679f0f2"]
        jest.spyOn(userModel,'findById').mockResolvedValueOnce(userId)
        jest.spyOn(userModel,'find').mockResolvedValueOnce(participants)
        jest.spyOn(chatGroupModel,'create').mockResolvedValueOnce(requestObj as any)
        const response=await request(app)
        .post('/group/createGroup')
        .send({
            name:"NodeJs",
            participants:["660f840281d1cbab8679f0f2","660f83ed81d1cbab8679f0ef"]
        })
        .set({authorization:`Bearer ${jwtToken}`})

        // console.log(response.body)
        expect(response.status).toBe(201)
        expect(response.body).toEqual({group: requestObj, result: `Group created by undefined`})
    })

    it('Should Return Internal Server Error',async()=>{
        jest.spyOn(userModel,'findById').mockRejectedValueOnce(new Error("Db Error at createGroup"))
        const response=await request(app)
        .post('/group/createGroup')
        .send({name:"NodeJs",
        participants:["660f840281d1cbab8679f0f2","660f83ed81d1cbab8679f0ef"]})
        .set({authorization:`Bearer ${jwtToken}`})

        expect(response.status).toBe(500)
        expect(response.body).toEqual({error:"Internal Server Error"})
    })
})