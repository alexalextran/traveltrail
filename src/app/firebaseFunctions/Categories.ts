import { Category } from './../types/categoryData';
// firebaseOperations.ts

// Import Firestore and your Firebase app configuration
import { collection, addDoc, getFirestore, doc, deleteDoc, updateDoc, arrayUnion, where, getDocs, query, writeBatch, getDoc  } from "firebase/firestore";
import { app } from "../firebase";
const db = getFirestore(app);

// Modify writeToFirestore to return the document ID
export const writeCategory = async (data: {
  categoryName: string;
  categoryColor: string;
}): Promise<Category> => {
  try {
    const docRef = await addDoc(collection(db, `users/alextran/categories`), data);
    console.log("Document written with ID: ", docRef.id);
    return {
      CategoryID: docRef.id,
      categoryName: data.categoryName,
      categoryColor: data.categoryColor,
    };
  } catch (error) {
    console.error("Error adding document: ", error);
    throw new Error("Failed to write document");
  }
};
export const deleteCategoryAndRelatedPins = async (categoryName: string, categoryID: string): Promise<void> => {
  try {
    // Step 1: Query for all pins related to the category
    const pinsCollectionRef = collection(db, `users/alextran/pins`);
    const q = query(pinsCollectionRef, where("category", "==", categoryName));
    const querySnapshot = await getDocs(q);

    // Step 2: Batch delete all related pins if there are any
    if (!querySnapshot.empty) {
      const batch = writeBatch(db);
      querySnapshot.forEach((doc) => {
        batch.delete(doc.ref);
      });

      // Execute the batch operation
      await batch.commit();
      console.log(`All pins related to category ${categoryName} have been deleted.`);
    }

    // Step 3: Delete the category itself
    const categoryRef = doc(db, `users/alextran/categories`, categoryID);
    await deleteDoc(categoryRef);
    console.log(`Category deleted with ID: ${categoryID}`);
  } catch (error) {
    console.error("Error deleting category and related pins: ", error);
    throw new Error("Failed to delete category and related pins");
  }
}


// export const deleteFromFirestore = async (collectionName: string, docId: string): Promise<void> => {
//   try {
//     // Create a reference to the document to delete
//     const docRef = doc(db, collectionName, docId);
//     // Delete the document
//     await deleteDoc(docRef);
//     console.log("Document deleted with ID: ", docId);
//   } catch (error) {
//     console.error("Error deleting document: ", error);
//   }
// };

