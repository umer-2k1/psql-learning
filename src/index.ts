import app from "./app";
import dotenv from "dotenv";
import connectDB from "./config/db";
import http from "http";
import { Server, Socket } from "socket.io";
import { addUser, removeUser } from "./functions/socketFunctions";

dotenv.config({ path: "./src/config/config.env" }); //load env vars

// Global vars
let io: Server;
const onlineUsers: any[] = [];

//server setup
const PORT = (process.env.PORT as string) || 8001;

var server = http.createServer(app);
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});

//socket.io
io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket: Socket) => {
  console.log("connected to socket", socket.id);
  io.to(socket.id).emit("reconnect", socket.id);
  socket.on("join", (userId: string) => {
    addUser(userId, socket.id);
  });
  socket.on("logout", () => {
    removeUser(socket.id);
  });
  socket.on("disconnect", () => {
    removeUser(socket.id);
    console.log("user disconnected", socket.id);
  });
});
