import app from "../../serverT";
import request from "supertest";
import bcrypt from "bcrypt";
import userModel from "../../models/User";

beforeEach(() => {
  jest.clearAllMocks();
});

describe("addUser API EndPoint", () => {
  it('Should CreateUser with 200 code',async()=>{
    const mockUserData = {
      name: "Raju",
      email: "raju@gmail.com",
      password: "Raju@123",
      number: "9988776655",
      role: "",
    };
    jest.spyOn(userModel,'findOne').mockResolvedValueOnce(null)
    jest.spyOn(bcrypt,'hash').mockResolvedValueOnce('hashedPassword' as never)
    jest.spyOn(userModel,'create').mockResolvedValueOnce(mockUserData as any)
    const response=await request(app)
    .post('/user/addUser')
    .send(mockUserData)
    // console.log(response.body)
    expect(response.status).toBe(201)
    expect(response.body).toEqual({message:"User Added Successfully"})
  })
  it("Should return error if user already exists", async () => {
    jest.spyOn(userModel, "findOne").mockResolvedValueOnce(true);
    jest.spyOn(bcrypt, "hash").mockResolvedValueOnce("hahsedPassword" as never);
    const response = await request(app).post("/user/addUser").send({
      name: "Raju",
      email: "raju@gmail.com",
      password: "hashedPassword",
      number: "9988776655",
      role: "",
    });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: "User Already Exists" });
  });

  it("Should Return internal Server Error", async () => {
    const mockUserData = {
      name: "Raju",
      email: "raju@gmail.com",
      password: "hashedPassword",
      number: "9988776655",
      role: "",
    };
    jest.spyOn(userModel, "findOne").mockRejectedValueOnce(new Error("error"));
    const response = await request(app)
      .post("/user/addUser")
      .send(mockUserData);

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: "Internal Server Error" });
  });

  it("Should Return name is Required",async()=>{
    const response=await request(app)
    .post('/user/addUser')
    .send({
      name:'',
      email:'email@gmail.com',
      password:'hashedPassword',
      number:'9988776655',
      role:''
    })

    expect(response.status).toBe(400)
    expect(response.body).toEqual({error:[{error:"Provide Valid Name"}]})
  })

  it("Should Return email is Required",async()=>{
    const response=await request(app)
    .post('/user/addUser')
    .send({
      name:'name',
      email:'emailgmail.com',
      password:'hashedPassword',
      number:'9988776655',
      role:''
    })

    expect(response.status).toBe(400)
    expect(response.body).toEqual({error:[{error:"Enter Valid Email"}]})
  })

  it("Should Return password is Required",async()=>{
    const response=await request(app)
    .post('/user/addUser')
    .send({
      name:'name',
      email:'email@gmail.com',
      password:'',
      number:'9988776655',
      role:''
    })

    expect(response.status).toBe(400)
    expect(response.body).toEqual({error:[{error:"Provide Valid Password"}]})
  })

  it("Should Return number is Required",async()=>{
    const response=await request(app)
    .post('/user/addUser')
    .send({
      name:'name',
      email:'email@gmail.com',
      password:'hashedPassword',
      number:'',
      role:''
    })

    expect(response.status).toBe(400)
    expect(response.body).toEqual({error:[{error:"provide Valid number"}]})
  })
});
