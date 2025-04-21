import React, { useState } from "react";
import styles from "../../Sass/FullScreen.module.scss";
import { MdDeleteForever } from "react-icons/md";
import { Category } from "../../types/categoryData";
import CategoryDeletionModal from "./CategoryDeletionConfirmation";
import { getContrastTextColor } from "../../utility";

export default function CategoryComponent({
  category,
  setselectedCategory,
  selectedCategory,
}: {
  category: Category;
  setselectedCategory: (category: Category) => void;
  selectedCategory: Category | null;
}) {
  const [categoryDeleteModal, setcategoryDeleteModal] = useState(false);
  const isSelected = selectedCategory?.categoryName === category.categoryName;

  return (
    <>
      <div
        className={styles.category}
        style={{
          backgroundColor: isSelected ? category.categoryColor : "",
          color: isSelected
            ? getContrastTextColor(category.categoryColor)
            : "white",
        }}
        onClick={() => setselectedCategory(category)}
      >
        <MdDeleteForever onClick={() => setcategoryDeleteModal(true)} />
        <p>{category.categoryName}</p>
      </div>

      {/* Category Deletion Modal */}
      {categoryDeleteModal && (
        <CategoryDeletionModal
          setcategoryDeleteModal={setcategoryDeleteModal}
          category={category}
        />
      )}
    </>
  );
}
