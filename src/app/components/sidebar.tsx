import React, { useState } from 'react'
import styles from "../Sass/sidebar.module.scss";
import { useSelector } from 'react-redux';
import { selectPins } from '../store/pins/pinsSlice.ts';
import { selectCategories } from '../store/categories/categoriesSlice'

import { Pin } from '../types/pinData.ts';
import PinItem from '../components/pinItem.tsx'; 
import AddCategoryModal from '../components/addCategoryModal.tsx'; // Import the addCategoryModal component


function Sidebar() {
    const [toggle, setToggle] = useState(false)
    const [extend, setextend] = useState(false)
    const pins = useSelector(selectPins);
    const categories = useSelector(selectCategories);
    return (
        <>
        <main className={styles.main} style={{ left: extend ? '0vw' : '-32vw' }}>
            <div>
                {categories.map((category: string, index: number) => <div key={index}>{category}</div>)}
                <button onClick={() => setToggle(true)}>Add  Category</button>
            </div>
            <div >
                {pins.map((pin: Pin, index: number) => <PinItem key={index} pin={pin} />)}
            </div>
            <div className={styles.rightExtender} onClick={() => {setextend(!extend)}}>
                Side
            </div>

           
        </main>
         {toggle && <AddCategoryModal setToggle={setToggle}/>} 
         </>
    )
}

export default Sidebar;