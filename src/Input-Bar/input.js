import { setLocationName, getLocationName } from '../Location/location';
import { updateMap } from '../Google-API/googleApi';
import displayWeather from '../weatherPage/weatherPage';

const button = document.getElementById('search-button');
const modal = document.getElementById('modal');
const modalOverlay = document.getElementById('modal-overlay');
const modalInput = document.getElementById('modal-input');
const modalButton = document.getElementById('modal-button');

button.addEventListener('click', function() {
    modal.style.display = 'block';
    modalOverlay.style.display = 'flex'; 
});

modalButton.addEventListener('click', async function() {
    const inputValue = modalInput.value.trim(); 
    if (inputValue) {
        setLocationName(inputValue); // Set the location name
        modalInput.value = '';
        modal.style.display = 'none';
        modalOverlay.style.display = 'none';
        
        try {
            // Update weather display
            await displayWeather();
            // Update map
            updateMap(inputValue);
        } catch (error) {
            console.error('Error updating weather data:', error);
            alert('Unable to find weather data for this location. Please try another city.');
        }
    } else {
        alert('Please enter a location name');
    }
});





