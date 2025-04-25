import weatherIcons from "../customMapping/iconMapping";
import { getLocationName } from '../Location/location';

const apiKey = 'a45efc5b41c54b5b8e6155635240606';

// Function to fetch forecast data
async function forecast() {
    try {
        const location = getLocationName();
        console.log('Fetching forecast for location:', location);
        
        if (!location) {
            throw new Error('No location specified');
        }
        
        const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${encodeURIComponent(location)}&days=3&aqi=no&alerts=no`;
        console.log('Making forecast API request to:', url);
        
        const response = await fetch(url);
        console.log('Forecast API Response status:', response.status);
        
        if (!response.ok) {
            const errorData = await response.json();
            console.error('Forecast API Error:', errorData);
            throw new Error(`Weather API error: ${errorData.error?.message || response.statusText}`);
        }
        
        const data = await response.json();
        console.log('Forecast data received:', data);
        return data;
    } catch (error) {
        console.error('Error fetching the forecast data:', error);
        throw error;
    }
}

// Helper function to format date
function formatDate(dateString) {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    return `${day}/${month}`;
}

// Function to update forecast box
function updateForecastBox(day, boxClass) {
    try {
        const box = document.querySelector(boxClass);
        if (!box) {
            console.error(`Forecast box not found: ${boxClass}`);
            return;
        }
        
        // Format date
        const formattedDate = formatDate(day.date);
        
        // Get the weather icon URL
        const weatherIconUrl = weatherIcons[day.day.condition.code]?.day || 'https://cdn.weatherapi.com/weather/64x64/day/113.png';
        
        // Update the box
        const imageElement = box.querySelector('.forecast-image img');
        if (imageElement) {
            imageElement.src = weatherIconUrl;
            imageElement.alt = day.day.condition.text;
        }
        
        const tempElement = box.querySelector('.forecast-temperature .forecast-number');
        if (tempElement) {
            tempElement.innerHTML = `${Math.round(day.day.maxtemp_c)}°<span class="forecast-celsius">C</span>`;
        }
        
        const dateElement = box.querySelector('.date-month');
        if (dateElement) {
            dateElement.textContent = formattedDate;
        }
    } catch (error) {
        console.error('Error updating forecast box:', error);
    }
}

// Function to display forecast information
async function displayForecast() {
    try {
        // Get the forecast data
        const forecastData = await forecast();
        if (!forecastData?.forecast?.forecastday) {
            throw new Error('Invalid forecast data format');
        }

        console.log('Updating forecast display with data');

        // Extract the forecast for the next three days
        const forecasts = forecastData.forecast.forecastday;

        // Update each forecast box separately
        updateForecastBox(forecasts[0], '.day-1');
        updateForecastBox(forecasts[1], '.day-2');
        updateForecastBox(forecasts[2], '.day-3');
        
        return forecastData; // Return the data for other components to use
    } catch (error) {
        console.error('Error displaying forecast data:', error);
        throw error;
    }
}

export { displayForecast, forecast };
