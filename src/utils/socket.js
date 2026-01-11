const socket = require("socket.io"); //* requiring socket.io after installing it using the command "npm install socket.io"
const crypto = require("crypto");
const { Chat } = require("../models/chat");
const ConnectionRequestModel = require("../models/connectionRequest");
const jwt = require("jsonwebtoken");
const { parse } = require("cookie");
//**
//* to add lastSeen and online status
const User = require("../models/user");
//* Initialize a Map to store key-value pairs where Key = UserID and Value = SocketID
//* This allows for quick lookups to check if a specific user is currently connected to the server
const activeUsers = new Map(); // Track userId -> socketId
//***

//* function to secure the roomId by loggedInUserId and targetUserId converting it to hash
const getSecureRoomId = (userId, targetUserId) => {
  return crypto
    .createHash("sha256")
    .update([userId, targetUserId].sort().join("_"))
    .digest("hex");
};

//*initializing the the socket
const initializeSocket = (server) => {
  //* initializing the socket connection by passing the server and cors configuration
  //*io: Refers to the main Socket.IO server instance that you have initialized.
  // console.log(socket);
  const io = socket(server, {
    cors: {
      origin: ["http://localhost:5173", "https://dev-connect1234.netlify.app"],
      credentials: true, //* Allows cookies/headers
    },
  });

  // Middleware to authenticate every new connection
  io.use((socket, next) => {
    // Access token sent from client-side 'auth' object
    const authToken = socket.handshake.auth.token;

    console.log("authToken " + authToken);
    if (!authToken) {
      return next(new Error("Authentication error: Token missing"));
    }

    jwt.verify(authToken, process.env.JWT_SECRET, async (err, decodedObj) => {
      // console.log("err" + err);
      if (err) return next(new Error("Authentication error: Invalid token"));

      // Verifying if the _id if it exists in the db or not
      const { _id } = decodedObj;
      // console.log("id" + _id);
      //* 1st check by verifying the id from db
      const user = await User.findById(_id);
      if (!user) {
        return next(new Error("User not found"));
      }

      //* accessing the cookie token
      const cookieString = socket.handshake.headers.cookie;

      const cookies = parse(cookieString); //*  parsing cookies token
      console.log("User ID from cookie:", cookies.token);
      const cookieToken = cookies.token;
      //* 2nd check if auth token match with the cookies token(received from credentials(cookies))
      // console.log(cookieToken + " + " + authToken);
      if (cookieToken === authToken) {
        console.log("tokens matched");
      }
      //* if tokens are not matching throwing error
      if (cookieToken !== authToken) {
        return next(new Error("tokens are not matching"));
      }

      // console.log("id:-" + _id);
      next();
    });
    //* Automatic Disconnection: When next(err) is called in the middleware, the connection is refused immediately. The connection event on the server will never fire for that specific client.

    //*Reconnection Logic: By default, Socket.io might try to reconnect automatically. If the error is a permanent authentication failure (e.g., invalid token), you should manually call socket.disconnect() or socket.close() in your connect_error handler to prevent infinite retry loops.
  });

  //* listening for the socket requests
  io.on("connection", (socket) => {
    //*handling events
    socket.on(
      "joinChat",
      ({ firstName, userId, targetUserId, onlineStatus }) => {
        //* like two have a conversation between two people there should separate room , similarly we need to create separate roomId to chat using socket io, which should be unique, because we can't mix, other people's conversation that's why we are getting the targetUserId and userId to create a separate roomId,
        console.log("join chat called");

        const roomId = getSecureRoomId(userId, targetUserId);
        console.log(firstName + "joined room ,Room Id:" + roomId);
        socket.join(roomId);
        //* emitting event to send online status
        io.to(roomId).emit("userOnline", { firstName, onlineStatus });
      }
    );

    socket.on(
      "sendMessage",
      async ({ firstName, lastName, userId, targetUserId, text }) => {
        try {
          //* send message should only happen if the both users are friends , other wise not so check if userId(loggedInUser) and targetUserId(other other side user are friends are not , if not then we will just throw error)
          const friendshipStatus = await ConnectionRequestModel.findOne({
            $or: [
              {
                fromUserId: userId,
                toUserId: targetUserId,
                status: "accepted",
              },
              {
                fromUserId: targetUserId,
                toUserId: userId,
                status: "accepted",
              },
            ],
          });
          if (!friendshipStatus) {
            throw new Error("users are not friends");
          }
          console.log("friendship status " + friendshipStatus);
          //* client is sending the message through this sendMessage event now we have send it to another user we have to send this message another user so  we have again send it to the same room
          const roomId = getSecureRoomId(userId, targetUserId);
          // console.log(firstName + " " + text);
          //* when user is sending message to another user then if this first time they are chatting then we will create a new chat but if they already did chat and a chat already exist in the database then we will just update the database, other wise we will create a new chat a add chat messages

          //* finding if chat already exist
          let chat = await Chat.findOne({
            participants: { $all: [userId, targetUserId] },
          }); //* $all means find finding the array where there is participant is userId and targetUserId and in future if we add any other group participants we can also add other people if we want.

          //* if there is no existing chat then creating a new chat
          if (!chat) {
            chat = new Chat({
              participants: [userId, targetUserId],
              messages: [],
            });
          }
          //* pushing chat messages
          chat.messages.push({
            senderId: userId,
            text,
          });
          // console.log(chat);
          //* saving the chat messages
          const savedChat = await chat.save();

          const newMessageTiming =
            savedChat.messages[savedChat.messages.length - 1].createdAt;
          console.log("newMessageTiming" + newMessageTiming);
          //* from the whole chat messages finding the last chat message and then finding the createdAt time (already in Indian standard tine format) to send the time to display the time on ui.
          //* sending message from the server to another client  by emitting this new message receive event, and we are sending the firstName and the message
          io.to(roomId).emit("messageReceived", {
            firstName,
            lastName,
            text,
            newMessageTiming,
          });
        } catch (err) {
          console.error(err.message);
        }
      }
    );

    //* Listen for the "setup" event when a client connects and sends their unique userId
    socket.on("setup", async (userId) => {
      //* If no userId is provided, exit the function early to prevent errors
      if (!userId) return;

      //* Join a socket room named after the userId to allow private messaging/targeted events
      socket.join(userId);

      //* Attach the userId directly to the socket object for easy access during disconnection
      socket.userId = userId;

      //* Map the userId to the current socket.id in an in-memory tracking Map (activeUsers)
      activeUsers.set(userId, socket.id);

      //* Update the user's status to "online" in the MongoDB database
      await User.findByIdAndUpdate(userId, { status: "online" });

      //* Broadcast to all connected clients that this specific user is now online
      io.emit("user-status-change", { userId, status: "online" });
    });

    //* Handle a client's request to get the status (online/offline) of a specific person
    socket.on("get-user-status", async (targetUserId) => {
      //* Fetch only the 'status' and 'lastSeen' fields from the database for the target user
      const user = await User.findById(targetUserId).select("status lastSeen");

      console.log("user" + user);

      //* Send the status data back ONLY to the specific client who requested it
      socket.emit("initial-status-response", {
        userId: targetUserId,
        status: user?.status || "offline", //* Default to offline if the user isn't found
        lastSeen: user?.lastSeen, //* Provide the timestamp of when they were last active
      });
    });

    //* Listen for the built-in "disconnect" event when a user closes the app or loses internet
    socket.on("disconnect", async () => {
      //* Retrieve the userId we stored on the socket object during the "setup" phase
      const userId = socket.userId;

      //* Proceed only if the socket had a userId associated with it
      if (userId) {
        //* Capture the current timestamp to mark when the user went offline
        const lastSeen = new Date();

        //* Update the database to set status to "offline" and save the current time as lastSeen
        await User.findByIdAndUpdate(userId, { status: "offline", lastSeen });

        //* Remove the user from our in-memory Map of active connections
        activeUsers.delete(userId);

        //* Notify all other clients that this user is now offline and provide their lastSeen time
        io.emit("user-status-change", {
          userId,
          status: "offline",
          lastSeen,
        });
      }
    });
  });
};
//* exporting this function
module.exports = initializeSocket;
