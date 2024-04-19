import app from "../../serverT";
import request from "supertest";
import userModel from "../../models/User";

beforeEach(() => {
  jest.resetAllMocks();
});


describe('Get All Users API',()=>{
    it('Should Return 200',async()=>{
        jest.spyOn(userModel,'find').mockResolvedValueOnce(true as never)
        const response=await request(app)
        .get('/user/getAll')
        

        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty('users')
    })

    it('Should Return Internal Server Error',async()=>{
        jest.spyOn(userModel,'find').mockRejectedValueOnce(new Error('error'))
        const response=await request(app)
        .get('/user/getAll')
        
        expect(response.status).toBe(500)
        expect(response.body).toEqual({error:"Internal Server Error"})
    })
})