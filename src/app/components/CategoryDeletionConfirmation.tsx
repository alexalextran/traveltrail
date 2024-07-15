import React from 'react';
import styles from '../Sass/DeletionConfirmationModal.module.scss';
import { Category } from '../types/categoryData';
import { selectPins } from '../store/pins/pinsSlice.ts';
import { useSelector, useDispatch } from 'react-redux';
import {deleteCategoryAndRelatedPins} from '../firebaseFunctions/Categories.ts';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { deleteCategory } from '../store/categories/categoriesSlice.ts';
import { deleteCategoryAndRelatedPinsRedux } from '../store/categories/categoriesSlice.ts';
import { AppDispatch } from '../store/store.ts';
import { useAuth } from '../context/authContext'; // Import the useAuth hook


export default function CategoryDeletionConfirmation({setcategoryDeleteModal, category}: {setcategoryDeleteModal: any, category: Category}) {
    const pins = useSelector(selectPins);
    var filteredPins = pins.filter(pin => pin.category === category.categoryName);
    const dispatch: AppDispatch = useDispatch(); // Use the typed version of useDispatch
    const { user } = useAuth(); // Use the useAuth hook


    

 

    return (
        
        <>
        <div className={styles.modal}>
            <div className={styles.mainModal}>
            <h4>Are you sure you want to delete this category?</h4>
            <p>Deleting <span style={{color: `${category.categoryColor}`}}>{category.categoryName}</span> will result in the following pins being deleted</p>
            <div className={styles.pinsDeleting}>
                 {
                filteredPins.map((pin, index) => (
                    <p key={index}>{pin.title}</p>
                ))
            }
            </div>
           
            <span className={styles.buttonSpan}>
              <button onClick={() => {setcategoryDeleteModal(false)}}>Cancel</button>
            <button onClick={() => {
                
                deleteCategoryAndRelatedPins(user.uid, category.categoryName, category.CategoryID).then(()=>{
                    dispatch(deleteCategoryAndRelatedPinsRedux(category))
                })
                
                toast('Deleted Successfully!', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                    });
                    setcategoryDeleteModal(false)
                }}>Delete</button>   
            </span>
           
            </div>
        </div>
        

        </>
    );
}
