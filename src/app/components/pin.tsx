import React, { useEffect, useState } from "react";
import { AdvancedMarker, Pin, InfoWindow, useAdvancedMarkerRef } from "@vis.gl/react-google-maps";
import styles from "../Sass/infoWindow.module.scss";
import InfoWindowComponent from "./InfoWindowComponent";
import ExpandedInfoModal from "../components/expandedInfoModal";
import { useSelector } from 'react-redux';
import { Category } from "../types/categoryData";
import { selectSelectedList } from "../store/List/listSlice"; 
import { doc, getFirestore, onSnapshot } from "firebase/firestore";
import { app } from "../firebase";
import { useAuth } from '../context/authContext'; // Import the useAuth hook

const CustomizedMarker = ({ lat, lng, pinID, userLocation, pin, category}: {category: Category, pin: any, lat: number, lng: number, pinID: string, userLocation: { lat: number; lng: number; } }) => {
  const [markerRef, marker] = useAdvancedMarkerRef();
  const [toggleIWM, settoggleIWM] = useState(false);
  const [showInfoWindow, setShowInfoWindow] = useState(false);
  const selectedList = useSelector(selectSelectedList);
  const [allListPins, setallListPins] = useState<string[]>([]);
  const { user } = useAuth(); // Use the useAuth hook

  console.log("I was rendered");
  const handleClick = () => {
    setShowInfoWindow(prevState => !prevState);
  };

  useEffect(() => {
    if (!selectedList || !selectedList.id) {
      setallListPins([]); 
      return;
    }

    const db = getFirestore(app);
    const listDocRef = doc(db, `users/${user.uid}/lists`, selectedList.id);
    const unsubscribe = onSnapshot(listDocRef, (snapshot) => {
      const fetchedList = snapshot.data();
      if (fetchedList && fetchedList.pins) {
        setallListPins([...fetchedList.pins]);
      } else {
        setallListPins([]);
      }
    });

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [selectedList]);

  const pinInList = allListPins.includes(pinID);
  const backgroundColor = allListPins.length === 0 ? category?.categoryColor : category?.categoryColor + (pinInList ? 'FF' : '50'); // 'FF' for full opacity, '50' for semi-transparent

  console.log("I was rendered");

  return (
    <>
      <AdvancedMarker 
        position={{ lat, lng }} 
        ref={markerRef} 
        onClick={handleClick}
      >
        <Pin background={backgroundColor} glyphColor={'#000'} borderColor={'#000'} />
        {showInfoWindow && (
          <InfoWindow anchor={marker} className={styles.infoWindow}>
            <InfoWindowComponent
              setShowInfoWindow={setShowInfoWindow}
              userLocation={userLocation}
              filteredPin={pin}
              settoggleIWM={settoggleIWM}
              filteredCategory={category}
            />
          </InfoWindow>
        )}
      </AdvancedMarker>
      {toggleIWM && (
        <ExpandedInfoModal
          pin={pin}
          settoggleIWM={settoggleIWM}
          userLocation={userLocation}
          filteredCategory={category}
        />
      )}
    </>
  );
};

export default React.memo(CustomizedMarker);
