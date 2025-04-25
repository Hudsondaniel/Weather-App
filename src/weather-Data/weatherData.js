const apiKey = 'a45efc5b41c54b5b8e6155635240606';
import { getLocationName } from '../Location/location';
// Get the JSON for a given location -- Gets all the details that are necessary
async function currentWeather(apiKey) {
    try {
        const location = getLocationName() || 'Hosur'; // Use searched location or default to Hosur
        const response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${location}&days=3&aqi=no&alerts=no`);
        console.log(location + "Is working under current weather")
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

export default currentWeather;