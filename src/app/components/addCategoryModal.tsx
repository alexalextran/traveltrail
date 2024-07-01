import React, { useState } from 'react'
import styles from '../Sass/addCategoryModal.module.scss'
import { useDispatch } from 'react-redux';
import { createCategory } from '../../app/store/categories/categoriesSlice.ts';
import { ColorPicker, useColor } from "react-color-palette";
import { writeCategory } from '../firebaseFunctions/Categories.ts';


export default function AddCategoryModal({ setToggle }: any) {
  const dispatch = useDispatch();
  const [categoryToAdd, setcategoryToAdd] = useState('')
  const [color, setColor] = useColor("rgb(0,0,0)");

  const addCategory = async () => {
    await writeCategory({
      categoryName: categoryToAdd,
      categoryColor: color.hex
    });
    dispatch(
      createCategory({
        categoryName: categoryToAdd,
        categoryColor: color.hex
      })
    );
    setToggle && setToggle(false);
  }

  return (
    <main className={setToggle ? styles.main : styles.fullScreen}>
      <h1>Add Category</h1>
      <input type='text' placeholder="Enter category name" value={categoryToAdd } onChange={(e) => setcategoryToAdd(e.target.value)} />
      <div className={setToggle ? styles.modalContent : ''}>
        <ColorPicker color={color} onChange={setColor} hideInput={["hsv"]} hideAlpha={true} />
      </div>
      <button onClick={() => { addCategory() }}>
        Add
      </button>
     { setToggle &&
      <button onClick={() => setToggle(false)} className={setToggle ? styles.exit : ''}>
        X
      </button>
      }
    </main>
  )
}
