import React, { useState, useEffect } from 'react';
import styles from '../../Sass/ProfileComponent.module.scss';
import { useAuth } from '../../context/authContext'; 
import {
    collection,
    getFirestore,
    onSnapshot,
    addDoc,
    updateDoc,
    doc,
    getDoc,
    getDocs,
    query,
    where
} from 'firebase/firestore';
import { app } from "../../firebase";
import { toast } from 'react-toastify';

interface FriendRequestsComponentProps {
    friendRequests: { id: string; from: string; displayName: string; status: string }[];
    user: any;
    friends: { friendID: string; displayName: string }[];
}



const FriendRequestsComponent: React.FC<FriendRequestsComponentProps> = ({ friendRequests: initialFriendRequests, user, friends }) => {
    const { user: authUser } = useAuth();
    const [friendCode, setFriendCode] = useState('');
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

    const handleAddFriend = async () => {
        const db = getFirestore(app);
        if (friendCode.trim() === '') return;
    
        const friendDocRef = doc(db, `users/${friendCode}`);
        const friendDocSnapshot = await getDoc(friendDocRef);
        if (!friendDocSnapshot.exists() || friendCode === user.uid) {
            toast.error("Invalid friend code. Please try again.");
            setFriendCode('');
            return;
        }
    
        const friendRequestsRef = collection(db, `users/${friendCode}/friendRequests`);
        const userDocRef = doc(db, `users/${user.uid}`);
        const userDocSnapshot = await getDoc(userDocRef);
    
        await addDoc(friendRequestsRef, {
            from: user.uid,
            displayName: userDocSnapshot.data()?.displayName,
            status: 'pending'
        });
        toast.success(`Friend request sent!`);
        setFriendCode('');
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
                    {friendRequests.map((request: FriendRequest) => (
                        request.status === 'pending' && (
                            <li key={request.id}>
                                <span>{request.displayName}</span>
                                <button>Accept</button>
                                <button>Decline</button>
                            </li>
                        )
                    ))}
                </ul>
            </div>
        </div>
    );
}
export default FriendRequestsComponent;
