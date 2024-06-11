import React, { useState } from 'react'
import Draggable from 'react-draggable';
import styles from "../Sass/modal.module.scss";
export default function Modal() {
    const [toggle, settoggle] = useState(false)
return (
    <>
    <button className={styles.button} onClick={() => {settoggle(!toggle)}}>
        <p>+</p>
    </button>
    {   toggle &&
    <Draggable 
        defaultPosition={{x: window.innerWidth / 2, y: window.innerHeight / 2}}
    >
        <div className={styles.modal}>
            modal
        </div>
    </Draggable> } 
    
    
    </>
)
}
