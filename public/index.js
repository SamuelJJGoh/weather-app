/// Frontend, displays results in the web page
/// Sends requests to server.js

const weatherForm = document.querySelector(".weatherForm");
const cityInput = document.querySelector(".cityInput");
const weatherCard = document.querySelector(".weatherCard");
const weatherMain = document.querySelector(".weatherMain");
const unitSwitch = document.getElementById("unitSwitch");
const unitLabel = document.getElementById("unitLabel");
let isCelsius = true; 
let currentWeatherData = null;

unitSwitch.addEventListener("change", () => {
    isCelsius = !isCelsius;
    unitLabel.textContent = isCelsius ? "°C" : "°F";

    if (currentWeatherData) {
      displayWeatherInfo(currentWeatherData);
    }
});

weatherForm.addEventListener("submit", async event => {
    event.preventDefault();

    const city = cityInput.value;

    if(city){
        try{
            // fetch from backend instead of OpenWeather directly
            const apiUrl = `/weather?city=${city}`;
            const response = await fetch(apiUrl);

            if(!response.ok){
                throw new Error("Could not fetch weather data");
            }

            const weatherData = await response.json();
            displayWeatherInfo(weatherData);
        }
        catch(error){ //catches anything thrown inside the try block
            console.error(error);
            displayError(error);
        }
    }
    else{ // if the user did not type anything
        displayError("Please enter a city...");   
    }
});

function displayWeatherInfo(data){
  // save data as currentWeatherData so that no new fetch from the API is needed
    currentWeatherData = data; 

    const {name: city,
           main: {temp, humidity, feels_like}, 
           weather: [{id, description}]} = data;
    
    weatherCard.textContent = "";
    weatherCard.style.display = "flex";

    weatherMain.textContent = "";
    weatherMain.style.display = "flex";

    const cityDisplay = document.createElement("h1");
    const tempDisplay = document.createElement("p");
    const humidityDisplay = document.createElement("p");
    const feelsLikeDisplay = document.createElement("p");
    const descDisplay = document.createElement("p");
    const weatherEmoji = document.createElement("p");
    
    cityDisplay.textContent = `📍 ${city}`;
    cityDisplay.classList.add("cityDisplay");
    weatherCard.appendChild(cityDisplay);
    
    weatherEmoji.textContent = getWeatherEmoji(id);
    weatherEmoji.classList.add("weatherEmoji");
    weatherMain.appendChild(weatherEmoji);
    
    const tempC = temp - 273.15;
    const feelsLikeC = feels_like - 273.15;

    const displayTemp = isCelsius ? tempC : (tempC * 9/5) + 32;
    const displayFeelsLike = isCelsius ? feelsLikeC : (feelsLikeC * 9/5) + 32;

    const unit = isCelsius ? "°C" : "°F";

    tempDisplay.textContent = `${(displayTemp).toFixed(1)}${unit}`;
    tempDisplay.classList.add("tempDisplay");
    weatherMain.appendChild(tempDisplay);

    weatherCard.appendChild(weatherMain);

    descDisplay.textContent = description;
    descDisplay.classList.add("descDisplay");
    weatherCard.appendChild(descDisplay);
  
    humidityDisplay.textContent = `💧 Humidity: ${humidity}%`;
    humidityDisplay.classList.add("humidityDisplay");
    weatherCard.appendChild(humidityDisplay);

    feelsLikeDisplay.textContent = `🌡️ Feels like: ${(displayFeelsLike).toFixed(1)}${unit}`;
    feelsLikeDisplay.classList.add("feelsLikeDisplay");
    weatherCard.appendChild(feelsLikeDisplay);
}

function getWeatherEmoji(weatherId){

    switch(true){
      case (weatherId >= 200 && weatherId < 300):
        return "⛈️";
      case (weatherId >= 300 && weatherId < 400):
        return "🌦️";
      case (weatherId >= 500 && weatherId < 600):
        return "🌧️";
      case (weatherId >= 600 && weatherId < 700):
        return "❄️";
      case (weatherId >= 700 && weatherId < 800):
        return "🌫️";
      case (weatherId === 800):
        return "☀️";
      case (weatherId > 800 && weatherId < 810):
        return "☁️";
      default:
        return "❓";
    }
  }

function displayError(message){
    const errorDisplay = document.createElement("p");
    errorDisplay.textContent = message;
    errorDisplay.classList.add("errorDisplay");

    weatherCard.textContent = "";
    weatherCard.style.display = "flex";
    weatherCard.appendChild(errorDisplay);
}