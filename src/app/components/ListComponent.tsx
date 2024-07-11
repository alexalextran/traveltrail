import React from 'react';
import styles from '../Sass/ListComponent.module.scss';
import { RiArrowRightDoubleFill } from "react-icons/ri";
import { HiOutlineArrowsExpand } from "react-icons/hi";
import { toggleListScreen } from '../store/toggleModals/toggleModalSlice.ts';
import { selectListScreen } from '../store/toggleModals/toggleModalSlice.ts';
import { useSelector, useDispatch } from 'react-redux';
import ListScreenComponent from './ListScreen.tsx';
export default function ListComponent() {
  const ListScreen = useSelector(selectListScreen);
  const dispatch = useDispatch();

  return (
    <>
    <main className={styles.main}>
      <div className={styles.content}>
        Content
        </div>
        <div className={styles.hover}>
          <h3>Lists</h3>
          <div><RiArrowRightDoubleFill/></div>
          <div onClick={() => {dispatch(toggleListScreen(true))}}><HiOutlineArrowsExpand/></div>
        </div>
      
      
    </main>


    {ListScreen && <ListScreenComponent/>}  
    </>
  );
}
