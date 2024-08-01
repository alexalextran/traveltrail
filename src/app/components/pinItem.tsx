import React, { useState } from 'react'
import { Pin } from '../types/pinData'
import styles from '../Sass/pinItem.module.scss'
import { useDispatch, useSelector } from 'react-redux';
import IconBar from '../components/iconBar.tsx';
import { selectCategories } from '../store/categories/categoriesSlice'
import { Category } from '../types/categoryData.ts';
import { setLocation } from '../store/location/locationSlice.ts';
import { AppDispatch } from '../store/store.ts';


function PinItem({ pin }: { pin: Pin }) {
  const dispatch: AppDispatch = useDispatch(); 

    const [show, setshow] = useState(false)
    const categories = useSelector(selectCategories);

    const category:Category = categories.filter(category => category.categoryName === pin.category)[0]
  return (
    <main className={styles.main} onClick={() => dispatch(setLocation({lat: pin.lat, lng: pin.lng}))}>
        <h3 style={{color: `${category?.categoryColor}`}}>{pin.title}</h3>
       <p>Click me to center pin!</p>
        <div>{pin.address}</div>




        {show && <div>{pin.description}</div> }
      <IconBar enableImage={false} pin={pin} setchild={null} color={category?.categoryColor}/>
          </main>
  )
}

export default PinItem;