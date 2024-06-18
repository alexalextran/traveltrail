import React, {useState} from 'react'
import styles from "../Sass/infoWindow.module.scss";
import { useSelector } from 'react-redux';
import { selectPins } from '../store/pins/pinsSlice.ts';
import { Pin } from '../types/pinData.ts';
import ExpandedInfoModal from './expandedInfoModal.tsx';

export default function InfoWindowComponent({lat, lng, pinID}: {lat: number, lng: number, pinID: string}) {
const [toggleIWM, settoggleIWM] = useState(false)

    const pins = useSelector(selectPins);
    const filteredPin:Pin = pins.filter(pin => pin.id == pinID)[0];
  console.log(pinID)
    
  return (
    <>
  
    <main>
        <h1>{filteredPin.title}</h1>
        {filteredPin.description && <p>{filteredPin.description}</p>}
        {filteredPin.category}
        <button onClick={()=> settoggleIWM(true)}>Click To Expand</button>
    </main>
    {toggleIWM && <ExpandedInfoModal pin={filteredPin} />} 
    </>
  )
}
