// firebaseOperations.ts

// Import Firestore and your Firebase app configuration
import { collection, addDoc, getFirestore } from "firebase/firestore";
import { app } from "../firebase";
const db = getFirestore(app);

// Function to write data to a specified Firestore collection
export const writeToFirestore = async (collectionName: string, data: any): Promise<void> => {
  try {
    const docRef = await addDoc(collection(db, collectionName), data);
    console.log("Document written with ID: ", docRef.id);
  } catch (error) {
    console.error("Error adding document: ", error);
  }
};