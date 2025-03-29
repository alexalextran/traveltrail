"use client";
import React, { useEffect, useState } from 'react';
import { Pin } from '../../types/pinData.ts';
import styles from '../../Sass/pinItem.module.scss';
import ImgUpload from './imgUpload.tsx';
import { RiEditFill } from "react-icons/ri";
import { MdDeleteForever } from "react-icons/md";
import { deleteFromFirestore } from '../../firebaseFunctions/writeDocument.ts';
import { useDispatch } from 'react-redux';
import { selectPin } from '../../store/pins/pinsSlice.ts';
import "react-color-palette/css";
import EditPinModal from '../PINManagementComponents/EditPinModal.tsx';
import ImageModal from './ImageModal.tsx';
import { toggleEditModal } from '../../store/toggleModals/toggleModalSlice.ts';
import { useAuth } from '../../context/authContext.js';
import { FaImages } from "react-icons/fa";
import { FaShare } from "react-icons/fa";
import { useRouter } from 'next/navigation'; // Changed from 'next/router'
import { toast } from 'react-toastify';

export default function IconBar({ pin, color, setchild, enableImage }: { pin: Pin, color: string, setchild?: any, enableImage: Boolean }) {
  const { user } = useAuth();
  const dispatch = useDispatch();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  // Ensure we're running in the client environment
  useEffect(() => {
    setIsClient(true);
  }, []);


const sharePin = () => {
  if (isClient) {
    const shareUrl = `${window.location.origin}/share/${pin.id}?userId=${user.uid}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
         toast.info('Link has been copied to clipboard!', {
                position: "top-right",  
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
              });
    }).catch(err => {
      console.error("Failed to copy link to clipboard:", err);
    });
    window.open(shareUrl, '_blank');
  }
};

  const deletePin = async () => {
    try {
      await deleteFromFirestore(`users/${user.uid}/pins`, `${pin.id}`);
    } catch (error) {
      console.error("Failed to delete pin:", error);
    }
  };

  const selectNewPin = (child: any) => {
    dispatch(selectPin(pin));

    if (setchild !== null && child === "edit") {
      setchild(<EditPinModal />);
    } else if (setchild !== null && child === "image") {
      setchild(<ImageModal />);
    }

    dispatch(toggleEditModal(true));
  };

  return (
    <div className={styles.iconBar} style={{ backgroundColor: `${color}` }}>
      <RiEditFill onClick={() => { selectNewPin("edit") }} />
      <ImgUpload pinID={pin.id} />
      {enableImage !== false ? <FaImages onClick={() => { selectNewPin("image") }} /> : null}
      <MdDeleteForever onClick={() => { deletePin() }} />
      {isClient && <FaShare onClick={sharePin}/>}
    </div>
  );
}