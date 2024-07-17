import React, { useState, useEffect } from 'react';
import styles from '../Sass/ProfileComponent.module.scss';
import { useAuth } from '../context/authContext'; // Adjust the path as needed
import { collection, getFirestore, onSnapshot, addDoc, updateDoc, doc } from 'firebase/firestore';
import { app } from "../firebase"; // Ensure this path is correct

export default function SocialMediaComponent() {
    const { user } = useAuth();
    const [friendCode, setFriendCode] = useState('');
    const [friendRequests, setFriendRequests] = useState<{ id: string; from: string }[]>([]);
    const [friends, setFriends] = useState<{ id: string; displayName: string }[]>([]);

    useEffect(() => {
        const db = getFirestore(app);
        const friendRequestsRef = collection(db, `users/${user.uid}/friendRequests`);
        const unsubscribeFriendRequests = onSnapshot(friendRequestsRef, (snapshot) => {
            const fetchedRequests = snapshot.docs.map(doc => ({
                id: doc.id,
                from: doc.data().from
            }));
            setFriendRequests(fetchedRequests);
        });

        const friendsRef = collection(db, `users/${user.uid}/friends`);
        const unsubscribeFriends = onSnapshot(friendsRef, (snapshot) => {
            const fetchedFriends = snapshot.docs.map(doc => ({
                id: doc.id,
                displayName: doc.data().displayName
            }));
            setFriends(fetchedFriends);
        });

        return () => {
            unsubscribeFriendRequests();
            unsubscribeFriends();
        };
    }, [user.uid]);

    const handleAddFriend = async () => {
        if (friendCode.trim() === '') return;
        const db = getFirestore(app);
        const friendRequestsRef = collection(db, `users/${friendCode}/friendRequests`);
        await addDoc(friendRequestsRef, { from: user.uid });
        setFriendCode('');
    };

    const handleAcceptRequest = async (requestId: string, from: string) => {
        const db = getFirestore(app);
        const userFriendsRef = collection(db, `users/${user.uid}/friends`);
        const friendFriendsRef = collection(db, `users/${from}/friends`);

        await addDoc(userFriendsRef, { displayName: from });
        await addDoc(friendFriendsRef, { displayName: user.uid });

        const requestDocRef = doc(db, `users/${user.uid}/friendRequests`, requestId);
        await updateDoc(requestDocRef, { status: 'accepted' });
    };

    const handleDeclineRequest = async (requestId: string) => {
        const db = getFirestore(app);
        const requestDocRef = doc(db, `users/${user.uid}/friendRequests`, requestId);
        await updateDoc(requestDocRef, { status: 'declined' });
    };

    return (
        <div className={styles.socialMediaContainer}>
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
                    {friendRequests.map((request) => (
                        <li key={request.id}>
                            <span>{request.from}</span>
                            <button onClick={() => handleAcceptRequest(request.id, request.from)}>Accept</button>
                            <button onClick={() => handleDeclineRequest(request.id)}>Decline</button>
                        </li>
                    ))}
                </ul>
            </div>
            <div className={styles.friendsSection}>
                <h3>Friends</h3>
                <ul>
                    {friends.map((friend) => (
                        <li key={friend.id}>{friend.displayName}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
