'use client';
import { APIProvider, Map } from '@vis.gl/react-google-maps';
import Pin from './pin.tsx';
import { useSelector } from 'react-redux';
import { selectPins } from '../store/pins/pinsSlice.ts';
import ImgUpload from '../components/imgUpload.tsx';
import ExpandedInfoModal from './expandedInfoModal.tsx';
const MapComponent = () => {
  const pins = useSelector(selectPins);

  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLEAPI_API_KEY ?? ''}>
      <Map mapId={'efa788b3413cc48d'} style={{ width: '100vw', height: '100vh', right: '0', position: 'absolute' }} defaultCenter={{ lat: 22.54992, lng: 0 }} defaultZoom={3} gestureHandling={'greedy'} disableDefaultUI={true}>
      {pins.map((pin) => (
        console.log(pin.id),
        <Pin key={pin.id} pinID={pin.id} lat={pin.lat} lng={pin.lng}></Pin>
))}

      </Map>
     
    </APIProvider>
  
  );
};

export default MapComponent;