import React, { useEffect, useState } from 'react';
import styles from '../Sass/ListComponent.module.scss';
import { RiArrowRightDoubleFill } from "react-icons/ri";
import { HiOutlineArrowsExpand } from "react-icons/hi";
import { toggleListScreen } from '../store/toggleModals/toggleModalSlice.ts';
import { selectListScreen } from '../store/toggleModals/toggleModalSlice.ts';
import { useSelector, useDispatch } from 'react-redux';
import ListScreenComponent from './ListScreen.tsx';
import { collection, getFirestore, onSnapshot } from 'firebase/firestore';
import { app } from "../firebase"; // Ensure this path is correct
import { setSelectedListRedux } from '../store/List/listSlice';
import { useAuth } from '../context/authContext'; // Import the useAuth hook
import { MdDeleteForever } from 'react-icons/md';

export default function ListComponent() {
  const ListScreen = useSelector(selectListScreen);
  const dispatch = useDispatch();
  const [expand, setexpand] = useState(false)
  const [lists, setLists] = useState<{ id: string; listName: string; }[]>([]);
  const [selectedList, setselectedList] = useState({id: '', listName: ''});
  const { user } = useAuth(); // Use the useAuth hook

  useEffect(() => {
    const db = getFirestore(app);
    const listCollectionRef = collection(db, `users/${user.uid}/lists`);
    const unsubscribe = onSnapshot(listCollectionRef, (snapshot) => {
        const fetchedLists = snapshot.docs.map(doc => ({
            id: doc.id,
            listName: doc.data().listName,
        }));
        setLists(fetchedLists);
    });

    return () => unsubscribe(); // Clean up the subscription
}, []);




const handleListClick = (list: { id: string; listName: string; }) => {
  setselectedList(list);
  dispatch(setSelectedListRedux(list));
};

  return (
    <>
    <main className={styles.main}  style={{ top: expand ? 0 : '-4em' }}>
      <div className={styles.content}>
        <div   className={styles.listItem}  onClick={() => handleListClick({id: '', listName: ''})}>All</div>
        {lists.map((list) => 
       <div 
         
       onClick={() => handleListClick(list)}

       className={styles.listItem} 
       style={{backgroundColor: list.id == selectedList.id ? 'rgb(0,123,255)' : 'white', color: list.id == selectedList.id ? 'white' : 'rgb(0,123,255)'}}  
       key={list.id}>
       {list.listName}
        </div> )}

        </div>
        <div className={styles.hover}>
          <h3>Lists</h3>
          <div onClick={() => {setexpand(!expand)}}><RiArrowRightDoubleFill/></div>
          <div onClick={() => {dispatch(toggleListScreen(true))}}><HiOutlineArrowsExpand/></div>
        </div>
      
      
    </main>


    {ListScreen && <ListScreenComponent/>}  
    </>
  );
}
