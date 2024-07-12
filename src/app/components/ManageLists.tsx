import React, { useState, useEffect } from 'react';
import { writeList } from '../firebaseFunctions/Lists'; // Ensure this path is correct
import { app } from "../firebase"; // Ensure this path is correct
import { getFirestore, collection, onSnapshot } from 'firebase/firestore';

function ManageLists() {
    const [listName, setListName] = useState('');
    const [lists, setLists] = useState<{ id: string; listName: string; }[]>([]);
    const db = getFirestore(app);

    useEffect(() => {
        const listCollectionRef = collection(db, 'users/alextran/lists');
        const unsubscribe = onSnapshot(listCollectionRef, (snapshot) => {
            const fetchedLists = snapshot.docs.map(doc => ({
                id: doc.id,
                listName: doc.data().listName, // Add the listName property
            }));
            setLists(fetchedLists);
        });

        return () => unsubscribe(); // Clean up the subscription
    }, []);

    console.log('Lists:', lists);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setListName(event.target.value);
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!listName.trim()) return; // Prevent adding empty lists

        try {
            const result = await writeList({ listName });
            console.log('List added:', result);
            setListName(''); // Reset the input field after successful addition
        } catch (error) {
            console.error('Error adding list:', error);
        }
    };

    return (
        <main>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={listName}
                    onChange={handleInputChange}
                    placeholder="Enter list name"
                />
                <button type="submit">Add List</button>
            </form>
            <div>
                {lists.map(list => (
                    <div key={list.id}>{list.listName}</div> // Ensure your documents have a 'title' field
                ))}
            </div>
        </main>
    );
}

export default ManageLists;