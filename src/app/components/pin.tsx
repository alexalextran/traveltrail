import React, { useState } from "react";
import { AdvancedMarker, Pin, InfoWindow, useAdvancedMarkerRef } from "@vis.gl/react-google-maps";
import styles from "../Sass/infoWindow.module.scss";
import InfoWindowComponent from "./InfoWindowComponent";
import ExpandedInfoModal from "../components/expandedInfoModal";
import { useSelector } from 'react-redux';
import { selectPins } from '../store/pins/pinsSlice';
import { selectCategories } from '../store/categories/categoriesSlice';
import { Category } from "../types/categoryData";

const CustomizedMarker = ({ lat, lng, pinID, userLocation, pin, category}: {category: Category, pin: any, lat: number, lng: number, pinID: string, userLocation: { lat: number; lng: number; } }) => {
  const [markerRef, marker] = useAdvancedMarkerRef();
  const [toggleIWM, settoggleIWM] = useState(false);
  const [showInfoWindow, setShowInfoWindow] = useState(false);

  const handleClick = () => {
    setShowInfoWindow(prevState => !prevState);
  };


  console.log("I was rendered")
  return (
    <>
      <AdvancedMarker position={{ lat, lng }} ref={markerRef} onClick={handleClick}>
        <Pin background={category?.categoryColor} glyphColor={'#000'} borderColor={'#000'} />
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
