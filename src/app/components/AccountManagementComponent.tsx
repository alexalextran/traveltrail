import React, { useEffect, useState } from 'react';
import styles from '../Sass/ProfileComponent.module.scss';
import { useAuth } from '../context/authContext';  // Adjust the path as needed
import { collection, getFirestore, onSnapshot } from 'firebase/firestore';
import { app } from "../firebase"; // Ensure this path is correct
import { updateListVisibility } from '../firebaseFunctions/Lists';
export default function ProfileComponent() {
    const { logout, user } = useAuth();
    const [displayName, setDisplayName] = useState(user?.displayName || '');
    const [newPassword, setNewPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
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
    
        return () => unsubscribe(); // Clean up the subscription
    }, []);

    const handleResetPassword = () => {
      
    };

    const updateList = (id: string, checked: boolean) => {
        updateListVisibility(`users/${user.uid}/lists`, id, checked);
    }

    return (
        <div className={styles.profileContainer}>
            <main className={styles.main}>
                <h2>Profile</h2>
                <div className={styles.profileInfo}>
                    <label>Email:</label>
                    <span>{user?.email}</span>
                </div>

                <div className={styles.profileInfo}>
                    <label>My Freind Code:</label>
                    <span>{user?.uid}</span>
                </div>
                
                <div className={styles.profileInfo}>
                    <label>Display Name:</label>
                    <input
                        type="text"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                    />
                </div>
                <div className={styles.profileInfo}>
                    <label>New Password:</label>
                    <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                </div>
                <button onClick={handleResetPassword} className={styles.resetButton}>
                    Update Display Name
                </button>
                <button onClick={() => logout()} className={styles.logoutButton}>
                    Logout
                </button>
            </main>

            <main>
            Social Media
            <div>
                <h2>Lists</h2>
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
