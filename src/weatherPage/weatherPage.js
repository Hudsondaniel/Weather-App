import currentWeather from '../weather-Data/weatherData'

const apiKey = 'a45efc5b41c54b5b8e6155635240606';


// Display all that on the page
async function displayWeather() {

    // Getting the JSON data
    const weatherData = await currentWeather(apiKey);

    // Selecting containers to display the data
    const temperatureDiv = document.querySelector('.temperature-letter');
    const locationContainer = document.querySelector('.location');
    const dateContainer = document.querySelector('.time-calendar');
    
    if (weatherData) {

        // Temperature data
        const temperature = weatherData.current.temp_c; 
        console.log(temperature); // Log the temperature for debugging purposes
        temperatureDiv.innerHTML = `<h1 id="temperature" class="temperature">${temperature}°<span class="degree">C</span></h1>`;

        // Country and location data
        const country = weatherData.location.country;
        const locality = weatherData.location.name;
        locationContainer.innerHTML = `<h3 id="city-name" class="city-name">${locality} , ${country} </h3>`

        // Date and time data
        const date = weatherData.location.localtime;
        dateContainer.innerHTML = `<h3 class="calendar"><span class="time">${date}</span></h3>`;
        
    }
}

displayWeather();


