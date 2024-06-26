import { useState, useEffect } from 'react';

const useGeolocation = () => {
const [location, setLocation] = useState<{ lat: any, lng: any }>({ lat: 22.54, lng: 0 });
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError(new Error('Geolocation is not supported by this browser.'));
      return;
    }

    const handleSuccess = (position: GeolocationPosition) => {
      setLocation({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });
    };

    const handleError = (error: GeolocationPositionError) => {
      setError(new Error(error.message));
    };

    const watcherId = navigator.geolocation.watchPosition(handleSuccess, handleError);

    // Cleanup the watcher when the component unmounts
    return () => {
      navigator.geolocation.clearWatch(watcherId);
    };
  }, []);

  return { location, error };
};

export default useGeolocation;
