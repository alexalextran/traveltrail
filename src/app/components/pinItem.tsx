import React, { useState } from 'react'
import { Pin } from '../types/pinData'
import styles from '../Sass/pinItem.module.scss'
import ImgUpload from './imgUpload'

function PinItem({ pin }: { pin: Pin }) {
    const [show, setshow] = useState(false)
    console.log(pin)
  return (
    <main className={styles.main}>
        <div><h3>{pin.title}</h3></div>
       
        <div>
        <div>{pin.address}</div>
        <div>{pin.category}</div>
        </div>

        {
            pin.description && <button onClick={() => setshow(!show)}>Show</button>
            
        }
        <button>Show Pictures</button>
        <ImgUpload pinID={pin.id}/>

        {show && <div>{pin.description}</div> }
        {pin.imageKeys && pin.imageKeys.map((image, index) => <img key={index} src={image} alt={`pin ${index}`} />)}    </main>
  )
}

export default PinItem;