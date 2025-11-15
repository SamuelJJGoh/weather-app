/// Main backend entry point — registers all routes and starts the server
/// All requests goes through server.js

import express from "express";
import dotenv from "dotenv";
import weatherRouter from "./routes/weather.js";
import forecastRouter from "./routes/forecast.js";

dotenv.config(); // loads .env file

const app = express();
const PORT = 3000;

// serve frontend files
app.use(express.static("public")); // the public folder contains everything the browser can see

// mount the weather router
// this means any route starting with /weather goes to routes/weather.js
app.use("/weather", weatherRouter);

app.use("/forecast", forecastRouter);

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
