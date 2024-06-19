const dataElement = document.querySelector('.data');

async function weatherData() {
    try {
        const response = await fetch('https://api.weatherapi.com/v1/current.json?key=a45efc5b41c54b5b8e6155635240606&q=London&aqi=yes');
        
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }

        const weatherData = await response.json();
        
        // Extracting relevant data from the API response
        const location = weatherData.location.name;
        const temperature = weatherData.current.temp_c;
        const condition = weatherData.current.condition.text;
        
        // Creating a string to display the weather data
        const weatherInfo = `Location: ${location}, Temperature: ${temperature}°C, Condition: ${condition}`;

        // Append the string to the data element
        dataElement.innerText = weatherInfo;
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
}

weatherData();
