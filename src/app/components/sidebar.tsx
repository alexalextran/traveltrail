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
import FullScreenComponent from '../components/FullScreen.tsx';
import { selectFullScreen } from '../store/toggleModals/toggleModalSlice.ts';
import { toggleFullScreen, toggleEditModal, toggleAddModal } from '../store/toggleModals/toggleModalSlice.ts';
import { useAuth } from '../context/authContext'; // Import the useAuth hook

function Sidebar() {
    const [toggle, setToggle] = useState(false)
    const [extend, setextend] = useState(false)
    const [selectedCategory, setSelectedCategory] = useState<null | string>(null);
    const pins = useSelector(selectPins);
    const categories = useSelector(selectCategories);
    const [toggleunNvisted, settoggleunNvisted] = useState<null | Boolean>(null)
    const dispatch: AppDispatch = useDispatch(); // Use the typed version of useDispatch
    const FullScreen = useSelector(selectFullScreen);
    const { user } = useAuth(); // Use the useAuth hook



    var filteredPins
   
     filteredPins = selectedCategory ? pins.filter(pin => pin.category === selectedCategory) : pins;
     filteredPins = toggleunNvisted != null ? filteredPins.filter(pin => pin.visited === toggleunNvisted) : filteredPins;



    useEffect(() => {
        dispatch(fetchCategories(user.uid))
     
    }, [selectedCategory, pins, dispatch])
    
    return (
        <>
        <main className={styles.main} style={{ left: extend ? '0vw' : '-32vw' }}>
            
            <div className={styles.categories}>

                {categories.map((category: Category, index: number) => 
                <div key={index} onClick={() => setSelectedCategory(category.categoryName)} style={{backgroundColor: selectedCategory === category.categoryName && 'rgb(0,123,255)', color: selectedCategory === category.categoryName && 'white'}}>{category.categoryName}</div>)}
                <div onClick={() => setSelectedCategory(null)} style={{backgroundColor: selectedCategory === null && 'rgb(0,123,255)', color: selectedCategory === null&& 'white'}}>Show All</div>
                <button onClick={() => setToggle(true)}>Add  Category</button>
            </div>
            <div className={styles.pinItems}>
                <div className={styles.unNvisitedButtons}>
                    <button style={{backgroundColor: toggleunNvisted == true ? "lightGrey" : "white"}}    onClick={() => toggleunNvisted === true ? settoggleunNvisted(null) : settoggleunNvisted(true)}>Visited</button>
                    <button  style={{backgroundColor: toggleunNvisted == false ? "lightGrey" : "white"}} onClick={() => toggleunNvisted === false ? settoggleunNvisted(null) : settoggleunNvisted(false)}>Unvisited</button>
                </div>
                {filteredPins.map((pin: Pin, index: number) => <PinItem key={index} pin={pin} />)}
            </div>
            <div className={styles.rightExtender} >
                <div onClick={() => {setextend(!extend)}}  className={extend ? styles.rotated : ''}><RiArrowRightDoubleFill/></div>
                <div onClick={() => {  
                    dispatch(toggleFullScreen(true))
                    dispatch(toggleEditModal(false))
                    dispatch(toggleAddModal(false))
                    }}><HiOutlineArrowsExpand/></div>
            </div>
        </main>
         {toggle && <AddCategoryModal setToggle={setToggle}/>} 
         {FullScreen && <FullScreenComponent pins={pins} categories={categories}/>} 
         </>
    )
}

export default Sidebar;