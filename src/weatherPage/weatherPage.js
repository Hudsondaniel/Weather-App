const apiKey = 'a45efc5b41c54b5b8e6155635240606';

async function currentWeather(apiKey) {
    try {
        const response = await fetch(`https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=London&aqi=no`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching the weather data:', error);
        return null;
    }
}

async function displayWeather() {
    const temperatureDiv = document.querySelector('.temperature-letter');
    const weatherData = await currentWeather(apiKey);
    if (weatherData) {
        const temperature = weatherData.current.temp_c; // Corrected the property access
        console.log(temperature); // Log the temperature for debugging purposes
        temperatureDiv.innerHTML = `
            <h1 id="temperature" class="temperature">${temperature}°<span class="degree">C</span></h1>
        `;
    }
}

displayWeather();


