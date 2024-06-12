import React from 'react'
import { Pin } from '../types/pinData'
import styles from '../Sass/pinItem.module.scss'

function PinItem({ pin }: { pin: Pin }) {
  return (
    <main className={styles.main}>
        <div><h3>{pin.title}</h3></div>
       
        <div>
        <div>{pin.address}</div>
        <div>{pin.category}</div>
        {/* <div>{pin?.description}</div>  */}
        </div>
    </main>
  )
}

export default PinItem;