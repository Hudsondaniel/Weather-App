import { getLocationName } from '../Location/location';

let map;
let center;

// Wait for DOM and Google Maps to be fully loaded
document.addEventListener('DOMContentLoaded', async function() {
    try {
        await initMap();
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
        // Load the Google Maps library
        const { Map } = await google.maps.importLibrary("maps");
        const location = getLocationName() || 'Bangalore';
        
        // Get coordinates for the location
        const geocoder = new google.maps.Geocoder();
        const coordinates = await new Promise((resolve, reject) => {
            geocoder.geocode({ address: location }, (results, status) => {
                if (status === 'OK') {
                    resolve({
                        lat: results[0].geometry.location.lat(),
                        lng: results[0].geometry.location.lng()
                    });
                } else {
                    reject(new Error('Geocoding failed'));
                }
            });
        });

        center = coordinates;
        const initialZoom = 11; // City level zoom
        
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

        // Add a marker for the location
        new google.maps.Marker({
            position: center,
            map: map,
            title: location
        });

    } catch (error) {
        console.error('Error in map initialization:', error);
        throw error;
    }
}

// Update map when location changes
export function updateMap(newLocation) {
    if (map && newLocation) {
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ address: newLocation }, (results, status) => {
            if (status === 'OK') {
                const newCenter = {
                    lat: results[0].geometry.location.lat(),
                    lng: results[0].geometry.location.lng()
                };
                map.setCenter(newCenter);
                
                // Clear existing markers
                if (window.currentMarker) {
                    window.currentMarker.setMap(null);
                }
                
                // Add new marker
                window.currentMarker = new google.maps.Marker({
                    position: newCenter,
                    map: map,
                    title: newLocation
                });
            }
        });
    }
}
