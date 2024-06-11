import React, { useState } from 'react'
import styles from "../Sass/sidebar.module.scss";

export default function Sidebar() {
    const [extend, setextend] = useState(false)

return (
 
    <main className={styles.main} style={{ left: extend ? '0vw' : '-32vw' }}>
            <div >
                    Main
            </div>
            <div className={styles.rightExtender} onClick={() => {setextend(!extend)}}>
                    Side
            </div>
    </main>
)
}
