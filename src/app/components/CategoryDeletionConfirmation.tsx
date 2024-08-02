import React from 'react';
import styles from '../Sass/DeletionConfirmationModal.module.scss';
import { Category } from '../types/categoryData';
import { selectPins } from '../store/pins/pinsSlice.ts';
import { useSelector } from 'react-redux';
import {deleteCategoryAndRelatedPins} from '../firebaseFunctions/Categories.ts';
import { toast } from 'react-toastify';
import { useAuth } from '../context/authContext'; // Import the useAuth hook


export default function CategoryDeletionConfirmation({setcategoryDeleteModal, category}: {setcategoryDeleteModal: any, category: Category}) {
    const pins = useSelector(selectPins);
    var filteredPins = pins.filter(pin => pin.category === category.categoryName);
    const { user } = useAuth(); // Use the useAuth hook


    

 

    return (
        
        <>
        <span className={styles.modal}>
            <span className={styles.mainModal}>
            <h4>Are you sure you want to delete this category?</h4>
            <p>Deleting <span style={{color: `${category.categoryColor}`}}>{category.categoryName}</span> will result in the following pins being deleted</p>
            <span className={styles.pinsDeleting}>
                 {
                filteredPins.map((pin, index) => (
                    <p key={index}>{pin.title}</p>
                ))
            }
            </span>
           
            <span className={styles.buttonSpan}>
              <button onClick={() => {setcategoryDeleteModal(false)}}>Cancel</button>
            <button onClick={() => { 

            deleteCategoryAndRelatedPins(user.uid, category.categoryName, category.CategoryID)

                toast.success('Category and all relavent pins Successfully!', {
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
           
            </span>
        </span>
        

        </>
    );
}
