import { Category } from './../types/categoryData';
// import { removePinFromList } from './Lists';
import { collection, addDoc, getFirestore, doc, deleteDoc, updateDoc, arrayUnion, arrayRemove, getDocs, getDoc, writeBatch, query, where, setDoc } from "firebase/firestore";
import { app } from "../firebase";

const db = getFirestore(app);

export const writeList = async (collectionName:string, data: {
    listName: string;
    owner: string;
}): Promise<any> => {
    try {
        const docRef = await addDoc(collection(db, collectionName), {
            listName: data.listName,
            visible: false, 
            owner: data.owner,
            collaborative: false,
            });
        await updateDoc(docRef, { listID: docRef.id });
       
    } catch (error) {
        console.error("Error adding document: ", error);
        throw new Error("Failed to write document");
    }
};

export const deleteList = async (collectionName: string, listID: string, collaborative: boolean, collaborators: string[]): Promise<void> => {
    try {
        const listRef = doc(db, collectionName, listID);
      


        if (collaborative) {
            const batch = writeBatch(db);
            
            for (const collaboratorID of collaborators) {
                const collaboratorListRef = doc(db, `users/${collaboratorID}/lists/${listID}`);
                batch.delete(collaboratorListRef);
            }

            batch.delete(listRef)
            const collaborativeList = doc(db, `collaborativeLists`, listID);
            await deleteDoc(collaborativeList)
            await batch.commit();
        } else {
            await deleteDoc(listRef);
        }

        console.log(`List deleted with ID: ${listID}`);
    } catch (error) {
        console.error("Error deleting list: ", error);
        throw new Error("Failed to delete list");
    }
};

export const addPinToList = async (collectionName:string, listID: string, pin: any, categoryObject: any, collaborative:boolean, userID:string): Promise<void> => {
    try {
        //check if pin doenst already exist in the collaborative list
        const listRef = doc(db, collectionName, listID);
        const userInfo = doc(db, `users/${userID}`);
        const userSnapshot = await getDoc(userInfo);
        const userData = userSnapshot.data();
        const pinWithUserData = {
            ...pin,
            ...userData
        }
        await updateDoc(listRef, {
             pins: arrayUnion(pinWithUserData),
            categories: arrayUnion(categoryObject[0])
        });
       
        if(collaborative){
      
            addPinToCollaborativeList(listID, pinWithUserData, categoryObject[0], userID);
        }
    } catch (error) {
        console.error("Error adding pin to list: ", error);
        throw new Error("Failed to add pin to list");
    }
};



const addPinToCollaborativeList = async (
    listID: string,
    pin: any,
    categoryObject: any,
    userID: string
): Promise<void> => {
    try {
        

        const listRef = doc(db, `collaborativeLists`, listID);
        const listSnapshot = await getDoc(listRef);

        if (!listSnapshot.exists()) {
            throw new Error("Collaborative list does not exist.");
        }

        const listData = listSnapshot.data();
        const collaborators: string[] = listData.collaborators.map((collaborator: { userID: string }) => collaborator.userID) || [];

        // Update collaborative list with the new pin and category
        await updateDoc(listRef, {
            pins: arrayUnion(pin),
            categories: arrayUnion(categoryObject),
        });


      // Batch update for collaborators
        const batch = writeBatch(db);

        for (const collaboratorID of collaborators) {
    const userListRef = doc(db, `users/${collaboratorID}/lists/${listID}`);

    // Ensure the list exists for each collaborator CHANGE
    const userListSnapshot = await getDoc(userListRef);
    if (!userListSnapshot.exists()) {
        batch.set(userListRef, {
            listName: listData.listName,
            visible: false,
            pins: [],
            categories: [],
        });
    }

    // Only update if the collaborator is NOT the original user who added the pin
    if (collaboratorID !== userID) {
        batch.update(userListRef, {
            pins: arrayUnion(pin),
            categories: arrayUnion(categoryObject),
        });
    }
}


        await batch.commit();
        console.log(`Pin synchronized to all collaborators' lists.`);

    } catch (error) {
        console.error("Error adding pin to collaborative list: ", error);
        throw new Error("Failed to add pin to collaborative list");
    }
};


const retrievePinDocument = async (userID: string, pinID: string): Promise<any> => {
    try {
        const pinRef = doc(db, `users/${userID}/pins`, pinID);
        const pinSnapshot = await getDoc(pinRef);
        return pinSnapshot.data();
    } catch (error) {
        console.error("Error retrieving pin document: ", error);
        throw new Error("Failed to retrieve pin document");
    }
}

const retrieveCategoryDocument = async (userID: string, categoryID: string): Promise<any> => {
    try { 
        const categoryRef = doc(db, `users/${userID}/categories`, categoryID);
        const categorySnapshot = await getDoc(categoryRef);
        return categorySnapshot.data();
    }
    catch (error) {
        console.error("Error retrieving category document: ", error);
        throw new Error("Failed to retrieve category document");
    }
}

export const removePinFromList = async (collectionName:string, listID: string, pinObject: any): Promise<void> => {
    try {
        const listRef = doc(db, collectionName, listID);
        await updateDoc(listRef, {
            pins: arrayRemove(pinObject)
        });
        const listSnapshot = await getDoc(listRef);
        const listData = listSnapshot.data();
        if(listData?.collaborative){
            removePinFromCollaborativeList(listID, pinObject);
        }
    } catch (error) {
        console.error("Error removing pin from list: ", error);
        throw new Error("Failed to remove pin from list");
    }
};

