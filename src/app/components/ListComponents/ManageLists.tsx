import React, { useState, useEffect } from 'react';
import { writeList } from '../../firebaseFunctions/Lists'; // Ensure this path is correct
import { app } from "../../firebase"; // Ensure this path is correct
import { getFirestore, collection, onSnapshot } from 'firebase/firestore';
import { useAuth } from '../../context/authContext'; // Import the useAuth hook
import styles from '../../Sass/ListComponent.module.scss';
import { MdDeleteForever } from 'react-icons/md';
import { deleteList } from '../../firebaseFunctions/Lists';
import { list } from 'firebase/storage';
import { toast } from 'react-toastify';
function ManageLists() {
    const [listName, setListName] = useState('');
    const [lists, setLists] = useState<{ id: string; listName: string; }[]>([]);
    const db = getFirestore(app);
    const { user } = useAuth();

    useEffect(() => {
        const listCollectionRef = collection(db, `users/${user.uid}/lists`);
        const unsubscribe = onSnapshot(listCollectionRef, (snapshot) => {
            const fetchedLists = snapshot.docs.map(doc => ({
                id: doc.id,
                listName: doc.data().listName, 
            }));
            setLists(fetchedLists);
        });

        return () => unsubscribe(); 
    }, []);


    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setListName(event.target.value);
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!listName.trim()) return; // Prevent adding empty lists

        try {
            await writeList(`users/${user.uid}/lists`,{ listName });
            setListName(''); 
            toast.success('List was addeded sucessfully', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
              });
        } catch (error) {
            console.log(error)
            toast.error('Something went wrong', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
              });
        }
    };


    const callDeleteList =  async (listId: string) => {
        try {
            await deleteList(`users/${user.uid}/lists`, listId);
            toast.success('List was deleted sucessfully', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        } catch (error) {
            console.log(error);
            toast.error('Something went wrong', {
                position: "top-right",
                autoClose: 5000,
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
         
            <div className={styles.Listcontent}>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        value={listName}
                        onChange={handleInputChange}
                        placeholder="Enter list name"
                        className={styles.input}
                        required
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