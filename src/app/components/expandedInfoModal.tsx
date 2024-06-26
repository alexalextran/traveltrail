import React from 'react'
import { Pin } from '../types/pinData'
import styles from '../Sass/expandedInfoModal.module.scss'
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { useMapsLibrary, useMap } from '@vis.gl/react-google-maps';

export default function ExpandedInfoModal({pin, settoggleIWM, userLocation}: {pin: Pin, settoggleIWM: any, userLocation: { lat: number, lng: number }}) {
  const responsiveConfig = {
    superLargeDesktop: {
      // the naming can be any, depends on you.
      breakpoint: { max: 4000, min: 3000 },
      items: 5
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1
    
  }
  }

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

  const distanceToUser = calculateDistance(pin.lat, pin.lng, userLocation.lat, userLocation.lng);
  
  return (
    <main className={styles.main}>
      <button onClick={() => settoggleIWM(false)}>Close</button>
      <h1>{pin.title}</h1>
      <h5>{pin.category}</h5>
      <p>{pin.address}</p>
      <p>{distanceToUser.toFixed(2)}KM Away</p>
      <p>{pin.visited}</p>
      <p>{pin?.description}</p>
      {pin.imageUrls && 
      <Carousel responsive={responsiveConfig}>
        { pin.imageUrls.map((src, index) => <img key={index} src={src} alt=""/>)}
      </Carousel>}
      
    </main>
  )
}
