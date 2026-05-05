import type { Coordinate } from "../navigation/restAreas";
import type { GpsProvider } from "../services/backgroundSession";

export interface GeolocationLike {
  getCurrentPosition(
    success: (position: { coords: { latitude: number; longitude: number } }) => void,
    error?: (err: unknown) => void,
    options?: { enableHighAccuracy?: boolean; timeout?: number; maximumAge?: number }
  ): void;
  watchPosition(
    success: (position: { coords: { latitude: number; longitude: number } }) => void,
    error?: (err: unknown) => void,
    options?: { enableHighAccuracy?: boolean; distanceFilter?: number; interval?: number }
  ): number;
  clearWatch(watchId: number): void;
}

export function createRnGpsProvider(geolocation: GeolocationLike): GpsProvider {
  return {
    async getCurrentLocation(): Promise<Coordinate> {
      return new Promise((resolve, reject) => {
        geolocation.getCurrentPosition(
          (pos) => resolve({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
          reject,
          { enableHighAccuracy: true, timeout: 8000, maximumAge: 1000 }
        );
      });
    },
    watch(onTick) {
      const watchId = geolocation.watchPosition(
        (pos) => onTick({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
        () => {
          // Keep session running even if one GPS tick fails.
        },
        { enableHighAccuracy: true, distanceFilter: 5, interval: 1000 }
      );
      return () => geolocation.clearWatch(watchId);
    },
  };
}
