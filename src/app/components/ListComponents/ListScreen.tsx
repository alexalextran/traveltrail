// ListScreen.tsx
import React, { useState, useEffect, useRef } from 'react';
import styles from '../../Sass/ListScreen.module.scss';
import { Pin } from '../../types/pinData.ts';
import { Category } from '../../types/categoryData.ts';
import "react-multi-carousel/lib/styles.css";
import { toggleEditModal, toggleListScreen } from '../../store/toggleModals/toggleModalSlice.ts';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../store/store.ts'; // Import the AppDispatch type
import CategoryComponent from '../PINManagementComponents/CategoryComponent.tsx';
import { ToastContainer, toast } from 'react-toastify';
import ManageLists from './ManageLists.tsx';
import { getFirestore, collection, onSnapshot } from 'firebase/firestore';
import { app } from "../../firebase.js"; // Ensure this path is correct
import ListDnD from './ListDnd.tsx';
import PinCard from './PinCard.tsx';
import { useDrop } from 'react-dnd';
import { removePinFromList } from '../../firebaseFunctions/Lists.ts'; // Function to add pin to list
import { useAuth } from '../../context/authContext.js'; // Import the useAuth hook
import { useSpring, animated } from '@react-spring/web';


function ListScreen() {
    const dropRef = useRef<HTMLDivElement>(null);
    const { user } = useAuth(); 

    const dispatch: AppDispatch = useDispatch(); 
    const [pins, setPins] = useState<Pin[]>([]);
    const [lists, setLists] = useState<{ id: string; listName: string; }[]>([]);
    const [child, setchild] = useState(<ManageLists/>);
    const [selectedList, setSelectedList] = useState<string>(''); 
    const [categories, setcategories] = useState<Category[]>([]);


    useEffect(() => {
        const db = getFirestore(app);
        const listCollectionRef = collection(db, `users/${user.uid}/lists`); 
        const unsubscribe = onSnapshot(listCollectionRef, (snapshot) => {
            const fetchedLists = snapshot.docs.map(doc => ({
                id: doc.id,
                listName: doc.data().listName,
            }));
            setLists(fetchedLists);
        });

        return () => unsubscribe(); 
    }, [selectedList]);

    useEffect(() => {
        const db = getFirestore(app);
        const listCollectionRef = collection(db, `users/${user?.uid}/pins`);
        const unsubscribe = onSnapshot(listCollectionRef, (snapshot) => {
            const fetchedPins: Pin[] = snapshot.docs.map(doc => ({
                id: doc.id,
                placeId: doc.data().pinId,
                address: doc.data().address,
                lat: doc.data().lat,
                lng: doc.data().lng,
                title: doc.data().title,
                description: doc.data().description,
                category: doc.data().category,
                visited: doc.data().visited,
                imageUrls: doc.data().imageUrls,
                openingHours: doc.data().openingHours,
                rating: doc.data().rating,
                website: doc.data().website
            }));
            setPins(fetchedPins);
        });
    
        return () => unsubscribe(); 
    }, []);


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
            setcategories(fetchedCategories);
        });
    
        return () => unsubscribe(); 
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

    const fadeIn = useSpring({
        from: { opacity: 0, transform: 'scale(0.8)' },
        to: { opacity: 1, transform: 'scale(1)' },
        config: { tension: 200, friction: 20 }, 
        delay: 100
    });



    const [{ isOver }, drop] = useDrop({
        accept: 'addedPin',
        drop: (item: { id: string }) => {
          if (selectedList) {

            removePinFromList(`users/${user.uid}/lists`, selectedList, item.id);
          }
        },
        collect: (monitor) => ({
          isOver: !!monitor.isOver(),
        }),
      });
      drop(dropRef);

      const [searchQuery, setSearchQuery] = useState('');
      const [selectedCategory, setselectedCategory] = useState(null as null | Category);

      var filteredPins = selectedCategory ? pins.filter(pin => pin.category === selectedCategory.categoryName) : pins;
      filteredPins = filteredPins.filter(pin =>
          pin.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
  
      const filteredCategories = [...categories].sort((a, b) => a.categoryName.localeCompare(b.categoryName));


    return (
        <>
            <animated.main style={fadeIn} className={styles.main}>
                <div className={styles.header}>
                    <h1>Lists</h1>
                    <button className={styles.exitButton} onClick={() => {
                        dispatch(toggleListScreen(false))
                        dispatch(toggleEditModal(false))
                    }}>X</button>
                </div>
                <div className={styles.content}>
                    <div className={styles.categories}>
                    <div className={styles.category} onClick={() => setselectedCategory(null)}>
                     <p>All</p>
                    </div>

                        {filteredCategories.map((category: Category, index: number) => (
                            <CategoryComponent key={index} category={category} setselectedCategory={setselectedCategory}/>
                        ))}
                    </div>
                    <div className={styles.pins} ref={dropRef} >
                    <div className={styles.searchQuery}>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search by title"
                            />
                            <button onClick={() => setSearchQuery('')}>Clear</button>
                        </div>
                        {filteredPins.map((pin: Pin, index: number) => {
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
            </animated.main>
        </>
    );
}

export default ListScreen;
