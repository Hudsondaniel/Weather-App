import { getLocationName, subscribeToLocationChanges } from '../Location/location';

let map = null;
let center;

// Subscribe to location changes
subscribeToLocationChanges((state) => {
    console.log('Location changed:', state.currentLocation);
    if (state.currentLocation) {
        updateMap(state.currentLocation);
    }
});

// Wait for DOM and Google Maps to be fully loaded
document.addEventListener('DOMContentLoaded', async function() {
    console.log('DOM Content Loaded, initializing map...');
    try {
        await initMap();
        console.log('Map initialized successfully');
    } catch (error) {
        console.error('Error initializing map:', error);
        const mapDiv = document.getElementById('map');
        if (mapDiv) {
            mapDiv.innerHTML = '<div style="color: white; text-align: center; padding: 20px;">Unable to load map. Please try again later.</div>';
        }
    }
});

async function initMap() {
    try {
        console.log('Starting map initialization...');
        // Load the Google Maps library
        const { Map } = await google.maps.importLibrary("maps");
        const location = getLocationName() || 'Bangalore';
        console.log('Initial location:', location);
        
        // Get coordinates for the location
        const geocoder = new google.maps.Geocoder();
        const coordinates = await new Promise((resolve, reject) => {
            geocoder.geocode({ address: location }, (results, status) => {
                console.log('Geocoding status:', status);
                if (status === 'OK') {
                    const coords = {
                        lat: results[0].geometry.location.lat(),
                        lng: results[0].geometry.location.lng()
                    };
                    console.log('Initial coordinates:', coords);
                    resolve(coords);
                } else {
                    reject(new Error('Geocoding failed'));
                }
            });
        });

        center = coordinates;
        const initialZoom = 11;
        
        // Define the dark theme styles
        const darkTheme = [
            {
                "elementType": "geometry",
                "stylers": [{"color": "#242f3e"}]
            },
            {
                "elementType": "labels.text.stroke",
                "stylers": [{"color": "#242f3e"}]
            },
            {
                "elementType": "labels.text.fill",
                "stylers": [{"color": "#746855"}]
            },
            {
                "featureType": "administrative.locality",
                "elementType": "labels.text.fill",
                "stylers": [{"color": "#d59563"}]
            },
            {
                "featureType": "poi",
                "elementType": "labels.text.fill",
                "stylers": [{"color": "#d59563"}]
            },
            {
                "featureType": "poi.park",
                "elementType": "geometry",
                "stylers": [{"color": "#263c3f"}]
            },
            {
                "featureType": "poi.park",
                "elementType": "labels.text.fill",
                "stylers": [{"color": "#6b9a76"}]
            },
            {
                "featureType": "road",
                "elementType": "geometry",
                "stylers": [{"color": "#38414e"}]
            },
            {
                "featureType": "road",
                "elementType": "geometry.stroke",
                "stylers": [{"color": "#212a37"}]
            },
            {
                "featureType": "road",
                "elementType": "labels.text.fill",
                "stylers": [{"color": "#9ca5b3"}]
            },
            {
                "featureType": "road.highway",
                "elementType": "geometry",
                "stylers": [{"color": "#746855"}]
            },
            {
                "featureType": "road.highway",
                "elementType": "geometry.stroke",
                "stylers": [{"color": "#1f2835"}]
            },
            {
                "featureType": "road.highway",
                "elementType": "labels.text.fill",
                "stylers": [{"color": "#f3d19c"}]
            },
            {
                "featureType": "transit",
                "elementType": "geometry",
                "stylers": [{"color": "#2f3948"}]
            },
            {
                "featureType": "transit.station",
                "elementType": "labels.text.fill",
                "stylers": [{"color": "#d59563"}]
            },
            {
                "featureType": "water",
                "elementType": "geometry",
                "stylers": [{"color": "#17263c"}]
            },
            {
                "featureType": "water",
                "elementType": "labels.text.fill",
                "stylers": [{"color": "#515c6d"}]
            },
            {
                "featureType": "water",
                "elementType": "labels.text.stroke",
                "stylers": [{"color": "#17263c"}]
            }
        ];

        // Create the map with the dark theme
        const mapDiv = document.getElementById("map");
        if (!mapDiv) {
            throw new Error('Map container not found');
        }

        map = new Map(mapDiv, {
            center: center,
            zoom: initialZoom,
            styles: darkTheme,
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: false
        });

        console.log('Map instance created:', map !== null);

        // Add a marker for the location and store it
        if (window.currentMarker) {
            window.currentMarker.setMap(null);
        }
        window.currentMarker = new google.maps.Marker({
            position: center,
            map: map,
            title: location
        });
        console.log('Initial marker placed');

    } catch (error) {
        console.error('Error in map initialization:', error);
        throw error;
    }
}

// Update map when location changes
export function updateMap(newLocation) {
    console.log('Updating map with location:', newLocation);
    console.log('Map instance exists:', map !== null);
    
    if (!map) {
        console.error('Map not initialized');
        // Try to reinitialize the map
        initMap().then(() => {
            updateMap(newLocation);
        }).catch(error => {
            console.error('Failed to reinitialize map:', error);
        });
        return;
    }
    
    if (!newLocation) {
        console.error('No location provided');
        return;
    }

    const geocoder = new google.maps.Geocoder();
    console.log('Starting geocoding for:', newLocation);
    
    geocoder.geocode({ address: newLocation }, (results, status) => {
        console.log('Geocoding status for update:', status);
        if (status === 'OK') {
            const newCenter = {
                lat: results[0].geometry.location.lat(),
                lng: results[0].geometry.location.lng()
            };
            console.log('New coordinates:', newCenter);
            
            try {
                map.setCenter(newCenter);
                console.log('Map center updated');
                
                // Clear existing markers
                if (window.currentMarker) {
                    window.currentMarker.setMap(null);
                    console.log('Previous marker cleared');
                }
                
                // Add new marker
                window.currentMarker = new google.maps.Marker({
                    position: newCenter,
                    map: map,
                    title: newLocation
                });
                console.log('New marker placed');
                
                // Force a redraw of the map
                google.maps.event.trigger(map, 'resize');
                
            } catch (error) {
                console.error('Error updating map:', error);
            }
        } else {
            console.error('Geocoding failed:', status);
        }
    });
}

// Update map with direct coordinates
export function updateMapWithCoordinates(lat, lng, title) {
    console.log('Updating map with coordinates:', { lat, lng, title });
    if (!map) {
        console.error('Map not initialized');
        return;
    }

    const newCenter = { lat, lng };
    try {
        map.setCenter(newCenter);
        console.log('Map center updated');
        
        // Clear existing markers
        if (window.currentMarker) {
            window.currentMarker.setMap(null);
            console.log('Previous marker cleared');
        }
        
        // Add new marker
        window.currentMarker = new google.maps.Marker({
            position: newCenter,
            map: map,
            title: title || ''
        });
        console.log('New marker placed');
        
        // Force a redraw of the map
        google.maps.event.trigger(map, 'resize');
    } catch (error) {
        console.error('Error updating map with coordinates:', error);
    }
}
