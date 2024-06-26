'use client';
import { APIProvider, Map, AdvancedMarker } from '@vis.gl/react-google-maps';
import Pin from './pin.tsx';
import { useSelector, useDispatch } from 'react-redux';
import { selectPins } from '../store/pins/pinsSlice.ts';
import { fetchPins } from '../store/pins/pinsSlice.ts';
import { useEffect, useState, useCallback } from 'react';
import { AppDispatch } from '../store/store.ts'; // Import the AppDispatch type
import useGeolocation from '../hooks/useGeolocation.ts'; // Import the custom hook
import { MdPersonPinCircle } from "react-icons/md";
import styles from '../Sass/page.module.scss';

const MapComponent = () => {
  const dispatch: AppDispatch = useDispatch(); // Use the typed version of useDispatch
  const pins = useSelector(selectPins);
  const { location, error } = useGeolocation();


  useEffect(() => {
    dispatch(fetchPins());
  }, [dispatch, location]);

  
  
  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLEAPI_API_KEY ?? ''}>
         <Map
          mapId={'efa788b3413cc48d'}
          style={{ width: '100vw', height: '100vh', right: '0', position: 'absolute' }}
          defaultCenter={{ lat: location.lat, lng: location.lng }}
          defaultZoom={13}
          gestureHandling={'greedy'}
          disableDefaultUI={true}
        >
        {pins.map((pin) => (
          // Render each pin using the Pin component
          <Pin key={pin.id} pinID={pin.id} lat={pin.lat} lng={pin.lng} />
        ))}

<AdvancedMarker position={{ lat: location.lat, lng: location.lng}}>
<MdPersonPinCircle className={styles.svg}/>
  </AdvancedMarker>
      </Map>
    </APIProvider>
  );
};

export default MapComponent;
