require('dotenv').config();
const fetch = require('node-fetch'); // Make sure you have this package installed

const apiKey = process.env.API_KEY;

async function currentWeather(apiKey) {
    try {
        const response = await fetch(`https://api.weatherapi.com/v1/sports.json?key=${apiKey}&q=London`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log(data); // Log the data
        return data;
    } catch (error) {
        console.error('Error fetching the weather data:', error);
    }
}

currentWeather(apiKey);

