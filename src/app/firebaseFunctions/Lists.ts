import { collection, addDoc, getFirestore, doc, deleteDoc, updateDoc, arrayUnion, where, getDocs, query, writeBatch, getDoc  } from "firebase/firestore";
import { app } from "../firebase";

// firebaseOperations.ts

// Import Firestore and your Firebase app configuration

const db = getFirestore(app);

// Modify writeToFirestore to return the document ID
export const writeList = async (data: {
    listName: string;
}): Promise<any> => {
    try {
        const docRef = await addDoc(collection(db, `users/alextran/lists`), data);
        console.log("Document written with ID: ", docRef.id);
        return {
            listID: docRef.id,
            listName: data.listName,
        };
    } catch (error) {
        console.error("Error adding document: ", error);
        throw new Error("Failed to write document");
    }
};

export const deleteList = async (listID: string): Promise<void> => {
    try {
        // Delete the list
        const listRef = doc(db, `users/alextran/lists`, listID);
        await deleteDoc(listRef);
        console.log(`List deleted with ID: ${listID}`);
    } catch (error) {
        console.error("Error deleting list: ", error);
        throw new Error("Failed to delete list");
    }
};
