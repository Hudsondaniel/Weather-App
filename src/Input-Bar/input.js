import { setLocationName, getLocationName } from '../Location/location';
import { updateMap, updateMapWithCoordinates } from '../Google-API/googleApi';
import displayWeather from '../weatherPage/weatherPage';

const button = document.getElementById('search-button');
const modal = document.getElementById('modal');
const modalOverlay = document.getElementById('modal-overlay');
const modalInput = document.getElementById('modal-input');
const modalButton = document.getElementById('modal-button');

// Store the selected place globally
let selectedPlace = null;

// Initialize Google Places Autocomplete
function initAutocomplete() {
    const autocomplete = new google.maps.places.Autocomplete(modalInput, {
        types: ['(cities)'],
        fields: ['formatted_address', 'geometry', 'name', 'address_components']
    });

    // When a place is selected from dropdown
    autocomplete.addListener('place_changed', function() {
        const place = autocomplete.getPlace();
        console.log('Place selected:', place);
        
        if (place.geometry && place.geometry.location) {
            // Store the selected place
            selectedPlace = place;
            
            // Update the input field with the formatted address
            modalInput.value = place.formatted_address || place.name;
        } else {
            console.error('Place has no geometry or location');
            selectedPlace = null;
        }
    });
}

// Initialize autocomplete when the modal is shown
button.addEventListener('click', function() {
    modal.style.display = 'block';
    modalOverlay.style.display = 'flex';
    modalInput.value = ''; // Clear previous input
    selectedPlace = null; // Clear any previously selected place
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
    
    if (!inputValue) {
        alert('Please enter a location name');
        return;
    }

    try {
        let locationString;
        let coordinates;

        if (selectedPlace && selectedPlace.geometry) {
            // Use the selected place from autocomplete
            console.log('Using selected place from autocomplete');
            let cityName = '';
            let state = '';
            let country = '';
            
            selectedPlace.address_components.forEach(component => {
                if (component.types.includes('locality')) {
                    cityName = component.long_name;
                } else if (component.types.includes('administrative_area_level_1')) {
                    state = component.long_name;
                } else if (component.types.includes('country')) {
                    country = component.long_name;
                }
            });

            locationString = `${cityName}${state ? `, ${state}` : ''}${country ? `, ${country}` : ''}`;
            coordinates = {
                lat: selectedPlace.geometry.location.lat(),
                lng: selectedPlace.geometry.location.lng()
            };
        } else {
            // Fallback to geocoding the input value
            console.log('Geocoding manual input');
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

            locationString = `${cityName}${state ? `, ${state}` : ''}${country ? `, ${country}` : ''}`;
            coordinates = {
                lat: result.geometry.location.lat(),
                lng: result.geometry.location.lng()
            };
        }

        console.log('Updating with location:', locationString);
        
        // Update location in store
        setLocationName(locationString);
        
        // Update weather data
        await displayWeather();
        
        // Update map with coordinates
        updateMapWithCoordinates(coordinates.lat, coordinates.lng, locationString);
        
        // Clear the input and selected place
        modalInput.value = '';
        selectedPlace = null;
        
        // Hide the modal
        modal.style.display = 'none';
        modalOverlay.style.display = 'none';
    } catch (error) {
        console.error('Error in search handler:', error);
        alert(error.message || 'Unable to find weather data for this location. Please try another city.');
    }
});

// Add keyboard event listener for Enter key
modalInput.addEventListener('keypress', async function(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        modalButton.click();
    }
});





