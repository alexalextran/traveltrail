import { collection, addDoc, getFirestore, doc, deleteDoc, updateDoc, arrayUnion, arrayRemove, query, where, getDocs, getDoc } from "firebase/firestore";
import { app } from "../firebase";

const db = getFirestore(app);

export const removeFriend = async (friendID: string, userID: string): Promise<void> => {
    try {
        const friendsCollectionRef = collection(db, `users/${userID}/friends`);
        const q = query(friendsCollectionRef, where("friendID", "==", friendID));
        const querySnapshot = await getDocs(q);

        querySnapshot.forEach(async (docSnapshot) => { //remove selected friend from user's friends list
            await deleteDoc(doc(db, `users/${userID}/friends/${docSnapshot.id}`));
        });

        const externalFriendsCollectionRef = collection(db, `users/${friendID}/friends`);
        const q2 = query(externalFriendsCollectionRef, where("friendID", "==", userID));
        const querySnapshot2 = await getDocs(q2);

        querySnapshot2.forEach(async (docSnapshot) => { //remove selected friend from user's friends list
            await deleteDoc(doc(db, `users/${friendID}/friends/${docSnapshot.id}`));
        }); 

        console.log(`Friend removed with ID: ${friendID}`);
    } catch (error) {
        console.error("Error removing friend: ", error);
    }



}


export const retrieveDisplayName = async (userID: string): Promise<string> => {
    try {
        const userDoc = doc(db, `users/${userID}`);
        const userSnapshot = await getDoc(userDoc);
        return userSnapshot.data()?.displayName;
    } catch (error) {
        console.error("Error retrieving display name: ", error);
        throw new Error("Failed to retrieve display name");
    }
}

export const fetchUserData = async (userID: string): Promise<any> => {
    try {
        const userDoc = doc(db, `users/${userID}`);
        const userSnapshot = await getDoc(userDoc);
        return userSnapshot.data();
    } catch (error) {
        console.error("Error fetching user data: ", error);
        throw new Error("Failed to fetch user data");
    }
}

export const returnUsers = async (userIDs: string[]): Promise<any> => {
    try {
        const users = [];
        for (const userID of userIDs) {
            const userDoc = doc(db, `users/${userID}`);
            const userSnapshot = await getDoc(userDoc);
            const userData = userSnapshot.data();
            if (userData) {
                users.push({ ...userData, userID });
            }
        }
        return users;
    } catch (error) {
        console.error("Error retrieving users: ", error);
        throw new Error("Failed to retrieve users");
    }
}


export const retrieveUserProfilePicture = async (userID: string): Promise<string> => {
    try {
        const userDoc = doc(db, `users/${userID}`);
        const userSnapshot = await getDoc(userDoc);
        return userSnapshot.data()?.photoURL;
    } catch (error) {
        console.error("Error retrieving profile picture: ", error);
        throw new Error("Failed to retrieve profile picture");
    }
}