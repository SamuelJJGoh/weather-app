/// Main backend entry point — registers all routes and starts the server
/// All requests goes through server.js

// npm run dev to start the server during development
// npm start to start the server during production / deployment

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import weatherRouter from "./routes/weather.js";
import forecastRouter from "./routes/forecast.js";

dotenv.config(); // loads .env file

const app = express();
const PORT = 3000;

// Lets my frontend (on 5500) talk to my backend (on 3000)
app.use(cors()); 

// serve frontend files
// app.use(express.static("public")); // the public folder contains everything the browser can see

// mount the weather router
// this means any route starting with /weather goes to routes/weather.js
app.use("/weather", weatherRouter);

app.use("/forecast", forecastRouter);

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
