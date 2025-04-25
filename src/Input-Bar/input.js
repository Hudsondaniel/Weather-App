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
        fields: ['formatted_address', 'geometry', 'name', 'address_components']
    });

    // When a place is selected
    autocomplete.addListener('place_changed', async function() {
        const place = autocomplete.getPlace();
        if (place.geometry) {
            // Get the full location name including state and country
            let cityName = '';
            let state = '';
            let country = '';
            
            place.address_components.forEach(component => {
                if (component.types.includes('locality')) {
                    cityName = component.long_name;
                } else if (component.types.includes('administrative_area_level_1')) {
                    state = component.long_name;
                } else if (component.types.includes('country')) {
                    country = component.long_name;
                }
            });

            // Construct a specific location string
            const locationString = `${cityName}${state ? `, ${state}` : ''}${country ? `, ${country}` : ''}`;
            console.log('Selected location:', locationString);
            
            setLocationName(locationString);
            modal.style.display = 'none';
            modalOverlay.style.display = 'none';
            
            try {
                await displayWeather();
                updateMap(locationString);
            } catch (error) {
                console.error('Error updating weather data:', error);
                modal.style.display = 'block';
                modalOverlay.style.display = 'flex';
                alert(error.message || 'Unable to find weather data for this location. Please try another city.');
            }
        }
    });
}

// Initialize autocomplete when the modal is shown
button.addEventListener('click', function() {
    modal.style.display = 'block';
    modalOverlay.style.display = 'flex';
    modalInput.value = ''; // Clear previous input
    modalInput.focus(); // Focus the input field
    // Initialize autocomplete if not already initialized
    if (!window.googleAutoCompleteInitialized) {
        initAutocomplete();
        window.googleAutoCompleteInitialized = true;
    }
});

modalButton.addEventListener('click', async function() {
    const inputValue = modalInput.value.trim(); 
    console.log('Search button clicked with value:', inputValue);
    
    if (inputValue) {
        try {
            // Try to get more specific location using Google Places Autocomplete
            const geocoder = new google.maps.Geocoder();
            const result = await new Promise((resolve, reject) => {
                geocoder.geocode({ address: inputValue }, (results, status) => {
                    if (status === 'OK' && results[0]) {
                        resolve(results[0]);
                    } else {
                        reject(new Error('Location not found'));
                    }
                });
            });

            // Extract location components
            let cityName = '';
            let state = '';
            let country = '';
            
            result.address_components.forEach(component => {
                if (component.types.includes('locality')) {
                    cityName = component.long_name;
                } else if (component.types.includes('administrative_area_level_1')) {
                    state = component.long_name;
                } else if (component.types.includes('country')) {
                    country = component.long_name;
                }
            });

            // Construct a specific location string
            const locationString = `${cityName}${state ? `, ${state}` : ''}${country ? `, ${country}` : ''}`;
            console.log('Geocoded location:', locationString);

            setLocationName(locationString);
            modalInput.value = '';
            modal.style.display = 'none';
            modalOverlay.style.display = 'none';
            
            await displayWeather();
            updateMap(locationString);
        } catch (error) {
            console.error('Error in search handler:', error);
            modal.style.display = 'block';
            modalOverlay.style.display = 'flex';
            alert(error.message || 'Unable to find weather data for this location. Please try another city.');
        }
    } else {
        alert('Please enter a location name');
    }
});

// Add keyboard event listener for Enter key
modalInput.addEventListener('keypress', async function(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        modalButton.click();
    }
});





