import weatherIcons from "../customMapping/iconMapping";

// Function to fetch forecast data
async function forecast(apiKey) {
    try {
        const response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=London&days=3&aqi=no&alerts=no`);
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

const apiKey = 'a45efc5b41c54b5b8e6155635240606';

// Helper function to format date
function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { weekday: 'short', month: 'short', day: 'numeric' }; // Use 'short' for abbreviated weekday
    return date.toLocaleDateString('en-US', options);
}

// Function to update forecast box
function updateForecastBox(day, boxClass) {
    const box = document.querySelector(boxClass);
    
    // Format date
    const formattedDate = formatDate(day.date);
    const [dayOfWeek, monthDay] = formattedDate.split(', ');

    // Get the weather icon URL
    const weatherIconUrl = weatherIcons[day.day.condition.code] ? weatherIcons[day.day.condition.code].day : 'https://cdn.weatherapi.com/weather/64x64/day/113.png'; // Default to sunny if icon not found

    // Update the box
    box.querySelector('.forecast-image img').src = weatherIconUrl;
    box.querySelector('.forecast-temperature .forecast-number').innerHTML = `${day.day.maxtemp_c} <span class="forecast-celsius">° C</span>`;
    box.querySelector('.date-month').textContent = monthDay;
    box.querySelector('.day').textContent = dayOfWeek;
}

// Function to display forecast information
async function displayForecast() {
    try {
        // Get the forecast data
        const forecastData = await forecast(apiKey);
        if (!forecastData || !forecastData.forecast || !forecastData.forecast.forecastday) {
            throw new Error('Invalid forecast data format');
        }

        console.log('Forecast Data is available');

        // Extract the forecast for the next three days
        const forecasts = forecastData.forecast.forecastday;

        // Update each forecast box separately
        updateForecastBox(forecasts[0], '.day-1');
        updateForecastBox(forecasts[1], '.day-2');
        updateForecastBox(forecasts[2], '.day-3');
        
    } catch (error) {
        console.error('Error displaying forecast data:', error);
    }
}

displayForecast();

export default forecast;
