import currentWeather from '../weather-Data/weatherData';
import weatherIcons from "../cutomMapping/iconMapping";

const apiKey = 'a45efc5b41c54b5b8e6155635240606';


// Display all that on the page
async function displayWeather() {

    // Getting the JSON data
    const weatherData = await currentWeather(apiKey);

    // Selecting containers to display the data
    const temperatureDiv = document.querySelector('.temperature-letter');
    const locationContainer = document.querySelector('.location');
    const dateContainer = document.querySelector('.time-calendar');
    const svgContainer = document.querySelector('.weather-icon');
    const conditionCode = weatherData.current.condition.code; // Get the condition code from the weather data
    const isDay = weatherData.current.is_day;
    
    if (weatherData) {

        // Temperature data
        const temperature = weatherData.current.temp_c; 
         // Log the temperature for debugging purposes

        temperatureDiv.innerHTML = `<h1 id="temperature" class="temperature">${temperature}°<span class="degree">C</span></h1>`;

        // Country and location data
        const country = weatherData.location.country;
        const locality = weatherData.location.name;
        locationContainer.innerHTML = `<h3 id="city-name" class="city-name">${locality} , ${country} </h3>`

        // Date and time data
        const date = weatherData.location.localtime;
        dateContainer.innerHTML = `<h3 class="calendar"><span class="time">${date}</span></h3>`;

        // SVG data. 
        console.log("Temperature of " + locality + " is " + temperature);
        console.log( "Weather code is " + conditionCode);
        if(isDay){
            svgContainer.innerHTML = `<img src= ${weatherIcons[conditionCode]?.day} class="icon-temp">`;
        }
        else 
            svgContainer.innerHTML = `<img src= ${weatherIcons[conditionCode]?.night} class="icon-temp">`;
        }
}

displayWeather();


