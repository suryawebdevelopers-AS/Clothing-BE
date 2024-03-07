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

// CORS configuration for production
const whitelist = ["http://localhost:3000", "http://localhost:5173"]; // Add your production domain here
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST"],
  credentials: true, // Enable credentials for cookies, authorization headers with HTTPS
};

app.use(cors(corsOptions));

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

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
