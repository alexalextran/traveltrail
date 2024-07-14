'use client';
import React, { useEffect, useState } from 'react';
import Map from '../components/map.tsx';
import Sidebar from '../components/sidebar.tsx';
import Modal from '../components/modal.tsx';
import { APIProvider } from '@vis.gl/react-google-maps';
import EditPinModal from '../components/EditPinModal.tsx';
import { useSelector } from 'react-redux';
import { selectEditModal } from '../store/toggleModals/toggleModalSlice.ts'; // Import the ExpandedInfoModal component
import { ToastContainer } from 'react-toastify';
import ListComponent  from '../components/ListComponent.tsx';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';


const Page = () => {
    const toggleEdit = useSelector(selectEditModal);



  return (
    <>
      <DndProvider backend={HTML5Backend}>
     <ToastContainer /> {/* Add this line */}
      <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLEAPI_API_KEY ?? ''}>
        <Modal />
        <ListComponent />
        {toggleEdit && <EditPinModal/>}
        <Sidebar />
        <Map />
      </APIProvider>
      </DndProvider>

    </>
  );
};

export default Page;
