import {Server as HttpServer} from "http";
import { Server,Socket } from "socket.io";
import {DefaultEventsMap } from "socket.io/dist/typed-events";

let users: { [key: string]: string } = {};
const getIo = (server:HttpServer) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",
    },
  });

  io.on("connection",(socket) => {
    
    console.log("user connected", socket.id);


  socket.on('initial', (data) => {
    console.log('initial data', data);
    const userId: string = data.userId;
    console.log(userId, 'userId socket');
    users[userId] = socket.id;
    console.log(users);
    console.log('User joined:', userId);
  });

  socket.on('sendMessage', ({ receiverId, content }) => {
    console.log('receiver id', receiverId);
    const recipientSocketId = users[receiverId];
    console.log('rep user', users);
    console.log('socketid',recipientSocketId);
    if (recipientSocketId) {
      io.to(recipientSocketId).emit('message', { content });
    } else {
      console.log('Recipient is not connected');
    }
  });

    JoinGroup(socket,io)

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

let group:{[key:string]:string}={}
function JoinGroup(socket:Socket,io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>){
  socket.on("joinGroup", ({ userId }) => {
    socket.join(userId)
    // group[userId]=socket.id
    console.log(`user joined group ${userId}`);
  });

  socket.on("sendMessageToGroup", ({ groupId, sender, message }) => {
    // socket.join(groupId);
    console.log('groupid',groupId)
    console.log("content", message);
    io.sockets.in(groupId).emit("groupMessage", {
      message,
      from:sender
    });
  });
}


export default getIo;
