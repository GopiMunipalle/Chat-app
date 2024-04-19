import express from "express";
import http from "http";
import path from "path";
import cors from "cors";
import { config } from "dotenv";
import admin from "firebase-admin";
import { ServiceAccount } from "firebase-admin";

import connectDb from "./db";
import userRouter from "./routes/userRouter";
import orderRouter from "./routes/orderRouter";
import chatRouter from "./routes/chatRouter";
import chatGroupRouter from "./routes/chatGroupRouter";
import pushNotifyRouter from "./routes/pushNotifyRouter";
import getIo from "./socketio";
import serviceAccount from '../nodejs-f579d-firebase-adminsdk-2ezdr-53188602a7.json'

config();

const app = express();
const port = process.env.PORT || 8080;
const server = http.createServer(app);
getIo(server);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as ServiceAccount),
  storageBucket:'gs://nodejs-f579d.appspot.com'
});


app.use(cors());
app.use(express.json());
app.use("/user", userRouter);
app.use("/razorpay", orderRouter);
app.use("/chat", chatRouter);
app.use("/group", chatGroupRouter);
app.use("/firebase", pushNotifyRouter);


app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.get("/razorpay", (req, res) => {
  res.render("razorpay");
});

connectDb.connectDb()
  .then(() => {
    server.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error("Error starting server:", error);
  });

export default app;
