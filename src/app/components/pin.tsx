import { AdvancedMarker, Pin, InfoWindow, useAdvancedMarkerRef } from "@vis.gl/react-google-maps";
import { useState } from "react";
import styles from "../Sass/infoWindow.module.scss";
import InfoWindowComponent from "./InfoWindowComponent";
import ExpandedInfoModal from "../components/expandedInfoModal";
import { useSelector } from 'react-redux';
import { selectPins } from '../store/pins/pinsSlice.ts'; // Import the ExpandedInfoModal component


const CustomizedMarker = ({lat, lng, pinID, userLocation}: {lat: number, lng: number, pinID:string, userLocation: { lat: number; lng: number; }}) => {
  const [markerRef, marker] = useAdvancedMarkerRef();
  const [toggleIWM, settoggleIWM] = useState(false)

  const [showInfoWindow, setShowInfoWindow] = useState(false);
  const handleClick = () => {
    setShowInfoWindow(prevState => !prevState);
  };


  const pins = useSelector(selectPins);
  const filteredPin:any = pins.filter(pin => pin.id == pinID)[0];

  return (
    <>
    <AdvancedMarker position={{lat: lat, lng: lng}} ref={markerRef} onClick={handleClick}>
      <Pin background={'#FBBC04'} glyphColor={'#000'} borderColor={'#000'} />
      {showInfoWindow && <InfoWindow  anchor={marker} className={styles.infoWindow}><InfoWindowComponent filteredPin={filteredPin} settoggleIWM={settoggleIWM}   /></InfoWindow>}
      
    </AdvancedMarker>
     {toggleIWM && <ExpandedInfoModal pin={filteredPin} settoggleIWM={settoggleIWM}  userLocation={userLocation}/> }
    </>
  );
};

export default CustomizedMarker;