"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRnGpsProvider = createRnGpsProvider;
function createRnGpsProvider(geolocation) {
    return {
        async getCurrentLocation() {
            return new Promise((resolve, reject) => {
                geolocation.getCurrentPosition((pos) => resolve({ lat: pos.coords.latitude, lon: pos.coords.longitude }), reject, { enableHighAccuracy: true, timeout: 8000, maximumAge: 1000 });
            });
        },
        watch(onTick) {
            const watchId = geolocation.watchPosition((pos) => onTick({ lat: pos.coords.latitude, lon: pos.coords.longitude }), () => {
                // Keep session running even if one GPS tick fails.
            }, { enableHighAccuracy: true, distanceFilter: 5, interval: 1000 });
            return () => geolocation.clearWatch(watchId);
        },
    };
}
