import React, { useEffect, useState } from "react";
import styles from "../../Sass/DeletionConfirmationModal.module.scss";
import { Category } from "../../types/categoryData.ts";
import {
  deleteCategoryAndRelatedPins,
  retrieveAllPinsWithCategory,
} from "../../firebaseFunctions/Categories.ts";
import { useAuth } from "../../context/authContext.js";
import { Pin } from "../../types/pinData";
import {
  categoryDeletedToast,
  standardErrorToast,
} from "../../toastNotifications.tsx";
export default function CategoryDeletionConfirmation({
  setcategoryDeleteModal,
  category,
}: {
  setcategoryDeleteModal: (val: boolean) => void;
  category: Category;
}) {
  const { user } = useAuth();
  const [filteredPins, setFilteredPins] = useState<Pin[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPins = async () => {
      try {
        const allPins = await retrieveAllPinsWithCategory(
          user.uid,
          category.categoryName
        );
        const matchingPins = allPins.filter(
          (pin: Pin) => pin.category === category.categoryName
        );
        setFilteredPins(matchingPins);
      } catch (error) {
        standardErrorToast(
          "Failed to retrieve pins for this category. Please try again."
        );
        console.error("Error retrieving pins:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPins();
  }, [user.uid, category.categoryName]);

  const handleDelete = async () => {
    try {
      await deleteCategoryAndRelatedPins(
        user.uid,
        category.categoryName,
        category.CategoryID
      );
      categoryDeletedToast(category.categoryName);
    } catch (error) {
      standardErrorToast("Failed to delete category and related pins.");
    } finally {
      setcategoryDeleteModal(false);
    }
  };

  return (
    <div className={styles.modal}>
      <div className={styles.mainModal}>
        <h4>Are you sure you want to delete this category?</h4>
        <p>
          Deleting{" "}
          <span style={{ color: category.categoryColor }}>
            {category.categoryName}
          </span>{" "}
          will result in the following pins being deleted:
        </p>

        <div className={styles.pinsDeleting}>
          {loading ? (
            <p>Loading pins...</p>
          ) : (
            filteredPins.map((pin, index) => <p key={index}>{pin.title}</p>)
          )}
        </div>

        <div className={styles.buttonSpan}>
          <button onClick={() => setcategoryDeleteModal(false)}>Cancel</button>
          <button onClick={handleDelete}>Delete</button>
        </div>
      </div>
    </div>
  );
}
