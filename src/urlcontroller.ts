import axios, { AxiosError } from "axios";
import { Request, Response } from "express";
const dotenv = require("dotenv");
dotenv.config();
import { nanoid } from "nanoid";
import URL from "./urlmodel";
import { redisClient } from "./redisconfig";

// Get your tiny url
export const shorten_url = async (req: Request, res: Response) => {
  try {
    const { longUrl } = req.body;
    console.log(longUrl);
    if (!longUrl) {
     return res
        .status(400)
        .json({ status: false, message: "Please provide the url" });
    }
    const checkAvailabilitResponse = await axios.head(longUrl, {
      timeout: 5000,
    });
    if (
      checkAvailabilitResponse.status >= 200 &&
      checkAvailabilitResponse.status < 400
    ) {
      // Check in MongoDB

      let tinyUrlFromCache = await redisClient.get(longUrl);

      if (tinyUrlFromCache) {
        console.log("Delivering from cache 🗑️🗑️");
        return res
          .status(200)
          .json({ shortUrl: `${process.env.BASE_URL}/${tinyUrlFromCache}` });
      }

      const existingUrl = await URL.findOne({ longUrl });
      if (existingUrl) {
        console.log("Delivering value from exisitng data");
        await redisClient.setex(longUrl, 86400, existingUrl.shortId);
        return res
          .status(200)
          .json({ shortUrl: `${process.env.BASE_URL}/${existingUrl.shortId}` });
      }

      // Generate a new short ID
      let shortId = nanoid(6);
      const newUrl = new URL({ longUrl, shortId });
      await newUrl.save();

      // Store in cache
      await redisClient.setex(longUrl, 86400, shortId);

      return res.json({ shortUrl: `${process.env.BASE_URL}/${shortId}` });
    }
  } catch (e: any) {
    if (e.code == "ENOTFOUND") {
      return res.status(501).send("Please provide a valid url");
    }
    return res.status(501).send("Unexpected error occured");
  }
};

//Redirect to your tiny url
export const redirectUrl = async (req: Request, res: Response) => {
  try {
    console.log('asdasdsda')
    const { shortId } = req.params;
    console.log(shortId)
    // Check Redis cache first
    const cachedUrl = await redisClient.get(shortId);
    if (cachedUrl) return res.redirect(cachedUrl);

    // If not found in Redis, check MongoDB
    const urlEntry = await URL.findOne({ shortId });
    if (!urlEntry) return res.send("URL not found"); // This will display "URL not found" on the webpage

    // Cache in Redis
    await redisClient.setex(shortId, 86400 , urlEntry.longUrl );

    res.redirect(urlEntry.longUrl);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};