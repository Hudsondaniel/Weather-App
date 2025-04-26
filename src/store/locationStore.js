// Simple state management for location
const MAX_HISTORY = 5;
const STORAGE_KEY = 'skynet_locationState';

class LocationStore {
    constructor() {
        // Try to load state from localStorage
        const savedState = localStorage.getItem(STORAGE_KEY);
        this.state = savedState ? JSON.parse(savedState) : {
            currentLocation: 'Bangalore',
            locationHistory: ['Bangalore'],
            error: null,
            isLoading: false
        };
        this.listeners = [];
    }

    // Subscribe to state changes
    subscribe(listener) {
        this.listeners.push(listener);
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }

    // Notify all listeners and persist state
    notify() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
        this.listeners.forEach(listener => listener(this.state));
    }

    // Get current state
    getState() {
        return this.state;
    }

    // Update location
    setLocation(newLocation) {
        if (!newLocation) return;
        
        this.state.currentLocation = newLocation;
        
        // Add to history if it's a new location
        if (!this.state.locationHistory.includes(newLocation)) {
            this.state.locationHistory = [
                newLocation,
                ...this.state.locationHistory.slice(0, MAX_HISTORY - 1)
            ];
        }
        this.state.error = null;
        this.notify();
    }

    // Set error state
    setError(error) {
        this.state.error = error;
        this.notify();
    }

    // Set loading state
    setLoading(isLoading) {
        this.state.isLoading = isLoading;
        this.notify();
    }

    // Clear location history
    clearHistory() {
        this.state.locationHistory = [this.state.currentLocation];
        this.notify();
    }
}

// Create and export a singleton instance
const locationStore = new LocationStore();
export default locationStore; 