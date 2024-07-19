'use client';
import React, { useEffect, useState } from 'react';
import Map from '../components/map.tsx';
import Sidebar from '../components/sidebar.tsx';
import Modal from '../components/modal.tsx';
import { APIProvider } from '@vis.gl/react-google-maps';
import EditPinModal from '../components/EditPinModal.tsx';
import { useSelector } from 'react-redux';
import { selectEditModal } from '../store/toggleModals/toggleModalSlice.ts';
import { ToastContainer } from 'react-toastify';
import ListComponent  from '../components/ListComponent.tsx';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useRequireAuth } from '../hooks/useRequiredAuth.ts';
import ProfileComponent from '../components/ProfileComponent.tsx';

const Page = () => {
  const toggleEdit = useSelector(selectEditModal);
  const user = useRequireAuth();
  const { loading } = useRequireAuth();
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!user) {
    return null;
  }

  return (
    <>
    {showContent && (
    <DndProvider backend={HTML5Backend}>
      
      <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLEAPI_API_KEY ?? ''}>
      <Modal />
      <ListComponent />
      {toggleEdit && <EditPinModal/>}
      <Sidebar />
          <Map />
          <ProfileComponent />
      </APIProvider>
    </DndProvider>
    )}
    </>
  );
};

export default Page;
