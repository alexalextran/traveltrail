import { Category } from './../types/categoryData';
// import { removePinFromList } from './Lists';
import { collection, addDoc, getFirestore, doc, deleteDoc, updateDoc, arrayUnion, arrayRemove, getDocs, getDoc, writeBatch, query, where, setDoc } from "firebase/firestore";
import { app } from "../firebase";
import { list } from 'firebase/storage';

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
        
        // First, get the current list data to check categories
        const listSnapshot = await getDoc(listRef);
        const listData = listSnapshot.data();
        

        // Remove the pin
        await updateDoc(listRef, {
            pins: arrayRemove(pinObject)
        });
        
        // Fetch the updated list data after pin removal
        const updatedListSnapshot = await getDoc(listRef);
        const updatedListData = updatedListSnapshot.data();
        const updatedCategories = updatedListData?.categories || [];

        // Check and remove the specific category if no other pins use it
        if (updatedListData?.categories && updatedListData?.pins && pinObject.categoryId) {
            
            // Check if any remaining pins use this category
            const pinsWithCategory = updatedListData.pins.filter(
                (pin: any) => pin.categoryId === pinObject.categoryId
            );
            
            
            // If no other pins use this category, remove it
            if (pinsWithCategory.length === 0) {
                const updatedCategories = updatedListData.categories.filter(
                    (category: any) => category.CategoryID !== pinObject.categoryId
                );

                updatedListData.categories.forEach((category: { CategoryID: string }) => {
                    if (pinObject.categoryId === category.CategoryID) {
                        console.log(`Match found: ${category.CategoryID}`);
                    } else {
                        console.log(`No match: ${category.CategoryID}`);
                    }
                });
                
                
                await updateDoc(listRef, {
                    categories: updatedCategories
                });

                if(listData?.collaborative){
                    await removePinFromCollaborativeList(listID, pinObject, updatedCategories);
                }
                return;
            }
        }
      

        
        // Existing collaborative list handling
        if(listData?.collaborative){
            await removePinFromCollaborativeList(listID, pinObject, updatedCategories);
        }
    } catch (error) {
        console.error("Error removing pin from list: ", error);
        throw new Error("Failed to remove pin from list");
    }
};

const removePinFromCollaborativeList = async (listID: string, pin: any, updatedCategories: any): Promise<void> => {
    try {
        console.log(updatedCategories);

        const listRef = doc(db, `collaborativeLists`, listID);
        const listSnapshot = await getDoc(listRef);
        if (!listSnapshot.exists()) {
            throw new Error("Collaborative list does not exist.");
        }

        const listData = listSnapshot.data();

        const collaborators: string[] = listData.collaborators.map((collaborator: { userID: string }) => collaborator.userID) || [];

        // Remove the pin from the collaborative list
        await updateDoc(listRef, {
            pins: arrayRemove(pin),
        });

        await updateDoc(listRef, {
         categories: updatedCategories
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

            batch.update(userListRef, {
                categories: updatedCategories
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
      
        // Add the list to the user's profile
        const userListRef = collection(db, `users/${userId}/lists`);
        const newUserListRef = await addDoc(userListRef, {
            ...friendListData,
            collaborative: false,
            collaborators: [],
            owner: userId
        });

        // Add the listID property after the document is created
        await updateDoc(newUserListRef, {
            listID: newUserListRef.id
        });


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
