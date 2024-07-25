import React, { useState, useEffect } from 'react';
import { writeList } from '../firebaseFunctions/Lists'; // Ensure this path is correct
import { app } from "../firebase"; // Ensure this path is correct
import { getFirestore, collection, onSnapshot } from 'firebase/firestore';
import { useAuth } from '../context/authContext'; // Import the useAuth hook
import styles from '../Sass/ListComponent.module.scss';
import { MdDeleteForever } from 'react-icons/md';
import { deleteList } from '../firebaseFunctions/Lists';
import { list } from 'firebase/storage';

function ManageLists() {
    const [listName, setListName] = useState('');
    const [lists, setLists] = useState<{ id: string; listName: string; }[]>([]);
    const db = getFirestore(app);
    const { user } = useAuth(); // Use the useAuth hook

    useEffect(() => {
        const listCollectionRef = collection(db, `users/${user.uid}/lists`);
        const unsubscribe = onSnapshot(listCollectionRef, (snapshot) => {
            const fetchedLists = snapshot.docs.map(doc => ({
                id: doc.id,
                listName: doc.data().listName, // Add the listName property
            }));
            setLists(fetchedLists);
        });

        return () => unsubscribe(); // Clean up the subscription
    }, []);


    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setListName(event.target.value);
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!listName.trim()) return; // Prevent adding empty lists

        try {
            const result = await writeList(`users/${user.uid}/lists`,{ listName });
            console.log('List added:', result);
            setListName(''); // Reset the input field after successful addition
        } catch (error) {
            console.error('Error adding list:', error);
        }
    };


    const callDeleteList =  async (listId: string) => {
        await deleteList(`users/${user.uid}/lists` ,listId);
    }

   return (
         
            <div className={styles.Listcontent}>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        value={listName}
                        onChange={handleInputChange}
                        placeholder="Enter list name"
                        className={styles.input}
                    />
                    <button type="submit" className={styles.button}>Add List</button>
                </form>
                <div className={styles.lists}>
                    {lists.map(list => (
                        <div key={list.id} className={styles.listItem}>
                             <MdDeleteForever onClick={() => callDeleteList(list.id)}/>
                            <p>{list.listName}</p>
                        </div>
                    ))}
                </div>
            </div>
    );
}


export default ManageLists;