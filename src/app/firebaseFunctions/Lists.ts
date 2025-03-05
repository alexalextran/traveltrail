import { collection, addDoc, getFirestore, doc, deleteDoc, updateDoc, arrayUnion, arrayRemove, getDocs, getDoc } from "firebase/firestore";
import { app } from "../firebase";

const db = getFirestore(app);

export const writeList = async (collectionName:string, data: {
    listName: string;
}): Promise<any> => {
    try {
        const docRef = await addDoc(collection(db, collectionName), {
            listName: data.listName,
            visible: false, 
            });
        await updateDoc(docRef, { listID: docRef.id });
       
    } catch (error) {
        console.error("Error adding document: ", error);
        throw new Error("Failed to write document");
    }
};

export const deleteList = async (collectionName:string, listID: string): Promise<void> => {
    try {
        const listRef = doc(db, collectionName, listID);
        await deleteDoc(listRef);
        console.log(`List deleted with ID: ${listID}`);
    } catch (error) {
        console.error("Error deleting list: ", error);
        throw new Error("Failed to delete list");
    }
};

export const addPinToList = async (collectionName:string, listID: string, pinID: string): Promise<void> => {
    try {
        const listRef = doc(db, collectionName, listID);
        await updateDoc(listRef, {
            pins: arrayUnion(pinID)
        });
        console.log(`Pin added to list with ID: ${listID}`);
    } catch (error) {
        console.error("Error adding pin to list: ", error);
        throw new Error("Failed to add pin to list");
    }
};

export const removePinFromList = async (collectionName:string, listID: string, pinID: string): Promise<void> => {
    console.log(listID, pinID)
    try {
        const listRef = doc(db, collectionName, listID);
        await updateDoc(listRef, {
            pins: arrayRemove(pinID)
        });
        console.log(`Pin removed from list with ID: ${listID}`);
    } catch (error) {
        console.error("Error removing pin from list: ", error);
        throw new Error("Failed to remove pin from list");
    }
};

export const updateListVisibility = async (collectionName: string, listID: string, visible: boolean): Promise<void> => {
    try {
        const listRef = doc(db, collectionName, listID);
        await updateDoc(listRef, {
            visible: visible
        });
        console.log(`List visibility updated with ID: ${listID}`);
    } catch (error) {
        console.error("Error updating list visibility: ", error);
        throw new Error("Failed to update list visibility");
    }
};


export const getLists = async (friendID: string): Promise<any> => {

    try {
        const querySnapshot = await getDocs(collection(db, `users/${friendID}/lists`));
        const lists = querySnapshot.docs.map((doc) => {
            return {
                listID: doc.id,
                ...doc.data()
            };
        });
        return lists;
    }catch{
        console.error("Error getting lists");
        throw new Error("Failed to get lists");
    }

}


export const getPinsFromList = async (friendID: string, listID: string): Promise<any[]> => {
    try {
        // First, get the list document to retrieve pin IDs
        const listRef = doc(db, `users/${friendID}/lists`, listID);
        const listSnapshot = await getDoc(listRef);
        const listData = listSnapshot.data();

        // If the list has no pins, return an empty array
        if (!listData?.pins || listData.pins.length === 0) {
            return [];
        }

        // Fetch each pin document
        const pinPromises = listData.pins.map(async (pinID: string) => {
            const pinRef = doc(db, `users/${friendID}/pins`, pinID);
            const pinSnapshot = await getDoc(pinRef);
            return { id: pinID, ...pinSnapshot.data() };
        });

        // Wait for all pin fetches to complete and return
        return await Promise.all(pinPromises);
    } catch (error) {
        console.error("Error getting pins from list", error);
        throw new Error("Failed to get pins from list");
    }
}
