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

// Centralized CORS configuration
const corsOptions = {
  origin: ["*", "http://localhost:5173"],
  methods: ["GET", "POST"],
  credentials: true,
};
app.use(cors(corsOptions));

app.use(compression({ threshold: 2048 }));
app.use(json());

// MongoDB connection
connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("MongoDB connection error:", error));

// Socket.IO setup
const io = new Server(server, { cors: corsOptions });
const messages = {};

io.on("connection", (socket) => {
  console.log("User connected");

  socket.on("joinRoom", (userId) => {
    socket.join(userId);
    // Initialize user messages array if not present
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

// Global error handler
app.use((err, req, res, next) => {
  console.error("Global error:", err);
  res.status(500).send("Internal Server Error");
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
