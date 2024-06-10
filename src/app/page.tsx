'use client'
import React from 'react';
import {createRoot} from 'react-dom/client';
import {APIProvider, Map} from '@vis.gl/react-google-maps';
import  Pin from './components/pin.jsx';

const page = () => (
  <APIProvider apiKey='AIzaSyC9dICfO1Q2SlNUbKIyUWpE3gTiZ_qeE0c'>
    <Map
      mapId={'efa788b3413cc48d'}
      style={{width: '100vw', height: '100vh'}}
      defaultCenter={{lat: 22.54992, lng: 0}}
      defaultZoom={3}
      gestureHandling={'greedy'}
      disableDefaultUI={true}
    >

      <Pin></Pin>
    </Map>

  </APIProvider>
);

export default page;