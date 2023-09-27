import express from "express";
import http from "http";
import { Server } from "socket.io";
import { connectDB } from "./config/database.js";
import { APP_PORT } from "./config/index.js";
import router from "./routes/userRoutes.js";
import ErrorMiddleware from "./middleware/Error.js";
import fileupload from "express-fileupload";
import cors from "cors";
import { User } from "./model/User.js";
import ChatModel from "./model/ChatModel.js";
import MessageModel from "./model/MessageModel.js";

connectDB();

const app = express();

// Use Middlewares
app.use(express.json());
app.use(cors());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(
  fileupload({
    useTempFiles: true,
  })
);

app.use(ErrorMiddleware);
// Import User Routes
app.use("/api", router);
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// io.of('/')
let userStatus = {};
const offlineMessages = {};

io.on("connection", (socket) => {
  socket.on("join-chat", (chatId) => {
    // Join the chat room identified by chatId
    socket.join(chatId);
  });
  socket.on("status", async (data) => {
    userStatus[data.userId] = data.status;

    if (data.status === "online" && offlineMessages[data.userId]) {
      for (const message of offlineMessages[data.userId]) {
        console.log(message);
        io.to(data.userId).emit("new-message", {
          newMessage: message,
          status: "success",
        });
      }
      // Clear the offline messages for the user
      delete offlineMessages[data.userId];
    }
  });
  socket.on("new-message", async (data) => {
    try {
      const text = data.text;
      const sender = data.sender;
      const chatId = data.chatId;
      const status = data.status;

      const message = new MessageModel({
        ...data,
      });

      await message.save();

      for (const userId in userStatus) {
        if (userStatus.hasOwnProperty(userId)) {
          const status = userStatus[userId];

          // Check the status for the specific user
          if (status === "online") {
            const chatRooms = await ChatModel.findById(chatId);
            const obj = {
              ...data,
              createdAt: new Date(),
            };

            chatRooms.lastMessage = obj;

            chatRooms.unread = 0;
            await chatRooms.save();

            // console.log('delete unread message ===>', res1);

            io.to(chatId).emit("new-message", {
              newMessage: data,
              status: "success",
            });
          } else {
            const chatRooms = await ChatModel.findById(chatId);
            console.log("chatID data ===", chatRooms?.unread);
            let number = Number(chatRooms?.unread) + 1;
            console.log("increment number ====", number);
            const obj = {
              ...data,
              createdAt: new Date(),
            };

            chatRooms.lastMessage = obj;

            chatRooms.unread = number;
            await chatRooms.save();
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  });
});

// Start the server
server.listen(APP_PORT, () => {
  console.log(`App is running on port ${APP_PORT}`);
});
