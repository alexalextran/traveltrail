import React, { useEffect, useState } from "react";
import { AdvancedMarker, Pin, InfoWindow, useAdvancedMarkerRef } from "@vis.gl/react-google-maps";
import styles from "../../Sass/infoWindow.module.scss";
import InfoWindowComponent from "./InfoWindowComponent";
import ExpandedInfoModal from "./expandedInfoModal";
import { useSelector } from 'react-redux';
import { Category } from "../../types/categoryData";
import { selectSelectedList } from "../../store/List/listSlice"; 
import { doc, getFirestore, onSnapshot } from "firebase/firestore";
import { app } from "../../firebase";
import { useAuth } from '../../context/authContext'; // Import the useAuth hook
import CustomPin from "./customPin";
const CustomizedMarker = ({ lat, lng, pinID, userLocation, pin, category}: {category: Category, pin: any, lat: number, lng: number, pinID: string, userLocation: { lat: number; lng: number; } }) => {
  const [markerRef, marker] = useAdvancedMarkerRef();
  const [toggleIWM, settoggleIWM] = useState(false);
  const [showInfoWindow, setShowInfoWindow] = useState(false);
  const selectedList = useSelector(selectSelectedList);
  const [allListPins, setallListPins] = useState<string[]>([]);
  const { user } = useAuth(); 

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
  var backgroundColor =  allListPins.length == 0 || pinInList  ? '100%' : '10%';





  return (
    <>
      <AdvancedMarker 
        position={{ lat, lng }} 
        ref={markerRef} 
        onClick={handleClick}
      >
        <CustomPin  category={category} backgroundColor={backgroundColor}/>
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
