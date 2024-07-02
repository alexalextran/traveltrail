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
import EditPinModal from '../components/EditPinModal.tsx';


export default function IconBar({pin, color, setchild}: {pin: Pin, color: string, setchild?: any}) {
 


    const dispatch  = useDispatch();
    const deletePin = () => {
        deleteFromFirestore(`users/alextran/pins`, `${pin.id}`).then(() => {
         dispatch(removePinById(pin.id));
        });
       }; 

       const selectNewPin = () => {
        
         dispatch(selectPin(pin));
         if(setchild !== null){
            setchild(<EditPinModal/>)
         }
         
        ;
       }; 
       
       
  return (
      <div className={styles.iconBar} style={{backgroundColor: `${color}`}}>
      <RiEditFill onClick={() => {selectNewPin() }}/>
      <ImgUpload pinID={pin.id}/>
      <MdDeleteForever onClick={() => {deletePin()}}/>
    </div>
    )
}
