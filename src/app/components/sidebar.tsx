import React, { useState } from 'react'
import styles from "../Sass/sidebar.module.scss";
import { useSelector } from 'react-redux';
import { selectPins } from '../store/pins/pinsSlice.ts';
import { Pin } from '../types/pinData.ts';
import PinItem from '../components/pinItem.tsx'; 

function Sidebar() {
    const [extend, setextend] = useState(false)
    const pins = useSelector(selectPins);

    return (
        <main className={styles.main} style={{ left: extend ? '0vw' : '-32vw' }}>
            <div>
                {pins.map((pin: Pin, index: number) => <PinItem key={index} pin={pin} />)}
            </div>
            <div className={styles.rightExtender} onClick={() => {setextend(!extend)}}>
                Side
            </div>
        </main>
    )
}

export default Sidebar;