/*  const socket = require("socket.io");
const crypto = require("crypto");
const { Chat } = require("../models/chat");
const { timeStamp } = require("console");
const ConnectionRequest = require("../models/connectionRequest");

const  getSecretRoomId = (userId,targetUserId) => {
    return crypto
    .createHash("sha256")
    .update([userId,targetUserId].sort().join("_"))
    .digest("hex");
}

const initializaSocket = (server) => {
  const io = socket(server, {
    cors: {
      origin: "http://localhost:5173",
      credentials : true,
    },
  });
  io.on("connection", (socket) => {
    //Handle events
    socket.on("joinChat",({firstName,userId,targetUserId})=> {
        
        const roomId = getSecretRoomId(userId,targetUserId);
        console.log(firstName+" Joined room  :" + roomId)
        socket.join(roomId);
    })
    socket.on("sendMessage", async ({firstName,lastName,userId,targetUserId,text })=> {
        

       
        try{
            const roomId = getSecretRoomId(userId,targetUserId);
            console.log(firstName+ " sends " +text);
            ConnectionRequest.findOne({
              fromUserId:userId,
              toUserId:targetUserId,
              status: "accepted"
            },{
              fromUserId:targetUserId,
              toUserId:userId,
              status: "accepted"
            })
            
            let chat = await Chat.findOne({
              participants:{$all: [userId,targetUserId]}
            });
            if(!chat){
              chat = await Chat({
                participants: [userId,targetUserId],
                messages: [],
              })
            }
            chat.messages.push({
              senderId: userId,
              text,
            });
            await chat.save();
            io.to(roomId).emit("messageReceived",{firstName,lastName,text});
        } catch(err){
          console.log(err);
        }


        
        
    })
    socket.on("disconnect",()=> {

    })

  });
};

module.exports = initializaSocket;
 */
/*
const socket = require("socket.io");
const crypto = require("crypto");
const { Chat } = require("../models/chat");
const ConnectionRequest = require("../models/connectionRequest");

const getSecretRoomId = (userId, targetUserId) => {
  return crypto
    .createHash("sha256")
    .update([userId, targetUserId].sort().join("_"))
    .digest("hex");
};

const initializaSocket = (server) => {
  const io = socket(server, {
    cors: {
      origin: process.env.BASE_URL, 
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    socket.on("joinChat", ({ firstName, userId, targetUserId }) => {
      const roomId = getSecretRoomId(userId, targetUserId);
      console.log(`${firstName} joined room: ${roomId}`);
      socket.join(roomId);
    });

    socket.on("sendMessage", async ({ firstName, lastName, photoUrl, userId, targetUserId, text }) => {
      const roomId = getSecretRoomId(userId, targetUserId);
      console.log(`${firstName} sends: ${text}`);

      try {
        // Only send message if users are connected
        const connectionExists = await ConnectionRequest.findOne({
          $or: [
            { fromUserId: userId, toUserId: targetUserId, status: "accepted" },
            { fromUserId: targetUserId, toUserId: userId, status: "accepted" }
          ]
        });

        if (!connectionExists) {
          console.log("No accepted connection found between users");
          return;
        }

        // Save message to DB
        let chat = await Chat.findOne({
          participants: { $all: [userId, targetUserId] }
        });

        if (!chat) {
          chat = new Chat({
            participants: [userId, targetUserId],
            messages: [],
          });
        }

        const newMessage = {
          senderId: userId,
          text,
        };

        chat.messages.push(newMessage);
        await chat.save();

        // Emit message back to both users in the room
        io.to(roomId).emit("messageReceived", {
          firstName,
          lastName,
          photoUrl,
          text,
          userId, // ✅ Add sender userId for frontend alignment
        });

      } catch (err) {
        console.error("Error sending message:", err);
      }
    });

    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });
};

module.exports = initializaSocket;
 */
const socket = require("socket.io");
const crypto = require("crypto");
const { Chat } = require("../models/chat");
const ConnectionRequest = require("../models/connectionRequest");

// Generate a consistent room ID for 2 users
const getSecretRoomId = (userId, targetUserId) => {
  return crypto
    .createHash("sha256")
    .update([userId, targetUserId].sort().join("_"))
    .digest("hex");
};

const initializeSocket = (server) => {
  const io = socket(server, {
    cors: {
      origin: process.env.BASE_URL || "http://localhost:5173", 
      credentials: true,
    },
    path: "/socket.io", 
  });

  io.on("connection", (socket) => {
    console.log("🔌 New socket connection:", socket.id);

   
    socket.on("joinChat", ({ firstName, userId, targetUserId }) => {
      const roomId = getSecretRoomId(userId, targetUserId);
      socket.join(roomId);
     
    });

    
    socket.on("sendMessage", async ({ firstName, lastName, photoUrl = '', userId, targetUserId, text }) => {
      const roomId = getSecretRoomId(userId, targetUserId);
      console.log(`✉️ ${firstName} sends to room ${roomId}: ${text}`);

      try {
        
        const connectionExists = await ConnectionRequest.findOne({
          $or: [
            { fromUserId: userId, toUserId: targetUserId, status: "accepted" },
            { fromUserId: targetUserId, toUserId: userId, status: "accepted" }
          ]
        });

        if (!connectionExists) {
          console.warn("No accepted connection between users.");
          return;
        }

        // Fetch or create chat
        let chat = await Chat.findOne({
          participants: { $all: [userId, targetUserId] }
        });

        if (!chat) {
          chat = new Chat({
            participants: [userId, targetUserId],
            messages: [],
          });
        }

        // Add new message
        const newMessage = {
          senderId: userId,
          text,
        };

        chat.messages.push(newMessage);
        await chat.save();

        // Broadcast to room
        io.to(roomId).emit("messageReceived", {
          firstName,
          lastName,
          photoUrl,
          text,
          userId, // for frontend alignment
        });

      } catch (err) {
        console.error("Error sending message:", err);
      }
    });

    // Handle disconnect
    socket.on("disconnect", () => {
      console.log("🔌 Socket disconnected:", socket.id);
    });
  });
};

module.exports = initializeSocket;
