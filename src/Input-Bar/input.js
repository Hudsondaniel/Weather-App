import { setLocationName, getLocationName } from '../Location/location'; 

const button = document.getElementById('search-button');
const modal = document.getElementById('modal');
const modalOverlay = document.getElementById('modal-overlay');
const modalInput = document.getElementById('modal-input');
const modalButton = document.getElementById('modal-button');

button.addEventListener('click', function() {
        modal.style.display = 'block';
        modalOverlay.style.display = 'flex'; 
});

modalButton.addEventListener('click', function() {
        const inputValue = modalInput.value.trim(); 
        if (inputValue) {
        setLocationName(inputValue); // Set the location name
        alert('Location name entered: ' + inputValue);
        modalInput.value = '';
        console.log('Updated locationName:', getLocationName()); 
        } else {
        alert('Please enter a location name');
        }
        modal.style.display = 'none';
        modalOverlay.style.display = 'none';
});





