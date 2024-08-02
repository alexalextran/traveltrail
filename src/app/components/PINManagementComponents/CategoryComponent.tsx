import React, { useState } from 'react';
import styles from '../../Sass/FullScreen.module.scss';
import { MdDeleteForever } from 'react-icons/md';
import { Category } from '../../types/categoryData';
import CategoryDeletionModal from './CategoryDeletionConfirmation'

export default function CategoryComponent({ category, setselectedCategory }: { category: Category, setselectedCategory:any }) {
    const [categoryDeleteModal, setcategoryDeleteModal] = useState(false);
    return (
        <>
        <div className={styles.category} onClick={() => setselectedCategory(category)}>
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
