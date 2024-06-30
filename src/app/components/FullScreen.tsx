import React from 'react'
import styles from "../Sass/FullScreen.module.scss";


export default function FullScreen({setfullScreen}: {setfullScreen: any}) {
  return (
    <main className={styles.main}>
        <div className={styles.header}>
        <h1>Travel Trail</h1>
        <button className={styles.exitButton} onClick={() => setfullScreen(false)}>X</button>
      
        </div>
       



    </main>
  )
}
