import React from 'react'
import { Pin } from '../../types/pinData.ts'
import { Category } from '../../types/categoryData.ts'
import styles from '../../Sass/expandedInfoModal.module.scss'
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { useMapsLibrary } from '@vis.gl/react-google-maps';
import IconBar from '../ImageComponents/IconBar.tsx';
import { Rating } from 'react-simple-star-rating';

export default function ExpandedInfoModal({pin, settoggleIWM, userLocation, filteredCategory}: {filteredCategory: Category, pin: Pin, settoggleIWM: any, userLocation: { lat: number, lng: number }}) {
  const responsiveConfig = {
    superLargeDesktop: {
      // the naming can be any, depends on you.
      breakpoint: { max: 4000, min: 3000 },
      items: 1
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 1
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 1
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
    <main className={styles.main} >
      <div className={styles.header} >
      <h1>{pin.title}</h1>
      <button onClick={() => settoggleIWM(false)}>Close</button>
      </div>

      <div className={styles.content}>
        <div className={styles.info}>
          <div>
          <p className={styles.address}>{pin.address}</p>
          <p><span>{distanceToUser.toFixed(2)}</span>KM Away</p>
          {pin.website && <a href={pin.website} target='_blank'>Check Link</a>}
          </div>

          <div>
           { pin.rating != 0 && pin.rating && <Rating initialValue={pin.rating} readonly></Rating>}
          <p>{pin?.openingHours}</p>
          </div>
        
        </div>
      
      <div className={styles.expandedModalTags}>
      <p style={{ backgroundColor: filteredCategory.categoryColor, border: `2px solid ${filteredCategory.categoryColor}`}}>{pin.category}</p>
      <p>{pin.visited ? "Visited" : "Unvisited"}</p>
      </div>
     { pin.description && <p className={styles.description}>{pin?.description}</p>}
      </div>
     
      <div className={styles.footer}>
      {pin.imageUrls && 
      <Carousel responsive={responsiveConfig} className={styles.carouselcontainer}>
        { pin.imageUrls.map((src, index) => <img key={index} src={src} alt=""/>)}
      </Carousel>}
        <IconBar enableImage={false} pin={pin} setchild={null} color={filteredCategory.categoryColor}/>
      </div>
      
    </main>
  )
}
