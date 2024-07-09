import React, { useRef, useState } from 'react';
import { addPictures, updatePin, selectPin } from '../store/pins/pinsSlice';
import { useDispatch, useSelector } from 'react-redux';
import { app } from "../firebase";
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { addImageReferenceToFirestore } from '../firebaseFunctions/writeDocument';
import { FaImages } from "react-icons/fa";
import styles from '../Sass/pinItem.module.scss';
import { RootState } from '../store/store';

function ImgUpload({pinID}: {pinID: string}) {
  const [images, setImages] = useState<string[]>([]);
  const dispatch = useDispatch();
  const storage = getStorage(app);
  const fileInputRef = useRef<HTMLInputElement>(null!);
  const selectedPin = useSelector((state: RootState) => state.pins.pins.find(pin => pin.id === pinID));

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const reader = new FileReader();
  
        reader.onloadend = async () => {
          const newImageUrl = reader.result as string;
          setImages(oldImages => [...oldImages, newImageUrl]);
          dispatch(addPictures({id: pinID, picture: [...images, newImageUrl]}));
          const storageRef = ref(storage, `${pinID}/${file.name}`);
          await uploadBytes(storageRef, file);
          const url = await getDownloadURL(storageRef);
          addImageReferenceToFirestore(pinID, url);

          // Update selectedPin in Redux store
          if (selectedPin) {
            const updatedPin = {
              ...selectedPin,
              imageUrls: [...selectedPin.imageUrls, url]
            };
            dispatch(updatePin(updatedPin));
            dispatch(selectPin(updatedPin));
          }
        };
  
        reader.readAsDataURL(file);
      }
    }
  }

  return (
    <div className={styles.uploadContainer}>
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleUpload}
        className={styles.hiddenFileInput}
      />
        <FaImages onClick={handleClick}/>
    </div>
    
  );
}

export default ImgUpload;
