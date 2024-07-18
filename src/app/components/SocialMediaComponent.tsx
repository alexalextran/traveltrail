import React, { useState, useEffect } from 'react';
import styles from '../Sass/ProfileComponent.module.scss';
import { useAuth } from '../context/authContext'; // Adjust the path as needed
import {
    collection,
    getFirestore,
    onSnapshot,
    addDoc,
    updateDoc,
    doc,
    getDoc,
    query,
    where,
    getDocs,
    setDoc,
    writeBatch // Import writeBatch for Firestore batch operations
} from 'firebase/firestore';
import { app } from "../firebase"; // Ensure this path is correct

export default function SocialMediaComponent() {
    const { user } = useAuth();
    const [friendCode, setFriendCode] = useState('');
    const [friendRequests, setFriendRequests] = useState<{ id: string; from: string; displayName: string; status: string }[]>([]);
    const [friends, setFriends] = useState<{ friendID: string; displayName: string }[]>([]);
    const [publicLists, setPublicLists] = useState<{ friendId: string; listId: string; listName: string }[]>([]);
    const [listToBeAdded, setListToBeAdded] = useState('');

    useEffect(() => {
        const db = getFirestore(app);
        const friendRequestsRef = collection(db, `users/${user.uid}/friendRequests`);
        const unsubscribeFriendRequests = onSnapshot(friendRequestsRef, (snapshot) => {
            const fetchedRequests = snapshot.docs.map(doc => ({
                id: doc.id,
                from: doc.data().from,
                displayName: doc.data().displayName,
                status: doc.data().status
            }));
            setFriendRequests(fetchedRequests);
        });

        const friendsRef = collection(db, `users/${user.uid}/friends`);
        const unsubscribeFriends = onSnapshot(friendsRef, (snapshot) => {
            const fetchedFriends = snapshot.docs.map(doc => ({
                friendID: doc.data().friendID,
                displayName: doc.data().displayName
            }));
            setFriends(fetchedFriends);
        });

        return () => {
            unsubscribeFriendRequests();
            unsubscribeFriends();
        };
    }, [user.uid]);

    useEffect(() => {
        const fetchPublicLists = async () => {
            const db = getFirestore(app);
            const publicLists: { friendId: string; listId: string; listName: string }[] = [];

            for (const friend of friends) {
                const listsRef = collection(db, `users/${friend.friendID}/lists`);
                const q = query(listsRef, where("visible", "==", true));
                const snapshot = await getDocs(q);

                snapshot.docs.forEach(doc => {
                    publicLists.push({
                        friendId: friend.friendID,
                        listId: doc.id,
                        listName: doc.data().listName
                    });
                });
            }

            setPublicLists(publicLists);
        };

        if (friends.length > 0) {
            fetchPublicLists();
        }
    }, [friends]);

    const handleAddFriend = async () => {
        if (friendCode.trim() === '') return;
        const db = getFirestore(app);
        const friendRequestsRef = collection(db, `users/${friendCode}/friendRequests`);
        await addDoc(friendRequestsRef, {
            from: user.uid,
            displayName: user.displayName,
            status: 'pending'
        });
        setFriendCode('');
    };

    const handleAcceptRequest = async (requestId: string, from: string) => {
        const db = getFirestore(app);

        const friendsDisplayNameDoc = doc(db, `users/${from}`);
        const friendsDisplayNameSnapshot = await getDoc(friendsDisplayNameDoc);
        const friendsDisplayName = friendsDisplayNameSnapshot.data()?.displayName;

        const userDisplayNameDoc = doc(db, `users/${user.uid}`);
        const userDisplayNameSnapshot = await getDoc(userDisplayNameDoc);
        const userDisplayName = userDisplayNameSnapshot.data()?.displayName;

        const userFriendsRef = collection(db, `users/${user.uid}/friends`);
        const friendFriendsRef = collection(db, `users/${from}/friends`);

        await addDoc(userFriendsRef, {
            friendID: from,
            displayName: friendsDisplayName
        });

        await addDoc(friendFriendsRef, {
            friendID: user.uid,
            displayName: userDisplayName
        });

        const requestDocRef = doc(db, `users/${user.uid}/friendRequests`, requestId);
        await updateDoc(requestDocRef, { status: 'accepted' });
    };

    const handleDeclineRequest = async (requestId: string) => {
        const db = getFirestore(app);
        const requestDocRef = doc(db, `users/${user.uid}/friendRequests`, requestId);
        await updateDoc(requestDocRef, { status: 'declined' });
    };

    const handleAddToProfile = async (friendId: string, listId: string) => {
        const db = getFirestore(app);
        const friendListRef = doc(db, `users/${friendId}/lists/${listId}`);
        const friendListSnapshot = await getDoc(friendListRef);

        if (!friendListSnapshot.exists()) {
            console.error("Friend list does not exist");
            return;
        }

        const friendListData = friendListSnapshot.data();
        const pinIDs = friendListData?.pins || [];

        const uniqueCategories = new Set<string>();
        const pins = [];

        for (const pinID of pinIDs) {
            const pinRef = doc(db, `users/${friendId}/pins/${pinID}`);
            const pinSnapshot = await getDoc(pinRef);
            if (pinSnapshot.exists()) {
                const pinData = pinSnapshot.data();
                pins.push(pinID);

                // Collect unique categories from each pin
                if (pinData?.category) {
                    uniqueCategories.add(pinData.category);
                }
            }
        }

        // Check if each category already exists before adding
        const userCategoriesRef = collection(db, `users/${user.uid}/categories`);
        const batch = writeBatch(db);

        for (const category of uniqueCategories) {
            const categoryQuery = query(userCategoriesRef, where("categoryName", "==", category));
            const categorySnapshot = await getDocs(categoryQuery);
            if (categorySnapshot.empty) {
                const categoryRef = doc(userCategoriesRef);
                batch.set(categoryRef, {
                    categoryName: category,
                    categoryColor: '#FFFFFF' // Default color in #FFFFFF format
                });
            } else {
                console.log(`Category '${category}' already exists.`);
            }
        }

        await batch.commit();

        // Add the list to the user's profile
        const userListRef = collection(db, `users/${user.uid}/lists`);
        const newUserListRef = await addDoc(userListRef, {
            listName: friendListData.listName,
            visible: false,
            pins,
            categories: Array.from(uniqueCategories) // Convert Set to Array
        });

        console.log(`List added to profile with ID: ${newUserListRef.id}`);
    };

    return (
        <>
            <h2>Social Media</h2>
            <div className={styles.addFriendSection}>
                <input
                    type="text"
                    placeholder="Enter Friend Code"
                    value={friendCode}
                    onChange={(e) => setFriendCode(e.target.value)}
                />
                <button onClick={handleAddFriend}>Add Friend</button>
            </div>
            <div className={styles.friendRequestsSection}>
                <h3>Friend Requests</h3>
                <ul>
                    {friendRequests.map((request) => {
                        if (request.status === 'pending') {
                            return (
                                <li key={request.id}>
                                    <span>{request.displayName}</span>
                                    <button onClick={() => handleAcceptRequest(request.id, request.from)}>Accept</button>
                                    <button onClick={() => handleDeclineRequest(request.id)}>Decline</button>
                                </li>
                            );
                        } else {
                            return null;
                        }
                    })}
                </ul>
            </div>
            <div className={styles.friendsSection}>
                <h3>Friends</h3>
                <ul>
                    {friends.map((friend) => (
                        <li key={friend.friendID}>
                            {friend.displayName}
                            <form onSubmit={(e) => {
                                e.preventDefault();
                                handleAddToProfile(friend.friendID, listToBeAdded);
                            }}>
                                <select onChange={(e) => setListToBeAdded(e.target.value)}>
                                <option >Pick an option</option>

                                    {publicLists
                                        .filter(list => list.friendId === friend.friendID)
                                        .map((list) => (
                                            <option key={list.listId} value={list.listId}>{list.listName}</option>
                                        ))}
                                </select>
                                <button type="submit">Add to Profile</button>
                            </form>
                        </li>
                    ))}
                </ul>
            </div>
        </>
    );
}
