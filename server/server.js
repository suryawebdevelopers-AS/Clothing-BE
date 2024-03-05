import express, { json } from "express";
import cors from "cors";
import compression from "compression";
import { Server } from "socket.io";
import routes from "./routes.js";
import http from "http";
import { connect } from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
  },
});
//this is cors
app.use(cors());
app.use(compression({ threshold: 2048 }));
app.use(json());

connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error(error));

const messages = {};

io.on("connection", (socket) => {
  console.log("User connected");

  socket.on("joinRoom", (userId) => {
    socket.join(userId);
    messages[userId] = [];
  });

  socket.on("sendMessage", (message, userId) => {
    messages[userId].push({ message, userId });
    io.to(userId).emit("receiveMessage", message, userId);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

app.use("/", routes);

const port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
