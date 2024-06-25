// firebaseOperations.ts

// Import Firestore and your Firebase app configuration
import { collection, addDoc, getFirestore, doc, deleteDoc, updateDoc, arrayUnion  } from "firebase/firestore";
import { app } from "../firebase";
const db = getFirestore(app);

// Modify writeToFirestore to return the document ID
export const writeToFirestore = async (collectionName: string, data: any): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, collectionName), data);
    console.log("Document written with ID: ", docRef.id);
    return docRef.id; // Return the document ID
  } catch (error) {
    console.error("Error adding document: ", error);
    throw new Error("Failed to write document");
  }
};


export const deleteFromFirestore = async (collectionName: string, docId: string): Promise<void> => {
  try {
    // Create a reference to the document to delete
    const docRef = doc(db, collectionName, docId);
    // Delete the document
    await deleteDoc(docRef);
    console.log("Document deleted with ID: ", docId);
  } catch (error) {
    console.error("Error deleting document: ", error);
  }
};

export const addImageReferenceToFirestore = async (docId: string, imageURL: string) => {
  try {
    const docRef = doc(db, 'users/alextran/pins', docId);
    await updateDoc(docRef, {
      imageUrls: arrayUnion(imageURL),  // Use arrayUnion to add the new URL to the array
    });
  } catch (error) {
    console.error('Error adding image reference to document: ', error);
  }
};