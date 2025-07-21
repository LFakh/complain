import { useState, useCallback } from 'react';

interface GeolocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
}

interface GeolocationError {
  code: number;
  message: string;
}

export const useGeolocation = () => {
  const [location, setLocation] = useState<GeolocationData | null>(null);
  const [error, setError] = useState<GeolocationError | null>(null);
  const [loading, setLoading] = useState(false);

  const getCurrentLocation = useCallback((): Promise<GeolocationData> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        const error = {
          code: 0,
          message: 'Geolocation is not supported by this browser'
        };
        setError(error);
        reject(error);
        return;
      }

      setLoading(true);
      setError(null);

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const locationData: GeolocationData = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: position.timestamp
          };
          
          setLocation(locationData);
          setLoading(false);
          resolve(locationData);
        },
        (error) => {
          const geoError: GeolocationError = {
            code: error.code,
            message: error.message
          };
          
          setError(geoError);
          setLoading(false);
          reject(geoError);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000
        }
      );
    });
  }, []);

  const formatLocationString = (location: GeolocationData): string => {
    return `Location: ${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)} (±${location.accuracy}m)`;
  };

  return {
    location,
    error,
    loading,
    getCurrentLocation,
    formatLocationString
  };
};