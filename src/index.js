import express from 'express';
//const mongoose = require('mongoose');
import "dotenv/config";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoute.js";
import deviceRoutes from "./routes/deviceRoute.js";
import job from "./lib/cron.js";
import connectDB from "./lib/db.js";

const app = express();
const PORT = process.env.PORT || 3000;

job.start(); // Start the cron job
app.use(express.json());
app.use(cors());

app.use("/api/auth",authRoutes);
app.use("/api/user",userRoutes);
app.use("/api/device",deviceRoutes);

app.listen(PORT, () => {
  console.log("Server is running on port", PORT);
  connectDB();
});
