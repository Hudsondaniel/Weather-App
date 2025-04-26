import currentWeather from '../weather-Data/weatherData';
import { displayForecast } from '../Forecast/forecast';
import weatherIcons from "../customMapping/iconMapping";
import { updateWindStatus } from '../visualizations/d3Visualizations';

const apiKey = 'a45efc5b41c54b5b8e6155635240606';

// Display all that on the page
async function displayWeather() {
    try {
        // Getting the current weather data
        const weatherData = await currentWeather(apiKey);
        if (!weatherData) {
            throw new Error('No weather data received');
        }

        // Update current weather
        updateCurrentWeather(weatherData);
        
        // Get and update forecast data
        try {
            const forecastData = await displayForecast();
            if (forecastData?.forecast?.forecastday) {
                // Update today's highlights with forecast data
                updateTodayHighlights(weatherData, forecastData);
            } else {
                console.warn('No forecast data available');
            }
        } catch (error) {
            console.error('Error updating forecast:', error);
            throw new Error('Unable to fetch forecast data. Please try another location or try again later.');
        }

    } catch (error) {
        console.error('Error displaying weather:', error);
        throw new Error('Unable to fetch weather data. Please try another location or try again later.');
    }
}

function updateCurrentWeather(weatherData) {
    try {
        if (!weatherData.current || !weatherData.location) {
            throw new Error('Invalid weather data format');
        }

        const temperatureDiv = document.querySelector('.temperature-letter');
        const locationContainer = document.querySelector('.location');
        const dateContainer = document.querySelector('.time-calendar');
        const svgContainer = document.querySelector('.weather-icon');
        const conditionText = document.querySelector('.condition-text');
        const conditionCode = weatherData.current.condition.code;
        const isDay = weatherData.current.is_day;
        
        // Temperature data
        const temperature = Math.round(weatherData.current.temp_c); // Round the temperature
        temperatureDiv.innerHTML = `<h1 id="temperature" class="temperature">${temperature}°<span class="degree">C</span></h1>`;

        // Country and location data
        const country = weatherData.location.country;
        const locality = weatherData.location.name;
        locationContainer.innerHTML = `<h3 id="city-name" class="city-name">${locality}, ${country}</h3>`;

        // Date and time data
        const date = new Date(weatherData.location.localtime);
        const formattedDate = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()} at ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
        dateContainer.innerHTML = `<h3 class="calendar"><span class="time">${formattedDate}</span></h3>`;

        // Weather icon
        const iconUrl = isDay ? weatherIcons[conditionCode]?.day : weatherIcons[conditionCode]?.night;
        if (iconUrl) {
            svgContainer.innerHTML = `<img src="${iconUrl}" class="icon-temp" alt="${weatherData.current.condition.text}">`;
        }

        if (conditionText) {
            conditionText.innerHTML = weatherData.current.condition.text;
        }
    } catch (error) {
        console.error('Error updating current weather:', error);
        throw error;
    }
}

function updateForecast(forecastData) {
    // Update each day's forecast
    forecastData.forEach((day, index) => {
        const dayContainer = document.querySelector(`.day-${index + 1}`);
        if (dayContainer) {
            const date = new Date(day.date);
            const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
            const monthDay = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            
            // Update forecast icon
            const iconContainer = dayContainer.querySelector(`.forecast-image-${index + 1}`);
            const isDay = true; // Always use day icons for forecast
            iconContainer.innerHTML = `<img src=${weatherIcons[day.day.condition.code]?.day} class="forecast-image" alt="${day.day.condition.text}">`;
            
            // Update temperature
            const tempContainer = dayContainer.querySelector('.forecast-temperature');
            tempContainer.innerHTML = `<h4 class="forecast-number">${Math.round(day.day.avgtemp_c)}°<span class="forecast-celsius">C</span></h4>`;
            
            // Update date
            dayContainer.querySelector('.date-month').textContent = monthDay;
            dayContainer.querySelector('.day').textContent = dayName;
        }
    });
}

function updateTodayHighlights(weatherData, forecastData) {
    try {
        // Update Wind Status
        const windSpeed = document.querySelector('.wind-speed .speed');
        const windTime = document.querySelector('.wind-speed .time');
        if (windSpeed) windSpeed.textContent = weatherData.current.wind_kph.toFixed(1);
        if (windTime) windTime.textContent = new Date(weatherData.current.last_updated).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
        // Add D3 compass update
        updateWindStatus(weatherData.current.wind_kph, weatherData.current.wind_dir);

        // Update UV Index
        const uvIndex = document.querySelector('.speed-UV');
        if (uvIndex) uvIndex.textContent = weatherData.current.uv;

        // Update Sunrise & Sunset from forecast data
        if (forecastData?.forecast?.forecastday?.[0]?.astro) {
            const sunriseTime = document.querySelector('.sunrise-time');
            const sunsetTime = document.querySelector('.sunset-time');
            if (sunriseTime) sunriseTime.textContent = forecastData.forecast.forecastday[0].astro.sunrise;
            if (sunsetTime) sunsetTime.textContent = forecastData.forecast.forecastday[0].astro.sunset;
        }

        // Update Humidity
        const humidity = document.querySelector('.humidity-number');
        if (humidity) humidity.textContent = weatherData.current.humidity;

        // Update Wind Chill
        const windChill = document.querySelector('.windchill-number');
        if (windChill) windChill.textContent = Math.round(weatherData.current.feelslike_c);

        // Update Visibility
        const visibility = document.querySelector('.visibility-number');
        if (visibility) visibility.textContent = weatherData.current.vis_km;

        // Update Wind Direction
        const windDirection = document.querySelector('.winddirection-string');
        if (windDirection) windDirection.textContent = weatherData.current.wind_dir;

        // Update Dew Point from forecast data
        if (forecastData?.forecast?.forecastday?.[0]?.hour?.[0]) {
            const dewPoint = document.querySelector('.dewpoint-number');
            if (dewPoint) dewPoint.textContent = Math.round(forecastData.forecast.forecastday[0].hour[0].dewpoint_c);
        }

        // Update Feels Like
        const feelsLike = document.querySelector('.feelslike-number');
        if (feelsLike) feelsLike.textContent = Math.round(weatherData.current.feelslike_c);
    } catch (error) {
        console.error('Error updating highlights:', error);
    }
}

// Initial weather display
displayWeather();

export default displayWeather;


