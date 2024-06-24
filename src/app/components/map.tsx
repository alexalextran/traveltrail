'use client';
import { APIProvider, Map } from '@vis.gl/react-google-maps';
import Pin from './pin.tsx';
import { useSelector, useDispatch } from 'react-redux';
import { selectPins } from '../store/pins/pinsSlice.ts';
import ImgUpload from '../components/imgUpload.tsx';
import { fetchPins } from '../store/pins/pinsSlice.ts';
import { useEffect } from 'react';
import { AppDispatch } from '../store/store.ts'; // Import the AppDispatch type

const MapComponent = () => {
  const dispatch: AppDispatch = useDispatch(); // Use the typed version of useDispatch

  // Use useSelector to access the pins from the Redux state
  const pins = useSelector(selectPins);

  useEffect(() => {
    // Dispatch fetchPins to load pins from the database into the Redux state
    dispatch(fetchPins());
  }, [dispatch]);
console.log(pins)
  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLEAPI_API_KEY ?? ''}>
      <Map mapId={'efa788b3413cc48d'} style={{ width: '100vw', height: '100vh', right: '0', position: 'absolute' }} defaultCenter={{ lat: 22.54992, lng: 0 }} defaultZoom={3} gestureHandling={'greedy'} disableDefaultUI={true}>
        {pins.map((pin) => (
          // Render each pin using the Pin component
          <Pin key={pin.id} pinID={pin.id} lat={pin.lat} lng={pin.lng} />
        ))}
      </Map>
    </APIProvider>
  );
};

export default MapComponent;