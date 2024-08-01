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
import ListComponent from '../components/ListComponent.tsx';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useRequireAuth } from '../hooks/useRequiredAuth.ts';
import ProfileComponent from '../components/ProfileComponent.tsx';
import { collection, getFirestore, onSnapshot } from 'firebase/firestore';
import { app } from "../firebase"; // Ensure this path is correct
import { Pin } from '../types/pinData.ts';
import { useAuth } from '../context/authContext.js';
import styles from '../Sass/Auth.module.scss';
import { mkConfig, generateCsv, download } from "export-to-csv";
import { FaFileCsv } from "react-icons/fa";

type CSVPin = {
  id: string;
  address: string;
  lat: number;
  lng: number;
  title: string;
  description: string;
  category: string;
  visited: boolean;
  imageUrls: string;
  openingHours: string;
  rating: number;
  website: string;
};

const Page = () => {
  const toggleEdit = useSelector(selectEditModal);
  const userRequire = useRequireAuth();
  const { loading } = useRequireAuth();
  const [showContent, setShowContent] = useState(false);
  const [pins, setPins] = useState<Pin[]>([]);
  const [CSVData, setCSVData] = useState<CSVPin[]>([]);
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
      const fetchedPins: Pin[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        address: doc.data().address || '',
        lat: doc.data().lat || 0,
        lng: doc.data().lng || 0,
        title: doc.data().title || '',
        description: doc.data().description || '',
        category: doc.data().category || '',
        visited: doc.data().visited || false,
        imageUrls: doc.data().imageUrls || '',
        openingHours: doc.data().openingHours || '',
        rating: doc.data().rating || 0,
        website: doc.data().website || '',
      }));

      const fetchedPinsCSV: CSVPin[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        address: String(doc.data().address || ''),
        lat: Number(doc.data().lat || 0),
        lng: Number(doc.data().lng || 0),
        title: String(doc.data().title || ''),
        description: String(doc.data().description || ''),
        category: String(doc.data().category || ''),
        visited: Boolean(doc.data().visited || false),
        imageUrls: String(doc.data().imageUrls || ''),
        openingHours: String(doc.data().openingHours || ''),
        rating: Number(doc.data().rating || 0),
        website: String(doc.data().website || ''),
      }));

      setCSVData(fetchedPinsCSV);
      setPins(fetchedPins);
    });

    return () => unsubscribe(); // Clean up the subscription
  }, [user]);

  const downloadCSV = async () => {
    const csvConfig = mkConfig({ useKeysAsHeaders: true });
    const csv = generateCsv(csvConfig)(CSVData);
    download(csvConfig)(csv);
  };

  if (loading) {
    return (
      <div>
        <iframe
          className={styles.loadingAnimation}
          src="https://lottie.host/embed/6599d90e-2886-4785-86fc-f7fb10f4a8ad/gvM3MrH0Q5.json"
        ></iframe>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <>
      {showContent ? (
        <DndProvider backend={HTML5Backend}>
          <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLEAPI_API_KEY ?? ''}>
            <Modal />
            <ListComponent />
            {toggleEdit && <EditPinModal />}
            <Sidebar pins={pins} />
            <Map pins={pins} />
            <ProfileComponent />
            <button className={styles.csvButton} onClick={downloadCSV}>
              <FaFileCsv />
            </button>
          </APIProvider>
        </DndProvider>
      ) : (
        <div>
          <iframe
            className={styles.loadingAnimation}
            src="https://lottie.host/embed/6599d90e-2886-4785-86fc-f7fb10f4a8ad/gvM3MrH0Q5.json"
          ></iframe>
        </div>
      )}
    </>
  );
};

export default Page;
