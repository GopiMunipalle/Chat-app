import app from "../../serverT";
import request from "supertest";
import userModel from "../../models/User";

describe('Delete User By Id API Endpoint', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('Should Delete User Successfuly',async()=>{
        const userId='660fc8213ee5e4bac3631ab9'
        jest.spyOn(userModel,'findByIdAndDelete').mockResolvedValueOnce(userId)
        const response=await request(app)
        .delete(`/user/delete/${userId}`)

        console.log(response.body)
        expect(response.status).toBe(200)
        expect(response.body).toEqual({error:"User deleted successfully"})
    })

    it('Should Return User id is not found',async()=>{
        const userId='660fc8213ee5e4bac3631ab9999'
        jest.spyOn(userModel,'findByIdAndDelete').mockResolvedValueOnce(false)
        const response=await request(app)
        .delete(`/user/delete/${userId}`)
        console.log(response.body)
        expect(response.status).toBe(404)
        expect(response.body).toEqual({error:"User id not found"})
    })

    it('Should Return Internal Server Error',async()=>{
        jest.spyOn(userModel,'findByIdAndDelete').mockRejectedValueOnce(new Error('error'))
        const response=await request(app)
        .delete(`/user/delete/660fc8213ee5e4bac3631ab9`)

        console.log(response.body)
        expect(response.status).toBe(500)
        expect(response.body).toEqual({error:"Internal Server Error"})
    })
})