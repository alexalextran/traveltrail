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
    query,
    where,
    getDocs,
    setDoc,
    writeBatch
} from 'firebase/firestore';
import { app } from "../../firebase";
import { toast } from 'react-toastify';
import ManageFriendsComponent from './ManageFriendsComponent';
import FriendRequestsComponent from './FriendRequestsComponent';
import ViewProfileComponent from './ViewProfileComponent';
import CollaborativeComponent from './CollborativeComponent';
export default function SocialMediaComponent() {
    const { user } = useAuth();
    const [friendRequests, setFriendRequests] = useState<{ id: string; from: string; displayName: string; status: string }[]>([]);
    const [friends, setFriends] = useState<{ friendID: string; displayName: string }[]>([]);
    const [filteredFriends, setFilteredFriends] = useState<{ friendID: string; displayName: string }[]>([]);
    const [publicLists, setPublicLists] = useState<{ friendId: string; listId: string; listName: string }[]>([]);
    const [searchFriends, setsearchFriends] = useState('');
    const [friendCode, setFriendCode] = useState('');
    const [viewProfile, setviewProfile] = useState(false)
    const [profileData, setprofileData] = useState<{ friendID: string; displayName: string }>({ friendID: '', displayName: '' });

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
            setFilteredFriends(fetchedFriends); // Initialize filtered friends
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

    useEffect(() => {
        const filtered = friends.filter(friend =>
            friend.displayName.toLowerCase().includes(searchFriends.toLowerCase())
        );
        setFilteredFriends(filtered);
    }, [searchFriends, friends]);

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



       const handleAddFriend = async () => {
        const db = getFirestore(app);
        if (friendCode.trim() === '') return;
    
        // Check if the friendCode exists
        const friendDocRef = doc(db, `users/${friendCode}`);
        const friendDocSnapshot = await getDoc(friendDocRef);
        if (!friendDocSnapshot.exists() || friendCode === user.uid) {
            toast.error("Invalid friend code. Please try again.", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
            setFriendCode('');
            return;
        }
    
        // Check if the user is already a friend
        const friendsRef = collection(db, `users/${user.uid}/friends`);
        const friendsSnapshot = await getDocs(friendsRef);
        const isFriend = friendsSnapshot.docs.some(doc => doc.data().friendID === friendCode);
        const friendsName = friendsSnapshot.docs.find(doc => doc.data().friendID === friendCode);
    
        if (isFriend) {
            toast.error(`${friendsName?.data().displayName} has already been added as a friend`, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
            return;
        }
    
        // Get current user's display name
        const friendRequestsRef = collection(db, `users/${friendCode}/friendRequests`);
        const userDocRef = doc(db, `users/${user.uid}`);
        const userDocSnapshot = await getDoc(userDocRef);
    
        await addDoc(friendRequestsRef, {
            from: user.uid,
            displayName: userDocSnapshot.data()?.displayName,
            status: 'pending'
        });
        toast.success(`Friend Request was sent`, {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
        });
        setFriendCode('');
    };
    
    return (
        <main className={styles.socialMediaMain}>

            {viewProfile 
            ? 
            <ViewProfileComponent 
            profileData={profileData}
            setViewProfile={setviewProfile}/> 
            :
            <>
            <FriendRequestsComponent 
                friendRequests={friendRequests} 
                user={user} 
                friends={friends} 
                handleAcceptRequest={handleAcceptRequest}
                handleDeclineRequest={handleDeclineRequest}
                handleAddFriend={handleAddFriend}
                friendCode={friendCode}
                setFriendCode={setFriendCode}
            />
            <ManageFriendsComponent
                setprofileData={setprofileData}
                setViewProfile={setviewProfile} 
                friends={filteredFriends} 
                searchFriends={searchFriends} 
                setSearchFriends={setsearchFriends} 
            />
            <CollaborativeComponent />
            </>
            
            }

            
        </main>
    );
}