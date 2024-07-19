import React, { useEffect, useState } from 'react';
import styles from "../Sass/sidebar.module.scss";
import { useSelector, useDispatch } from 'react-redux';
import { selectPins } from '../store/pins/pinsSlice';
import { selectCategories } from '../store/categories/categoriesSlice';
import { Pin } from '../types/pinData';
import PinItem from '../components/pinItem';
import AddCategoryModal from '../components/addCategoryModal';
import { Category } from '../types/categoryData';
import { fetchCategories } from '../store/categories/categoriesSlice';
import { AppDispatch } from '../store/store';
import { RiArrowRightDoubleFill } from "react-icons/ri";
import { HiOutlineArrowsExpand } from "react-icons/hi";
import FullScreenComponent from '../components/FullScreen';
import { selectFullScreen } from '../store/toggleModals/toggleModalSlice';
import { toggleFullScreen, toggleEditModal, toggleAddModal } from '../store/toggleModals/toggleModalSlice';
import { useAuth } from '../context/authContext';
import { collection, getFirestore, onSnapshot } from 'firebase/firestore';
import { app } from "../firebase"; // Ensure this path is correct

function Sidebar() {
    const [toggle, setToggle] = useState(false);
    const [extend, setExtend] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<null | string>(null);
    const pins = useSelector(selectPins);
    const [toggleUnvisited, setToggleUnvisited] = useState<null | boolean>(null);
    const dispatch: AppDispatch = useDispatch();
    const fullScreen = useSelector(selectFullScreen);
    const { user } = useAuth();
    const [categories, setcategories] = useState<Category[]>([]);

    let filteredPins = selectedCategory ? pins.filter(pin => pin.category === selectedCategory) : pins;
    filteredPins = toggleUnvisited != null ? filteredPins.filter(pin => pin.visited === toggleUnvisited) : filteredPins;

    useEffect(() => {
        const db = getFirestore(app);
        const listCollectionRef = collection(db, `users/${user.uid}/categories`);
        const unsubscribe = onSnapshot(listCollectionRef, (snapshot) => {
            const fetchedCategories = snapshot.docs.map(doc => ({
                CategoryID: doc.id,
                categoryName: doc.data().categoryName,
                categoryColor: doc.data().categoryColor // Fix the typo in the property name
            }));
            setcategories(fetchedCategories);
        });
    
        return () => unsubscribe(); // Clean up the subscription
    }, []);

    return (
        <>
            <main className={styles.main} style={{ left: extend ? '0vw' : '-32vw' }}>
                <div className={styles.categories}>

                <div className={styles.addCategoryBtn} onClick={() => setToggle(true)}>Add Category</div>

                <div
                        onClick={() => setSelectedCategory(null)}
                        style={{
                            backgroundColor: selectedCategory === null ? 'rgb(0,123,255)' : undefined,
                            color: selectedCategory === null ? 'white' : undefined
                        }}
                    >
                        Show All
                    </div>


                    
                    {categories.map((category: Category) => (
                        <div
                            key={category.CategoryID}
                            onClick={() => setSelectedCategory(category.categoryName)}
                            style={{
                                backgroundColor: selectedCategory === category.categoryName ? 'rgb(0,123,255)' : undefined,
                                color: selectedCategory === category.categoryName ? 'white' : undefined
                            }}
                        >
                            {category.categoryName}
                        </div>
                    ))}
                    
                 
                </div>
                <div className={styles.pinItems}>
                    <div className={styles.unNvisitedButtons}>
                        <button
                            style={{ backgroundColor: toggleUnvisited === true ? "lightGrey" : "white" }}
                            onClick={() => toggleUnvisited === true ? setToggleUnvisited(null) : setToggleUnvisited(true)}
                        >
                            Visited
                        </button>
                        <button
                            style={{ backgroundColor: toggleUnvisited === false ? "lightGrey" : "white" }}
                            onClick={() => toggleUnvisited === false ? setToggleUnvisited(null) : setToggleUnvisited(false)}
                        >
                            Unvisited
                        </button>
                    </div>
                    {filteredPins.map((pin: Pin, index: number) => <PinItem key={index} pin={pin} />)}
                </div>
                <div className={styles.rightExtender}>
                    <div onClick={() => { setExtend(!extend) }} className={extend ? styles.rotated : ''}><RiArrowRightDoubleFill /></div>
                    <div onClick={() => {
                        dispatch(toggleFullScreen(true));
                        dispatch(toggleEditModal(false));
                        dispatch(toggleAddModal(false));
                    }}><HiOutlineArrowsExpand /></div>
                </div>
            </main>
            {toggle && <AddCategoryModal setToggle={setToggle} />}
            {fullScreen && <FullScreenComponent pins={pins} categories={categories} />}
        </>
    );
}

export default Sidebar;