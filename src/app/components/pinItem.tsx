import React, { useState } from 'react'
import { Pin } from '../types/pinData'
import styles from '../Sass/pinItem.module.scss'
import ImgUpload from './imgUpload'
import { RiEditFill } from "react-icons/ri";
import { MdPhotoSizeSelectActual, MdDeleteForever  } from "react-icons/md";
import { deleteFromFirestore } from '../firebaseFunctions/writeDocument.ts'; // Adjust the import path as necessary
import { useDispatch } from 'react-redux';
import { removePinById } from '../store/pins/pinsSlice.ts'; // Add this import statement


function PinItem({ pin }: { pin: Pin }) {
    const [show, setshow] = useState(false)
    const dispatch  = useDispatch();

  const deletePin = () => {
   deleteFromFirestore(`users/alextran/pins`, `${pin.id}`).then(() => {
    dispatch(removePinById(pin.id));
   });
  }; // Add closing parenthesis here
  
  return (
    <main className={styles.main}>
        <div><h3>{pin.title}</h3></div>
       
        <div>
        <div>{pin.address}</div>
        <div>{pin.category}</div>
        </div>




        {show && <div>{pin.description}</div> }
        <div className={styles.iconBar}>
          <RiEditFill/>
          <ImgUpload pinID={pin.id}/>
          <MdDeleteForever onClick={() => {deletePin()}}/>
        </div>
          </main>
  )
}

export default PinItem;