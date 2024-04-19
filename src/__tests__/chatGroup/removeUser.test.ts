import app from "../../serverT";
import userModel from "../../models/User";
import request from "supertest";
import chatGroupModel from "../../models/ChatGroupModel";

beforeEach(() => {
  jest.clearAllMocks();
});

let jwtToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NjBmODQxYzgxZDFjYmFiODY3OWYwZjUiLCJlbWFpbCI6ImtyaXNobmFAZ21haWwuY29tIiwiaWF0IjoxNzEzMzMxMDgxLCJleHAiOjE3MTMzNjcwODF9.V2RNDxzn4RwDH2BaQ0Wvt2tcXrcDxACD5WLllQgbkc0";

describe("Remove User API END POINT", () => {

  it("Should Return User not found", async () => {
    const groupId = "660f84f581d1cbab8679f113";
    const userId = "660f844581d1cbab8679f0f9";
    jest.spyOn(userModel, "findById").mockResolvedValueOnce(null);
    const response = await request(app)
      .get(`/group/removeUser/${groupId}/$${userId}`)
      .set({ authorization: `Bearer ${jwtToken}` });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: "User not found" });
  });

  it("Should Return your not an admin", async () => {
    const groupId = "660f84f581d1cbab8679f113";
    const userId = "660f844581d1cbab8679f0f9";
    const mockUser = { _id: "660f841c81d1cbab8679f0f5" };
    jest.spyOn(userModel, "findById").mockResolvedValueOnce(mockUser);
    const response = await request(app)
      .get(`/group/removeUser/${groupId}/${userId}`)
      .set({ authorization: `Bearer ${jwtToken}` });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: "Your Not An Admin" });
  });

  it("Should Return Group not Exists", async () => {
    const groupId = "660f84f581d1cbab8679f113";
    const userId = "660f844581d1cbab8679f0f9";
    const mockUser = { _id: "660f841c81d1cbab8679f0f5", role: "admin" };
    jest.spyOn(userModel, "findById").mockResolvedValueOnce(mockUser);
    jest.spyOn(chatGroupModel, "findById").mockResolvedValueOnce(null);
    const response = await request(app)
      .get(`/group/removeUser/${groupId}/${userId}`)
      .set({ authorization: `Bearer ${jwtToken}` });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: "Group not exists" });
  });
  
  it('Should Return user not in the group',async()=>{
    const groupId='660f84f581d1cbab8679f113'
    const userId='660f841c81d1cbab8679f0f5'
    const mockedUser={_id:userId,role:'admin'}
    const mockedGroup={groupId,participants:["660f83ed81d1cbab8679f0ef","660f840281d1cbab8679f0f2"]} 
    jest.spyOn(userModel,'findById').mockResolvedValueOnce(mockedUser)
    jest.spyOn(chatGroupModel,'findById').mockResolvedValueOnce(mockedGroup)
    const response=await request(app)
      .get(`/group/removeUser/${groupId}/${userId}`)
      .set({authorization:`Bearer ${jwtToken}`})
  
    expect(response.status).toBe(400)
    expect(response.body).toEqual({error: "User not in the group"})
  })
  

  it('Should Return participant removed successfully', async () => {
    const groupId = "660f84f581d1cbab8679f113";
    const userId = "660f83ed81d1cbab8679f0ef";
    const mockUser = { _id: "660f841c81d1cbab8679f0f5", role: 'admin' };
    const mockedGroup = { _id: "660f84f581d1cbab8679f113", participants: ["660f83ed81d1cbab8679f0ef", "660f840281d1cbab8679f0f2"] }; 
    jest.spyOn(userModel, 'findById').mockResolvedValueOnce(mockUser);
    jest.spyOn(chatGroupModel, 'findById').mockResolvedValueOnce(mockedGroup);
    jest.spyOn(chatGroupModel, 'findByIdAndUpdate').mockResolvedValueOnce(mockedGroup);
    
    const response = await request(app)
      .get(`/group/removeUser/${groupId}/${userId}`)
      .set({ authorization: `Bearer ${jwtToken}` });
  
    // console.log(response.body);
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ result: "Participant removed successfully", updatedChat: mockedGroup });
  });
  
  it('Should Return Internal Server Error',async()=>{
    const groupId = "660f84f581d1cbab8679f113";
    const userId = "660f841c81d1cbab8679f0f5555";
    jest.spyOn(userModel,'findById').mockRejectedValueOnce(new Error('Error at removing user'))
    const response=await request(app)
      .get(`/group/removeUser/${groupId}/${userId}`)
      .set({authorization:`Bearer ${jwtToken}`})

    // console.log(response.body)
    expect(response.status).toBe(500)
    expect(response.body).toEqual({error:"Internal Server Error"})
  })
});
