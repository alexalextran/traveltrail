import { collection, addDoc, getFirestore, doc, deleteDoc, updateDoc, arrayUnion, arrayRemove, getDocs, getDoc, writeBatch, query, where, setDoc } from "firebase/firestore";
import { app } from "../firebase";
import { list } from "firebase/storage";
import { retrieveListName } from "./Lists";
import { retrieveDisplayName, retrieveUserProfilePicture } from "./friends";
import { Console, profile } from "console";

const db = getFirestore(app);
export { db };

export const sendCollaborativeListRequest = async (friendID: string, friendName: string, listID: string, userId: string, userName: string): Promise<void> => {
    try {
        if(await checkIfRequestExists(userId, friendID, listID)){
            throw new Error("Request already exists");
        }
        
        const friendRef = doc(db, `users/${friendID}/collaborativeRequests`, listID + '_' + userId);
        const userRef = doc(db, `users/${userId}/collaborativeRequests`, listID + '_' + userId);

        await setDoc(friendRef, {
            from: userId,
            fromName: userName,
            listID: listID,
            status: 'pending',
            listOwner: friendID
        });

        await setDoc(userRef, {
            to: friendID,
            toName: friendName,
            listID: listID,
            status: 'pending',
            listOwner: friendID
        });

        console.log(`Collaborative list request sent to ${friendID}`);
    } catch (error) {
        console.error("Error sending collaborative list request: ", error);
        throw new Error("Failed to send collaborative list request");
    }
}


export const checkIfRequestExists = async (userID: string, friendID: string, listID: string): Promise<boolean> => {
    try {
        const requestRef = doc(db, `users/${userID}/collaborativeRequests`, listID);
        const requestSnapshot = await getDoc(requestRef);

        if (requestSnapshot.exists()) {
            const requestData = requestSnapshot.data();
            return requestData.to === friendID;
        }

        return false;
    } catch (error) {
        console.error("Error checking if request exists: ", error);
        throw new Error("Failed to check if request exists");
    }
}


export const retrieveCollaborativeRequests = async (userID: string): Promise<any[]> => {
    try {
        const collaborativeRequestsRef = collection(db, `users/${userID}/collaborativeRequests`);
        const querySnapshot = await getDocs(collaborativeRequestsRef);

        return querySnapshot.docs.filter((doc) => doc.data().status === 'pending').map((doc) => {
            const data = doc.data();
            
            // Return all fields from the document
            return {
                id: doc.id,
                from: data.from || null,
                fromName: data.fromName || null,
                to: data.to || null,
                toName: data.toName || null,
                listID: data.listID,
                status: data.status,
                listOwner: data.listOwner
            };
        });
    } catch (error) {
        console.error("Error retrieving collaborative requests: ", error);
        throw new Error("Failed to retrieve collaborative requests");
    }
};

export const retrieveCollaborativeRequestStatus = async (userID: string, listID: string): Promise<string> => {
    try {
        const requestRef = doc(db, `users/${userID}/collaborativeRequests`, listID);
        const requestSnapshot = await getDoc(requestRef);

        if (requestSnapshot.exists()) {
            return requestSnapshot.data().status;
        }

        return 'none';
    }
    catch (error) {
        console.error("Error retrieving collaborative request status: ", error);
        throw new Error("Failed to retrieve collaborative request status");
    }
}


