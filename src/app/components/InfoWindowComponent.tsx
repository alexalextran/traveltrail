import React from 'react'
import styles from "../Sass/infoWindow.module.scss";


export default function InfoWindowComponent({ filteredPin, settoggleIWM}: { filteredPin: any, settoggleIWM: any}) {

   
 
    
  return (
    <>
  
    <main>
        <h1>{filteredPin.title}</h1>
        {filteredPin.description && <p>{filteredPin.description}</p>}
        {filteredPin.category}
        <button onClick={()=> settoggleIWM(true)}>Click To Expand</button>
    </main>
  
    </>
  )
}
