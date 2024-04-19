import app from "../../serverT";
import request from "supertest";
import userModel from "../../models/User";

describe('Update User By Id API Endpoint', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should update user details and return success message', async () => {
        const updatedUser = { _id: 'user660fc8213ee5e4bac3631ab9_id', name: 'gopi', email: 'muni@gmail.com', number: '9876543210' };
        const userId = '660fc8213ee5e4bac3631ab9';
        jest.spyOn(userModel,'findById').mockResolvedValueOnce(userId)
        jest.spyOn(userModel, 'findByIdAndUpdate').mockResolvedValueOnce(updatedUser);

        const requestBody = { name: 'gopi', email: 'muni@gmail.com', password: 'newpassword', number: '9876543210' };

        const response = await request(app)
        .put(`/user/update/${userId}`)
        .send(requestBody);
        
        // console.log(response.body)
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ message: 'User Updated Successfully', user: updatedUser });
    });

    it('should return error message for invalid user id', async () => {
        jest.spyOn(userModel, 'findById').mockResolvedValueOnce(null as any);

        const userId = 'invalid_user_id';
        const requestBody = { name: 'gopi', email: 'muni@gmail.com', password: 'newpassword', number: '9876543210' };

        const response = await request(app)
        .put(`/user/update/${userId}`)
        .send(requestBody);
        // console.log(response.body)
        expect(response.status).toBe(400);
        expect(response.body).toEqual({ error: 'Invalid User Id' });
    });

    it('should handle internal server error', async () => {
        jest.spyOn(userModel, 'findById').mockRejectedValueOnce(new Error('Internal server error'));

        const userId = '660fc8213ee5e4bac3631ab9';
        const requestBody = { name: 'gopi', email: 'muni@gmail.com', password: 'newpassword', number: '9876543210' };

        const response = await request(app)
        .put(`/user/update/${userId}`)
        .send(requestBody);
        // console.log(response.body)

        expect(response.status).toBe(500);
        expect(response.body).toEqual({ error: 'Internal Server Error' });
    });

});