const removePinFromCollaborativeList = async (listID: string, pin: any): Promise<void> => {
    try {
        const listRef = doc(db, `collaborativeLists`, listID);
        const listSnapshot = await getDoc(listRef);
        if (!listSnapshot.exists()) {
            throw new Error("Collaborative list does not exist.");
        }

        const listData = listSnapshot.data();
        const collaborators: string[] = listData.collaborators.map((collaborator: { userID: string }) => collaborator.userID) || [];

        // Update collaborative list with the new pin and category
        await updateDoc(listRef, {
            pins: arrayRemove(pin),
        });

        console.log(`Pin removed from collaborative list with ID: ${listID}`);

        // Batch update for collaborators
        const batch = writeBatch(db);

        for (const collaboratorID of collaborators) {
            const userListRef = doc(db, `users/${collaboratorID}/lists/${listID}`);

            // Only update if the collaborator is NOT the original user who added the pin
            batch.update(userListRef, {
                pins: arrayRemove(pin),
            });
        }

        await batch.commit();
        console.log(`Pin removed from all collaborators' lists.`);
    }
    catch (error) {
        console.error("Error removing pin from collaborative list: ", error);
        throw new Error("Failed to remove pin from collaborative list");
    }
}


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

       return listData?.pins || [];

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


  export const handleAddToProfile = async (friendId: string, listId: string, userId: string) => {
    try {
        const db = getFirestore(app);

        // Get friend's list
        const friendListRef = doc(db, `users/${friendId}/lists/${listId}`);
        const friendListSnapshot = await getDoc(friendListRef);
        if (!friendListSnapshot.exists()) {
            throw new Error("Friend list does not exist.");
        }

        const friendListData = friendListSnapshot.data();
        const pinIDs: string[] = friendListData?.pins || [];

        // Fetch all pins in parallel
        const pinSnapshots = await Promise.all(
            pinIDs.map((pinID) => getDoc(doc(db, `users/${friendId}/pins/${pinID}`)))
        );

        const batch = writeBatch(db);
        const userPinsRef = collection(db, `users/${userId}/pins`);
        const userCategoriesRef = collection(db, `users/${userId}/categories`);

        const newPinIDs: string[] = [];
        const categoryIds = new Set<string>();

        pinSnapshots.forEach((pinSnapshot) => {
            if (pinSnapshot.exists()) {
                const pinData = pinSnapshot.data();
                const newPinRef = doc(userPinsRef);
                newPinIDs.push(newPinRef.id);

                batch.set(newPinRef, {
                    ...pinData, // Copy all pin data
                });

                if (pinData?.categoryId) {
                    categoryIds.add(pinData.categoryId);
                }
            }
        });

        // Fetch category details in parallel
        const categorySnapshots = await Promise.all(
            Array.from(categoryIds).map((categoryId) => getDoc(doc(db, `users/${friendId}/categories/${categoryId}`)))
        );

        // Add categories to Firestore
        categorySnapshots.forEach((categorySnapshot) => {
            if (categorySnapshot.exists()) {
                const categoryData = categorySnapshot.data();
                const categoryRef = doc(userCategoriesRef, categorySnapshot.id);
                batch.set(categoryRef, categoryData);
            }
        });

        // Add the list to the user's profile
        const userListRef = collection(db, `users/${userId}/lists`);
        const newUserListRef = await addDoc(userListRef, {
            listName: friendListData.listName,
            visible: false,
            pins: newPinIDs, // Store new pin IDs
            categories: Array.from(categoryIds), // Store category IDs
        });

        await batch.commit();

        console.log(`List added to profile with ID: ${newUserListRef.id}`);
    } catch (error) {
        console.error("Error adding list to profile:", (error as any).message);
    }
};

export const retrieveListName = async (userID: string, listID: string): Promise<string> => {
    try {
        const listDoc = doc(db, `users/${userID}/lists/${listID}`);
        const listSnapshot = await getDoc(listDoc);
        return listSnapshot.data()?.listName;
    } catch (error) {
        console.error("Error retrieving list name: ", error);
        throw new Error("Failed to retrieve list name");
    }
}

export const synchronizeCollaborativePin = async (listID: string, userID: string) => {
    try{
        //ONLY SYNC OVER THE PINS AND CATEGORIES THAT DONT EXIST IN THE USER'S PROFILE YET OR ELSE DUPLICATES WILL OCCUR
        const listRef = doc(db, `users/${userID}/lists`, listID);
        const listSnapshot = await getDoc(listRef);
        const pins = listSnapshot.data()?.pins || [];
        const categories = listSnapshot.data()?.categories || [];

        for(const category of categories){
            const categoryRef = doc(db, `users/${userID}/categories`, category.CategoryID);
            await setDoc(categoryRef, {
                ...category,
            });
        }

        for(const pin of pins){
           const pinRef = doc(db, `users/${userID}/pins`, pin.id);
         await setDoc(pinRef, {
                ...pin,
                });

        }
    } catch{

    }
}
