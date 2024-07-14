const apiKey = 'a45efc5b41c54b5b8e6155635240606';

// Get the JSON for a given location -- Gets all the details that are necessary
async function currentWeather(apiKey) {
    try {
        const response = await fetch(`https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=hosur&aqi=no`);
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