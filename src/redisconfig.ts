import { Callback } from "ioredis";
import Redis from "ioredis";
const dotenv = require('dotenv');

dotenv.config();

export const redisClient = new Redis(`rediss://default:${process.env.REDIS_PASS}@${process.env.REDIS_URL}:${process.env.REDIS_PORT}`);
  
export const TestRedisConnection = async () => {
  try {
    console.log("Connecting to Redis...");

    // Set a test value
    const setResult = await redisClient.set("url-shortner", "true");
    console.assert(setResult === "OK", "Failed to set value in Redis");

    // Get the test value
    const getResult = await redisClient.get("url-shortner");
    console.assert(getResult === "true", "Failed to get value from Redis");
    console.log("✅ Redis connection successful!");

    // Close the connection
    redisClient.disconnect();
  } catch (error) {
    console.error("❌ Redis connection failed:", error);
  }
}
