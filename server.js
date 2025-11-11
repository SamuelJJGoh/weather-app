/// BACKEND - TALKS TO OPENWEATHER USING API KEY

import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config(); // loads .env file

const app = express();
const PORT = 3000;

// serve frontend files
app.use(express.static("public")); // the public folder contains everything the browser can see

// endpoint the frontend can call, this function runs whenever someone visits /weather endpoint
app.get("/weather", async (req, res) => {
    const city = req.query.city;
    const apiKey = process.env.API_KEY; // access api key from process.env object

    if (!city) {
        return res.status(400).json({ error: "City name required" });
    }

    try {
        const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`
        );

        if (!response.ok) {
            throw new Error("Could not fetch weather data");
        }

        const data = await response.json();
        res.json(data);
    } 
    catch(error){
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
