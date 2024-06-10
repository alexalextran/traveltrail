'use client';
import React from 'react';
import { APIProvider, Map } from '@vis.gl/react-google-maps';
import Pin from './components/pin.jsx';
var page = function () { return (<APIProvider apiKey={NEXT_PUBLIC_GOOGLEAPI_API_KEY}>
    <Map mapId={'efa788b3413cc48d'} style={{ width: '100vw', height: '100vh' }} defaultCenter={{ lat: 22.54992, lng: 0 }} defaultZoom={3} gestureHandling={'greedy'} disableDefaultUI={true}>

      <Pin></Pin>
    </Map>

  </APIProvider>); };
export default page;
