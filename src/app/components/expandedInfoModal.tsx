import React from 'react'
import { Pin } from '../types/pinData'
import styles from '../Sass/expandedInfoModal.module.scss'

export default function ExpandedInfoModal({pin, settoggleIWM}: {pin: Pin, settoggleIWM: any}) {
  return (
    <main className={styles.main}>
      <button onClick={() => settoggleIWM(false)}>Close</button>
      <h1>{pin.title}</h1>
      <h5>{pin.category}</h5>
      <p>{pin.address}</p>
      <p>{pin.visited}</p>
      <p>{pin?.description}</p>
      <img src={pin?.imageKeys}/>
    </main>
  )
}
