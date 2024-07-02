import React, { useState } from 'react'
import { Pin } from '../types/pinData'
import styles from '../Sass/pinItem.module.scss'
import { useSelector } from 'react-redux';
import IconBar from './iconBar.tsx';
import { selectCategories } from '../store/categories/categoriesSlice'
import { Category } from '../types/categoryData.ts';


function PinItem({ pin }: { pin: Pin }) {
    const [show, setshow] = useState(false)
    const categories = useSelector(selectCategories);

    const category:Category = categories.filter(category => category.categoryName === pin.category)[0]
  return (
    <main className={styles.main}>
        <h3 style={{color: `${category.categoryColor}`}}>{pin.title}</h3>
       
        <div>
        <div>{pin.address}</div>
        <div>{pin.category}</div>
        </div>




        {show && <div>{pin.description}</div> }
      <IconBar pin={pin} setchild={null} color={category.categoryColor}/>
          </main>
  )
}

export default PinItem;