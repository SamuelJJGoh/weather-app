import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

router.get("/", async (req, res) => {
    const city = req.query.city;
    const apiKey = process.env.API_KEY;
  
    if (!city) {
        return res.status(400).json({ error: "City name required" });
    }
  
    try {
        const response = await fetch(
            // fetches 5 day forecast (40 entries, 8 per day)
            `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`
        );
    
        if (!response.ok) {
            throw new Error("Failed to fetch weather forecast");
        }
    
        const data = await response.json();
        res.json(data);
    } 
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
  
export default router;