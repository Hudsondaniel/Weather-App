import locationStore from '../store/locationStore';

export function setLocationName(name) {
    locationStore.setLocation(name);
}

export function getLocationName() {
    return locationStore.getState().currentLocation;
}

export function getLocationHistory() {
    return locationStore.getState().locationHistory;
}

export function subscribeToLocationChanges(callback) {
    return locationStore.subscribe(callback);
}

export default {
    setLocationName,
    getLocationName,
    getLocationHistory,
    subscribeToLocationChanges
}; 
