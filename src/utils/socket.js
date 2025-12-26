const socket = require("socket.io"); //* requiring socket.io after installing it using the command "npm install socket.io"

//*initializing the the socket
const initializeSocket = (server) => {
  //* initializing the socket connection by passing the server and cors configuration
  console.log(socket);
  const io = socket(server, {
    cors: {
      origin: "http://localhost:5173",
    },
  });

  //* listening for the socket requests
  io.on("connection", (socket) => {
    //*handling events
    socket.on("joinChat", ({ firstName, userId, targetUserId }) => {
      //* like two have a conversation between two people there should separate room , similarly we need to create separate roomId to chat using socket io, which should be unique, because we can't mix, other people's conversation that's why we are getting the targetUserId and userId to create a separate roomId,
      console.log("join chat called");

      const roomId = [userId, targetUserId].join("_");
      console.log(firstName + "joined room ,Room Id:" + roomId);
      socket.join(roomId);
    });
    socket.on("sendMessage", () => {});
    socket.on("disconnect", () => {});
  });
};
//* exporting this function
module.exports = initializeSocket;
