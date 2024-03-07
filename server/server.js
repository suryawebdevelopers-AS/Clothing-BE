import express, { json } from "express";
import cors from "cors";
import compression from "compression";
import routes from "./routes.js";
import { connect } from "mongoose";
import dotenv from "dotenv";
import { Server } from "socket.io";

dotenv.config();

const app = express();

// Updated CORS configuration to allow all origins
app.use(cors());

app.use(compression({ threshold: 2048 }));
app.use(json());

// MongoDB connection
connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("MongoDB connection error:", error));

// Socket.IO setup
const io = new Server(app, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});
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

// Improved global error handler with more specific messages
app.use((err, req, res, next) => {
  console.error("Global error:", err);

  if (err.name === "CorsError") {
    res.status(403).send("CORS request not allowed"); // Specific message for CORS errors
  } else {
    res.status(500).send("Internal Server Error"); // Generic message for other errors
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
