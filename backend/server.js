import express from "express";
import dotenv from "dotenv";
import connectDB from "./db/connectDB.js";

import authRoutes from "./routes/auth.routes.js";

dotenv.config();

const app = express();

const port = process.env.PORT || 8000;

app.use("/api/auth", authRoutes);

app.listen(port, () => {
  console.log(`Server is listening on port ${port}...`);
  connectDB();
});
