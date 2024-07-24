import React, { useState } from 'react'
import styles from '../Sass/addCategoryModal.module.scss'
import { createCategory } from '../../app/store/categories/categoriesSlice.ts';
import { ColorPicker, useColor } from "react-color-palette";
import { writeCategory } from '../firebaseFunctions/Categories.ts';
import { useAuth } from '../context/authContext'; // Import the useAuth hook
import { toast } from 'react-toastify';


export default function AddCategoryModal({ setToggle }: any) {
  const [categoryToAdd, setcategoryToAdd] = useState('')
  const [color, setColor] = useColor("rgb(0,0,0)");
  const { user } = useAuth(); // Use the useAuth hook

  const addCategory = async (e: any) => {
    e.preventDefault()
    
  try {
    const uploadedCategory = await writeCategory(
      `users/${user.uid}/categories`,
      {
        categoryName: categoryToAdd,
        categoryColor: color.hex
      }
    );

   

    toast.success('Category added successfully!', {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });

    
    setToggle && setToggle(false);

   

  } catch (error) {
    toast.error('There has been an issue, please notify the owner!', {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  }

    


    
  }

  return (
    <main className={setToggle ? styles.main : styles.fullScreen}>
      
      <h1>Add Category</h1>
      <form className={styles.form} onSubmit={(e) => addCategory(e)}>
      <input required type='text' placeholder="Enter category name" value={categoryToAdd } onChange={(e) => setcategoryToAdd(e.target.value)} />
      <div className={setToggle ? styles.modalContent : ''}>
        <ColorPicker color={color} onChange={setColor} hideInput={["hsv"]} hideAlpha={true} />
      </div>
      <button type='submit'>
        Add Category
      </button>
      </form>
     { setToggle &&
      <button onClick={() => setToggle(false)} className={setToggle ? styles.exit : ''}>
        X
      </button>
      }
    </main>
  )
}
