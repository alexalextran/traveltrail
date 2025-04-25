import React, { useState, useEffect } from 'react';
import styles from '../../Sass/ProfileComponent.module.scss';
import {
    collection,
    getFirestore,
    onSnapshot,
} from 'firebase/firestore';
import { app } from "../../firebase";

interface FriendRequestsComponentProps {
    friendRequests: { id: string; from: string; displayName: string; status: string }[];
    user: any;
    friends: { friendID: string; displayName: string }[];
    handleAcceptRequest: (requestId: string, from: string) => void;
    handleDeclineRequest: (requestId: string) => void;
    handleAddFriend: () => void; // Updated type - no parameter needed
    setFriendCode: React.Dispatch<React.SetStateAction<string>>; // More specific type
    friendCode: string;
}

const FriendRequestsComponent: React.FC<FriendRequestsComponentProps> = ({
    friendRequests: initialFriendRequests,
    user,
    friends,
    handleAcceptRequest,
    handleDeclineRequest,
    handleAddFriend,
    setFriendCode,
    friendCode
}) => {

    interface FriendRequest {
        id: string;
        from: string;
        displayName: string;
        status: string;
    }

    const [friendRequests, setFriendRequests] = useState<FriendRequest[]>(initialFriendRequests);

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

        return () => unsubscribeFriendRequests();
    }, [user.uid]);


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
                {friendRequests.filter(request => request.status === 'pending').length > 0 ? (
                    <ul>
                        {friendRequests.map((request: FriendRequest) => (
                            request.status === 'pending' && (
                                <li key={request.id}>
                                    <span>{request.displayName}</span>
                                    <button onClick={() => handleAcceptRequest(request.id, request.from)}>Accept</button>
                                    <button onClick={() => handleDeclineRequest(request.id)}>Decline</button>
                                </li>
                            )
                        ))}
                    </ul>
                ) : (
                    <p className={styles.noFriendRequests}>No pending friend requests</p>
                )}
            </div>
        </div>
    );
}

export default FriendRequestsComponent;