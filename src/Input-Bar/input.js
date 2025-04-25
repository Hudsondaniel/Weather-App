import { setLocationName, getLocationName } from '../Location/location';
import { updateMap } from '../Google-API/googleApi';
import displayWeather from '../weatherPage/weatherPage';

const button = document.getElementById('search-button');
const modal = document.getElementById('modal');
const modalOverlay = document.getElementById('modal-overlay');
const modalInput = document.getElementById('modal-input');
const modalButton = document.getElementById('modal-button');

// Initialize Google Places Autocomplete
function initAutocomplete() {
    const autocomplete = new google.maps.places.Autocomplete(modalInput, {
        types: ['(cities)'],
        fields: ['name', 'geometry']
    });

    // When a place is selected
    autocomplete.addListener('place_changed', async function() {
        const place = autocomplete.getPlace();
        if (place.geometry) {
            const cityName = place.name;
            setLocationName(cityName);
            modal.style.display = 'none';
            modalOverlay.style.display = 'none';
            
            try {
                await displayWeather();
                updateMap(cityName);
            } catch (error) {
                console.error('Error updating weather data:', error);
                alert('Unable to find weather data for this location. Please try another city.');
            }
        }
    });
}

// Initialize autocomplete when the modal is shown
button.addEventListener('click', function() {
    modal.style.display = 'block';
    modalOverlay.style.display = 'flex';
    // Initialize autocomplete if not already initialized
    if (!window.googleAutoCompleteInitialized) {
        initAutocomplete();
        window.googleAutoCompleteInitialized = true;
    }
});

modalButton.addEventListener('click', async function() {
    const inputValue = modalInput.value.trim(); 
    if (inputValue) {
        setLocationName(inputValue);
        modalInput.value = '';
        modal.style.display = 'none';
        modalOverlay.style.display = 'none';
        
        try {
            await displayWeather();
            updateMap(inputValue);
        } catch (error) {
            console.error('Error updating weather data:', error);
            alert('Unable to find weather data for this location. Please try another city.');
        }
    } else {
        alert('Please enter a location name');
    }
});





