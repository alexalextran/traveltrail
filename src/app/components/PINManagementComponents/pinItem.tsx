import React, { useEffect, useState } from 'react'
import { Pin } from '../../types/pinData.ts'
import styles from '../../Sass/pinItem.module.scss'
import { useDispatch, useSelector } from 'react-redux';
import IconBar from '../ImageComponents/IconBar.tsx';
import { selectCategories } from '../../store/categories/categoriesSlice.ts'
import { Category } from '../../types/categoryData.ts';
import { setLocation } from '../../store/location/locationSlice.ts';
import { AppDispatch } from '../../store/store.ts';
import { collection, getFirestore, onSnapshot } from 'firebase/firestore';
import { app } from "../../firebase.js"; 
import { useAuth } from '../../context/authContext.js'; // Import the useAuth hook

function PinItem({ pin, index }: { pin: Pin, index: number }) {
  const dispatch: AppDispatch = useDispatch(); 
  const [categories, setcategories] = useState<Category[]>([]);

  const { user } = useAuth(); 

    useEffect(() => { //fetch categories from firestore
      const db = getFirestore(app);
      const listCollectionRef = collection(db, `users/${user.uid}/categories`);
      const unsubscribe = onSnapshot(listCollectionRef, (snapshot) => {
        const fetchedCategories = snapshot.docs.map(doc => ({
          CategoryID: doc.id,
          categoryName: doc.data().categoryName,
          categoryColor: doc.data().categoryColor 
        }));
        setcategories(fetchedCategories);
      });
  
      return () => unsubscribe(); 
    }, []);

    const category:Category = categories.filter(category => category.categoryName === pin.category)[0]
  return (
    <main className={styles.main} onClick={() => dispatch(setLocation({lat: pin.lat, lng: pin.lng}))}>
        <h3 style={{color: `${category?.categoryColor}`}}>{pin.title}</h3>
       <p>Click me to center pin!</p>
        <div>{pin.address}</div>




      <IconBar enableImage={false} pin={pin} setchild={null} color={category?.categoryColor}/>
          </main>
  )
}

export default PinItem;