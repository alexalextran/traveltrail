'use client';
import { APIProvider, Map, AdvancedMarker, MapCameraProps, MapCameraChangedEvent } from '@vis.gl/react-google-maps';
import Pin from './pin.tsx';
import { useSelector, useDispatch } from 'react-redux';
import { selectPins } from '../store/pins/pinsSlice';
import { fetchPins } from '../store/pins/pinsSlice';
import { useEffect, useState, useCallback, useMemo } from 'react';
import { AppDispatch } from '../store/store'; // Import the AppDispatch type
import useGeolocation from '../hooks/useGeolocation'; // Import the custom hook
import { MdPersonPinCircle } from "react-icons/md";
import styles from '../Sass/page.module.scss';
import { selectLocation } from '../store/location/locationSlice';

const MapComponent = () => {
  const dispatch = useDispatch<AppDispatch>();
  const pins = useSelector(selectPins);
  const { location, error } = useGeolocation();
  const locationRedux = useSelector(selectLocation);

  useEffect(() => {
    dispatch(fetchPins());
    setCameraProps(prevCameraProps => ({
      ...prevCameraProps,
      center: { lat: locationRedux.lat, lng: locationRedux.lng }
    }));
  }, [dispatch, locationRedux.lat, locationRedux.lng]);

  const INITIAL_CAMERA = useMemo(() => ({
    center: { lat: location.lat, lng: location.lng },
    zoom: 5
  }), [location.lat, location.lng]);

  const [cameraProps, setCameraProps] = useState<MapCameraProps>(INITIAL_CAMERA);

  const handleCameraChange = useCallback((ev: MapCameraChangedEvent) => {
    setCameraProps(ev.detail);
  }, []);

  const handleSetCameraToJapan = () => {
    setCameraProps({
      center: { lat: 35.6895, lng: 139.6917 },
      zoom: 13
    });
  };

  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLEAPI_API_KEY ?? ''}>
      <button onClick={handleSetCameraToJapan} style={{ position: 'absolute', top: '10px', left: '10px', zIndex: 1000 }}>
        Go to Japan
      </button>
      <Map
        onCameraChanged={handleCameraChange}
        {...cameraProps}
        mapId={'efa788b3413cc48d'}
        style={{ width: '100vw', height: '100vh', right: '0', position: 'absolute', overflowY: 'hidden' }}
        defaultCenter={INITIAL_CAMERA.center}
        defaultZoom={INITIAL_CAMERA.zoom}
        gestureHandling={'greedy'}
        disableDefaultUI={true}
      >
        {pins.map((pin) => (
          <Pin key={pin.id} pinID={pin.id} lat={pin.lat} lng={pin.lng} userLocation={INITIAL_CAMERA.center} />
        ))}
        <AdvancedMarker position={INITIAL_CAMERA.center}>
          <MdPersonPinCircle className={styles.svg}/>
        </AdvancedMarker>
      </Map>
    </APIProvider>
  );
};

export default MapComponent;
