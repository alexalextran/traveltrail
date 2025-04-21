import React, { useEffect, useState } from "react";
import { AdvancedMarker, InfoWindow, useAdvancedMarkerRef } from "@vis.gl/react-google-maps";
import styles from "../../Sass/infoWindow.module.scss";
import InfoWindowComponent from "./InfoWindowComponent";
import ExpandedInfoModal from "./expandedInfoModal";
import { useDispatch, useSelector } from 'react-redux';
import { Category } from "../../types/categoryData";
import { selectSelectedList } from "../../store/List/listSlice";
import { setActivePin, selectActivePin } from "../../store/activePinModal/activePinModalSlice";

import { doc, getFirestore, onSnapshot } from "firebase/firestore";
import { app } from "../../firebase";
import { useAuth } from '../../context/authContext'; // Import the useAuth hook
import CustomPin from "./customPin";
const CustomizedMarker = ({ lat, lng, pinID, userLocation, pin, category }: { category: Category, pin: any, lat: number, lng: number, pinID: string, userLocation: { lat: number; lng: number; } }) => {
  const [markerRef, marker] = useAdvancedMarkerRef();
  const [toggleIWM, settoggleIWM] = useState(false);
  const [showInfoWindow, setShowInfoWindow] = useState(false);
  const selectedList = useSelector(selectSelectedList);
  const [allListPins, setallListPins] = useState<string[]>([]);
  const { user } = useAuth();
  const dispatch = useDispatch();
  const activePinID = useSelector(selectActivePin);
  const isActive = activePinID === pinID;

  const handleClick = () => {
    dispatch(setActivePin(isActive ? null : pinID)); // Toggle modal
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
        setallListPins(fetchedList.pins.map((pin: { id: string }) => pin.id));
      } else {
        setallListPins([]);
      }
    });

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [selectedList, user.uid]);

  const pinInList = allListPins.includes(pinID);
  var backgroundColor = allListPins.length == 0 || pinInList ? '100%' : '10%';





  return (
    <>
      <AdvancedMarker
        position={{ lat, lng }}
        ref={markerRef}
        onClick={handleClick}
        onMouseEnter={() => setShowInfoWindow(true)}
        onMouseLeave={() => setShowInfoWindow(false)}>

        <CustomPin category={category} backgroundColor={backgroundColor} />
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
      {isActive && (
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
