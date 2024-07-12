import { collection, addDoc, getFirestore, doc, deleteDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { app } from "../firebase";

const db = getFirestore(app);

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
        const listRef = doc(db, `users/alextran/lists`, listID);
        await deleteDoc(listRef);
        console.log(`List deleted with ID: ${listID}`);
    } catch (error) {
        console.error("Error deleting list: ", error);
        throw new Error("Failed to delete list");
    }
};

export const addPinToList = async (listID: string, pinID: string): Promise<void> => {
    try {
        const listRef = doc(db, `users/alextran/lists`, listID);
        await updateDoc(listRef, {
            pins: arrayUnion(pinID)
        });
        console.log(`Pin added to list with ID: ${listID}`);
    } catch (error) {
        console.error("Error adding pin to list: ", error);
        throw new Error("Failed to add pin to list");
    }
};

export const removePinFromList = async (listID: string, pinID: string): Promise<void> => {
    try {
        const listRef = doc(db, `users/alextran/lists`, listID);
        await updateDoc(listRef, {
            pins: arrayRemove(pinID)
        });
        console.log(`Pin removed from list with ID: ${listID}`);
    } catch (error) {
        console.error("Error removing pin from list: ", error);
        throw new Error("Failed to remove pin from list");
    }
};
