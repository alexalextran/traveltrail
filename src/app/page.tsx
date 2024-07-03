'use client';
import React, { useEffect, useState } from 'react';
import Map from './components/map.tsx';
import Sidebar from './components/sidebar.tsx';
import Modal from './components/modal.tsx';
import { APIProvider } from '@vis.gl/react-google-maps';
import EditPinModal from './components/EditPinModal.tsx';
import { useSelector } from 'react-redux';
import { selectEditModal } from './store/toggleModals/toggleModalSlice.ts'; // Import the ExpandedInfoModal component

const Page = () => {
    const toggleEdit = useSelector(selectEditModal);



  return (
    <>
      <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLEAPI_API_KEY ?? ''}>
        <Modal />
        {toggleEdit && <EditPinModal/>}
        <Sidebar />
        <Map />
      </APIProvider>
    </>
  );
};

export default Page;
