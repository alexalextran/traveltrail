import React, { useState } from 'react'
import { Pin } from '../types/pinData'
import styles from '../Sass/pinItem.module.scss'
import ImgUpload from './imgUpload'

function PinItem({ pin }: { pin: Pin }) {
    const [show, setshow] = useState(false)
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
      
        <ImgUpload pinID={pin.id}/>

        {show && <div>{pin.description}</div> }
          </main>
  )
}

export default PinItem;