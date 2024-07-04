import React from 'react';
import styles from '../Sass/DeletionConfirmationModal.module.scss';

export default function CategoryDeletionConfirmation() {
    return (
        <div className={styles.modal}>
            <div>
            <p>Are you sure you want to delete this category?</p>
            <span>
              <button>Cancel</button>
            <button>Delete</button>   
            </span>
           
            </div>
        </div>
    );
}
