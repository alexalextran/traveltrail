import { AdvancedMarker, Pin, InfoWindow, useAdvancedMarkerRef } from "@vis.gl/react-google-maps";
import { useState } from "react";
import styles from "../Sass/infoWindow.module.scss";
import InfoWindowComponent from "./InfoWindowComponent";
const CustomizedMarker = ({lat, lng, key, pinID}: {lat: number, lng: number, pinID:string}) => {
  const [markerRef, marker] = useAdvancedMarkerRef();
  const [showInfoWindow, setShowInfoWindow] = useState(false);
  const handleClick = () => {
    setShowInfoWindow(prevState => !prevState);
  };

  return (
    <AdvancedMarker position={{lat: lat, lng: lng}} ref={markerRef} onClick={handleClick}>
      <Pin background={'#FBBC04'} glyphColor={'#000'} borderColor={'#000'} />
      {showInfoWindow && <InfoWindow  anchor={marker} className={styles.infoWindow}><InfoWindowComponent pinID={pinID}  lng={lng} lat={lat} /></InfoWindow>}
    </AdvancedMarker>
  );
};

export default CustomizedMarker;