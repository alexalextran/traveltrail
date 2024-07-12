import React, { useState } from "react";
import { AdvancedMarker, Pin, InfoWindow, useAdvancedMarkerRef } from "@vis.gl/react-google-maps";
import styles from "../Sass/infoWindow.module.scss";
import InfoWindowComponent from "./InfoWindowComponent";
import ExpandedInfoModal from "../components/expandedInfoModal";
import { useSelector } from 'react-redux';
import { selectPins } from '../store/pins/pinsSlice';
import { selectCategories } from '../store/categories/categoriesSlice';
import { Category } from "../types/categoryData";

const CustomizedMarker = ({ lat, lng, pinID, userLocation }: { lat: number, lng: number, pinID: string, userLocation: { lat: number; lng: number; } }) => {
  const [markerRef, marker] = useAdvancedMarkerRef();
  const [toggleIWM, settoggleIWM] = useState(false);
  const [showInfoWindow, setShowInfoWindow] = useState(false);

  const handleClick = () => {
    setShowInfoWindow(prevState => !prevState);
  };

  const pins = useSelector(selectPins);
  const categories = useSelector(selectCategories);

  const filteredPin = pins.find(pin => pin.id === pinID);
  const filteredCategory = categories.find(category => category.categoryName === filteredPin?.category) as Category;
  console.log("I was rendered")
  return (
    <>
      <AdvancedMarker position={{ lat, lng }} ref={markerRef} onClick={handleClick}>
        <Pin background={filteredCategory?.categoryColor} glyphColor={'#000'} borderColor={'#000'} />
        {showInfoWindow && (
          <InfoWindow anchor={marker} className={styles.infoWindow}>
            <InfoWindowComponent
              setShowInfoWindow={setShowInfoWindow}
              userLocation={userLocation}
              filteredPin={filteredPin}
              settoggleIWM={settoggleIWM}
              filteredCategory={filteredCategory}
            />
          </InfoWindow>
        )}
      </AdvancedMarker>
      {toggleIWM && (
        <ExpandedInfoModal
          pin={filteredPin}
          settoggleIWM={settoggleIWM}
          userLocation={userLocation}
          filteredCategory={filteredCategory}
        />
      )}
    </>
  );
};

export default React.memo(CustomizedMarker);
