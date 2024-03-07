import express, { json } from "express";
import cors from "cors";
import compression from "compression";
import routes from "./routes.js";
import http from "http";
import { connect } from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const server = http.createServer(app);

// Updated CORS configuration to allow all origins
app.use(cors());

app.use(compression({ threshold: 2048 }));
app.use(json());

// MongoDB connection
connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("MongoDB connection error:", error));

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
