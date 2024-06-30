import React, { useEffect, useState } from 'react'
import styles from "../Sass/sidebar.module.scss";
import { useSelector, useDispatch } from 'react-redux';
import { selectPins } from '../store/pins/pinsSlice.ts';
import { selectCategories } from '../store/categories/categoriesSlice'
import { Pin } from '../types/pinData.ts';
import PinItem from '../components/pinItem.tsx'; 
import AddCategoryModal from '../components/addCategoryModal.tsx'; // Import the addCategoryModal component
import { Category } from '../types/categoryData.ts';
import { fetchCategories } from '../store/categories/categoriesSlice.ts'; // Import the AppThunk type
import { AppDispatch } from '../store/store.ts'; // Import the AppDispatch type
import { RiArrowRightDoubleFill } from "react-icons/ri";
import { HiOutlineArrowsExpand } from "react-icons/hi";
import FullScreen from '../components/FullScreen.tsx';

function Sidebar() {
    const [toggle, setToggle] = useState(false)
    const [extend, setextend] = useState(false)
    const [fullScreen, setfullScreen] = useState(false)
    const [selectedCategory, setSelectedCategory] = useState<null | string>("Place");
    const pins = useSelector(selectPins);
    const categories = useSelector(selectCategories);
    const [toggleunNvisted, settoggleunNvisted] = useState<null | Boolean>(null)
    const dispatch: AppDispatch = useDispatch(); // Use the typed version of useDispatch



    var filteredPins
   
     filteredPins = selectedCategory ? pins.filter(pin => pin.category === selectedCategory) : pins;
     filteredPins = toggleunNvisted != null ? filteredPins.filter(pin => pin.visited === toggleunNvisted) : filteredPins;



    useEffect(() => {
        dispatch(fetchCategories())
     
    }, [selectedCategory, pins, dispatch])
    
    return (
        <>
        <main className={styles.main} style={{ left: extend ? '0vw' : '-32vw' }}>
            
            <div className={styles.categories}>

                {categories.map((category: Category, index: number) => 
                <div key={index} onClick={() => setSelectedCategory(category.categoryName)}>{category.categoryName}</div>)}
                <div onClick={() => setSelectedCategory(null)}>Show All</div>
                <button onClick={() => setToggle(true)}>Add  Category</button>
            </div>
            <div className={styles.pinItems}>
                <div className={styles.unNvisitedButtons}>
                    <button style={{backgroundColor: toggleunNvisted == true ? "black" : "white"}}    onClick={() => toggleunNvisted === true ? settoggleunNvisted(null) : settoggleunNvisted(true)}>Visited</button>
                    <button  style={{backgroundColor: toggleunNvisted == false ? "black" : "white"}} onClick={() => toggleunNvisted === false ? settoggleunNvisted(null) : settoggleunNvisted(false)}>Unvisited</button>
                </div>
                {filteredPins.map((pin: Pin, index: number) => <PinItem key={index} pin={pin} />)}
            </div>
            <div className={styles.rightExtender} >
                <div onClick={() => {setextend(!extend)}}><RiArrowRightDoubleFill/></div>
                <div onClick={() => {setfullScreen(true)}}><HiOutlineArrowsExpand/></div>
            </div>
        </main>
         {toggle && <AddCategoryModal setToggle={setToggle}/>} 
         {fullScreen && <FullScreen setfullScreen={setfullScreen}/>} 
         </>
    )
}

export default Sidebar;