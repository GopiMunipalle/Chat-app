import app from "../../serverT";
import request from "supertest";
import bcrypt from "bcrypt";
import userModel from "../../models/User";
import jwt from 'jsonwebtoken'


beforeEach(() => {
  jest.resetAllMocks();
});


describe('Login User API EndPoint',()=>{
    it('Should Return Invalid Email',async()=>{
        const response=await request(app)
        .post('/user/login')
        .send({
            email:"",
            password:"hashedPassword"
        })

        expect(response.status).toBe(400)
        expect(response.body).toEqual({errors:[{error:"Enter Valid Email"}]})
    })

    it('Should Return Invalid password',async()=>{
        const response=await request(app)
        .post('/user/login')
        .send({
            email:"raju@gmail.com",
            password:''
        })

        expect(response.status).toBe(400)
        expect(response.body).toEqual({errors:[{error:"Enter Valid Password"}]})
    })

    it('Should Return user not Registered',async()=>{
        jest.spyOn(userModel,'findOne').mockResolvedValueOnce(null)
        const response=await request(app)
        .post('/user/login')
        .send({
            email:'gopi@gmail.com',
            password:"Gopi@123"
        })

        expect(response.status).toBe(400)
        expect(response.body).toEqual({error:"User not registered"})
    })

    it('Should Return incorrect Password',async()=>{
        jest.spyOn(userModel,'findOne').mockResolvedValueOnce({email:"krishna@gmail.com"})
        jest.spyOn(bcrypt,'compare').mockResolvedValueOnce(false as never)
        const response=await request(app)
        .post('/user/login')
        .send({
            email:'krishna@gmal.com',
            password:'hahsedPassword'
        })
        expect(response.status).toBe(400)
        expect(response.body).toEqual({error:"Incorrect Password"})
    })

    it('Should Return JwtToken',async()=>{
        jest.spyOn(userModel,'findOne').mockResolvedValueOnce({email:'krishna@gmail.com'})
        jest.spyOn(bcrypt,'compare').mockResolvedValueOnce("hashedPassword" as never)
        const response=await request(app)
        .post('/user/login')
        .send({
            email:'krishna@gmail.com',
            password:"hashedPassword"
        })
       console.log(response.body)
        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty('result')
    })

    it('Should Return Internal Server Error',async()=>{
        jest.spyOn(userModel,'findOne').mockRejectedValueOnce(new Error('Db Error at login'))
        const response=await request(app)
        .post('/user/login')
        .send({email:"gopi@gmail.com",
        password:"hashedPassword"})

        expect(response.status).toBe(500)
        expect(response.body).toEqual({error:"Internal Server Error"})
    })
})