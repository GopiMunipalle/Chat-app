import express from "express";
 
import userRouter from "./routes/userRouter";
import orderRouter from "./routes/orderRouter";
import path from "path";
import cors from "cors";
import http from "http";
import { config } from "dotenv";
import chatRouter from "./routes/chatRouter";
import chatGroupRouter from "./routes/chatGroupRouter";
// import getIo from "./socketio";
config();
const app = express();
const port = 8080;

app.use(cors());
app.use(express.json());
app.use("/user", userRouter);
app.use("/razorpay", orderRouter);
app.use("/chat", chatRouter);
app.use("/group", chatGroupRouter);

const server = http.createServer(app);
// getIo(server)

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});


app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.get("/razorpay", (req, res) => {
  res.render("razorpay");
});


export default app
