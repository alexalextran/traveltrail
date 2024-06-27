import React from 'react'
import { Pin } from '../types/pinData.ts'
import styles from '../Sass/pinItem.module.scss'
import ImgUpload from './imgUpload.tsx'
import { RiEditFill } from "react-icons/ri";
import {  MdDeleteForever  } from "react-icons/md";
import { deleteFromFirestore } from '../firebaseFunctions/writeDocument.ts'; 
import { useDispatch } from 'react-redux';
import { removePinById } from '../store/pins/pinsSlice.ts'; 
import "react-color-palette/css";

export default function IconBar({pin}: {pin: Pin}) {
    const dispatch  = useDispatch();

    const deletePin = () => {
        deleteFromFirestore(`users/alextran/pins`, `${pin.id}`).then(() => {
         dispatch(removePinById(pin.id));
        });
       }; 
       
       
  return (
    <div className={styles.iconBar}>
    <RiEditFill/>
    <ImgUpload pinID={pin.id}/>
    <MdDeleteForever onClick={() => {deletePin()}}/>
  </div>
  )
}
