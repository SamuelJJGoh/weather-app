/// Frontend, displays results in the web page
/// Sends requests to server.js

const BACKEND_URL = "http://localhost:3000";

const weatherForm = document.querySelector(".weatherForm");
const cityInput = document.querySelector(".cityInput");
const weatherCard = document.querySelector(".weatherCard");
const weatherMain = document.querySelector(".weatherMain");
const contentLayout = document.querySelector(".contentLayout");

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
    if (currentForecastData){
      displayForecast(currentForecastData);
    }
});

weatherForm.addEventListener("submit", async event => {
    event.preventDefault();

    const city = cityInput.value;

    if(city){
        try{
            // fetch from backend instead of OpenWeather directly
            const apiUrl = `${BACKEND_URL}/weather?city=${city}`;
            const response = await fetch(apiUrl);

            if(!response.ok){
                throw new Error("Could not fetch weather data");
            }

            const weatherData = await response.json();
            let oldForecast = document.querySelector(".forecastSection");
            if (oldForecast){
              oldForecast.remove();
              weatherCard.classList.remove("showingForecast");
            }
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
    
    const cityContainer = document.createElement("div");
    cityContainer.classList.add("cityContainer");
    const mapIcon = document.createElement("img");
    const cityDisplay = document.createElement("h1");

    const weatherIcon = document.createElement("img");
    const snowIcon = document.createElement("img");
    const tempDisplay = document.createElement("p");

    const descDisplay = document.createElement("p");

    const humidityContainer = document.createElement("div");
    humidityContainer.classList.add("humidityContainer");
    const waterIcon = document.createElement("img");
    const humidityDisplay = document.createElement("p");

    const feelsLikeContainer = document.createElement("div");
    feelsLikeContainer.classList.add("humidityContainer");
    const thermometerIcon = document.createElement("img");
    const feelsLikeDisplay = document.createElement("p");
    
    mapIcon.src = `icons/map-pin.svg`;
    mapIcon.alt = "map pin svg icon";
    mapIcon.classList.add("mapIcon");
    cityContainer.appendChild(mapIcon);

    cityDisplay.textContent = `${city}`;
    cityDisplay.classList.add("cityDisplay");
    cityContainer.appendChild(cityDisplay);
    weatherCard.appendChild(cityContainer);
      
    if (getWeatherIcon(id) === "snow"){
        snowIcon.src = `icons/weather_conditions/snow.svg`;
        snowIcon.alt = description;
        snowIcon.classList.add("snowIcon");
        weatherMain.appendChild(snowIcon);
    }
    else{
        weatherIcon.src = `icons/weather_conditions/${getWeatherIcon(id)}.svg`;
        weatherIcon.alt = description;
        weatherIcon.classList.add("weatherIcon");
        weatherMain.appendChild(weatherIcon);
    }
    
    const tempC = temp - 273.15; // temp is given in Kelvin
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
    
    waterIcon.src = "icons/water-droplet.svg";
    waterIcon.alt = "humidity icon";
    waterIcon.classList.add("waterIcon");
    humidityContainer.appendChild(waterIcon);
    
    humidityDisplay.textContent = `Humidity: ${humidity}%`;
    humidityDisplay.classList.add("humidityDisplay");
    humidityContainer.appendChild(humidityDisplay);
    weatherCard.appendChild(humidityContainer);
    
    thermometerIcon.src = "icons/thermometer.svg";
    thermometerIcon.alt = "thermometer icon";
    thermometerIcon.classList.add("waterIcon");
    feelsLikeContainer.appendChild(thermometerIcon);

    feelsLikeDisplay.textContent = `Feels like: ${(displayFeelsLike).toFixed(1)}${unit}`;
    feelsLikeDisplay.classList.add("feelsLikeDisplay");
    feelsLikeContainer.appendChild(feelsLikeDisplay);
    weatherCard.appendChild(feelsLikeContainer);

    const footerContainer = document.createElement("div");
    footerContainer.classList.add("footerContainer");
    weatherCard.appendChild(footerContainer);

    const forecastButton = document.createElement("button");
    forecastButton.type = "button";
    forecastButton.classList.add("forecastButton");
    forecastButton.innerHTML = `
      <img src = "icons/calendar.svg" alt="calendar icon" class="calendarIcon">
      5-Day Forecast`;

    forecastButton.addEventListener("click", async event => {
        event.preventDefault();
        const city = currentWeatherData.name;

        try{
          const apiUrl = `${BACKEND_URL}/forecast?city=${city}`;
          const response = await fetch(apiUrl);

          if(!response.ok){
            throw new Error("Could not fetch forecast");
          }

          const forecastData = await response.json();
          console.log("Forecast:", forecastData);
          displayForecast(forecastData);
        }
        catch(error){
          console.error(error);
          displayError(error);
        }
    });

    const saveCityButton = document.createElement("button");
    saveCityButton.type = "button";
    saveCityButton.classList.add("saveCityButton");
    saveCityButton.innerHTML = `
    <img src = "icons/star.svg" alt="star icon" class="starIcon">
    Save City`;

    footerContainer.appendChild(forecastButton);
    footerContainer.appendChild(saveCityButton);
}

function displayForecast(forecastData){
  currentForecastData = forecastData;

  let oldForecast = document.querySelector(".forecastSection");
  if (oldForecast){
    oldForecast.remove();
  }

  weatherCard.classList.add("showingForecast");

  const forecastSection = document.createElement("div");
  forecastSection.classList.add("forecastSection");

  const title = document.createElement("h2");
  title.textContent = "5-Day Forecast";
  title.classList.add("forecastTitle");

  const container = document.createElement("div");
  container.classList.add("forecastContainer");

  const middayForecasts = forecastData.list.filter(item => 
    item.dt_txt.includes("12:00:00")
  );

  middayForecasts.forEach(item => {
    const card = document.createElement("div");
    card.classList.add("forecastCard");

    const date = new Date(item.dt_txt);
    const weekday = date.toLocaleString("en-GB", { weekday: "short"});

    const day = document.createElement("p");
    day.classList.add("forecastDay");
    day.textContent = weekday;

    const icon = document.createElement("img");
    icon.classList.add("forecastIcon");
    icon.src = `icons/weather_conditions/${getWeatherIcon(item.weather[0].id)}.svg`;

    const tempC = item.main.temp - 273.15;
    const displayTemp = isCelsius ? tempC : (tempC * 9/5) + 32;
    const unit = isCelsius ? "°C" : "°F";
    const temp = document.createElement("p");
    temp.classList.add("forecastTemp");
    temp.textContent = `${(displayTemp).toFixed(1)}${unit}`;

    card.appendChild(day);
    card.appendChild(icon);
    card.appendChild(temp);

    container.appendChild(card);
  })

  forecastSection.appendChild(title);
  forecastSection.appendChild(container);

  contentLayout.appendChild(forecastSection);
}

function getWeatherIcon(weatherId){

    switch(true){
      case (weatherId >= 200 && weatherId < 300):
        return "thunderstorm";
      case (weatherId >= 300 && weatherId < 400):
        return "drizzle";
      case (weatherId >= 500 && weatherId < 600):
        return "rain";
      case (weatherId >= 600 && weatherId < 700):
        return "snow";
      case (weatherId >= 700 && weatherId < 800):
        return "fog";
      case (weatherId === 800):
        return "sun";
      case (weatherId > 800 && weatherId < 810):
        return "cloudy";
      default:
        return "unknown";
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
