let map;
let center;


async function initMap() {
  // Load the Google Maps library
    const { Map } = await google.maps.importLibrary("maps");
    
    center = { lat: 37.4161493, lng: -122.0812166 };
    map = new Map(document.getElementById("map"), {
    center: center,
    zoom: 8,
    mapId: "592e46f5751e805d", 
});

findPlaces();

}

async function findPlaces() {
    // Load the Places library
    const { Place } = await google.maps.importLibrary("places");
    const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");

    const request = {
        textQuery: "Hosur",
        fields: ["displayName", "location", "businessStatus"],
        locationBias: { lat: 37.4161493, lng: -122.0812166 },
        isOpenNow: true,
        language: "en-US",
        maxResultCount: 8,
        minRating: 3.2,
        region: "us",
        useStrictTypeFiltering: false,
    };

    try {
        //@ts-ignore
        const { places } = await Place.searchByText(request);

        if (places.length) {
        console.log(places);

        const { LatLngBounds } = await google.maps.importLibrary("core");
        const bounds = new LatLngBounds();

        // Loop through and get all the results
        places.forEach((place) => {
            new AdvancedMarkerElement({
            map,
            position: place.location,
            title: place.displayName,
        });

        bounds.extend(place.location);
        console.log(place);
        });
        map.fitBounds(bounds);
        } else {
        console.log("No results");
        }   
    } catch (error) {
    console.error("Error searching for places: ", error);
}
}

function loadGoogleMapsAPI(apiKey) {
    return new Promise((resolve, reject) => {
        if (window.google && window.google.maps) {
            resolve(window.google.maps);
            return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,geometry,visualization&callback=initMap`;
    script.async = true;
    script.defer = true;

    script.onload = () => {
        resolve(window.google.maps);
    };

    script.onerror = () => {
        reject(new Error('Failed to load Google Maps API'));
    };

    document.head.appendChild(script);
        });
}

const apiKey = 'AIzaSyAPt-7nt-ZuKZh02FKzU_WhlbB9G_gyTQs'; // Replace with your API key

window.initMap = function() {
  // Map initialization code here
  initMap(); // Call your initMap function here
};

loadGoogleMapsAPI(apiKey).then((maps) => {
    console.log('Google Maps API loaded');
  // API is loaded and can be used
}).catch((error) => {
    console.error(error);
});
