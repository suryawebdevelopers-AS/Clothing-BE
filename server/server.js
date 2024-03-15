import express from "express";
import cors from "cors";
import http from "http";
import compression from "compression";
import routes from "./routes.js";
import { connect } from "mongoose";
import dotenv from "dotenv";
import { Server as SocketIOServer } from "socket.io";

dotenv.config();

const app = express();
const server = http.createServer(app);

// CORS configuration for allowing all origins (not recommended for production)
const corsOptions = {
  origin: "*", // Allow all origins (be cautious in production)
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"], // Allow all common HTTP methods
  credentials: true, // Enable credentials for cookies, authorization headers with HTTPS
};
app.use(cors(corsOptions)); // Apply CORS middleware with the options

app.use(compression({ threshold: 2048 }));
app.use(express.json()); // Ensure express.json() is used instead of json()

// MongoDB connection
connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("MongoDB connection error:", error));

// Socket.IO setup
const io = new SocketIOServer(server, { cors: corsOptions });
const messages = {};

io.on("connection", (socket) => {
  console.log("User connected");

  socket.on("joinRoom", (userId) => {
    socket.join(userId);
    if (!messages[userId]) {
      messages[userId] = [];
    }
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

// Improved global error handler
app.use((err, req, res, next) => {
  console.error("Global error:", err);
  res.status(err.status || 500).send(err.message || "Internal Server Error");
});

const port = process.env.PORT || 4000;
server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
