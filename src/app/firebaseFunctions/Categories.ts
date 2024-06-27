// firebaseOperations.ts

// Import Firestore and your Firebase app configuration
import { collection, addDoc, getFirestore, doc, deleteDoc, updateDoc, arrayUnion  } from "firebase/firestore";
import { app } from "../firebase";
const db = getFirestore(app);

// Modify writeToFirestore to return the document ID
export const writeCategory = async (data: object): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, `users/alextran/categories`), data);
    console.log("Document written with ID: ", docRef.id);
    return docRef.id; // Return the document ID
  } catch (error) {
    console.error("Error adding document: ", error);
    throw new Error("Failed to write document");
  }
};


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

