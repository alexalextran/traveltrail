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
import { collection, getFirestore, onSnapshot } from 'firebase/firestore';
import { app } from "../firebase"; // Ensure this path is correct
import { Pin } from '../types/pinData.ts';
import { useAuth } from '../context/authContext.js';



const Page = () => {
  const toggleEdit = useSelector(selectEditModal);
  const userRequire = useRequireAuth();
  const { loading } = useRequireAuth();
  const [showContent, setShowContent] = useState(false);
  const [pins, setPins] = useState<Pin[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  
  useEffect(() => {
    const db = getFirestore(app);
    const listCollectionRef = collection(db, `users/${user?.uid}/pins`);
    const unsubscribe = onSnapshot(listCollectionRef, (snapshot) => {
        const fetchedPins: Pin[] = snapshot.docs.map(doc => ({
            id: doc.id,
            address: doc.data().address,
            lat: doc.data().lat,
            lng: doc.data().lng,
            title: doc.data().title,
            description: doc.data().description,
            category: doc.data().category,
            visited: doc.data().visited,
            imageUrls: doc.data().imageUrls,
            openingHours: doc.data().openingHours,
            rating: doc.data().rating,
            website: doc.data().website
        }));
        setPins(fetchedPins);
    });

    return () => unsubscribe(); // Clean up the subscription
}, [user]);


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
      <Sidebar pins={pins}/>
          <Map />
          <ProfileComponent />
      </APIProvider>
    </DndProvider>
    )}
    </>
  );
};

export default Page;
