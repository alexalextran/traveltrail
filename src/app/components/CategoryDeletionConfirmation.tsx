import React from 'react';
import styles from '../Sass/DeletionConfirmationModal.module.scss';
import { Category } from '../types/categoryData';
import { selectPins } from '../store/pins/pinsSlice.ts';
import { useSelector, useDispatch } from 'react-redux';

export default function CategoryDeletionConfirmation({setcategoryDeleteModal, category}: {setcategoryDeleteModal: any, category: Category}) {
    const pins = useSelector(selectPins);
    var filteredPins = pins.filter(pin => pin.category === category.categoryName);
    

    return (
        <div className={styles.modal}>
            <div className={styles.mainModal}>
            <h4>Are you sure you want to delete this category?</h4>
            <p>Deleting <span>{category.categoryName}</span> will result in the following pins being deleted</p>
            <div className={styles.pinsDeleting}>
                 {
                filteredPins.map((pin, index) => (
                    <p key={index}>{pin.title}</p>
                ))
            }
            </div>
           
            <span className={styles.buttonSpan}>
              <button onClick={() => {setcategoryDeleteModal(false)}}>Cancel</button>
            <button>Delete</button>   
            </span>
           
            </div>
        </div>
    );
}
