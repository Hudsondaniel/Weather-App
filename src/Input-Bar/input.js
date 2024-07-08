const button = document.getElementById('search-button');
const modal = document.getElementById('modal');
const modalOverlay = document.getElementById('modal-overlay');
const modalInput = document.getElementById('modal-input');
const modalButton = document.getElementById('modal-button');

button.addEventListener('click', function() {
        modal.style.display = 'block';
        modalOverlay.style.display = 'flex'; // Displaying overlay as flex to center its content
});

modalButton.addEventListener('click', function() {
        const inputValue = modalInput.value.trim(); // Get input value and trim whitespace
        if (inputValue) {
            // Use inputValue as needed (e.g., store in a variable, process, etc.)
                alert('Location name entered: ' + inputValue);
            // Reset input field (optional)
                modalInput.value = '';
        } else {
                alert('Please enter a location name');
        }
        modal.style.display = 'none';
        modalOverlay.style.display = 'none';
});