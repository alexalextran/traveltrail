import React, { useState } from 'react'
import styles from '../Sass/addCategoryModal.module.scss'
import { useDispatch } from 'react-redux';
import { createCategory } from '../../app/store/categories/categoriesSlice.ts';
import { ColorPicker, useColor } from "react-color-palette";
import { writeCategory } from '../firebaseFunctions/Categories.ts';
import { useAuth } from '../context/authContext'; // Import the useAuth hook


export default function AddCategoryModal({ setToggle }: any) {
  const dispatch = useDispatch();
  const [categoryToAdd, setcategoryToAdd] = useState('')
  const [color, setColor] = useColor("rgb(0,0,0)");
  const { user } = useAuth(); // Use the useAuth hook

  const addCategory = async () => {
  const uploadedCategory =  await writeCategory(
    `users/${user.uid}/categories`,
    {
      categoryName: categoryToAdd,
      categoryColor: color.hex
    });


    dispatch(
      createCategory(
        uploadedCategory
      )
    );
    setToggle && setToggle(false);
  }

  return (
    <main className={setToggle ? styles.main : styles.fullScreen}>
      
      <h1>Add Category</h1>
      <div className={styles.form}>
      <input type='text' placeholder="Enter category name" value={categoryToAdd } onChange={(e) => setcategoryToAdd(e.target.value)} />
      <div className={setToggle ? styles.modalContent : ''}>
        <ColorPicker color={color} onChange={setColor} hideInput={["hsv"]} hideAlpha={true} />
      </div>
      <button onClick={() => { addCategory() }}>
        Add Category
      </button>
      </div>
     { setToggle &&
      <button onClick={() => setToggle(false)} className={setToggle ? styles.exit : ''}>
        X
      </button>
      }
    </main>
  )
}
