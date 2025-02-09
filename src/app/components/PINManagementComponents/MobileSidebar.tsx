// MobileSidebar.tsx
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Pin } from '../../types/pinData';
import PinItem from './pinItem';
import AddCategoryModal from './addCategoryModal';
import { Category } from '../../types/categoryData';
import { AppDispatch } from '../../store/store';
import { RiMenuLine, RiCloseLine } from "react-icons/ri";
import { selectFullScreen } from '../../store/toggleModals/toggleModalSlice';
import { toggleFullScreen, toggleEditModal, toggleAddModal } from '../../store/toggleModals/toggleModalSlice';
import { useAuth } from '../../context/authContext';
import { collection, getFirestore, onSnapshot } from 'firebase/firestore';
import { app } from "../../firebase";
import { useTransition, animated } from '@react-spring/web';
import styles from '../../Sass/MobileSidebar.module.scss';

function MobileSidebar({ pins }: { pins: Pin[] }) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<null | string>(null);
    const [toggleUnvisited, setToggleUnvisited] = useState<null | boolean>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddCategory, setShowAddCategory] = useState(false);
    const dispatch: AppDispatch = useDispatch();
    const fullScreen = useSelector(selectFullScreen);
    const { user } = useAuth();
    const [categories, setCategories] = useState<Category[]>([]);

    let filteredPins = selectedCategory ? pins.filter(pin => pin.category === selectedCategory) : pins;
    filteredPins = toggleUnvisited != null ? filteredPins.filter(pin => pin.visited === toggleUnvisited) : filteredPins;
    filteredPins = filteredPins.filter(pin => pin.title.toLowerCase().includes(searchTerm.toLowerCase()));

    useEffect(() => {
        const db = getFirestore(app);
        const listCollectionRef = collection(db, `users/${user.uid}/categories`);
        const unsubscribe = onSnapshot(listCollectionRef, (snapshot) => {
            const fetchedCategories = snapshot.docs.map(doc => ({
                CategoryID: doc.id,
                categoryName: doc.data().categoryName,
                categoryColor: doc.data().categoryColor,
                categoryEmoji: doc.data().categoryEmoji
            }));
            setCategories(fetchedCategories);
        });
    
        return () => unsubscribe(); 
    }, []);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const transitions = useTransition(filteredPins, {
        from: { opacity: 0, y: -20 },
        enter: { opacity: 1, y: 0 },
        leave: { opacity: 0, y: -20 },
        config: { tension: 200, friction: 20 },
        keys: (pin: Pin) => pin.id,
    });

    return (
        <>
            <button 
                className={styles.mobileSidebarToggle}
                onClick={() => setIsOpen(!isOpen)}
            >
                {isOpen ? <RiCloseLine size={24} /> : <RiMenuLine size={24} />}
            </button>

            <div className={`${styles.mobileSidebar} ${isOpen ? styles.open : ''}`}>
                <div className={styles.mobileSidebarContent}>
                    

                    <div className={styles.pinsSection}>
                       
                        
                        <input
                            type="text"
                            placeholder="Search By Title"
                            value={searchTerm}
                            onChange={handleSearchChange}
                            className={styles.searchInput}
                        />

                        <div className={styles.pinsList}>
                            {transitions((style, pin, _, index) => (
                                <animated.div style={style}>
                                    <PinItem key={index} index={index} pin={pin} />
                                </animated.div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {showAddCategory && <AddCategoryModal setToggle={setShowAddCategory} />}
        </>
    );
}

export default MobileSidebar;