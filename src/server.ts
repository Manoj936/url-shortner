import { Application, Request, Response } from "express";
import appRouter from "./route";
import connectDB from "./dbconfig";
import { redisClient } from "./redisconfig";
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

connectDB();
const app: Application = express();
//reseting redis

//  redisClient.flushall().then();
// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.get("/", (req: Request, res: Response) => {
  res.send("API is running...!!");
});

// Port Configuration
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.use("/", appRouter);
