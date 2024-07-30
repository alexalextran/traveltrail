import React, { useEffect, useState } from 'react';
import styles from '../Sass/ProfileComponent.module.scss';
import { useAuth } from '../context/authContext';  // Adjust the path as needed
import { collection, doc, getFirestore, onSnapshot, updateDoc } from 'firebase/firestore';
import { app } from "../firebase"; // Ensure this path is correct
import { updateListVisibility } from '../firebaseFunctions/Lists';
export default function ProfileComponent() {
    const { logout, user } = useAuth();
    const [displayName, setDisplayName] = useState(user?.displayName || '');
    const [lists, setLists] = useState<{ id: string; listName: string; visible:boolean }[]>([]);



    useEffect(() => {
        const db = getFirestore(app);
        const listCollectionRef = collection(db, `users/${user.uid}/lists`);
        const unsubscribe = onSnapshot(listCollectionRef, (snapshot) => {
            const fetchedLists = snapshot.docs.map(doc => ({
                id: doc.id,
                listName: doc.data().listName,
                visible: doc.data().visible
            }));
            setLists(fetchedLists);
        });

        const userDocRef = doc(db, `users/${user.uid}`);
        const userDocUnsubscribe = onSnapshot(userDocRef, (doc) => {
            if (doc.exists()) {
                const userData = doc.data();
                setDisplayName(userData.displayName);
            }
        });

        return () => {
            unsubscribe(); // Clean up the list subscription
            userDocUnsubscribe(); // Clean up the user document subscription
        };
    }, []);

    

    const updateList = (id: string, checked: boolean) => {
        updateListVisibility(`users/${user.uid}/lists`, id, checked);
    }

    const updateDisplayName = async () => {
        try {
            const userDocRef = doc(getFirestore(app), `users/${user.uid}`);
            await updateDoc(userDocRef, { displayName });
            console.log('Display name updated successfully!');
        } catch (error) {
            console.error('Error updating display name:', error);
        }
    }
    

    return (
        <div className={styles.profileContainer}>
            <main className={styles.main}>
                <h2>Profile</h2>
                <div className={styles.profileInfo}>
                    <label>Email:</label>
                    <p>{user?.email}</p>
                </div>

                <div className={styles.profileInfo}>
                    <label>My Freind Code:</label>
                    <p>{user?.uid}</p>
                </div>
                
                <div className={styles.profileInfo}>
                    <label>Display Name:</label>
                    <input
                        type="text"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                    />
                </div>
              
                <button onClick={updateDisplayName} className={styles.resetButton}>
                    Update Display Name
                </button>
                <button onClick={() => logout()} className={styles.logoutButton}>
                    Logout
                </button>

                <div className={styles.socialMediaMain}>
                <h2>My Public Lists</h2>
                <div className={styles.SocialMedia}>
                <ul>
                    {lists.map((list) => (
                        <li key={list.id}>
                            <input
                            
                            checked={list.visible}
                                type="checkbox"
                                onChange={(e) => updateList(list.id, e.target.checked)}
                            />
                            {list.listName}
                        </li>
                    ))}
                </ul>
                </div>
            </div>
            </main>

           

        </div>
    );
}
