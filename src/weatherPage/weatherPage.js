import currentWeather from '../weather-Data/weatherData'

const apiKey = 'a45efc5b41c54b5b8e6155635240606';


// Display all that on the page
async function displayWeather() {
    const temperatureDiv = document.querySelector('.temperature-letter');
    const weatherData = await currentWeather(apiKey);
    if (weatherData) {
        const temperature = weatherData.current.temp_c; 
        console.log(temperature); // Log the temperature for debugging purposes
        temperatureDiv.innerHTML = `
            <h1 id="temperature" class="temperature">${temperature}°<span class="degree">C</span></h1>
        `;
    }
}

displayWeather();


