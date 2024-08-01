import React from 'react'
import { Pin } from '../types/pinData.ts'
import styles from '../Sass/pinItem.module.scss'
import ImgUpload from './imgUpload.tsx'
import { RiEditFill } from "react-icons/ri";
import {  MdDeleteForever  } from "react-icons/md";
import { deleteFromFirestore } from '../firebaseFunctions/writeDocument.ts'; 
import { useDispatch } from 'react-redux';
import { removePinById, selectPin } from '../store/pins/pinsSlice.ts'; 
import "react-color-palette/css";
import EditPinModal from './EditPinModal.tsx';
import ImageModal from './imageModal.tsx';
import { toggleEditModal } from '../store/toggleModals/toggleModalSlice.ts';
import { useAuth } from '../context/authContext.js'; // Import the useAuth hook
import { FaCameraRetro } from "react-icons/fa";
import { FaImages } from "react-icons/fa";

export default function IconBar({pin, color, setchild, enableImage}: {pin: Pin, color: string, setchild?: any, enableImage:Boolean}) {
  const { user } = useAuth(); // Use the useAuth hook



    const dispatch  = useDispatch();
    const deletePin = async () => {
      try {
        await deleteFromFirestore(`users/${user.uid}/pins`, `${pin.id}`);
      } catch (error) {
        console.error("Failed to delete pin:", error);
      }
    };

       const selectNewPin = (child:any) => {
        
         dispatch(selectPin(pin));
         if(setchild !== null && child == "edit"){
            setchild(<EditPinModal/>)
         }else if(setchild !== null && child == "image"){
          setchild(<ImageModal/>)
         }
         dispatch(toggleEditModal(true))
         
        ;
       }; 
       
  return (
      <div className={styles.iconBar} style={{backgroundColor: `${color}`}}>
      <RiEditFill onClick={() => {selectNewPin("edit") }}/>
      <ImgUpload pinID={pin.id}/>
      {enableImage != null ? <FaImages onClick={() => {selectNewPin("image") }}/> : null}
      <MdDeleteForever onClick={() => {deletePin()}}/>
    </div>
    )
}
