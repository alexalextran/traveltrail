import React, { useEffect, useState } from 'react';
import styles from '../../Sass/ProfileComponent.module.scss';
import { useAuth } from '../../context/authContext';
import { collection, doc, getFirestore, onSnapshot, updateDoc } from 'firebase/firestore';
import { app } from "../../firebase";
import { updateListVisibility } from '../../firebaseFunctions/Lists';
import { toast } from 'react-toastify';

export default function ProfileComponent() {
    const { logout, user } = useAuth();
    const [displayName, setDisplayName] = useState(user?.displayName || '');
    const [lists, setLists] = useState<{ id: string; listName: string; visible: boolean; }[]>([]);

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
            unsubscribe();
            userDocUnsubscribe();
        };
    }, []);

    const updateList = (id: string, checked: boolean) => {
        updateListVisibility(`users/${user.uid}/lists`, id, checked);
    }

    const updateDisplayName = async () => {
        try {
            const userDocRef = doc(getFirestore(app), `users/${user.uid}`);
            await updateDoc(userDocRef, { displayName });
            toast.success('Name updated successfully', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        } catch (error) {
            toast.error('Name could not be updated', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
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
                    <label>My Friend Code:</label>
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
