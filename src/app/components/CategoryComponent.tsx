import React, { useState } from 'react';
import styles from '../Sass/FullScreen.module.scss';
import { MdDeleteForever } from 'react-icons/md';
import { Category } from '../types/categoryData';
import CategoryDeletionModal from './CategoryDeletionConfirmation'

export default function CategoryComponent({ category }: { category: Category }) {
    const [categoryDeleteModal, setcategoryDeleteModal] = useState(false);
    return (
        <>
        <div className={styles.category}>
            <MdDeleteForever onClick={() => setcategoryDeleteModal(true)}/>
            <p>{category.categoryName}</p>
        </div>
        {
            categoryDeleteModal &&
           <CategoryDeletionModal setcategoryDeleteModal={setcategoryDeleteModal} category={category}/>
        }
        </>
    );
}
