import app from "../../serverT";
import request from 'supertest'
import jwt from 'jsonwebtoken'

beforeEach(()=>{
    jest.clearAllMocks()
})

let jwtToken='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NjBmODQxYzgxZDFjYmFiODY3OWYwZjUiLCJlbWFpbCI6ImtyaXNobmFAZ21haWwuY29tIiwiaWF0IjoxNzEzMzMxMDgxLCJleHAiOjE3MTMzNjcwODF9.V2RNDxzn4RwDH2BaQ0Wvt2tcXrcDxACD5WLllQgbkc0'

describe('AuthMiddleware API',()=>{

    it('Should Return 400 token not found',async()=>{
        const response=await request(app)
        .get('/chat/clearChat/660f840281d1cbab8679f0f2')
        .set({
            authorization:` `
        })

        expect(response.status).toBe(400)
        expect(response.body).toEqual({error:"token not found"})
    })

    it('Should Return 400 Provide token',async()=>{
        const response=await request(app)
        .get('/chat/clearChat/660f840281d1cbab8679f0f2')
        .set({
            authorization:`Bearer `
        })

        expect(response.status).toBe(400)
        expect(response.body).toEqual({error:"please provide token"})
    })

    it('Should Return 400 Invalid Token',async()=>{
        const response=await request(app)
        .get('/chat/clearChat/660f840281d1cbab8679f0f2')
        .set({
            authorization:`Bearer jwttoken `
        })

        expect(response.status).toBe(400)
        expect(response.body).toEqual({error:"Invalid token"})
    })

    it('JwtToken headers error',async()=>{
        jest.spyOn(jwt,'verify').mockRejectedValueOnce(undefined as never)
        const response=await request(app)
        .get('/chat/clearChat/660f840281d1cbab8679f0f2')
        .set({authorization:`Bearer ${jwtToken}`})

        // console.log(response.body)
        expect(response.status).toBe(500)
        expect(response.body).toEqual({error:"Internal Server Error"})
    })
})