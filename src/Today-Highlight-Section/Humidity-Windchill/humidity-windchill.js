import currentWeather from "../../weather-Data/weatherData";

const apiKey = "a45efc5b41c54b5b8e6155635240606";

async function moreStats() {
    try {
        // Fetch current weather data
        const weatherData = await currentWeather(apiKey);
        
        // Check if data was successfully fetched
        if (weatherData && weatherData.current) {
            console.log("more Stats is working");
            
            // Extract humidity from the weather data
            const humidityNumber = document.querySelector('.humidity-number');
            const windchillUnit = document.querySelector('.windchill-number');

            humidityNumber.textContent = `${weatherData.current.humidity}`;
            console.log(weatherData.current.humidity);
            windchillUnit.textContent = `${weatherData.current.windchill_c}`;
        } else {
            console.error('No weather data available');
        }
    } catch (error) {
        console.error('Error fetching weather data:', error);
    }
}

moreStats();
