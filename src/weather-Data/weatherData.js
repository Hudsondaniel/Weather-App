const apiKey = 'a45efc5b41c54b5b8e6155635240606';
import { getLocationName } from '../Location/location';
// Get the JSON for a given location -- Gets all the details that are necessary
async function currentWeather(apiKey) {
    try {
        const location = getLocationName();
        console.log('Fetching weather for location:', location);
        
        if (!location) {
            throw new Error('No location specified');
        }
        
        const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${encodeURIComponent(location)}&aqi=no`;
        console.log('Making API request to:', url);
        
        const response = await fetch(url);
        console.log('API Response status:', response.status);
        
        if (!response.ok) {
            const errorData = await response.json();
            console.error('API Error:', errorData);
            throw new Error(`Weather API error: ${errorData.error?.message || response.statusText}`);
        }
        
        const data = await response.json();
        console.log('Weather data received:', data);
        return data;
    } catch (error) {
        console.error('Error fetching the weather data:', error);
        throw error; // Propagate the error for handling in the UI
    }
}

export default currentWeather;