import React from 'react'
import styles from "../Sass/infoWindow.module.scss";
import { useSelector } from 'react-redux';
import { selectPins } from '../store/pins/pinsSlice.ts';
import { Pin } from '../types/pinData.ts';

export default function InfoWindowComponent({lat, lng}: {lat: number, lng: number}) {


    const pins = useSelector(selectPins);
    const filteredPin:Pin = pins.filter(pin => pin.lat === lat && pin.lng === lng)[0];

    
  return (
    <main>
        <h1>{filteredPin.title}</h1>
        {filteredPin.description && <p>{filteredPin.description}</p>}
        {filteredPin.category}

    </main>
  )
}
