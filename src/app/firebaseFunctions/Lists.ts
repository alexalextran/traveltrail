import { collection, addDoc, getFirestore, doc, deleteDoc, updateDoc, arrayUnion, arrayRemove, getDocs, getDoc, writeBatch, query, where } from "firebase/firestore";
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

export const addPinToList = async (collectionName:string, listID: string, pinID: string, categoryID: string): Promise<void> => {
    try {
        const listRef = doc(db, collectionName, listID);
        await updateDoc(listRef, {
            pins: arrayUnion(pinID),
            categories: arrayUnion(categoryID)
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


export const getUserStatistics = async (friendID: string): Promise<{
    totalLists: number;
    totalPins: number;
    totalCategories: number;
  }> => {
      try {
          // Count total lists
          const listsSnapshot = await getDocs(collection(db, `users/${friendID}/lists`));
          const totalLists = listsSnapshot.docs.length;
  
          // Count total pins
          const pinsSnapshot = await getDocs(collection(db, `users/${friendID}/pins`));
          const totalPins = pinsSnapshot.docs.length;
  
          const categoriesSnapshot = await getDocs(collection(db, `users/${friendID}/categories`));
          const totalCategories = categoriesSnapshot.docs.length;
  
          return {
              totalLists,
              totalPins,
              totalCategories
          };
      } catch (error) {
          console.error("Error getting user statistics", error);
          throw new Error("Failed to get user statistics");
      }
  }


    //   const handleAddToProfile = async (friendId: string, listId: string) => {
    //       const db = getFirestore(app);
    //       const friendListRef = doc(db, `users/${friendId}/lists/${listId}`);
    //       const friendListSnapshot = await getDoc(friendListRef);
      
    //       if (!friendListSnapshot.exists()) {
    //           console.error("Friend list does not exist");
    //           return;
    //       }
      
    //       const friendListData = friendListSnapshot.data();
    //       const pinIDs = friendListData?.pins || [];
      
    //       const uniqueCategories = new Set<string>();
    //       const pins = [];
      
    //       for (const pinID of pinIDs) {
    //           const pinRef = doc(db, `users/${friendId}/pins/${pinID}`);
    //           const pinSnapshot = await getDoc(pinRef);
    //           if (pinSnapshot.exists()) {
    //               const pinData = pinSnapshot.data();
    //               pins.push(pinID);
      
    //               // Collect unique categories from each pin
    //               if (pinData?.category) {
    //                   uniqueCategories.add(pinData.category);
    //               }
    //           }
    //       }
      
    //       // Convert Set to Array for iteration
    //       const uniqueCategoriesArray = Array.from(uniqueCategories);
      
    //       // Check if each category already exists before adding
    //       const userCategoriesRef = collection(db, `users/${user.uid}/categories`);
    //       const batch = writeBatch(db);
      
    //       for (const category of uniqueCategoriesArray) {
    //           const categoryQuery = query(userCategoriesRef, where("categoryName", "==", category));
    //           const categorySnapshot = await getDocs(categoryQuery);
    //           if (categorySnapshot.empty) {
    //               const categoryRef = doc(userCategoriesRef);
    //               batch.set(categoryRef, {
    //                   categoryName: category,
    //                   categoryColor: '#FFFFFF' // Default color in #FFFFFF format
    //               });
    //           } else {
    //               console.log(`Category '${category}' already exists.`);
    //           }
    //       }
      
    //       await batch.commit();
      
    //       // Add the list to the user's profile
    //       const userListRef = collection(db, `users/${user.uid}/lists`);
    //       const newUserListRef = await addDoc(userListRef, {
    //           listName: friendListData.listName,
    //           visible: false,
    //           pins,
    //           categories: uniqueCategoriesArray // Use the converted array
    //       });
      
    //       console.log(`List added to profile with ID: ${newUserListRef.id}`);
    //   };