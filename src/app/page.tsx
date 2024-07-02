'use client';
import React, { useState } from 'react';
import Map from './components/map.tsx';
import Sidebar from './components/sidebar.tsx';
import Modal from './components/modal.tsx';
import { APIProvider } from '@vis.gl/react-google-maps';
import EditPinModal from './components/EditPinModal.tsx';

const Page = () => {
    const [toggleEditPin, settoggleEditPin] = useState(false);


  return (
    <>
      <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLEAPI_API_KEY ?? ''}>
        <Modal fullScreen={false} />
        {toggleEditPin && <EditPinModal settoggleEditPin={settoggleEditPin}/>}
        <Sidebar />
        <Map />
      </APIProvider>
    </>
  );
};

export default Page;
