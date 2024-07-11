import React, { useState } from 'react';
import { writeList } from '../firebaseFunctions/Lists'; // Adjust the import path as necessary

export default function ManageLists() {
    const [listName, setListName] = useState('');

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setListName(event.target.value);
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!listName.trim()) return; // Prevent adding empty lists

        try {
            const result = await writeList({ listName });
            console.log('List added:', result);
            // Reset the input field after successful addition
            setListName('');
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

            {}
        </main>
    );
}
