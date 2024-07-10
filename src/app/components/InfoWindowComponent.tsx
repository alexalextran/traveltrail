import React from 'react';
import styles from "../Sass/infoWindow.module.scss";
import { Category } from '../types/categoryData';
import { useMapsLibrary, useMap } from '@vis.gl/react-google-maps';

interface InfoWindowProps {
  filteredPin: any;
  settoggleIWM: any;
  filteredCategory: Category;
  setShowInfoWindow: (value: boolean) => void;
  userLocation: { lat: number, lng: number };
}

export default function InfoWindowComponent({ setShowInfoWindow, filteredPin, settoggleIWM, filteredCategory, userLocation }: InfoWindowProps) {
  const handleClick = () => {
    settoggleIWM(true);
    setShowInfoWindow(false)
  };

  const geometryLibrary = useMapsLibrary('geometry');
  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
    if (!geometryLibrary) {
      console.error('geometry library not loaded.');
      return 0;
    }

    const from = new google.maps.LatLng(lat1, lng1);
    const to = new google.maps.LatLng(lat2, lng2);
    
    return google.maps.geometry.spherical.computeDistanceBetween(from, to) / 1000; // Distance in km
  };

  const distanceToUser = calculateDistance(filteredPin.lat, filteredPin.lng, userLocation.lat, userLocation.lng);

  return (
    <main className={styles.main}>
      <h1>{filteredPin.title}</h1>
      <div>
        <div className={styles.category} style={{ backgroundColor: filteredCategory.categoryColor, border: `2px solid ${filteredCategory.categoryColor}`}}>{filteredPin.category}</div>
        <p>{distanceToUser.toFixed(2)}KM Away</p>
      </div>
     
      <button className={styles.expandButton} onClick={handleClick}>Click To Expand</button>
    </main>
  );
}