export const declineCollaborativeRequest = async (userID: string, requestID: string): Promise<void> => {
    try {
        // 1. Get the request data first to find the other user
        const requestRef = doc(db, `users/${userID}/collaborativeRequests`, requestID);
        const requestSnapshot = await getDoc(requestRef);
        
        if (!requestSnapshot.exists()) {
            throw new Error("Request not found");
        }
        
        const requestData = requestSnapshot.data();
        
        // 2. Determine the other user's ID (could be in 'from' or 'to' field)
        const otherUserID = requestData.from || requestData.to;
        
        if (!otherUserID) {
            throw new Error("Invalid request data: missing user reference");
        }
        
        // 3. Find and delete the corresponding request in the other user's collection
        // We need to query for it since we don't know its ID
        const otherUserRequestsRef = collection(db, `users/${otherUserID}/collaborativeRequests`);
        const otherUserQuerySnapshot = await getDocs(
            query(otherUserRequestsRef, 
                where("listID", "==", requestData.listID)
            )
        );
        
        // 4. Delete both requests in a batch
        const batch = writeBatch(db);
        
        // Delete the current user's request
        batch.delete(requestRef);
        
        // Delete the other user's corresponding request if found
        if (!otherUserQuerySnapshot.empty) {
            otherUserQuerySnapshot.forEach(doc => {
                batch.delete(doc.ref);
            });
        }
        
        // Commit the batch
        await batch.commit();
        
        console.log("Successfully declined and deleted collaborative requests");
    } catch (error) {
        console.error("Error declining collaborative request: ", error);
        throw new Error("Failed to decline collaborative request");
    }
};


export const acceptCollaborativeRequest = async (userID: string, requestID: string, friendID: string): Promise<void> => {
    try {
        // 1. Get the request data first to find the other user
        const requestRef = doc(db, `users/${userID}/collaborativeRequests`, requestID);
        const requestSnapshot = await getDoc(requestRef);
        
        if (!requestSnapshot.exists()) {
            throw new Error("Request not found");
        }
        
        const requestData = requestSnapshot.data();
        
        // 2. Determine the other user's ID (could be in 'from' or 'to' field)
        
        if (!friendID) {
            throw new Error("Invalid request data: missing user reference");
        }
        
        // 3. Find the corresponding request in the other user's collection
        const otherUserRequestsRef = collection(db, `users/${friendID}/collaborativeRequests`);
        const otherUserQuerySnapshot = await getDocs(
            query(otherUserRequestsRef, 
                where("listID", "==", requestData.listID)
            )
        );
        
        // 4. Update the status of both requests in a batch
        const batch = writeBatch(db);
        
        // Update the current user's request
        batch.update(requestRef, { status: 'accepted' });
        
        // Update the other user's corresponding request if found
        if (!otherUserQuerySnapshot.empty) {
            otherUserQuerySnapshot.forEach(doc => {
                batch.update(doc.ref, { status: 'accepted' });
            });
        }
        
        // Commit the batch
        await batch.commit();

        const listOwnerName = await retrieveDisplayName(requestData.listOwner);
        

        console.log(requestData)
        
        const listOwnerRef = doc(db, `users/${requestData.listOwner}/lists`, requestData.listID);
        await updateDoc(listOwnerRef, {
            collaborative: true,
            collaborators: arrayUnion(
            { userID: friendID, edit: true, displayName: requestData.fromName, photoURL: await retrieveUserProfilePicture(friendID) },
            { userID: requestData.listOwner, edit: true, displayName:listOwnerName, photoURL: await retrieveUserProfilePicture(requestData.listOwner) } // Add the list owner as a collaborator
            ),
            owner: requestData.listOwner
        });

        

        const friendListRef = doc(db, `users/${friendID}/lists`, requestData.listID);
        const listOwnerSnapshot = await getDoc(listOwnerRef);
        await addCollaborativeList(userID, friendID, requestData.listID, requestData.fromName, listOwnerName, listOwnerSnapshot);


        if (listOwnerSnapshot.exists()) {
            await setDoc(friendListRef, listOwnerSnapshot.data());
        }




        
        console.log("Successfully accepted collaborative requests");
    } catch (error) {
        console.error("Error accepting collaborative request: ", error);
        console.log(error)
        throw new Error("Failed to accept collaborative request");
    }
}

export const addCollaborativeList = async (userID: string, friendID: string, listID: string, friendDisplayName: string, listOnwerDisplayName: string, listOwnerData: any): Promise<void> => {
    try {

        //const listName = await retrieveListName(userID, listID);
        const collaborativeListRef = doc(db, `collaborativeLists/${listID}`);
        await setDoc(collaborativeListRef, {
            ...listOwnerData.data()
        });

        console.log(`Collaborative list added to user: ${userID}`);
    } catch (error) {
        console.error("Error adding collaborative list: ", error);
        throw new Error("Failed to add collaborative list");
    }
}