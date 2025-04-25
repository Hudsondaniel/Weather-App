import currentWeather from '../weather-Data/weatherData';
import weatherIcons from "../customMapping/iconMapping";

const apiKey = 'a45efc5b41c54b5b8e6155635240606';

// Display all that on the page
async function displayWeather() {
    try {
        // Getting the JSON data
        const weatherData = await currentWeather(apiKey);
        if (!weatherData) {
            throw new Error('No weather data received');
        }

        // Selecting containers to display the data
        const temperatureDiv = document.querySelector('.temperature-letter');
        const locationContainer = document.querySelector('.location');
        const dateContainer = document.querySelector('.time-calendar');
        const svgContainer = document.querySelector('.weather-icon');
        const conditionText = document.querySelector('.condition-text');
        const conditionIcon = document.querySelector('.condition-icon');
        const conditionCode = weatherData.current.condition.code;
        const isDay = weatherData.current.is_day;
        
        // Temperature data
        const temperature = weatherData.current.temp_c;
        temperatureDiv.innerHTML = `<h1 id="temperature" class="temperature">${temperature}°<span class="degree">C</span></h1>`;

        // Country and location data
        const country = weatherData.location.country;
        const locality = weatherData.location.name;
        locationContainer.innerHTML = `<h3 id="city-name" class="city-name">${locality} , ${country} </h3>`;

        // Date and time data
        const date = weatherData.location.localtime;
        dateContainer.innerHTML = `<h3 class="calendar"><span class="time">${date}</span></h3>`;

        // Weather icon
        if(isDay) {
            svgContainer.innerHTML = `<img src=${weatherIcons[conditionCode]?.day} class="icon-temp">`;
        } else {
            svgContainer.innerHTML = `<img src=${weatherIcons[conditionCode]?.night} class="icon-temp">`;
        }

        conditionText.innerHTML = weatherData.current.condition.text;

    } catch (error) {
        console.error('Error displaying weather:', error);
        throw error;
    }
}

// Initial weather display
displayWeather();

export default displayWeather;


