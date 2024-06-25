import React from 'react'
import { Pin } from '../types/pinData'
import styles from '../Sass/expandedInfoModal.module.scss'
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

export default function ExpandedInfoModal({pin, settoggleIWM}: {pin: Pin, settoggleIWM: any}) {
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
  return (
    <main className={styles.main}>
      <button onClick={() => settoggleIWM(false)}>Close</button>
      <h1>{pin.title}</h1>
      <h5>{pin.category}</h5>
      <p>{pin.address}</p>
      <p>{pin.visited}</p>
      <p>{pin?.description}</p>
      {pin.imageUrls && 
      <Carousel responsive={responsiveConfig}>
        { pin.imageUrls.map((src, index) => <img key={index} src={src} alt=""/>)}
      </Carousel>}
      
    </main>
  )
}
