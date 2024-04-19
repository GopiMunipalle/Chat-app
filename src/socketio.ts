import http from "http";
import { Server,Socket } from "socket.io";
import {DefaultEventsMap } from "socket.io/dist/typed-events";

const getIo = (
  server: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>
) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",
    },
  });
  io.on("connection", (socket) => {
    console.log("user connected" , socket.id);
    sendMessageFunction(socket,io)    

    socket.on("joinGroup", ({ name, participants }) => {
      console.log(`Group Name ${name} created with ${participants} members`);
    });

    socket.on("sendMessageToGroup", ({ groupId, sender, message }) => {
      socket.join(groupId);
      console.log("content", message);
      io.to(groupId).emit("groupMessage", {
        message,
        from:sender
      });
    });

    socket.on("addNewUser", (groupId, userId) => {
      socket.join(groupId);
      console.log("new user joined", userId);
    });

    socket.on("removeUserFromGroup", ({ groupId, newUserId }) => {
      console.log(`Removing user ${newUserId} from group ${groupId}`);
      io.emit("userRemovedFromGroup", { groupId, newUserId });
    });

    socket.on("clear chat", ({ groupId }) => {
      console.log("chat cleared", groupId);
    });

    socket.on("delete group message", ({ groupId, messageId }) => {
      console.log("message deleted successfully", groupId, messageId);
    });

    socket.on("disconnect", () => {
      console.log("user disconnected");
    });
  });
  return io;
};

function sendMessageFunction(socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,io:Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>){
  socket.on('initial',({userId})=>{
    console.log("????????????//" , userId);
    socket.join(userId)
  })
  socket.on("sendMessage", ({receiverId,content}) => {
    socket.join(receiverId)
    console.log("Received message:", content);
    io.to(receiverId).emit("sendMessage",content)
  });

  socket.on('join',({receiverId})=>{
    console.log(receiverId);
    socket.join(receiverId)
  })
}

export default getIo;
