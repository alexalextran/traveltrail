import React, { useState } from 'react'
import styles from '../Sass/addCategoryModal.module.scss'
import { useDispatch } from 'react-redux';
import { addCategory } from '../../app/store/categories/categoriesSlice.ts';
import ColorPickerComponent from './ColorPickerComponent.tsx';




export default function AddCategoryModal({setToggle}: any) {
    const dispatch = useDispatch();
    const [categoryToAdd, setcategoryToAdd] = useState('')
  return (
    <main className={styles.main}>ADD
    <input type='text'value={categoryToAdd} onChange={(e) => setcategoryToAdd(e.target.value)}>
    </input>
    <ColorPickerComponent/>
    <button onClick={()=> { 
        dispatch(addCategory(categoryToAdd)); 
        setToggle(false);
        }}>
        ADD BUTTON
    </button>
    <button onClick={()=> setToggle(false)}>
        Exit Button
    </button>
    </main>
  )
}
