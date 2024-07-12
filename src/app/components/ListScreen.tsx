// ListScreen.tsx
import React, { useState, useEffect } from 'react';
import styles from '../Sass/ListScreen.module.scss';
import { Pin } from '../types/pinData';
import { Category } from '../types/categoryData';
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import Modal from '../components/modal.tsx';
import { toggleEditModal, toggleListScreen } from '../store/toggleModals/toggleModalSlice.ts';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../store/store.ts'; // Import the AppDispatch type
import CategoryComponent from '../components/CategoryComponent.tsx';
import { ToastContainer, toast } from 'react-toastify';
import { selectPins } from '../store/pins/pinsSlice';
import { selectCategories } from '../store/categories/categoriesSlice';
import ManageLists from './ManageLists.tsx';
import { getFirestore, collection, onSnapshot } from 'firebase/firestore';
import { app } from "../firebase"; // Ensure this path is correct
import ListDnD from './ListDnd.tsx';
import PinCard from './PinCard.tsx';

function ListScreen() {
    const dispatch: AppDispatch = useDispatch(); // Use the typed version of useDispatch
    const pins = useSelector(selectPins);
    const categories = useSelector(selectCategories);
    const [lists, setLists] = useState<{ id: string; listName: string; }[]>([]);
    const [child, setchild] = useState(<Modal/>);
    const [selectedList, setSelectedList] = useState<string>(''); // Add this line

    useEffect(() => {
        const db = getFirestore(app);
        const listCollectionRef = collection(db, 'users/alextran/lists');
        const unsubscribe = onSnapshot(listCollectionRef, (snapshot) => {
            const fetchedLists = snapshot.docs.map(doc => ({
                id: doc.id,
                listName: doc.data().listName,
            }));
            setLists(fetchedLists);
        });

        return () => unsubscribe(); // Clean up the subscription
    }, []);

    const responsiveConfig = {
        superLargeDesktop: {
            breakpoint: { max: 4000, min: 3000 },
            items: 1
        },
        desktop: {
            breakpoint: { max: 3000, min: 1024 },
            items: 1
        },
        tablet: {
            breakpoint: { max: 1024, min: 464 },
            items: 1
        },
        mobile: {
            breakpoint: { max: 464, min: 0 },
            items: 1
        }
    };

    return (
        <>
            <main className={styles.main}>
                <div className={styles.header}>
                    <h1>Lists</h1>
                    <button className={styles.exitButton} onClick={() => {
                        dispatch(toggleListScreen(false))
                        dispatch(toggleEditModal(false))
                    }}>X</button>
                </div>
                <div className={styles.content}>
                    <div className={styles.categories}>
                        {categories.map((category: Category, index: number) => (
                            <CategoryComponent key={index} category={category} />
                        ))}
                    </div>
                    <div className={styles.pins}>
                        {pins.map((pin: Pin, index: number) => {
                            const pinCategory = categories.find(category => category.categoryName === pin.category);
                            const categoryColor = pinCategory ? pinCategory.categoryColor : 'black';
                            return (
                                <PinCard
                                    key={index}
                                    pin={pin}
                                    responsiveConfig={responsiveConfig}
                                    categoryColor={categoryColor}
                                />
                            );
                        })}
                    </div>
                    <div className={styles.form}>
                        <div className={styles.formBar}>
                            <select 
                            onClick={() => setchild(<ListDnD listId={selectedList}/>)}
                            value={selectedList} // Add this line
                            onChange={(e) => setSelectedList(e.target.value)}
                            >
                                <option value="">Choose a list</option>
                                {lists.map(list => (
                                    <option key={list.id} value={list.id}>{list.listName}</option>
                                ))}
                            </select>
                            <button onClick={() => setchild(<ManageLists />)}>Manage Lists</button>
                        </div>
                        {child}
                    </div>
                </div>
            </main>
        </>
    );
}

export default ListScreen;
